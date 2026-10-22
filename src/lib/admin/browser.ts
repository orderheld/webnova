import "server-only";
import dns from "node:dns";
import https from "node:https";
import net from "node:net";
import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser } from "puppeteer-core";

/*
 * Headless Chromium for the PDF proposals of Admin > Vorschauen: screenshots of a preview and the PDF itself.
 * On Vercel it is the Chromium of @sparticuz/chromium (unpacked to /tmp on the first call, next.config.ts ships its
 * bin folder with the routes); CHROMIUM_PATH points to another Chromium, e.g. on a Mac for local work.
 *
 * Chromium itself has no way out: every connection goes to a proxy that does not exist, loopback included, WebRTC may
 * only use that proxy (so it sends no UDP), and new windows are blocked. What a page may load comes only through
 * request interception (proposal-shots.ts), which fetches public files with fetchPublic below.
 */

const blockedFlags = new Set(["--disable-web-security", "--allow-running-insecure-content", "--disable-popup-blocking"]);
const isolation = [
  "--proxy-server=http://127.0.0.1:9",
  "--proxy-bypass-list=<-loopback>",
  "--force-webrtc-ip-handling-policy=disable_non_proxied_udp",
  "--block-new-web-contents",
];

/**
 * Starts a browser for one task and always closes it again, also when the task fails. Without WebGL, Chromium draws
 * in software, which is fast; with it (3D previews), every frame goes through SwiftShader and takes seconds.
 */
export async function withBrowser<T>(task: (browser: Browser) => Promise<T>, { webgl = false } = {}): Promise<T> {
  const own = process.env.CHROMIUM_PATH;
  chromium.setGraphicsMode = webgl;
  const base = own ? ["--no-sandbox", "--hide-scrollbars", "--mute-audio", ...(webgl ? [] : ["--disable-webgl"])] : chromium.args;
  const args = [...(await puppeteer.defaultArgs({ args: base, headless: "shell" })).filter((a) => !blockedFlags.has(a)), ...isolation];
  const browser = await puppeteer.launch({
    executablePath: own || (await chromium.executablePath()),
    args,
    ignoreDefaultArgs: true,
    headless: "shell",
    defaultViewport: null,
  });
  // A page that still manages to open another one (which request interception would not cover) loses it at once.
  browser.on("targetcreated", (target) => {
    if (target.type() === "page" && target.opener()) void target.page().then((p) => p?.close().catch(() => {}));
  });
  try {
    return await task(browser);
  } finally {
    await browser.close().catch(() => {});
  }
}

/** URLs a page may load from outside: https to a host name (fonts, scripts and images from CDNs), never an IP address. */
export function isPublicUrl(raw: string) {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" || u.port || u.username || u.password) return false;
    const host = u.hostname.toLowerCase();
    if (!host.includes(".") || host.startsWith("[") || /^[\d.]+$/.test(host)) return false;
    return !/\.(local|localhost|internal|invalid|test|example|home|lan|corp)$/.test(host);
  } catch {
    return false;
  }
}

/** Loopback, private, link-local, carrier-grade NAT, multicast and other addresses that are not the public internet. */
function isPrivateAddress(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 0 || b === 168)) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  const v = ip.toLowerCase();
  if (v.startsWith("::ffff:")) return isPrivateAddress(v.slice(7));
  return v === "::" || v === "::1" || /^(fc|fd|fe[89ab]|ff|64:ff9b:|2001:db8:)/.test(v);
}

/** DNS lookup that refuses names pointing to a non-public address, checked at connect time (no rebinding). */
const publicLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "");
    if (!addresses.length || addresses.some((a) => isPrivateAddress(a.address))) {
      return callback(Object.assign(new Error(`${hostname} is not a public address`), { code: "EBLOCKED" }), "");
    }
    if (options.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
};

const MAX_EXTERNAL = 20 * 1024 * 1024;

/**
 * GET of a public https URL for a page in Chromium, following up to five redirects that stay public. Returns null
 * when the URL, a redirect or the address is not allowed, or the file is too large or too slow.
 */
export async function fetchPublic(url: string, headers: Record<string, string>): Promise<{ status: number; contentType: string; body: Buffer } | null> {
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    if (!isPublicUrl(current)) return null;
    const res = await new Promise<{ status: number; location?: string; contentType: string; body: Buffer } | null>((resolve) => {
      const req = https.get(current, { headers, lookup: publicLookup, timeout: 10_000 }, (r) => {
        const status = r.statusCode ?? 502;
        const contentType = String(r.headers["content-type"] ?? "application/octet-stream");
        if (status >= 300 && status < 400) {
          r.resume();
          return resolve({ status, location: r.headers.location, contentType, body: Buffer.alloc(0) });
        }
        const chunks: Buffer[] = [];
        let size = 0;
        r.on("data", (c: Buffer) => {
          size += c.length;
          if (size > MAX_EXTERNAL) {
            req.destroy();
            resolve(null);
          } else chunks.push(c);
        });
        r.on("end", () => resolve({ status, contentType, body: Buffer.concat(chunks) }));
        r.on("error", () => resolve(null));
      });
      req.on("timeout", () => req.destroy());
      req.on("error", () => resolve(null));
    });
    if (!res) return null;
    if (!res.location) return res;
    current = new URL(res.location, current).href;
  }
  return null;
}

import "server-only";
import { and, eq, max, ne } from "drizzle-orm";
import type { HTTPRequest, Page } from "puppeteer-core";
import { db, schema } from "@/db";
import type { Preview } from "@/db/schema";
import { fetchPublic, isPublicUrl, withBrowser } from "./browser";
import { cleanPreviewPath, isMedia, PREVIEW_CHUNK } from "./preview-files";
import { previewFileBuffer } from "./previews";
import { shotPath, type ShotKind, spread } from "./proposal-server";

/*
 * Screenshots of a client preview for its PDF proposal: Chromium opens the preview's files straight from the
 * database under a made-up address (nothing goes over webnova.ch, no view is counted), scrolls from section to
 * section and photographs each, once as a computer (1440 × 900) and once as a phone (390 × 844).
 */

const ORIGIN = "https://vorschau.webnova.invalid";
/** Videos larger than this are not loaded; the page then shows their poster picture. */
const MAX_MEDIA = 30 * 1024 * 1024;

export const shotLimits: Record<ShotKind, number> = { desktop: 10, mobile: 8 };
/** Fewer for 3D previews, whose screenshots take seconds each (see withBrowser). */
const webglLimits: Record<ShotKind, number> = { desktop: 6, mobile: 5 };
export type CapturedShot = { kind: ShotKind; caption: string; data: Buffer };

type SiteFile = { id: number; size: number; contentType: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Takes the screenshots of the preview's current version. */
export async function capturePreview(preview: Pick<Preview, "id" | "version">): Promise<CapturedShot[]> {
  const f = schema.previewFiles;
  const rows = await db()
    .select({ id: f.id, path: f.path, size: f.size, contentType: f.contentType })
    .from(f)
    .where(and(eq(f.previewId, preview.id), eq(f.kind, "site"), eq(f.version, preview.version)));
  const files = new Map<string, SiteFile>(rows.map((r) => [r.path, r]));
  const cache = new Map<number, Promise<Buffer>>();
  const load = (file: SiteFile) => {
    let data = cache.get(file.id);
    if (!data) cache.set(file.id, (data = previewFileBuffer(file.id)));
    return data;
  };
  // 3D previews (three.js and the like) need WebGL; everything else is photographed much faster without it.
  let webgl = false;
  for (const [path, file] of files) {
    if (webgl || !/\.(html?|m?js)$/i.test(path) || file.size > 5 * 1024 * 1024) continue;
    webgl = /webgl|WebGLRenderer|from\s*["'][^"']*three/i.test((await load(file)).toString("utf8"));
  }
  const limits = webgl ? webglLimits : shotLimits;

  return withBrowser(async (browser) => {
    const shots: CapturedShot[] = [];
    for (const kind of ["desktop", "mobile"] as const) {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on("request", (req) => void serve(page, req, files, load));
      if (kind === "desktop") {
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
      } else {
        await page.setUserAgent({
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
        });
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      }
      await page.goto(`${ORIGIN}/`, { waitUntil: "load", timeout: 30_000 });
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 8_000 }).catch(() => {});
      await page.evaluate(() => document.fonts.ready);
      await sleep(2_000); // opening animations

      const stops = spread(await page.evaluate(findStops), limits[kind]);
      for (const stop of stops) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), stop.y);
        await sleep(200);
        await page.waitForNetworkIdle({ idleTime: 300, timeout: 3_000 }).catch(() => {});
        await sleep(900); // animations of elements scrolled into view
        const data = await page.screenshot({ type: "jpeg", quality: 84, captureBeyondViewport: false });
        shots.push({ kind, caption: stop.caption, data: Buffer.from(data) });
      }
      await page.close();
    }
    return shots;
  }, { webgl });
}

/** The preview's own files from the database; from outside only GET of public https files (fonts, CDNs). */
async function serve(page: Page, req: HTTPRequest, files: Map<string, SiteFile>, load: (f: SiteFile) => Promise<Buffer>) {
  if (req.isInterceptResolutionHandled()) return;
  try {
    const url = req.url();
    if (url.startsWith("data:") || url.startsWith("blob:") || url === "about:blank") return await req.continue();
    if (url.startsWith(`${ORIGIN}/`)) {
      if (req.method() !== "GET" && req.method() !== "HEAD") return await req.respond({ status: 204, body: "" });
      let rel = decodeURIComponent(new URL(url).pathname.slice(1));
      if (rel === "" || rel.endsWith("/")) rel += "index.html";
      const path = cleanPreviewPath(rel);
      const file = path ? files.get(path) : undefined;
      if (!file) return await req.respond({ status: 404, contentType: "text/plain", body: "" });
      if (isMedia(path!) && file.size > MAX_MEDIA) return await req.abort();
      return await req.respond({ status: 200, contentType: file.contentType, headers: { "Access-Control-Allow-Origin": "*" }, body: await load(file) });
    }
    // The preview must not leave its address; fonts, scripts and pictures from public web servers are fetched here
    // (Chromium itself has no network, see withBrowser).
    // "aborted" cancels the navigation and the preview stays; any other error would replace it with an empty error page.
    if (req.isNavigationRequest() && req.frame() === page.mainFrame()) return await req.abort("aborted");
    if (req.method() !== "GET" || !isPublicUrl(url)) return await req.abort();
    const h = req.headers();
    const res = await fetchPublic(url, {
      "User-Agent": h["user-agent"] ?? "Mozilla/5.0",
      Accept: h.accept ?? "*/*",
      "Accept-Language": h["accept-language"] ?? "de-CH,de;q=0.9",
    });
    if (!res) return await req.abort();
    return await req.respond({ status: res.status, contentType: res.contentType, headers: { "Access-Control-Allow-Origin": "*" }, body: res.body });
  } catch {
    if (!req.isInterceptResolutionHandled()) await req.abort().catch(() => {});
  }
}

type Stop = { y: number; caption: string };

/**
 * Runs in the page: where to scroll for each section. The sections are the outermost <section> elements (or the
 * blocks of <main>); a section much taller than the screen is usually pinned while its animation plays, so it is
 * shown halfway through. A fixed header is taken into account, so it does not cover the section's top.
 */
function findStops(): Stop[] {
  const vh = window.innerHeight;
  const max = Math.max(0, (document.scrollingElement ?? document.documentElement).scrollHeight - vh);
  const clean = (s: string | null | undefined) => {
    const t = (s ?? "")
      .replace(/\s+/g, " ")
      .replace(/\s+([.,!?:;])/g, "$1")
      .trim()
      .replace(/[.!:]+$/, "");
    return t.length > 60 ? `${t.slice(0, 57).replace(/\s+\S*$/, "")} …` : t;
  };
  // Words of an animated headline often sit in their own spans without spaces between them ("Zeit", "in", "Farbe").
  const words = (el: Element | null | undefined) => (el ? Array.from(el.childNodes, (n) => n.textContent ?? "").join(" ") : "");
  const caption = (el: Element) =>
    clean(words(el.querySelector("h1, h2, h3"))) || clean(el.getAttribute("aria-label")) || clean(el.id.replace(/[-_]+/g, " ").replace(/^./, (c) => c.toUpperCase()));

  let header = 0;
  for (const el of document.elementsFromPoint(window.innerWidth / 2, 4)) {
    for (let e: Element | null = el; e && e !== document.body; e = e.parentElement) {
      const pos = getComputedStyle(e).position;
      if (pos !== "fixed" && pos !== "sticky") continue;
      const r = e.getBoundingClientRect();
      if (r.top <= 4 && r.height < vh * 0.25) header = Math.max(header, r.bottom);
      break;
    }
  }

  let blocks = Array.from(document.querySelectorAll("section")).filter((s) => !s.parentElement?.closest("section"));
  if (blocks.length < 2) blocks = Array.from((document.querySelector("main") ?? document.body).children) as HTMLElement[];
  const stops: Stop[] = [{ y: 0, caption: clean(words(document.querySelector("h1"))) }];
  for (const el of blocks) {
    const r = el.getBoundingClientRect();
    if (r.height < 120) continue;
    const top = r.top + window.scrollY;
    const y = Math.round(Math.min(max, r.height > vh * 1.6 ? top + (r.height - vh) / 2 : Math.max(0, top - header)));
    if (y - stops[stops.length - 1].y < vh * 0.5) continue;
    stops.push({ y, caption: caption(el) });
  }
  return stops;
}

/** Stores new screenshots and deletes the older ones; returns the new files in order. */
export async function saveShots(previewId: number, shots: CapturedShot[]) {
  const f = schema.previewFiles;
  const c = schema.previewChunks;
  const counter = { desktop: 0, mobile: 0 };
  return db().transaction(async (tx) => {
    // under the preview's row lock, so two captures at once do not pick the same batch number
    await tx.select({ id: schema.previews.id }).from(schema.previews).where(eq(schema.previews.id, previewId)).for("update");
    const [last] = await tx.select({ v: max(f.version) }).from(f).where(and(eq(f.previewId, previewId), eq(f.kind, "shot")));
    const version = (last?.v ?? 0) + 1;
    const saved: { id: number; kind: ShotKind; caption: string }[] = [];
    for (const shot of shots) {
      const [row] = await tx
        .insert(f)
        .values({
          previewId,
          kind: "shot",
          version,
          path: shotPath(shot.kind, counter[shot.kind]++, shot.caption),
          contentType: "image/jpeg",
          size: shot.data.length,
          chunkCount: Math.ceil(shot.data.length / PREVIEW_CHUNK),
        })
        .returning({ id: f.id });
      for (let seq = 0; seq * PREVIEW_CHUNK < shot.data.length; seq++) {
        await tx.insert(c).values({ fileId: row.id, seq, data: shot.data.subarray(seq * PREVIEW_CHUNK, (seq + 1) * PREVIEW_CHUNK) });
      }
      saved.push({ id: row.id, kind: shot.kind, caption: shot.caption });
    }
    await tx.delete(f).where(and(eq(f.previewId, previewId), eq(f.kind, "shot"), ne(f.version, version)));
    return saved;
  });
}

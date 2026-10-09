import { createHash, randomBytes } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { after, userAgent, type NextRequest } from "next/server";
import { z } from "zod";
import { db, hasDb, schema } from "@/db";
import { todayIso } from "@/lib/admin/money";
import { LIVE_MINUTES } from "@/lib/admin/visitors";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/*
 * Page views for the visitor statistics in the admin (/admin/besucher), sent by PageViewBeacon.
 * No cookies and no IP address are stored. The visitor id is a hash of IP, browser and the salt of the
 * day; the salt is replaced and deleted every day, so the id only groups the views of one day.
 */

const input = z.object({
  /** page path, e.g. "/de/kontakt" */
  p: z.string().max(200).regex(/^\/(de|fr)(\/[a-z0-9-]+)*$/),
  /** document.referrer, first view of a visit only */
  r: z.string().max(500).optional(),
  /** utm_source, first view of a visit only */
  s: z.string().max(100).optional(),
  /** touch Mac = iPad with a desktop user agent */
  t: z.boolean().optional(),
});

// Bots that run JavaScript or call the endpoint directly. Next's userAgent().isBot covers the search engines.
const BOTS = /(?<!cu)bot\b|crawl|spider|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|preview|curl|wget|python|axios|node-fetch|undici|okhttp|go-http|java\/|selenium|puppeteer|playwright|phantom/i;
// Own hosts never count as a source (internal links, previews, local tests).
const OWN_HOST = /(^|\.)webnova\.ch$|\.vercel\.app$|^localhost$|^127\.0\.0\.1$/;

const none = () => new Response(null, { status: 204 });

let salt: { day: string; value: string } | undefined;

/** Salt of the day (Zurich), shared by all server instances through the database. */
async function dailySalt(day: string) {
  if (salt?.day === day) return salt.value;
  const created = await db().execute<{ salt: string }>(
    sql`insert into visitor_salts (day, salt) values (${day}, ${randomBytes(32).toString("hex")}) on conflict (day) do nothing returning salt`,
  );
  let value = created.rows[0]?.salt;
  if (value) {
    // First view of a new day: drop the old salts (yesterday's ids can no longer be recomputed) and expired statistics.
    await db().execute(sql`delete from visitor_salts where day < ${day}`);
    await db().execute(sql`delete from page_views where created_at < now() - interval '13 months'`);
  } else {
    const found = await db().execute<{ salt: string }>(sql`select salt from visitor_salts where day = ${day}`);
    value = found.rows[0].salt;
  }
  salt = { day, value };
  return value;
}

// Per-instance flood guard: at most 60 views per minute from one address. Only kept in memory, and
// expired entries are swept every minute, so no address is held longer than about two minutes.
const hits = new Map<string, { n: number; until: number }>();
let sweepAt = 0;
function flooding(ip: string) {
  const now = Date.now();
  if (now > sweepAt) {
    for (const [k, h] of hits) if (h.until < now) hits.delete(k);
    sweepAt = now + 60_000;
  }
  const h = hits.get(ip);
  if (!h || h.until < now) {
    hits.set(ip, { n: 1, until: now + 60_000 });
    return false;
  }
  return ++h.n > 60;
}

function sourceOf(referrer?: string, utm?: string): string | null {
  const tag = utm?.trim().toLowerCase().replace(/[^a-z0-9._ -]/g, "").slice(0, 60);
  if (tag) return tag;
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    return host && !OWN_HOST.test(host) ? host.slice(0, 100) : null;
  } catch {
    return null;
  }
}

/** «Neuer Besucher» push, e.g. "Kontakt · Smartphone · Solothurn · über Google". */
async function visitorMessage(view: { path: string; source: string | null; device: string; country: string | null; region: string | null }) {
  // The labels pull in the site content, so they are only loaded when a push goes out.
  const { deviceLabels, pageLabel, placeLabel, sourceLabel } = await import("@/lib/admin/visitor-labels");
  const live = await db().execute<{ n: number }>(
    sql`select count(distinct visitor)::int as n from page_views where created_at > now() - make_interval(mins => ${LIVE_MINUTES})`,
  );
  const n = live.rows[0]?.n ?? 1;
  const parts = [
    `${pageLabel(view.path)}${view.path.startsWith("/fr") ? " (FR)" : ""}`,
    deviceLabels[view.device] ?? view.device,
    view.country ? placeLabel(view.country, view.region) : null,
    view.source ? `über ${sourceLabel(view.source)}` : "direkt",
    n > 1 ? `${n} gerade live` : null,
  ];
  return { title: "Neuer Besucher auf webnova.ch", body: parts.filter(Boolean).join(" · "), url: "/admin/besucher" };
}

export async function POST(req: NextRequest) {
  if (!hasDb()) return none();
  const ua = req.headers.get("user-agent") ?? "";
  const agent = userAgent(req);
  if (!ua || agent.isBot || BOTS.test(ua)) return none();
  // Only the site itself sends page views (browsers mark same-origin requests).
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return none();
  if (Number(req.headers.get("content-length") ?? 0) > 2000) return none();
  // Own visits while logged in to the admin are not counted.
  if (await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return none();

  let body: z.infer<typeof input>;
  try {
    body = input.parse(JSON.parse(await req.text()));
  } catch {
    return new Response(null, { status: 400 });
  }

  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (flooding(ip)) return none();
  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase() ?? "";
  const region = req.headers.get("x-vercel-ip-country-region")?.toUpperCase() ?? "";
  const type = agent.device.type;
  const device = type === "mobile" || type === "wearable" ? "mobile" : type === "tablet" || body.t ? "tablet" : "desktop";

  try {
    const day = todayIso();
    const visitor = createHash("sha256")
      .update(`${await dailySalt(day)}|${ip}|${ua}`)
      .digest("hex")
      .slice(0, 16);
    const [seen] = await db().select({ id: schema.pageViews.id }).from(schema.pageViews).where(eq(schema.pageViews.visitor, visitor)).limit(1);
    const view = {
      path: body.p,
      source: sourceOf(body.r, body.s),
      device,
      country: /^[A-Z]{2}$/.test(country) ? country : null,
      region: /^[A-Z0-9]{1,3}$/.test(region) ? region : null,
    };
    await db()
      .insert(schema.pageViews)
      .values({ ...view, visitor });
    // First view of this visitor today: push to the admin devices, after the response so the beacon stays fast.
    // Loaded on demand, like the labels: most page views never need the push code.
    if (!seen) after(async () => (await import("@/lib/admin/push")).pushNewVisitor(() => visitorMessage(view)));
  } catch (err) {
    console.error("[page-view]", err);
  }
  return none();
}

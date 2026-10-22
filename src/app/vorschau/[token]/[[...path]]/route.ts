import { and, eq, sql } from "drizzle-orm";
import { after, type NextRequest } from "next/server";
import { db, hasDb, schema } from "@/db";
import { cleanPreviewPath, isMedia, PREVIEW_PART } from "@/lib/admin/preview-files";
import { isBot, isPreviewToken, previewFileStream } from "@/lib/admin/previews";
import { pushPreviewOpened } from "@/lib/admin/push";
import { currentAdmin } from "@/lib/auth";

/*
 * Client previews from Admin > Vorschauen: webnova.ch/vorschau/<token>/ serves the files of the current upload from
 * the database. next.config.ts adds noindex and the CSP sandbox to every response here (the preview's scripts run
 * without access to webnova.ch), src/proxy.ts adds the slash after the token, which relative paths need.
 */

type Ctx = RouteContext<"/vorschau/[token]/[[...path]]">;

export async function GET(req: NextRequest, ctx: Ctx) {
  return serve(req, ctx, false);
}

export async function HEAD(req: NextRequest, ctx: Ctx) {
  return serve(req, ctx, true);
}

async function serve(req: NextRequest, ctx: Ctx, head: boolean): Promise<Response> {
  const { token, path = [] } = await ctx.params;
  if (!hasDb() || !isPreviewToken(token)) return unavailable(head);
  const folder = path.length === 0 || req.nextUrl.pathname.endsWith("/");
  const rel = cleanPreviewPath(folder ? [...path, "index.html"].join("/") : path.join("/"));
  if (!rel) return notFound(head);

  const p = schema.previews;
  const f = schema.previewFiles;
  const [row] = await db()
    .select({ preview: { id: p.id, title: p.title, active: p.active, version: p.version }, file: f })
    .from(p)
    .leftJoin(f, and(eq(f.previewId, p.id), eq(f.kind, "site"), eq(f.version, p.version), eq(f.path, rel)))
    .where(eq(p.token, token));
  if (!row || !row.preview.active || row.preview.version === 0) return unavailable(head);
  const file = row.file;
  if (!file) {
    // A subfolder page without the slash (/vorschau/<token>/team): its relative links need /team/.
    if (!folder && !rel.endsWith(".html")) {
      const [sub] = await db()
        .select({ id: f.id })
        .from(f)
        .where(and(eq(f.previewId, row.preview.id), eq(f.kind, "site"), eq(f.version, row.preview.version), eq(f.path, `${rel}/index.html`)));
      if (sub) return Response.redirect(new URL(`${req.nextUrl.pathname}/${req.nextUrl.search}`, req.url), 308);
    }
    return notFound(head);
  }

  // A new upload gets new file ids, so the id is a safe validator: the browser re-checks and gets 304 while unchanged.
  const etag = `"wn-${file.id}"`;
  const headers = new Headers({ "Content-Type": file.contentType, "Accept-Ranges": "bytes", ETag: etag, "Cache-Control": "no-cache" });
  if (req.headers.get("if-none-match")?.split(/\s*,\s*/).includes(etag)) return new Response(null, { status: 304, headers });

  const range = parseRange(req.headers.get("range"), file.size);
  if (range === "invalid") {
    headers.set("Content-Range", `bytes */${file.size}`);
    return new Response(null, { status: 416, headers });
  }

  if (!head && !range && rel === "index.html" && path.length === 0) after(() => countView(req, row.preview));

  if (file.size === 0) {
    headers.set("Content-Length", "0");
    return new Response(null, { status: 200, headers });
  }
  // One response carries at most PREVIEW_PART: a longer range is answered in part, the player asks for the rest.
  // Videos and audio also get the first part when they ask without a range, then continue with ranges.
  const partial = range ?? (isMedia(rel) && file.size > PREVIEW_PART ? { start: 0, end: file.size - 1 } : null);
  if (partial) {
    const end = Math.min(partial.end, partial.start + PREVIEW_PART - 1);
    headers.set("Content-Range", `bytes ${partial.start}-${end}/${file.size}`);
    headers.set("Content-Length", String(end - partial.start + 1));
    return new Response(head ? null : previewFileStream(file.id, partial.start, end), { status: 206, headers });
  }
  headers.set("Content-Length", String(file.size));
  return new Response(head ? null : previewFileStream(file.id, 0, file.size - 1), { status: 200, headers });
}

/** A single byte range (bytes=a-b, a- or -n); several ranges are answered with the whole file. */
function parseRange(header: string | null, size: number): { start: number; end: number } | "invalid" | null {
  const m = header?.match(/^bytes=(\d*)-(\d*)$/);
  if (!m || (!m[1] && !m[2])) return null;
  let start: number;
  let end: number;
  if (!m[1]) {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  }
  if (start >= size || start > end) return "invalid";
  return { start, end };
}

/**
 * An opening of the start page by the client: not by Ferhat (signed in to the admin), not by link previews of
 * WhatsApp or mail scanners, not by prefetches. The first opening of a visit (30 minutes) sends a push.
 */
async function countView(req: NextRequest, preview: { id: number; title: string }) {
  try {
    const dest = req.headers.get("sec-fetch-dest");
    if (isBot(req.headers.get("user-agent") ?? "") || (dest && dest !== "document")) return;
    if (/prefetch|prerender/i.test(req.headers.get("sec-purpose") ?? req.headers.get("purpose") ?? "")) return;
    if (await currentAdmin()) return;
    const result = await db().execute<{ views: number; prev: Date | string | null }>(sql`
      with old as (select ${schema.previews.lastViewedAt} as prev from ${schema.previews} where ${schema.previews.id} = ${preview.id})
      update ${schema.previews}
      set views = views + 1, first_viewed_at = coalesce(first_viewed_at, now()), last_viewed_at = now()
      where ${schema.previews.id} = ${preview.id}
      returning views, (select prev from old) as prev`);
    const r = result.rows[0];
    if (!r) return;
    const prev = r.prev ? new Date(r.prev).getTime() : 0;
    if (Date.now() - prev < 30 * 60_000) return;
    await pushPreviewOpened({
      title: "Vorschau geöffnet",
      body: `${preview.title} · ${r.views === 1 ? "zum ersten Mal" : `${r.views}. Öffnung`}`,
      url: `/admin/vorschauen/${preview.id}`,
      tag: `vorschau-${preview.id}`,
    });
  } catch (err) {
    console.error("[vorschau] view", err);
  }
}

const page = (title: string, text: string) => `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${title}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1c232b;background:#f3f6f9}
main{max-width:440px;padding:32px 24px;text-align:center}h1{font-size:20px;margin:0 0 8px;color:#24405a}p{margin:0 0 6px;color:#3a434d}a{color:#3b6385}</style></head>
<body><main>${text}<p style="margin-top:22px"><a href="https://webnova.ch" target="_top">webnova.ch</a></p></main></body></html>`;

function unavailable(head: boolean) {
  const html = page(
    "Vorschau nicht verfügbar",
    "<h1>Diese Vorschau ist nicht mehr verfügbar.</h1><p>Cet aperçu n’est plus disponible.</p>",
  );
  return new Response(head ? null : html, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

function notFound(head: boolean) {
  return new Response(head ? null : "Nicht gefunden", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

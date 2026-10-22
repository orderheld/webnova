import { and, eq, gt, max, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { cleanPreviewPath, PREVIEW_CHUNK, PREVIEW_MAX_BYTES, PREVIEW_MAX_FILES, PREVIEW_MAX_PDF, previewContentType } from "@/lib/admin/preview-files";
import { previewApiGuard } from "@/lib/admin/previews";
import { routeId } from "@/lib/admin/queries";

/**
 * Starts an upload (Admin > Vorschauen): registers the files of a new version, or the proposal PDF, and returns
 * their ids for the chunks. The link keeps serving the current version until /fertig switches over.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/admin/vorschauen/[id]/dateien">) {
  const denied = await previewApiGuard(req);
  if (denied) return denied;
  const id = routeId((await ctx.params).id);
  const [preview] = id ? await db().select().from(schema.previews).where(eq(schema.previews.id, id)) : [];
  if (!preview) return Response.json({ error: "Vorschau nicht gefunden." }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { kind?: unknown; files?: unknown } | null;
  const kind: "site" | "pdf" | null = body?.kind === "pdf" ? "pdf" : body?.kind === "site" ? "site" : null;
  const files = Array.isArray(body?.files) ? (body.files as { path?: unknown; size?: unknown }[]) : null;
  if (!kind || !files?.length) return Response.json({ error: "Keine Dateien." }, { status: 400 });

  const list: { path: string; size: number }[] = [];
  for (const raw of files) {
    const path = typeof raw?.path === "string" ? cleanPreviewPath(raw.path) : null;
    const size = typeof raw?.size === "number" && Number.isInteger(raw.size) && raw.size >= 0 ? raw.size : -1;
    if (!path || path !== raw.path || size < 0) return Response.json({ error: `Ungültige Datei: ${String(raw?.path).slice(0, 80)}` }, { status: 400 });
    list.push({ path, size });
  }
  const total = list.reduce((n, f) => n + f.size, 0);
  if (new Set(list.map((f) => f.path)).size !== list.length) return Response.json({ error: "Doppelte Dateinamen im ZIP." }, { status: 400 });
  if (kind === "site") {
    if (!list.some((f) => f.path === "index.html")) return Response.json({ error: "Die Startseite index.html fehlt." }, { status: 400 });
    if (list.length > PREVIEW_MAX_FILES || total > PREVIEW_MAX_BYTES) return Response.json({ error: "Das ZIP ist zu gross." }, { status: 413 });
  } else if (list.length !== 1 || previewContentType(list[0].path) !== "application/pdf" || total > PREVIEW_MAX_PDF) {
    return Response.json({ error: "Bitte ein PDF bis 15 MB wählen." }, { status: 400 });
  }

  const f = schema.previewFiles;
  const p = schema.previews;
  // Under the preview's row lock, like /fertig: the switch to a new version never sees half of another upload.
  const started = await db().transaction(async (tx) => {
    const [current] = await tx.select({ version: p.version, pdfFileId: p.pdfFileId }).from(p).where(eq(p.id, preview.id)).for("update");
    if (!current) return null;
    let version: number;
    if (kind === "site") {
      version = current.version + 1;
      // leftovers of an upload that never finished
      await tx.delete(f).where(and(eq(f.previewId, preview.id), eq(f.kind, "site"), gt(f.version, current.version)));
    } else {
      const [last] = await tx.select({ v: max(f.version) }).from(f).where(and(eq(f.previewId, preview.id), eq(f.kind, "pdf")));
      version = (last?.v ?? 0) + 1;
      await tx
        .delete(f)
        .where(and(eq(f.previewId, preview.id), eq(f.kind, "pdf"), current.pdfFileId ? ne(f.id, current.pdfFileId) : undefined));
    }
    const rows = await tx
      .insert(f)
      .values(
        list.map((x) => ({
          previewId: preview.id,
          kind,
          version,
          path: x.path,
          contentType: previewContentType(x.path),
          size: x.size,
          chunkCount: Math.ceil(x.size / PREVIEW_CHUNK),
        })),
      )
      .returning({ id: f.id, path: f.path, chunks: f.chunkCount });
    return { version, files: rows };
  });
  if (!started) return Response.json({ error: "Vorschau nicht gefunden." }, { status: 404 });
  return Response.json(started);
}

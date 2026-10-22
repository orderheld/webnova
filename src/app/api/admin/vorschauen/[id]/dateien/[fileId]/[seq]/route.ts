import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { PREVIEW_CHUNK } from "@/lib/admin/preview-files";
import { previewApiGuard } from "@/lib/admin/previews";
import { routeId } from "@/lib/admin/queries";

/** One chunk (1 MB, the last one shorter) of a file registered by POST /dateien. Repeating a chunk overwrites it. */
export async function PUT(req: Request, ctx: RouteContext<"/api/admin/vorschauen/[id]/dateien/[fileId]/[seq]">) {
  const denied = await previewApiGuard(req);
  if (denied) return denied;
  const params = await ctx.params;
  const id = routeId(params.id);
  const fileId = routeId(params.fileId);
  const seq = /^\d{1,6}$/.test(params.seq) ? Number(params.seq) : -1;
  if (!id || !fileId || seq < 0) return Response.json({ error: "Ungültig." }, { status: 400 });

  const p = schema.previews;
  const f = schema.previewFiles;
  const [row] = await db()
    .select({ file: f, version: p.version, pdfFileId: p.pdfFileId })
    .from(f)
    .innerJoin(p, eq(p.id, f.previewId))
    .where(and(eq(f.id, fileId), eq(f.previewId, id)));
  if (!row) return Response.json({ error: "Datei nicht gefunden." }, { status: 404 });
  const { file } = row;
  // Files the link serves (or the PDF in use) stay as they are; only a running upload takes chunks.
  const live = file.kind === "site" ? file.version <= row.version : file.id === row.pdfFileId;
  if (live || seq >= file.chunkCount) return Response.json({ error: "Ungültig." }, { status: 409 });

  const data = Buffer.from(await req.arrayBuffer());
  const expected = seq < file.chunkCount - 1 ? PREVIEW_CHUNK : file.size - PREVIEW_CHUNK * (file.chunkCount - 1);
  if (data.length !== expected) return Response.json({ error: "Teil unvollständig." }, { status: 400 });
  const c = schema.previewChunks;
  await db()
    .insert(c)
    .values({ fileId, seq, data })
    .onConflictDoUpdate({ target: [c.fileId, c.seq], set: { data } });
  return new Response(null, { status: 204 });
}

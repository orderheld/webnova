import { and, eq, ne, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { flashDone } from "@/lib/admin/flash";
import { previewApiGuard, previewUrl } from "@/lib/admin/previews";
import { routeId } from "@/lib/admin/queries";

/**
 * Finishes an upload once every chunk is stored: the link switches to the new version (older files are deleted),
 * or the new PDF replaces the old one.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/admin/vorschauen/[id]/fertig">) {
  const denied = await previewApiGuard(req);
  if (denied) return denied;
  const id = routeId((await ctx.params).id);
  const [preview] = id ? await db().select().from(schema.previews).where(eq(schema.previews.id, id)) : [];
  if (!preview) return Response.json({ error: "Vorschau nicht gefunden." }, { status: 404 });
  const body = (await req.json().catch(() => null)) as { kind?: unknown; version?: unknown; fileId?: unknown } | null;
  const f = schema.previewFiles;
  const c = schema.previewChunks;

  // files of the upload whose chunks are not all stored yet
  const incomplete = (where: ReturnType<typeof and>) =>
    db()
      .select({ path: f.path })
      .from(f)
      .leftJoin(c, eq(c.fileId, f.id))
      .where(where)
      .groupBy(f.id, f.path, f.chunkCount)
      .having(sql`count(${c.id}) <> ${f.chunkCount}`);

  if (body?.kind === "site" && typeof body.version === "number" && body.version > preview.version) {
    const version = body.version;
    const ofVersion = and(eq(f.previewId, preview.id), eq(f.kind, "site"), eq(f.version, version));
    const missing = await incomplete(ofVersion);
    if (missing.length) return Response.json({ error: `Noch nicht vollständig: ${missing.slice(0, 3).map((m) => m.path).join(", ")}` }, { status: 409 });
    const [stats] = await db()
      .select({ n: sql<number>`count(*)::int`, bytes: sql<number>`coalesce(sum(${f.size}), 0)::int`, index: sql<boolean>`bool_or(${f.path} = 'index.html')` })
      .from(f)
      .where(ofVersion);
    if (!stats?.index) return Response.json({ error: "Die Startseite index.html fehlt." }, { status: 400 });
    await db().transaction(async (tx) => {
      await tx
        .update(schema.previews)
        .set({ version, fileCount: stats.n, totalBytes: stats.bytes, updatedAt: new Date() })
        .where(eq(schema.previews.id, preview.id));
      await tx.delete(f).where(and(eq(f.previewId, preview.id), eq(f.kind, "site"), ne(f.version, version)));
    });
    await flashDone(preview.version === 0 ? "Vorschau ist online" : "Neue Version ist online");
    return Response.json({ url: previewUrl(preview.token) });
  }

  if (body?.kind === "pdf" && typeof body.fileId === "number") {
    const fileId = body.fileId;
    const ofFile = and(eq(f.id, fileId), eq(f.previewId, preview.id), eq(f.kind, "pdf"));
    const [file] = await db().select({ id: f.id }).from(f).where(ofFile);
    if (!file) return Response.json({ error: "PDF nicht gefunden." }, { status: 404 });
    if ((await incomplete(ofFile)).length) return Response.json({ error: "Das PDF ist noch nicht vollständig." }, { status: 409 });
    await db().transaction(async (tx) => {
      await tx.update(schema.previews).set({ pdfFileId: fileId, updatedAt: new Date() }).where(eq(schema.previews.id, preview.id));
      await tx.delete(f).where(and(eq(f.previewId, preview.id), eq(f.kind, "pdf"), ne(f.id, fileId)));
    });
    await flashDone("PDF gespeichert");
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Ungültig." }, { status: 400 });
}

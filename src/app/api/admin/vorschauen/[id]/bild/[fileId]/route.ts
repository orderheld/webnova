import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { previewFileStream } from "@/lib/admin/previews";
import { routeId } from "@/lib/admin/queries";
import { currentAdmin } from "@/lib/auth";

/** A screenshot or picture of a preview, for the PDF-proposal form in the admin. */
export async function GET(_req: Request, ctx: RouteContext<"/api/admin/vorschauen/[id]/bild/[fileId]">) {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const params = await ctx.params;
  const id = routeId(params.id);
  const fileId = routeId(params.fileId);
  const f = schema.previewFiles;
  const [file] =
    id && fileId
      ? await db()
          .select({ id: f.id, size: f.size, contentType: f.contentType })
          .from(f)
          .where(and(eq(f.id, fileId), eq(f.previewId, id), inArray(f.kind, ["shot", "site"])))
      : [];
  if (!file || !file.contentType.startsWith("image/") || file.contentType.startsWith("image/svg") || file.size === 0) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(previewFileStream(file.id, 0, file.size - 1), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      // a new screenshot or upload gets a new id, so the same id never changes
      "Cache-Control": "private, max-age=86400, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { previewFileStream, previewPdf } from "@/lib/admin/previews";
import { routeId } from "@/lib/admin/queries";
import { currentAdmin } from "@/lib/auth";

/** The proposal PDF of a preview, for the admin only. */
export async function GET(_req: Request, ctx: RouteContext<"/api/admin/vorschauen/[id]/pdf">) {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const id = routeId((await ctx.params).id);
  const [preview] = id ? await db().select().from(schema.previews).where(eq(schema.previews.id, id)) : [];
  const file = preview ? await previewPdf(preview) : null;
  if (!file || file.size === 0) return new Response("Not found", { status: 404 });
  const name = file.path.replace(/[^\w.\- ]+/g, "_");
  return new Response(previewFileStream(file.id, 0, file.size - 1), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(file.size),
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

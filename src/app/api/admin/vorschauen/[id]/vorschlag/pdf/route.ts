import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { flashDone } from "@/lib/admin/flash";
import { previewApiGuard } from "@/lib/admin/previews";
import { createProposalPdf } from "@/lib/admin/proposal-pdf";
import { routeId } from "@/lib/admin/queries";

export const maxDuration = 60;

/** Prints the saved PDF proposal and makes it the preview's PDF (the one that goes with the e-mail). */
export async function POST(req: Request, ctx: RouteContext<"/api/admin/vorschauen/[id]/vorschlag/pdf">) {
  const denied = await previewApiGuard(req);
  if (denied) return denied;
  const id = routeId((await ctx.params).id);
  const [preview] = id ? await db().select().from(schema.previews).where(eq(schema.previews.id, id)) : [];
  if (!preview) return Response.json({ error: "Vorschau nicht gefunden." }, { status: 404 });
  const { proposal } = preview;
  if (!proposal) return Response.json({ error: "Bitte den Vorschlag zuerst speichern." }, { status: 409 });
  try {
    const { size } = await createProposalPdf({ ...preview, proposal });
    await flashDone("PDF erstellt");
    return Response.json({ size });
  } catch (err) {
    console.error("[vorschlag] pdf", err);
    return Response.json({ error: "Das PDF konnte nicht erstellt werden. Bitte nochmals versuchen." }, { status: 500 });
  }
}

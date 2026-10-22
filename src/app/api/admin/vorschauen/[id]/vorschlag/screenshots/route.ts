import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { previewApiGuard } from "@/lib/admin/previews";
import { initialProposal, previewShots, shotSelection } from "@/lib/admin/proposal-server";
import { capturePreview, saveShots } from "@/lib/admin/proposal-shots";
import { routeId } from "@/lib/admin/queries";

/** Opening the preview twice in Chromium and scrolling through it takes a while. */
export const maxDuration = 180;

/**
 * Takes new screenshots of the preview (computer and phone) for its PDF proposal, replaces the old ones and
 * preselects six and five of them in the proposal.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/admin/vorschauen/[id]/vorschlag/screenshots">) {
  const denied = await previewApiGuard(req);
  if (denied) return denied;
  const id = routeId((await ctx.params).id);
  const [preview] = id ? await db().select().from(schema.previews).where(eq(schema.previews.id, id)) : [];
  if (!preview) return Response.json({ error: "Vorschau nicht gefunden." }, { status: 404 });
  if (preview.version === 0) return Response.json({ error: "Bitte zuerst die Vorschau hochladen." }, { status: 409 });

  let shots;
  try {
    shots = await capturePreview(preview);
  } catch (err) {
    console.error("[vorschlag] screenshots", err);
    return Response.json({ error: "Die Vorschau konnte nicht fotografiert werden. Bitte nochmals versuchen." }, { status: 500 });
  }
  if (!shots.length) return Response.json({ error: "Keine Screenshots entstanden." }, { status: 500 });
  await saveShots(preview.id, shots);

  const stored = await previewShots(preview.id);
  const selection = shotSelection(stored);
  const [current] = await db().select({ proposal: schema.previews.proposal }).from(schema.previews).where(eq(schema.previews.id, preview.id));
  const proposal = current?.proposal ? { ...current.proposal, ...selection } : await initialProposal(preview);
  // a cover left to the automatic choice or showing an old screenshot gets the new first one; "none" and pictures stay
  if (proposal.cover.image === "" || proposal.cover.image.startsWith("shot:")) {
    proposal.cover = { ...proposal.cover, image: selection.desktop[0] ? `shot:${selection.desktop[0].fileId}` : "" };
  }
  await db().update(schema.previews).set({ proposal, updatedAt: new Date() }).where(eq(schema.previews.id, preview.id));
  return Response.json({ shots: stored, desktop: proposal.desktop, mobile: proposal.mobile, cover: proposal.cover.image });
}

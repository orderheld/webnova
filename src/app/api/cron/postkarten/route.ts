import { hasDb } from "@/db";
import { pushNewLead } from "@/lib/admin/push";
import { importLastWeek, weekLabel } from "@/lib/admin/postcards";

/** Reading ~900 register entries takes a while. */
export const maxDuration = 300;

/**
 * Weekly list for the postcards (vercel.json crons, Monday morning): imports last week's new companies.
 * Vercel sends CRON_SECRET as bearer token when it is set; without it the call is still harmless, because a week
 * that already has its list is skipped.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  if (!hasDb()) return Response.json({ skipped: "no database" });
  const result = await importLastWeek();
  if (result.added > 0) {
    await pushNewLead({
      title: "Postkarten: neue Adressliste",
      body: `${result.added} neue Firmen (${weekLabel(result.week)}) sind bereit für den Versand.`,
      url: `/admin/postkarten?woche=${result.week}`,
      tag: "postkarten",
    });
  }
  return Response.json(result);
}

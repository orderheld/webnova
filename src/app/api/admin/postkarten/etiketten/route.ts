import { and, asc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { currentAdmin } from "@/lib/auth";
import { renderLabels, type LabelFormat } from "@/lib/admin/postcard-labels";

/**
 * Address labels of one weekly list as PDF: /api/admin/postkarten/etiketten?woche=2026-W41&sprache=de&format=rolle.
 * Only companies not yet sent (status «offen»), in the order of the admin list; they get a printed date.
 */
export async function GET(req: Request) {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const q = new URL(req.url).searchParams;
  const week = q.get("woche") ?? "";
  const lang = q.get("sprache");
  const format: LabelFormat = q.get("format") === "a4" ? "a4" : "rolle";
  if (!/^\d{4}-W\d{2}$/.test(week)) return new Response("Woche fehlt", { status: 400 });
  const t = schema.postcardRecipients;
  const rows = await db()
    .select()
    .from(t)
    .where(and(eq(t.week, week), eq(t.status, "offen"), lang === "de" || lang === "fr" ? eq(t.language, lang) : undefined))
    .orderBy(asc(t.language), asc(t.zip), asc(t.name));
  const pdf = await renderLabels(rows, format);
  if (rows.length) await db().update(t).set({ labelPrintedAt: new Date() }).where(inArray(t.id, rows.map((r) => r.id)));
  const name = `etiketten-${week.toLowerCase()}${lang ? `-${lang}` : ""}-${format}.pdf`;
  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${name}"`, "Cache-Control": "private, no-store" },
  });
}

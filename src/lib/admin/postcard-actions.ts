"use server";

import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { postcardStatuses, type PostcardStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { flashDone } from "./flash";
import { importLastWeek, weekLabel } from "./postcards";

/** «Liste jetzt laden»: same import as the Monday cron, for the first week or when the cron was missed. */
export async function importPostcardsAction() {
  await requireAdmin();
  try {
    const r = await importLastWeek();
    if (r.existing) await flashDone(`Die Liste für ${weekLabel(r.week)} ist schon da`);
    else if (r.added) await flashDone(`${r.added} neue Firmen geladen`);
    else await flashDone("Keine passenden Neueintragungen gefunden", "error");
  } catch (err) {
    console.error("[postkarten] import", err);
    await flashDone("Handelsamtsblatt nicht erreichbar, bitte später nochmals", "error");
  }
}

export async function setPostcardStatusAction(id: number, status: PostcardStatus) {
  await requireAdmin();
  if (!postcardStatuses.includes(status)) return;
  const t = schema.postcardRecipients;
  await db()
    .update(t)
    .set({ status, sentAt: status === "versendet" ? new Date() : null })
    .where(eq(t.id, id));
  await flashDone(status === "versendet" ? "Als versendet markiert" : status === "ausgelassen" ? "Ausgelassen" : "Wieder offen");
}

/** After sticking the labels: every open company of the week (optionally one language) counts as sent. */
export async function markWeekSentAction(week: string, language: string | null) {
  await requireAdmin();
  const t = schema.postcardRecipients;
  const rows = await db()
    .update(t)
    .set({ status: "versendet", sentAt: new Date() })
    .where(and(eq(t.week, week), eq(t.status, "offen"), language === "de" || language === "fr" ? eq(t.language, language) : undefined))
    .returning({ id: t.id });
  await flashDone(`${rows.length} Postkarten als versendet markiert`);
}


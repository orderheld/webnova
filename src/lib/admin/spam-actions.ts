"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { flashDone } from "./flash";

/** The filter was wrong: insert the stored row as a normal lead and open it. */
export async function restoreSpamAction(id: number) {
  await requireAdmin();
  const [s] = await db().select().from(schema.leadSpam).where(eq(schema.leadSpam.id, id));
  if (!s) redirect("/admin/anfragen/spam");
  const row = s.row as typeof schema.leads.$inferInsert;
  const [created] = await db()
    .insert(schema.leads)
    .values({ ...row, createdAt: s.createdAt, ipHash: s.visitor })
    .returning({ id: schema.leads.id });
  await db().delete(schema.leadSpam).where(eq(schema.leadSpam.id, id));
  await flashDone("Als Anfrage übernommen");
  redirect(`/admin/anfragen/${created.id}`);
}

export async function deleteSpamAction(id: number) {
  await requireAdmin();
  await db().delete(schema.leadSpam).where(eq(schema.leadSpam.id, id));
  await flashDone("Gelöscht");
}

export async function clearSpamAction() {
  await requireAdmin();
  await db().delete(schema.leadSpam);
  await flashDone("Spam-Liste geleert");
}

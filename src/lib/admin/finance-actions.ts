"use server";

import { flashDone } from "./flash";

import { and, desc, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { billingIntervals, subscriptionStatuses, type SubscriptionStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { billSubscriptions, firstBillingDate, logActivity, openAmount, periodOf, subscriptionsFromQuote, syncInvoicePayments } from "./billing";
import { parseForm, zBool, zDate, zId, zNum, zOptDate, zOptId, zOptNum, zOptText, zReq, zUrl, type FormState } from "./form";
import { paymentMethodLabels, subscriptionCategoryLabels, subscriptionStatusLabels } from "./labels";
import { addDaysIso, chf, round2, todayIso } from "./money";
import { nextNumber } from "./numbering";
import { getSettings } from "./settings";


/* ───────────── Payments ───────────── */

const paymentSchema = z.object({
  date: zDate,
  amount: zNum.refine((n) => n > 0),
  method: z.enum(Object.keys(paymentMethodLabels) as [string, ...string[]]).default("bank"),
  note: zOptText(500),
});

export async function addPaymentAction(invoiceId: number, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(paymentSchema, fd);
  if (!r.data) return { error: r.error };
  const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, invoiceId));
  if (!inv) return { error: "Rechnung nicht gefunden." };
  if (inv.status === "storniert") return { error: "Auf stornierte Rechnungen können keine Zahlungen erfasst werden." };
  await db().insert(schema.payments).values({ ...r.data, amount: round2(r.data.amount), invoiceId });
  await syncInvoicePayments(invoiceId);
  await logActivity(`Zahlung CHF ${chf(r.data.amount)} zu ${inv.number} erfasst`, { customerId: inv.customerId, projectId: inv.projectId });
  await flashDone("Erstellt");
  return { ok: true };
}

export async function deletePaymentAction(paymentId: number) {
  await requireAdmin();
  const [p] = await db().delete(schema.payments).where(eq(schema.payments.id, paymentId)).returning();
  if (p) await syncInvoicePayments(p.invoiceId);
  await flashDone("Gelöscht");
}

/* ───────────── Reminders (Mahnungen) ───────────── */

export async function createReminderAction(invoiceId: number) {
  await requireAdmin();
  const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, invoiceId));
  if (!inv || inv.kind !== "rechnung" || openAmount(inv) <= 0) redirect(`/admin/rechnungen/${invoiceId}`);
  const s = await getSettings();
  const level = Math.min(3, inv.reminderLevel + 1);
  const today = todayIso();
  const [r] = await db()
    .insert(schema.invoiceReminders)
    .values({ invoiceId, level, date: today, dueDate: addDaysIso(today, s.reminderDays), fee: level === 1 ? s.reminderFee1 : s.reminderFee2 })
    .returning();
  await db().update(schema.invoices).set({ reminderLevel: level }).where(eq(schema.invoices.id, invoiceId));
  await logActivity(`${level}. Mahnung zu ${inv.number} erstellt`, { customerId: inv.customerId, projectId: inv.projectId });
  await flashDone("Erstellt");
  redirect(`/admin/rechnungen/${invoiceId}?mahnung=${r.id}`);
}

export async function deleteReminderAction(reminderId: number) {
  await requireAdmin();
  const [r] = await db().delete(schema.invoiceReminders).where(eq(schema.invoiceReminders.id, reminderId)).returning();
  if (r) {
    const [last] = await db()
      .select()
      .from(schema.invoiceReminders)
      .where(eq(schema.invoiceReminders.invoiceId, r.invoiceId))
      .orderBy(desc(schema.invoiceReminders.level))
      .limit(1);
    await db().update(schema.invoices).set({ reminderLevel: last?.level ?? 0 }).where(eq(schema.invoices.id, r.invoiceId));
  }
  await flashDone("Gelöscht");
}

/* ───────────── Duplicate, credit notes ───────────── */

export async function duplicateQuoteAction(id: number) {
  await requireAdmin();
  const [q] = await db().select().from(schema.quotes).where(eq(schema.quotes.id, id));
  if (!q) redirect("/admin/offerten");
  const s = await getSettings();
  const today = todayIso();
  const number = await nextNumber("quote", s.quotePrefix);
  const [n] = await db()
    .insert(schema.quotes)
    .values({
      number,
      customerId: q.customerId,
      leadId: q.leadId,
      title: q.title,
      intro: q.intro,
      outro: q.outro,
      items: q.items,
      discountPercent: q.discountPercent,
      vatRate: q.vatRate,
      total: q.total,
      issueDate: today,
      validUntil: addDaysIso(today, s.quoteValidityDays),
    })
    .returning({ id: schema.quotes.id });
  await flashDone("Dupliziert");
  redirect(`/admin/offerten/${n.id}`);
}

export async function duplicateInvoiceAction(id: number) {
  await requireAdmin();
  const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, id));
  if (!inv) redirect("/admin/rechnungen");
  const s = await getSettings();
  const today = todayIso();
  const credit = inv.kind === "gutschrift";
  const number = await nextNumber(credit ? "credit" : "invoice", credit ? s.creditPrefix : s.invoicePrefix);
  const [n] = await db()
    .insert(schema.invoices)
    .values({
      number,
      kind: inv.kind,
      customerId: inv.customerId,
      projectId: inv.projectId,
      title: inv.title,
      intro: inv.intro,
      outro: inv.outro,
      // subscription links are not copied, the copy is a normal invoice
      items: inv.items.map((it) => ({ ...it, subscriptionId: null })),
      discountPercent: inv.discountPercent,
      vatRate: inv.vatRate,
      total: inv.total,
      issueDate: today,
      dueDate: addDaysIso(today, s.paymentTermDays),
    })
    .returning({ id: schema.invoices.id });
  await flashDone("Dupliziert");
  redirect(`/admin/rechnungen/${n.id}`);
}

export async function creditNoteAction(invoiceId: number) {
  await requireAdmin();
  const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, invoiceId));
  if (!inv || inv.kind !== "rechnung") redirect("/admin/rechnungen");
  const s = await getSettings();
  const today = todayIso();
  const number = await nextNumber("credit", s.creditPrefix);
  const [n] = await db()
    .insert(schema.invoices)
    .values({
      number,
      kind: "gutschrift",
      creditForId: inv.id,
      customerId: inv.customerId,
      projectId: inv.projectId,
      title: `Gutschrift zu ${inv.number}: ${inv.title}`,
      intro: s.creditIntro,
      outro: s.creditOutro,
      items: inv.items.map((it) => ({ ...it, subscriptionId: null })),
      discountPercent: inv.discountPercent,
      vatRate: inv.vatRate,
      total: inv.total,
      issueDate: today,
      dueDate: today,
    })
    .returning({ id: schema.invoices.id });
  await logActivity(`Gutschrift ${number} zu ${inv.number} erstellt`, { customerId: inv.customerId, projectId: inv.projectId });
  await flashDone("Erstellt");
  redirect(`/admin/rechnungen/${n.id}`);
}

/* ───────────── Subscriptions ───────────── */

const subscriptionSchema = z.object({
  customerId: zId,
  projectId: zOptId,
  productId: zOptId,
  category: z.enum(Object.keys(subscriptionCategoryLabels) as [string, ...string[]]).default("hosting"),
  title: zReq(200),
  description: zOptText(1000),
  amount: zNum.refine((n) => n >= 0),
  interval: z.enum(billingIntervals),
  startDate: zDate,
  firstYearIncluded: zBool,
  nextBillingDate: zOptDate,
  endDate: zOptDate,
  status: z.enum(subscriptionStatuses).default("aktiv"),
  notes: zOptText(),
});

export async function saveSubscriptionAction(id: number | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(subscriptionSchema, fd);
  if (!r.data) return { error: r.error };
  const v = r.data;
  let next = v.nextBillingDate;
  if (id) {
    const [old] = await db().select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id));
    if (!old) return { error: "Abo nicht gefunden." };
    // start or "first year included" changed and the date was not set by hand: recompute
    if (!next || (next === old.nextBillingDate && (old.startDate !== v.startDate || old.firstYearIncluded !== v.firstYearIncluded) && !old.lastInvoiceId))
      next = firstBillingDate(v.startDate, v.firstYearIncluded);
    await db()
      .update(schema.subscriptions)
      .set({ ...v, nextBillingDate: next })
      .where(eq(schema.subscriptions.id, id));
    await flashDone("Gespeichert");
    return { ok: true, message: "Gespeichert." };
  }
  next ??= firstBillingDate(v.startDate, v.firstYearIncluded);
  const [sub] = await db()
    .insert(schema.subscriptions)
    .values({ ...v, nextBillingDate: next })
    .returning({ id: schema.subscriptions.id });
  await logActivity(`Abo «${v.title}» angelegt, erste Verrechnung ${next.split("-").reverse().join(".")}`, { customerId: v.customerId, projectId: v.projectId });
  await flashDone("Gespeichert");
  redirect(`/admin/abos/${sub.id}`);
}

export async function setSubscriptionStatusAction(id: number, status: SubscriptionStatus) {
  await requireAdmin();
  const [sub] = await db().select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id));
  if (!sub) return;
  const today = todayIso();
  const patch: Partial<typeof schema.subscriptions.$inferInsert> = { status };
  if (status === "gekuendigt" && !sub.endDate) {
    // runs until the end of the period already billed
    patch.endDate = sub.nextBillingDate > today ? addDaysIso(sub.nextBillingDate, -1) : today;
  }
  if (status === "aktiv" && sub.status === "pausiert") {
    // skip periods that fell into the pause
    let next = sub.nextBillingDate;
    let guard = 0;
    while (next < today && guard++ < 240) next = periodOf(sub, next).next;
    patch.nextBillingDate = next;
  }
  if (status === "aktiv" && sub.status === "gekuendigt") patch.endDate = null;
  await db().update(schema.subscriptions).set(patch).where(eq(schema.subscriptions.id, id));
  await logActivity(`Abo «${sub.title}»: ${subscriptionStatusLabels[status]}`, { customerId: sub.customerId, projectId: sub.projectId });
  await flashDone("Aktualisiert");
}

export async function deleteSubscriptionAction(id: number) {
  await requireAdmin();
  await db().delete(schema.subscriptions).where(eq(schema.subscriptions.id, id));
  await flashDone("Gelöscht");
  redirect("/admin/abos");
}

/** "Fällige Abos verrechnen": one draft invoice per customer. */
export async function billDueSubscriptionsAction() {
  await requireAdmin();
  const ids = await billSubscriptions();
  await flashDone("Erstellt");
  if (ids.length === 1) redirect(`/admin/rechnungen/${ids[0]}`);
  redirect(`/admin/rechnungen?status=entwurf&abos=${ids.length}`);
}

/** Bills the next period of one subscription right away, independent of the lead time. */
export async function billSubscriptionNowAction(id: number) {
  await requireAdmin();
  const [sub] = await db().select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id));
  if (!sub || sub.status !== "aktiv") redirect(`/admin/abos/${id}`);
  const ids = await billSubscriptions({ ids: [id], horizon: sub.nextBillingDate });
  await flashDone("Erstellt");
  redirect(ids[0] ? `/admin/rechnungen/${ids[0]}` : `/admin/abos/${id}?fehler=ende`);
}

export async function subscriptionsFromQuoteAction(quoteId: number, fd: FormData) {
  await requireAdmin();
  const [q] = await db().select().from(schema.quotes).where(eq(schema.quotes.id, quoteId));
  if (!q) redirect("/admin/offerten");
  const start = String(fd.get("startDate") || todayIso());
  const n = await subscriptionsFromQuote(q, /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : todayIso());
  if (n) await logActivity(`${n} Abo${n === 1 ? "" : "s"} aus Offerte ${q.number} angelegt`, { customerId: q.customerId, projectId: q.projectId });
  await flashDone("Erstellt");
  redirect(`/admin/abos?kunde=${q.customerId}`);
}

/* ───────────── Expenses ───────────── */

const expenseSchema = z.object({
  date: zDate,
  category: z.string().trim().min(1).max(60),
  description: zReq(300),
  supplier: zOptText(200),
  amount: zNum.refine((n) => n !== 0),
  vatAmount: zOptNum,
  customerId: zOptId,
  projectId: zOptId,
  receiptUrl: zUrl,
  notes: zOptText(),
});

export async function saveExpenseAction(id: number | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(expenseSchema, fd);
  if (!r.data) return { error: r.error };
  const v = { ...r.data, amount: round2(r.data.amount), vatAmount: round2(r.data.vatAmount ?? 0) };
  if (v.projectId && !v.customerId) {
    const [p] = await db().select({ c: schema.projects.customerId }).from(schema.projects).where(eq(schema.projects.id, v.projectId));
    v.customerId = p?.c ?? null;
  }
  if (id) {
    await db().update(schema.expenses).set(v).where(eq(schema.expenses.id, id));
    await flashDone("Gespeichert");
    return { ok: true, message: "Gespeichert." };
  }
  await db().insert(schema.expenses).values(v);
  await flashDone("Gespeichert");
  return { ok: true, message: "Ausgabe erfasst." };
}

export async function deleteExpenseAction(id: number) {
  await requireAdmin();
  await db().delete(schema.expenses).where(eq(schema.expenses.id, id));
  await flashDone("Gelöscht");
  redirect("/admin/ausgaben");
}

export async function duplicateExpenseAction(id: number) {
  await requireAdmin();
  const [e] = await db().select().from(schema.expenses).where(eq(schema.expenses.id, id));
  if (!e) redirect("/admin/ausgaben");
  const { id: _id, createdAt: _c, ...rest } = e;
  void _id;
  void _c;
  const [n] = await db().insert(schema.expenses).values({ ...rest, date: todayIso() }).returning({ id: schema.expenses.id });
  await flashDone("Dupliziert");
  redirect(`/admin/ausgaben/${n.id}`);
}

/* ───────────── Catalogue ───────────── */

const productSchema = z.object({
  name: zReq(200),
  description: zOptText(1000),
  category: zOptText(80),
  unit: z.string().trim().min(1).max(30),
  price: zNum,
  interval: z.enum(["", ...billingIntervals]).optional().transform((v) => (v ? (v as (typeof billingIntervals)[number]) : null)),
  active: zBool,
  sortOrder: zOptNum,
});

export async function saveProductAction(id: number | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const r = parseForm(productSchema, fd);
  if (!r.data) return { error: r.error };
  const v = { ...r.data, sortOrder: Math.round(r.data.sortOrder ?? 0) };
  if (id) await db().update(schema.products).set(v).where(eq(schema.products.id, id));
  else await db().insert(schema.products).values(v);
  await flashDone("Gespeichert");
  return { ok: true, message: id ? "Gespeichert." : "Leistung angelegt." };
}

export async function deleteProductAction(id: number) {
  await requireAdmin();
  await db().delete(schema.products).where(eq(schema.products.id, id));
  // remove from templates
  const tpls = await db().select().from(schema.projectTemplates);
  for (const t of tpls.filter((x) => x.productIds.includes(id)))
    await db().update(schema.projectTemplates).set({ productIds: t.productIds.filter((p) => p !== id) }).where(eq(schema.projectTemplates.id, t.id));
  await flashDone("Gelöscht");
}

export async function duplicateProductAction(id: number) {
  await requireAdmin();
  const [p] = await db().select().from(schema.products).where(eq(schema.products.id, id));
  if (p) {
    const { id: _id, createdAt: _c, ...rest } = p;
    void _id;
    void _c;
    await db().insert(schema.products).values({ ...rest, name: `${p.name} (Kopie)` });
  }
  await flashDone("Dupliziert");
}

/* ───────────── Bulk helpers ───────────── */

/** Marks several open invoices as sent (e.g. after printing). */
export async function markInvoicesSentAction(ids: number[]) {
  await requireAdmin();
  if (!ids.length) return;
  await db()
    .update(schema.invoices)
    .set({ status: "gesendet", sentAt: new Date() })
    .where(and(inArray(schema.invoices.id, ids), eq(schema.invoices.status, "entwurf")));
  await flashDone("Aktualisiert");
}

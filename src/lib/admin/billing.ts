import "server-only";
import { and, asc, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { LineItem, Quote, Subscription } from "@/db/schema";
import { intervalMonths, intervalUnit } from "./labels";
import { addDaysIso, addMonthsIso, computeTotals, fmtDate, isPriced, lineTotal, recurringItems, round2, todayIso } from "./money";
import { nextNumber } from "./numbering";
import { getSettings } from "./settings";

/* ───────────── Activity log ───────────── */

export async function logActivity(body: string, ref: { leadId?: number | null; customerId?: number | null; projectId?: number | null }, type: "system" | "email" = "system") {
  await db()
    .insert(schema.activities)
    .values({ type, body, leadId: ref.leadId ?? null, customerId: ref.customerId ?? null, projectId: ref.projectId ?? null });
}

/* ───────────── Payments ───────────── */

/** Recomputes paid amount, status and paid date of an invoice from its payments. */
export async function syncInvoicePayments(invoiceId: number) {
  const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, invoiceId));
  if (!inv) return;
  const rows = await db().select().from(schema.payments).where(eq(schema.payments.invoiceId, invoiceId)).orderBy(asc(schema.payments.date));
  const paid = round2(rows.reduce((s, p) => s + p.amount, 0));
  let status = inv.status;
  let paidAt: string | null = null;
  if (inv.status !== "storniert") {
    if (paid >= inv.total - 0.004 && inv.total > 0) {
      status = "bezahlt";
      paidAt = rows.at(-1)?.date ?? todayIso();
    } else if (paid > 0) status = "teilbezahlt";
    else status = inv.status === "entwurf" ? "entwurf" : "gesendet";
  }
  await db().update(schema.invoices).set({ paidAmount: paid, status, paidAt }).where(eq(schema.invoices.id, invoiceId));
}

export const openAmount = (inv: { total: number; paidAmount: number; status: string }) =>
  inv.status === "storniert" || inv.status === "entwurf" ? 0 : Math.max(0, round2(inv.total - inv.paidAmount));

/* ───────────── Subscriptions ───────────── */

export function firstBillingDate(startDate: string, firstYearIncluded: boolean) {
  return firstYearIncluded ? addMonthsIso(startDate, 12) : startDate;
}

export function periodOf(sub: Pick<Subscription, "interval">, from: string) {
  const months = intervalMonths[sub.interval] ?? 12;
  const next = addMonthsIso(from, months);
  return { from, to: addDaysIso(next, -1), next };
}

/** Yearly value of a subscription (for ARR figures). */
export const yearlyValue = (s: Pick<Subscription, "amount" | "interval">) => s.amount * (12 / (intervalMonths[s.interval] ?? 12));

const billable = (s: Subscription, horizon: string) =>
  s.status === "aktiv" && s.nextBillingDate <= horizon && (!s.endDate || s.nextBillingDate <= s.endDate);

export async function dueSubscriptions(horizon?: string) {
  const s = await getSettings();
  const h = horizon ?? addDaysIso(todayIso(), s.subscriptionLeadDays);
  const rows = await db()
    .select()
    .from(schema.subscriptions)
    .where(
      and(
        eq(schema.subscriptions.status, "aktiv"),
        lte(schema.subscriptions.nextBillingDate, h),
        or(isNull(schema.subscriptions.endDate), sql`${schema.subscriptions.nextBillingDate} <= ${schema.subscriptions.endDate}`),
      ),
    )
    .orderBy(asc(schema.subscriptions.nextBillingDate));
  return { rows, horizon: h };
}

/**
 * Creates one draft invoice per customer for all subscriptions due until the horizon
 * (billing in advance, one line per period) and moves their next billing date forward.
 */
export async function billSubscriptions(opts: { ids?: number[]; horizon?: string } = {}) {
  const s = await getSettings();
  const horizon = opts.horizon ?? addDaysIso(todayIso(), s.subscriptionLeadDays);
  let subs: Subscription[];
  if (opts.ids?.length) {
    subs = (await db().select().from(schema.subscriptions).where(inArray(schema.subscriptions.id, opts.ids))).filter((x) => billable(x, horizon));
  } else subs = (await dueSubscriptions(horizon)).rows;
  const byCustomer = new Map<number, Subscription[]>();
  for (const sub of subs) byCustomer.set(sub.customerId, [...(byCustomer.get(sub.customerId) ?? []), sub]);

  const vatRate = s.vatEnabled ? s.vatRate : 0;
  const created: number[] = [];
  for (const [customerId, list] of byCustomer) {
    const items: LineItem[] = [];
    const updates: { id: number; next: string }[] = [];
    for (const sub of list) {
      let next = sub.nextBillingDate;
      let guard = 0;
      while (next <= horizon && (!sub.endDate || next <= sub.endDate) && guard < 36) {
        const p = periodOf(sub, next);
        items.push({
          title: sub.title,
          description: [`Periode ${fmtDate(p.from)} bis ${fmtDate(p.to)}`, sub.description].filter(Boolean).join("\n"),
          quantity: 1,
          unit: intervalUnit[sub.interval] ?? "Jahr",
          unitPrice: sub.amount,
          productId: sub.productId,
          subscriptionId: sub.id,
        });
        next = p.next;
        guard++;
      }
      updates.push({ id: sub.id, next });
    }
    if (items.length === 0) continue;
    const issueDate = todayIso();
    const number = await nextNumber("invoice", s.invoicePrefix);
    const projectIds = [...new Set(list.map((x) => x.projectId).filter(Boolean))];
    const year = items[0].description?.match(/\d{2}\.\d{2}\.(\d{4})/)?.[1] ?? issueDate.slice(0, 4);
    const [inv] = await db()
      .insert(schema.invoices)
      .values({
        number,
        customerId,
        projectId: projectIds.length === 1 ? projectIds[0] : null,
        title: `${s.subscriptionInvoiceTitle} ${year}`,
        intro: s.subscriptionIntro,
        outro: s.invoiceOutro,
        items,
        vatRate,
        total: computeTotals(items, 0, vatRate).total,
        issueDate,
        dueDate: addDaysIso(issueDate, s.paymentTermDays),
      })
      .returning({ id: schema.invoices.id });
    for (const u of updates) {
      await db().update(schema.subscriptions).set({ nextBillingDate: u.next, lastInvoiceId: inv.id }).where(eq(schema.subscriptions.id, u.id));
    }
    await logActivity(`Abo-Rechnung ${number} erstellt (${items.length} Position${items.length === 1 ? "" : "en"})`, { customerId });
    created.push(inv.id);
  }
  return created;
}

/** Creates subscriptions for the recurring lines of a quote (once per quote). */
export async function subscriptionsFromQuote(q: Quote, startDate: string, projectId?: number | null) {
  const recurring = recurringItems(q.items);
  if (recurring.length === 0) return 0;
  const [{ n }] = await db()
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.quoteId, q.id));
  if (n > 0) return 0;
  const productIds = recurring.map((it) => it.productId).filter((x): x is number => !!x);
  const prods = productIds.length ? await db().select().from(schema.products).where(inArray(schema.products.id, productIds)) : [];
  for (const it of recurring) {
    const interval = it.recurring!;
    const prod = prods.find((p) => p.id === it.productId);
    const included = !!it.firstYearIncluded;
    // not included: the first period is billed with the project invoice, so the subscription continues after it
    const next = included ? addMonthsIso(startDate, 12) : addMonthsIso(startDate, intervalMonths[interval] ?? 12);
    await db()
      .insert(schema.subscriptions)
      .values({
        customerId: q.customerId,
        projectId: projectId ?? q.projectId ?? null,
        quoteId: q.id,
        productId: it.productId ?? null,
        category: guessCategory(prod?.category ?? it.title),
        title: it.title,
        description: it.description || null,
        amount: lineTotal({ ...it, quantity: Number(it.quantity) || 1 }),
        interval,
        startDate,
        firstYearIncluded: included,
        nextBillingDate: next,
      });
  }
  return recurring.length;
}

export function guessCategory(text: string) {
  const t = text.toLowerCase();
  if (t.includes("domain")) return "domain";
  if (t.includes("wartung") || t.includes("update") || t.includes("support")) return "wartung";
  if (t.includes("seo")) return "seo";
  if (t.includes("lizenz") || t.includes("kasse")) return "lizenz";
  if (t.includes("host") || t.includes("mail") || t.includes("server")) return "hosting";
  return "andere";
}

/* ───────────── Projects ───────────── */

export async function insertTemplateTasks(projectId: number, tasks: { title: string; offsetDays: number; milestone?: boolean }[], start: string) {
  if (!tasks.length) return;
  await db()
    .insert(schema.projectTasks)
    .values(
      tasks.map((t, i) => ({
        projectId,
        title: t.title,
        milestone: !!t.milestone,
        dueDate: addDaysIso(start, Math.max(0, Number(t.offsetDays) || 0)),
        sortOrder: (i + 1) * 10,
      })),
    );
}

/** Invoice lines for a quote: one-time lines plus the first period of recurring lines that are not included. */
export function invoiceItemsFromQuote(items: LineItem[]): LineItem[] {
  return items.flatMap((it) => {
    if (!it.recurring || !isPriced(it)) return [it];
    if (it.firstYearIncluded) return [];
    return [{ ...it, recurring: null, firstYearIncluded: undefined, description: [it.description, "Erste Periode"].filter(Boolean).join("\n") }];
  });
}


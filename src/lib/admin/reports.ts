import "server-only";
import { and, eq, gte, lte, notInArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { computeTotals, quarterOf, round2 } from "./money";

/** Invoiced revenue (by issue date, excl. drafts and cancelled), payments and expenses for one year. */
export async function yearReport(year: number) {
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;
  const [invoices, payments, expenses] = await Promise.all([
    db()
      .select()
      .from(schema.invoices)
      .where(and(gte(schema.invoices.issueDate, from), lte(schema.invoices.issueDate, to), notInArray(schema.invoices.status, ["entwurf", "storniert"]))),
    db()
      .select({ date: schema.payments.date, amount: schema.payments.amount, kind: schema.invoices.kind })
      .from(schema.payments)
      .innerJoin(schema.invoices, eq(schema.invoices.id, schema.payments.invoiceId))
      .where(and(gte(schema.payments.date, from), lte(schema.payments.date, to))),
    db()
      .select()
      .from(schema.expenses)
      .where(and(gte(schema.expenses.date, from), lte(schema.expenses.date, to))),
  ]);
  const months = Array.from({ length: 12 }, () => ({ revenue: 0, vat: 0, received: 0, expenses: 0, inputVat: 0 }));
  const quarters = Array.from({ length: 4 }, () => ({ revenue: 0, vat: 0, inputVat: 0, byRate: new Map<number, { net: number; vat: number }>() }));
  for (const inv of invoices) {
    const t = computeTotals(inv.items, inv.discountPercent, inv.vatRate);
    const sign = inv.kind === "gutschrift" ? -1 : 1;
    const m = Number(inv.issueDate.slice(5, 7)) - 1;
    months[m].revenue += sign * t.net;
    months[m].vat += sign * t.vat;
    const q = quarters[quarterOf(inv.issueDate) - 1];
    q.revenue += sign * t.net;
    q.vat += sign * t.vat;
    const r = q.byRate.get(inv.vatRate) ?? { net: 0, vat: 0 };
    r.net += sign * t.net;
    r.vat += sign * t.vat;
    q.byRate.set(inv.vatRate, r);
  }
  for (const p of payments) months[Number(p.date.slice(5, 7)) - 1].received += p.kind === "gutschrift" ? -p.amount : p.amount;
  for (const e of expenses) {
    const m = Number(e.date.slice(5, 7)) - 1;
    months[m].expenses += e.amount;
    months[m].inputVat += e.vatAmount;
    quarters[quarterOf(e.date) - 1].inputVat += e.vatAmount;
  }
  const sum = (k: "revenue" | "vat" | "received" | "expenses" | "inputVat") => round2(months.reduce((a, m) => a + m[k], 0));
  return {
    months,
    quarters,
    totals: { revenue: sum("revenue"), vat: sum("vat"), received: sum("received"), expenses: sum("expenses"), inputVat: sum("inputVat") },
    invoiceCount: invoices.filter((i) => i.kind === "rechnung").length,
  };
}

/** Sum of payments received between two dates (inclusive). */
export async function receivedBetween(from: string, to: string) {
  const [r] = await db()
    .select({ sum: sql<number>`coalesce(sum(case when ${schema.invoices.kind} = 'gutschrift' then -${schema.payments.amount} else ${schema.payments.amount} end),0)::float` })
    .from(schema.payments)
    .innerJoin(schema.invoices, eq(schema.invoices.id, schema.payments.invoiceId))
    .where(and(gte(schema.payments.date, from), lte(schema.payments.date, to)));
  return r.sum;
}

/** Invoiced net revenue between two dates (issue date). */
export async function invoicedBetween(from: string, to: string) {
  const rows = await db()
    .select()
    .from(schema.invoices)
    .where(and(gte(schema.invoices.issueDate, from), lte(schema.invoices.issueDate, to), notInArray(schema.invoices.status, ["entwurf", "storniert"])));
  return round2(rows.reduce((a, i) => a + (i.kind === "gutschrift" ? -1 : 1) * computeTotals(i.items, i.discountPercent, i.vatRate).net, 0));
}

export async function expensesBetween(from: string, to: string) {
  const [r] = await db()
    .select({ sum: sql<number>`coalesce(sum(${schema.expenses.amount}),0)::float` })
    .from(schema.expenses)
    .where(and(gte(schema.expenses.date, from), lte(schema.expenses.date, to)));
  return r.sum;
}

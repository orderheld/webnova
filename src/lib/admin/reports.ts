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

/**
 * Dashboard key figures in three aggregate queries: invoiced net revenue (month and year),
 * payments received (month and year) and expenses (year). Net revenue is derived from the
 * stored total, which is exact up to the 5-Rappen rounding.
 */
export async function dashboardFigures(monthStart: string, yearStart: string, today: string) {
  const i = schema.invoices;
  const p = schema.payments;
  const sign = sql`case when ${i.kind} = 'gutschrift' then -1 else 1 end`;
  const net = sql`${sign} * ${i.total} / (1 + ${i.vatRate} / 100.0)`;
  const [[rev], [inc], exp] = await Promise.all([
    db()
      .select({
        month: sql<number>`coalesce(sum(${net}) filter (where ${i.issueDate} >= ${monthStart}), 0)::float`,
        year: sql<number>`coalesce(sum(${net}), 0)::float`,
      })
      .from(i)
      .where(and(gte(i.issueDate, yearStart), lte(i.issueDate, today), notInArray(i.status, ["entwurf", "storniert"]))),
    db()
      .select({
        month: sql<number>`coalesce(sum(${sign} * ${p.amount}) filter (where ${p.date} >= ${monthStart}), 0)::float`,
        year: sql<number>`coalesce(sum(${sign} * ${p.amount}), 0)::float`,
      })
      .from(p)
      .innerJoin(i, eq(i.id, p.invoiceId))
      .where(and(gte(p.date, yearStart), lte(p.date, today))),
    expensesBetween(yearStart, today),
  ]);
  return { monthRev: round2(rev.month), yearRev: round2(rev.year), monthIn: round2(inc.month), yearIn: round2(inc.year), yearExp: exp };
}

/** Net invoiced revenue per calendar month ("YYYY-MM") between two dates, credit notes subtracted. */
export async function monthlyRevenue(from: string, to: string) {
  const i = schema.invoices;
  const month = sql<string>`to_char(${i.issueDate}, 'YYYY-MM')`;
  const rows = await db()
    .select({
      month,
      net: sql<number>`coalesce(sum(case when ${i.kind} = 'gutschrift' then -1 else 1 end * ${i.total} / (1 + ${i.vatRate} / 100.0)), 0)::float`,
    })
    .from(i)
    .where(and(gte(i.issueDate, from), lte(i.issueDate, to), notInArray(i.status, ["entwurf", "storniert"])))
    .groupBy(month);
  return new Map(rows.map((r) => [r.month, round2(r.net)]));
}

/**
 * Sales and operations figures for the dashboard in one round trip: leads, quotes (open, accepted
 * this year, acceptance rate), recurring revenue normalised to one month and tasks due.
 */
export async function salesFigures(yearStart: string, today: string, weekEnd: string) {
  const res = await db().execute<{
    new_leads: number;
    open_leads: number;
    leads_month: number;
    quotes_open: number;
    quotes_open_sum: number;
    quotes_expired: number;
    quotes_won: number;
    quotes_won_sum: number;
    quotes_lost: number;
    subs_active: number;
    mrr: number;
    tasks_due: number;
    tasks_week: number;
  }>(sql`
    select
      (select count(*)::int from leads where status = 'neu') as new_leads,
      (select count(*)::int from leads where status not in ('gewonnen','verloren')) as open_leads,
      (select count(*)::int from leads where created_at >= date_trunc('month', ${today}::date)) as leads_month,
      (select count(*)::int from quotes where status = 'gesendet') as quotes_open,
      (select coalesce(sum(total),0)::float from quotes where status = 'gesendet') as quotes_open_sum,
      (select count(*)::int from quotes where status = 'gesendet' and valid_until < ${today}) as quotes_expired,
      (select count(*)::int from quotes where status = 'angenommen' and issue_date >= ${yearStart}) as quotes_won,
      (select coalesce(sum(total),0)::float from quotes where status = 'angenommen' and issue_date >= ${yearStart}) as quotes_won_sum,
      (select count(*)::int from quotes where status = 'abgelehnt' and issue_date >= ${yearStart}) as quotes_lost,
      (select count(*)::int from subscriptions where status = 'aktiv' and (end_date is null or end_date >= ${today})) as subs_active,
      (select coalesce(sum(amount / case "interval" when 'monat' then 1 when 'quartal' then 3 when 'halbjahr' then 6 else 12 end), 0)::float
         from subscriptions where status = 'aktiv' and (end_date is null or end_date >= ${today})) as mrr,
      (select count(*)::int from project_tasks t join projects p on p.id = t.project_id
         where not t.done and t.due_date <= ${today} and p.status <> 'abgeschlossen') as tasks_due,
      (select count(*)::int from project_tasks t join projects p on p.id = t.project_id
         where not t.done and t.due_date > ${today} and t.due_date <= ${weekEnd} and p.status <> 'abgeschlossen') as tasks_week
  `);
  const r = res.rows[0];
  const decided = r.quotes_won + r.quotes_lost;
  return {
    newLeads: r.new_leads,
    openLeads: r.open_leads,
    leadsMonth: r.leads_month,
    quotesOpen: r.quotes_open,
    quotesOpenSum: round2(r.quotes_open_sum),
    quotesExpired: r.quotes_expired,
    quotesWon: r.quotes_won,
    quotesWonSum: round2(r.quotes_won_sum),
    winRate: decided ? Math.round((r.quotes_won / decided) * 100) : null,
    subsActive: r.subs_active,
    mrr: round2(r.mrr),
    tasksDue: r.tasks_due,
    tasksWeek: r.tasks_week,
  };
}

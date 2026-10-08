"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { billingIntervals, type LineItem } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { logActivity, subscriptionsFromQuote } from "./billing";
import { calcTotals, isPerUnit, normalizeCalc, type CalcState, type CalculatorConfig } from "./calculator";
import { intervalUnit } from "./labels";
import { addDaysIso, computeTotals, todayIso } from "./money";
import { nextNumber } from "./numbering";
import { getCalculatorConfig, getSettings, saveCalculatorConfig } from "./settings";

const done = () => revalidatePath("/admin", "layout");

const num = z.coerce.number().finite();
const lineSchema = z.object({
  id: z.string().max(40),
  name: z.string().trim().min(1).max(200),
  description: z.string().max(1000).default(""),
  qty: num.min(0).max(100000),
  unit: z.string().trim().max(30).default("Pauschal"),
  price: num.min(0).max(1_000_000),
  hours: num.min(0).max(10000),
});
const recurringSchema = z.object({
  id: z.string().max(40),
  name: z.string().trim().min(1).max(200),
  description: z.string().max(1000).default(""),
  price: num.min(0).max(1_000_000),
  interval: z.enum(billingIntervals),
  fromYear2: z.boolean(),
});
const calcSchema = z.object({
  version: z.literal(2),
  package: lineSchema.nullable(),
  addons: z.array(lineSchema).max(100),
  recurring: z.array(recurringSchema).max(30),
  discountPercent: num.min(0).max(100),
  targetRate: num.min(0).max(10000),
  marginNote: z.string().max(5000).optional(),
});
const estimateSchema = z.object({
  name: z.string().trim().min(1, "Bitte einen Namen angeben.").max(200),
  customerId: z.number().int().positive().nullable(),
  leadId: z.number().int().positive().nullable(),
  calc: calcSchema,
});
export type EstimatePayload = z.input<typeof estimateSchema>;

export async function saveEstimateAction(id: number | null, payload: EstimatePayload): Promise<{ error?: string; id?: number }> {
  await requireAdmin();
  const p = estimateSchema.safeParse(payload);
  if (!p.success) return { error: p.error.issues[0]?.message?.startsWith("Bitte") ? p.error.issues[0].message : "Bitte alle Positionen mit Bezeichnung und gültigen Beträgen ausfüllen." };
  const v = p.data;
  const t = calcTotals(v.calc as CalcState);
  const values = {
    name: v.name,
    customerId: v.customerId,
    leadId: v.leadId,
    data: v.calc,
    totalHours: t.hours,
    total: t.total,
    updatedAt: new Date(),
  };
  if (id) await db().update(schema.estimates).set(values).where(eq(schema.estimates.id, id));
  else id = (await db().insert(schema.estimates).values(values).returning({ id: schema.estimates.id }))[0].id;
  done();
  return { id };
}

export async function deleteEstimateAction(id: number) {
  await requireAdmin();
  await db().delete(schema.estimates).where(eq(schema.estimates.id, id));
  done();
  redirect("/admin/rechner");
}

/**
 * Creates a quote from a saved calculation: package and add-ons as positions, recurring fees as
 * recurring quote lines (first year included when billed from year 2) and optionally the subscriptions right away.
 */
export async function estimateToQuoteAction(id: number, opts: { withSubscriptions: boolean; startDate?: string }): Promise<{ error?: string }> {
  await requireAdmin();
  const [e] = await db().select().from(schema.estimates).where(eq(schema.estimates.id, id));
  if (!e) return { error: "Kalkulation nicht gefunden." };
  if (!e.customerId) return { error: "Bitte zuerst einen Kunden wählen und speichern." };
  const [s, cfg] = await Promise.all([getSettings(), getCalculatorConfig()]);
  const c = normalizeCalc(e.data, cfg, { total: e.total, hours: e.totalHours });
  const items: LineItem[] = [];
  if (c.package) items.push({ title: c.package.name, description: c.package.description, quantity: 1, unit: "Pauschal", unitPrice: c.package.price });
  const addons = c.addons.filter((a) => a.qty > 0);
  if (addons.length && c.package) items.push({ type: "title", title: "Zusatzleistungen", description: "", quantity: 0, unit: "", unitPrice: 0 });
  for (const a of addons) {
    const perUnit = isPerUnit(a.unit);
    items.push({ title: a.name, description: a.description, quantity: perUnit ? a.qty : 1, unit: perUnit ? a.unit : "Pauschal", unitPrice: perUnit ? a.price : a.price * a.qty });
  }
  for (const r of c.recurring) {
    items.push({ title: r.name, description: r.description, quantity: 1, unit: intervalUnit[r.interval] ?? "Jahr", unitPrice: r.price, recurring: r.interval, firstYearIncluded: r.fromYear2 });
  }
  if (!items.length) return { error: "Die Kalkulation enthält keine Positionen." };
  const vatRate = s.vatEnabled ? s.vatRate : 0;
  const issueDate = todayIso();
  const number = await nextNumber("quote", s.quotePrefix);
  const [q] = await db()
    .insert(schema.quotes)
    .values({
      number,
      customerId: e.customerId,
      leadId: e.leadId,
      title: e.name,
      intro: s.quoteIntro,
      outro: s.quoteOutro,
      items,
      discountPercent: c.discountPercent,
      vatRate,
      total: computeTotals(items, c.discountPercent, vatRate).total,
      issueDate,
      validUntil: addDaysIso(issueDate, s.quoteValidityDays),
      notes: c.marginNote || null,
    })
    .returning();
  if (e.leadId) await db().update(schema.leads).set({ status: "offerte", updatedAt: new Date() }).where(eq(schema.leads.id, e.leadId));
  let subs = 0;
  if (opts.withSubscriptions) {
    const start = opts.startDate && /^\d{4}-\d{2}-\d{2}$/.test(opts.startDate) ? opts.startDate : issueDate;
    subs = await subscriptionsFromQuote(q, start);
  }
  await logActivity(`Offerte ${number} aus Rechner erstellt${subs ? `, ${subs} Abo${subs === 1 ? "" : "s"} angelegt` : ""}`, { customerId: e.customerId, leadId: e.leadId });
  done();
  redirect(`/admin/offerten/${q.id}`);
}

/* ───────────── Calculator prices ───────────── */

const cfgSchema = z.object({
  targetRate: num.min(0).max(10000),
  minTotal: num.min(0),
  maxTotal: num.min(0),
  packages: z
    .array(z.object({ id: z.string().min(1).max(40), name: z.string().trim().min(1).max(200), description: z.string().max(1000), price: num.min(0), hours: num.min(0) }))
    .max(20),
  addons: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        name: z.string().trim().min(1).max(200),
        description: z.string().max(1000),
        price: num.min(0),
        hours: num.min(0),
        unit: z.string().trim().min(1).max(30),
      }),
    )
    .max(60),
  recurring: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        name: z.string().trim().min(1).max(200),
        description: z.string().max(1000),
        price: num.min(0),
        interval: z.enum(billingIntervals),
        defaultOn: z.boolean(),
      }),
    )
    .max(20),
});

export async function saveCalculatorConfigAction(cfg: CalculatorConfig): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const p = cfgSchema.safeParse(cfg);
  if (!p.success) return { error: "Bitte bei jeder Zeile eine Bezeichnung und gültige Beträge angeben." };
  await saveCalculatorConfig(p.data);
  done();
  return { ok: true };
}

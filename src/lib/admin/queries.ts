import "server-only";
import { asc, desc, eq, ne, sql } from "drizzle-orm";
import { db, schema } from "@/db";

export interface Option {
  id: number;
  name: string;
}

export async function customerOptions(): Promise<Option[]> {
  const c = schema.customers;
  const rows = await db()
    .select({ id: c.id, company: c.company, first: c.firstName, last: c.lastName, city: c.city })
    .from(c)
    .where(eq(c.archived, false))
    .orderBy(asc(sql`lower(coalesce(${c.company}, ${c.lastName}, ${c.firstName}))`));
  return rows.map((r) => ({
    id: r.id,
    name: [r.company || [r.first, r.last].filter(Boolean).join(" "), r.city].filter(Boolean).join(", "),
  }));
}

/** Projects with their customer id, for selects that filter by customer. */
export async function projectOptions(): Promise<(Option & { customerId: number })[]> {
  const p = schema.projects;
  const rows = await db()
    .select({ id: p.id, name: p.name, customerId: p.customerId, company: schema.customers.company, first: schema.customers.firstName, last: schema.customers.lastName })
    .from(p)
    .innerJoin(schema.customers, eq(schema.customers.id, p.customerId))
    .where(ne(p.status, "abgeschlossen"))
    .orderBy(desc(p.updatedAt));
  return rows.map((r) => ({ id: r.id, customerId: r.customerId, name: `${r.name} (${r.company || [r.first, r.last].filter(Boolean).join(" ")})` }));
}

/** All projects incl. finished ones (for edit forms that must keep the current value). */
export async function allProjectOptions(): Promise<(Option & { customerId: number })[]> {
  const p = schema.projects;
  const rows = await db().select({ id: p.id, name: p.name, customerId: p.customerId, status: p.status }).from(p).orderBy(desc(p.updatedAt));
  return rows.map((r) => ({ id: r.id, customerId: r.customerId, name: r.status === "abgeschlossen" ? `${r.name} (abgeschlossen)` : r.name }));
}

export async function productOptions() {
  return db().select().from(schema.products).where(eq(schema.products.active, true)).orderBy(asc(schema.products.sortOrder), asc(schema.products.name));
}

export async function templateOptions() {
  return db().select().from(schema.projectTemplates).orderBy(asc(schema.projectTemplates.name));
}

export const customerName = (c: { company: string | null; firstName: string | null; lastName: string | null }) =>
  c.company || [c.firstName, c.lastName].filter(Boolean).join(" ") || "Ohne Namen";

export const personName = (c: { firstName: string | null; lastName: string | null }) => [c.firstName, c.lastName].filter(Boolean).join(" ");

/** Parses a positive integer route param, or returns null. */
export function routeId(raw: string) {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

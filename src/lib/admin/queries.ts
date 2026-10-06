import "server-only";
import { asc, sql } from "drizzle-orm";
import { db, schema } from "@/db";

export async function customerOptions() {
  const c = schema.customers;
  const rows = await db()
    .select({ id: c.id, company: c.company, first: c.firstName, last: c.lastName, city: c.city })
    .from(c)
    .orderBy(asc(sql`coalesce(${c.company}, ${c.lastName})`));
  return rows.map((r) => ({
    id: r.id,
    name: [r.company || [r.first, r.last].filter(Boolean).join(" "), r.city].filter(Boolean).join(", "),
  }));
}

export const customerName = (c: { company: string | null; firstName: string | null; lastName: string | null }) =>
  c.company || [c.firstName, c.lastName].filter(Boolean).join(" ");

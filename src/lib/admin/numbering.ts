import "server-only";
import { like, sql } from "drizzle-orm";
import { db, schema } from "@/db";

/** Next document number like OF-2026-001 / RE-2026-014 */
export async function nextNumber(kind: "quote" | "invoice", prefix: string) {
  const year = new Date().getFullYear();
  const base = `${prefix}-${year}-`;
  const table = kind === "quote" ? schema.quotes : schema.invoices;
  const [row] = await db()
    .select({ max: sql<string | null>`max(${table.number})` })
    .from(table)
    .where(like(table.number, `${base}%`));
  const last = row?.max ? parseInt(row.max.slice(base.length), 10) || 0 : 0;
  return `${base}${String(last + 1).padStart(3, "0")}`;
}

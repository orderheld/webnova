import "server-only";
import { like } from "drizzle-orm";
import { db, schema } from "@/db";

/**
 * First sequence number of each year (raised from 1001 on 2026-11-27). Documents already issued keep
 * their number; the gap is allowed, Swiss law only requires unique, traceable numbers.
 */
export const FIRST_NUMBER = 2417;

/** Next document number like OF-2026-2417 / RE-2026-2430 / GS-2026-2418 (credit notes live in the invoices table). */
export async function nextNumber(kind: "quote" | "invoice" | "credit", prefix: string) {
  const year = new Date().getFullYear();
  const base = `${prefix}-${year}-`;
  const table = kind === "quote" ? schema.quotes : schema.invoices;
  const rows = await db().select({ n: table.number }).from(table).where(like(table.number, `${base}%`));
  // numeric max, so RE-2026-1000 sorts after RE-2026-999
  const last = rows.reduce((m, r) => Math.max(m, parseInt(r.n.slice(base.length), 10) || 0), 0);
  return `${base}${Math.max(last + 1, FIRST_NUMBER)}`;
}

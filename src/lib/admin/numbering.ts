import "server-only";
import { like } from "drizzle-orm";
import { db, schema } from "@/db";

/** Next document number like OF-2026-001 / RE-2026-014 / GS-2026-002 (credit notes live in the invoices table). */
export async function nextNumber(kind: "quote" | "invoice" | "credit", prefix: string) {
  const year = new Date().getFullYear();
  const base = `${prefix}-${year}-`;
  const table = kind === "quote" ? schema.quotes : schema.invoices;
  const rows = await db().select({ n: table.number }).from(table).where(like(table.number, `${base}%`));
  // numeric max, so RE-2026-1000 sorts after RE-2026-999
  const last = rows.reduce((m, r) => Math.max(m, parseInt(r.n.slice(base.length), 10) || 0), 0);
  return `${base}${String(last + 1).padStart(3, "0")}`;
}

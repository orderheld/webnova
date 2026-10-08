import type { LineItem } from "@/db/schema";

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
/** Swiss cash rounding to 5 Rappen */
export const round05 = (n: number) => Math.round(n * 20) / 20;

/** Priced position (as opposed to a title or text row). */
export const isPriced = (it: Pick<LineItem, "type">) => !it.type || it.type === "item";

export const lineTotal = (it: Pick<LineItem, "quantity" | "unitPrice" | "type" | "discount">) =>
  isPriced(it) ? round2((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0) * (1 - (Number(it.discount) || 0) / 100)) : 0;

/** Lines that belong to the one-time part (recurring quote lines are listed separately). Includes title and text rows. */
export const oneTimeItems = (items: LineItem[]) => items.filter((it) => !it.recurring || !isPriced(it));
export const recurringItems = (items: LineItem[]) => items.filter((it) => it.recurring && isPriced(it));

export function computeTotals(items: LineItem[], discountPercent: number, vatRate: number) {
  const subtotal = round2(oneTimeItems(items).reduce((s, it) => s + lineTotal(it), 0));
  const discount = round2((subtotal * (discountPercent || 0)) / 100);
  const net = round2(subtotal - discount);
  const vat = round2((net * (vatRate || 0)) / 100);
  const total = round05(net + vat);
  return { subtotal, discount, net, vat, total };
}

export function chf(n: number) {
  return new Intl.NumberFormat("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

/** Compact CHF without decimals for tiles, e.g. 12'400 */
export function chf0(n: number) {
  return new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function fmtDate(iso: string | Date | null | undefined) {
  if (!iso) return "–";
  const d = typeof iso === "string" ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso) : iso;
  return d.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Zurich" });
}

export function fmtDateTime(d: Date | string | null | undefined) {
  if (!d) return "–";
  const x = typeof d === "string" ? new Date(d) : d;
  return x.toLocaleString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
}

export function fmtHours(n: number) {
  return `${(Math.round(n * 100) / 100).toLocaleString("de-CH")} h`;
}

export function todayIso() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
}

export function addDaysIso(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Adds calendar months, clamping to the month end (31.01. + 1 month = 28./29.02.). */
export function addMonthsIso(iso: string, months: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1, 12));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0, 12)).getUTCDate();
  target.setUTCDate(Math.min(d, last));
  return target.toISOString().slice(0, 10);
}

export const daysBetween = (a: string, b: string) =>
  Math.round((new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime()) / 86_400_000);

export const quarterOf = (iso: string) => Math.floor((Number(iso.slice(5, 7)) - 1) / 3) + 1;

export const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

import type { LineItem } from "@/db/schema";

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
/** Swiss cash rounding to 5 Rappen */
export const round05 = (n: number) => Math.round(n * 20) / 20;

export function computeTotals(items: LineItem[], discountPercent: number, vatRate: number) {
  const subtotal = round2(items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0));
  const discount = round2((subtotal * (discountPercent || 0)) / 100);
  const net = round2(subtotal - discount);
  const vat = round2((net * (vatRate || 0)) / 100);
  const total = round05(net + vat);
  return { subtotal, discount, net, vat, total };
}

export function chf(n: number) {
  return new Intl.NumberFormat("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function fmtDate(iso: string | Date | null | undefined) {
  if (!iso) return "–";
  const d = typeof iso === "string" ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso) : iso;
  return d.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function todayIso() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
}

export function addDaysIso(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

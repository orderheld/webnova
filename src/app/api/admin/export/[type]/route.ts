import { and, asc, eq, gte, lte, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { computeTotals, todayIso } from "@/lib/admin/money";
import { expenseCategoryLabels, statusLabel } from "@/lib/admin/labels";
import { customerName } from "@/lib/admin/queries";
import { currentAdmin } from "@/lib/auth";

/** CSV for Excel (Swiss locale): semicolon separated, UTF-8 with BOM, decimal point. */
function csv(rows: (string | number | null | undefined)[][]) {
  const cell = (v: string | number | null | undefined) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "number" ? v.toFixed(2) : String(v);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + rows.map((r) => r.map(cell).join(";")).join("\r\n") + "\r\n";
}

export async function GET(req: Request, ctx: RouteContext<"/api/admin/export/[type]">) {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const { type } = await ctx.params;
  const raw = new URL(req.url).searchParams.get("jahr") ?? "";
  const year = /^\d{4}$/.test(raw) ? Number(raw) : Number(todayIso().slice(0, 4));
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;
  let body: string;

  if (type === "rechnungen") {
    const rows = await db()
      .select({ i: schema.invoices, c: schema.customers })
      .from(schema.invoices)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
      .where(and(gte(schema.invoices.issueDate, from), lte(schema.invoices.issueDate, to), ne(schema.invoices.status, "entwurf")))
      .orderBy(asc(schema.invoices.issueDate), asc(schema.invoices.number));
    body = csv([
      ["Nummer", "Art", "Datum", "Fällig", "Kunde", "Titel", "Netto", "MWST-Satz", "MWST", "Total", "Bezahlt", "Offen", "Status", "Bezahlt am"],
      ...rows.map(({ i, c }) => {
        const t = computeTotals(i.items, i.discountPercent, i.vatRate);
        const sign = i.kind === "gutschrift" ? -1 : 1;
        const cancelled = i.status === "storniert";
        return [
          i.number,
          i.kind === "gutschrift" ? "Gutschrift" : "Rechnung",
          i.issueDate,
          i.dueDate,
          customerName(c),
          i.title,
          sign * t.net,
          i.vatRate,
          sign * t.vat,
          sign * i.total,
          sign * i.paidAmount,
          cancelled ? 0 : sign * Math.max(0, i.total - i.paidAmount),
          statusLabel(i.status),
          i.paidAt ?? "",
        ];
      }),
    ]);
  } else if (type === "ausgaben") {
    const rows = await db()
      .select({ e: schema.expenses, c: schema.customers, p: schema.projects })
      .from(schema.expenses)
      .leftJoin(schema.customers, eq(schema.customers.id, schema.expenses.customerId))
      .leftJoin(schema.projects, eq(schema.projects.id, schema.expenses.projectId))
      .where(and(gte(schema.expenses.date, from), lte(schema.expenses.date, to)))
      .orderBy(asc(schema.expenses.date));
    body = csv([
      ["Datum", "Kategorie", "Beschreibung", "Lieferant", "Betrag brutto", "Vorsteuer", "Kunde", "Projekt", "Beleg", "Notiz"],
      ...rows.map(({ e, c, p }) => [
        e.date,
        expenseCategoryLabels[e.category] ?? e.category,
        e.description,
        e.supplier,
        e.amount,
        e.vatAmount,
        c ? customerName(c) : "",
        p?.name ?? "",
        e.receiptUrl,
        e.notes,
      ]),
    ]);
  } else {
    return new Response("Not found", { status: 404 });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}-${year}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}

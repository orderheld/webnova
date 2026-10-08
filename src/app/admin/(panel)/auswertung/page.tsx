import { asc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { invoiceDisplayStatus, InvoiceBadge } from "@/components/admin/lists";
import { Card, PageHeader, Stat, btn, btnSm, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { openAmount } from "@/lib/admin/billing";
import { chf, chf0, fmtDate, monthNames, todayIso } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";
import { yearReport } from "@/lib/admin/reports";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Auswertung" };

// Schieferblau for revenue, a light tint of the logo blue for expenses (corporate palette only).
const REV = "#24405a";
const EXP = "#9fb4c7";

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ jahr?: string }> }) {
  const { jahr } = await searchParams;
  const today = todayIso();
  const year = /^\d{4}$/.test(jahr ?? "") ? Number(jahr) : Number(today.slice(0, 4));
  const [r, prev, s, openRows] = await Promise.all([
    yearReport(year),
    yearReport(year - 1),
    getSettings(),
    db()
      .select({ i: schema.invoices, c: schema.customers })
      .from(schema.invoices)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
      .where(inArray(schema.invoices.status, ["gesendet", "teilbezahlt"]))
      .orderBy(asc(schema.invoices.dueDate)),
  ]);
  const open = openRows.filter(({ i }) => i.kind === "rechnung");
  const openSum = open.reduce((a, { i }) => a + openAmount(i), 0);
  const profit = r.totals.revenue - r.totals.expenses;
  const max = Math.max(1, ...r.months.map((m) => Math.max(m.revenue, m.expenses)));
  const diff = prev.totals.revenue ? Math.round(((r.totals.revenue - prev.totals.revenue) / prev.totals.revenue) * 100) : null;

  return (
    <>
      <PageHeader
        eyebrow="Finanzen"
        title="Auswertung"
        sub={`Geschäftsjahr ${year} · Umsatz netto nach Rechnungsdatum, Ausgaben brutto`}
        actions={
          <>
            <div className="flex items-center gap-1">
              <Link href={`/admin/auswertung?jahr=${year - 1}`} className={btnSm.ghost} aria-label="Vorjahr">
                <Icon name="arrowLeft" className="h-3.5 w-3.5" /> {year - 1}
              </Link>
              <Link href={`/admin/auswertung?jahr=${year + 1}`} className={btnSm.ghost} aria-label="Folgejahr">
                {year + 1} <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </div>
            <a href={`/api/admin/export/rechnungen?jahr=${year}`} className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> Rechnungen CSV
            </a>
            <a href={`/api/admin/export/ausgaben?jahr=${year}`} className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> Ausgaben CSV
            </a>
          </>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label={`Umsatz ${year} (netto)`} value={`CHF ${chf0(r.totals.revenue)}`} sub={diff === null ? `${r.invoiceCount} Rechnungen` : `${diff >= 0 ? "+" : ""}${diff} % ggü. Vorjahr`} />
        <Stat label="Zahlungseingang" value={`CHF ${chf0(r.totals.received)}`} />
        <Stat label="Ausgaben" value={`CHF ${chf0(r.totals.expenses)}`} />
        <Stat label="Ergebnis" value={`CHF ${chf0(profit)}`} tone={profit < 0 ? "warn" : undefined} sub="Umsatz minus Ausgaben" />
        <Stat label="Offene Posten" value={`CHF ${chf0(openSum)}`} sub={`${open.length} Rechnungen`} href="/admin/rechnungen?status=offen" />
      </div>

      <Card
        title="Umsatz und Ausgaben pro Monat"
        className="mb-5"
        actions={
          <span className="flex items-center gap-4 text-[12.5px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: REV }} /> Umsatz netto
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: EXP }} /> Ausgaben
            </span>
          </span>
        }
      >
        <div className="overflow-x-auto">
          <div className="flex h-[220px] min-w-[640px] items-end gap-2 border-b border-line pb-px">
            {r.months.map((m, k) => (
              <div key={k} className="group relative flex h-full flex-1 items-end justify-center gap-[2px]">
                <div className="w-[38%] rounded-t-[4px]" style={{ height: `${(Math.max(0, m.revenue) / max) * 100}%`, background: REV }} />
                <div className="w-[38%] rounded-t-[4px]" style={{ height: `${(m.expenses / max) * 100}%`, background: EXP }} />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-[12px] shadow-card group-hover:block">
                  <p className="font-semibold">{monthNames[k]}</p>
                  <p>Umsatz CHF {chf(m.revenue)}</p>
                  <p>Ausgaben CHF {chf(m.expenses)}</p>
                  <p>Eingang CHF {chf(m.received)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex min-w-[640px] gap-2 pt-1.5">
            {monthNames.map((n) => (
              <span key={n} className="flex-1 text-center text-[11.5px] text-muted">
                {n.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
        <div className="-mx-4 mt-5 overflow-x-auto sm:-mx-5">
          <table className="w-full min-w-[640px] text-[13.5px]">
            <thead>
              <tr className="border-y border-line text-left text-[11.5px] uppercase tracking-wider text-muted">
                <th className="px-4 py-2 font-medium sm:px-5">Monat</th>
                <th className="px-3 py-2 text-right font-medium">Umsatz netto</th>
                <th className="px-3 py-2 text-right font-medium">MWST</th>
                <th className="px-3 py-2 text-right font-medium">Eingang</th>
                <th className="px-3 py-2 text-right font-medium">Ausgaben</th>
                <th className="px-4 py-2 text-right font-medium sm:px-5">Ergebnis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {r.months.map((m, k) => (
                <tr key={k}>
                  <td className="px-4 py-1.5 sm:px-5">{monthNames[k]}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{chf(m.revenue)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted">{chf(m.vat)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{chf(m.received)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{chf(m.expenses)}</td>
                  <td className={`px-4 py-1.5 text-right tabular-nums sm:px-5 ${m.revenue - m.expenses < 0 ? "text-danger" : ""}`}>{chf(m.revenue - m.expenses)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="px-4 py-2 sm:px-5">Total</td>
                <td className="px-3 py-2 text-right tabular-nums">{chf(r.totals.revenue)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{chf(r.totals.vat)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{chf(r.totals.received)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{chf(r.totals.expenses)}</td>
                <td className="px-4 py-2 text-right tabular-nums sm:px-5">{chf(profit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title={`MWST pro Quartal ${year}`}>
          {!s.vatEnabled && <p className="mb-3 rounded-xl bg-bg px-3 py-2 text-[13px] text-muted">In den Einstellungen ist «MWST-pflichtig» nicht aktiv. Die Übersicht dient zur Kontrolle der Umsatzgrenze (CHF 100’000).</p>}
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
          <table className="w-full min-w-[420px] text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wider text-muted">
                <th className="py-2 font-medium">Quartal</th>
                <th className="py-2 text-right font-medium">Umsatz netto</th>
                <th className="py-2 text-right font-medium">Umsatzsteuer</th>
                <th className="py-2 text-right font-medium">Vorsteuer</th>
                <th className="py-2 text-right font-medium">Zahllast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {r.quarters.map((q, k) => (
                <tr key={k}>
                  <td className="py-2">
                    Q{k + 1}
                    {[...q.byRate.entries()].filter(([rate]) => rate > 0).length > 0 && (
                      <span className="block text-[11.5px] text-muted">
                        {[...q.byRate.entries()]
                          .filter(([rate]) => rate > 0)
                          .map(([rate, v]) => `${rate}%: ${chf(v.net)}`)
                          .join(" · ")}
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right tabular-nums">{chf(q.revenue)}</td>
                  <td className="py-2 text-right tabular-nums">{chf(q.vat)}</td>
                  <td className="py-2 text-right tabular-nums">{chf(q.inputVat)}</td>
                  <td className="py-2 text-right font-medium tabular-nums">{chf(q.vat - q.inputVat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p className="mt-3 text-[12px] text-muted">Vereinbartes Entgelt (Rechnungsdatum), Gutschriften abgezogen, Vorsteuer aus den erfassten Ausgaben.</p>
        </Card>

        <Card title={`Offene Posten (${open.length})`}>
          {open.length === 0 ? (
            <p className="text-[14px] text-muted">Keine offenen Rechnungen.</p>
          ) : (
            <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
            <table className="w-full min-w-[420px] text-[13.5px]">
              <tbody className="divide-y divide-line">
                {open.map(({ i, c }) => (
                  <tr key={i.id}>
                    <td className={`${td} pl-0`}>
                      <Link href={`/admin/rechnungen/${i.id}`} className="font-medium hover:text-accent">
                        {i.number}
                      </Link>
                      <p className="text-[12px] text-muted">{customerName(c)}</p>
                    </td>
                    <td className={`${td} whitespace-nowrap ${invoiceDisplayStatus(i, today) === "ueberfaellig" ? "text-danger" : "text-muted"}`}>{fmtDate(i.dueDate)}</td>
                    <td className={tdNum}>{chf(openAmount(i))}</td>
                    <td className={`${td} pr-0 text-right`}>
                      <InvoiceBadge inv={i} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

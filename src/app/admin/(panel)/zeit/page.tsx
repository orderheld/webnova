import { and, desc, eq, gte, isNotNull, isNull, lte } from "drizzle-orm";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { TimeForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { Card, Empty, FilterChips, PageHeader, Stat, Table, iconBtn, qs, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { deleteTimeAction } from "@/lib/admin/project-actions";
import { chf, fmtDate, fmtHours, monthNames, todayIso } from "@/lib/admin/money";
import { customerName, projectOptions } from "@/lib/admin/queries";

export const metadata = { title: "Zeiterfassung" };

type SP = { monat?: string; status?: string; projekt?: string };

export default async function TimePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const today = todayIso();
  const month = /^\d{4}-\d{2}$/.test(sp.monat ?? "") ? sp.monat! : today.slice(0, 7);
  const [y, m] = month.split("-").map(Number);
  const from = `${month}-01`;
  const to = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
  const prev = new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7);
  const next = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7);
  const e = schema.timeEntries;
  const projectId = Number(sp.projekt) || null;
  const rows = await db()
    .select({ e, p: schema.projects, c: schema.customers })
    .from(e)
    .innerJoin(schema.projects, eq(schema.projects.id, e.projectId))
    .innerJoin(schema.customers, eq(schema.customers.id, schema.projects.customerId))
    .where(
      and(
        sp.status === "offen" ? undefined : and(gte(e.date, from), lte(e.date, to)),
        sp.status === "offen" ? and(eq(e.billable, true), isNull(e.invoiceId)) : sp.status === "verrechnet" ? isNotNull(e.invoiceId) : undefined,
        projectId ? eq(e.projectId, projectId) : undefined,
      ),
    )
    .orderBy(desc(e.date), desc(e.id))
    .limit(1000);
  const projects = await projectOptions();
  const hours = rows.reduce((a, r) => a + r.e.hours, 0);
  const billable = rows.filter((r) => r.e.billable).reduce((a, r) => a + r.e.hours, 0);
  const value = rows.filter((r) => r.e.billable).reduce((a, r) => a + r.e.hours * r.e.rate, 0);
  const openValue = rows.filter((r) => r.e.billable && !r.e.invoiceId).reduce((a, r) => a + r.e.hours * r.e.rate, 0);
  const base = "/admin/zeit";
  const params = { monat: sp.monat, status: sp.status, projekt: sp.projekt };

  return (
    <>
      <PageHeader title="Zeiterfassung" sub={sp.status === "offen" ? "Alle noch nicht verrechneten Stunden" : `${monthNames[m - 1]} ${y}`} />
      <Card title="Zeit erfassen" className="mb-5">
        <TimeForm projects={projects} />
      </Card>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {sp.status !== "offen" && (
          <div className="flex items-center gap-1">
            <Link href={qs(base, params, { monat: prev })} className={iconBtn} aria-label="Vormonat">
              <Icon name="arrowLeft" className="h-4 w-4" />
            </Link>
            <span className="min-w-[120px] text-center text-[14px] font-medium">
              {monthNames[m - 1]} {y}
            </span>
            <Link href={qs(base, params, { monat: next })} className={iconBtn} aria-label="Nächster Monat">
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        )}
        <FilterChips active={sp.status} href={(v) => qs(base, params, { status: v })} items={[[undefined, "Alle"], ["offen", "Unverrechnet"], ["verrechnet", "Verrechnet"]]} />
        <form className="ml-auto">
          {sp.monat && <input type="hidden" name="monat" value={sp.monat} />}
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
          <select name="projekt" defaultValue={sp.projekt ?? ""} className="input w-auto">
            <option value="">Alle Projekte</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="ml-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] hover:border-accent">Filtern</button>
        </form>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Stunden total" value={fmtHours(hours)} />
        <Stat label="Verrechenbar" value={fmtHours(billable)} sub={hours ? `${Math.round((billable / hours) * 100)} % Auslastung verrechenbar` : undefined} />
        <Stat label="Wert verrechenbar" value={`CHF ${chf(value)}`} />
        <Stat label="Davon noch offen" value={`CHF ${chf(openValue)}`} tone={openValue > 0 ? "warn" : undefined} />
      </div>
      {rows.length === 0 ? (
        <Empty>Keine Zeiteinträge in diesem Zeitraum.</Empty>
      ) : (
        <Table minWidth={760} head={["Datum", "Projekt", "Tätigkeit", { label: "Std.", align: "right" }, { label: "CHF", align: "right" }, "Status", ""]}>
          {rows.map(({ e, p, c }) => (
            <tr key={e.id} className="hover:bg-bg/60">
              <td className={`${td} whitespace-nowrap text-muted`}>{fmtDate(e.date)}</td>
              <td className={td}>
                <Link href={`/admin/projekte/${p.id}`} className="font-medium hover:text-accent">
                  {p.name}
                </Link>
                <p className="text-[12px] text-muted">{customerName(c)}</p>
              </td>
              <td className={td}>{e.description}</td>
              <td className={tdNum}>{e.hours}</td>
              <td className={tdNum}>{e.billable ? chf(e.hours * e.rate) : "–"}</td>
              <td className={`${td} text-[12.5px]`}>
                {e.invoiceId ? (
                  <Link href={`/admin/rechnungen/${e.invoiceId}`} className="text-accent hover:underline">
                    verrechnet
                  </Link>
                ) : e.billable ? (
                  <span className="text-amber-700">offen</span>
                ) : (
                  <span className="text-muted">intern</span>
                )}
              </td>
              <td className="pr-3 text-right">
                {!e.invoiceId && (
                  <form action={deleteTimeAction.bind(null, e.id)}>
                    <ConfirmButton message="Zeiteintrag löschen?" className={iconBtn}>
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      <span className="sr-only">Löschen</span>
                    </ConfirmButton>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

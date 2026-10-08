import { and, eq, ilike, inArray, lt, or, sql } from "drizzle-orm";
import { DocTable } from "@/components/admin/doc-table";
import { Icon } from "@/components/admin/icons";
import { invoiceDisplayStatus } from "@/components/admin/lists";
import { FilterChips, LinkButton, Notice, PageHeader, Stat, btn, qs } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { invoiceStatuses } from "@/db/schema";
import { dueSubscriptions, openAmount } from "@/lib/admin/billing";
import { billDueSubscriptionsAction } from "@/lib/admin/finance-actions";
import { creditStatusLabels, invoiceStatusLabels } from "@/lib/admin/labels";
import { chf, todayIso } from "@/lib/admin/money";

export const metadata = { title: "Rechnungen" };

type SP = { status?: string; q?: string; sort?: string; dir?: string; art?: string; jahr?: string; abos?: string };

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const today = todayIso();
  const i = schema.invoices;
  const c = schema.customers;
  const status = [...invoiceStatuses, "ueberfaellig", "offen"].includes(sp.status ?? "") ? sp.status : undefined;
  const kind = sp.art === "gutschrift" ? "gutschrift" : "rechnung";
  const year = /^\d{4}$/.test(sp.jahr ?? "") ? sp.jahr : undefined;
  const term = sp.q?.trim();
  const sortCols: Record<string, ReturnType<typeof sql>> = {
    nummer: sql`${i.number}`,
    kunde: sql`lower(coalesce(${c.company}, ${c.lastName}))`,
    datum: sql`${i.issueDate}`,
    faellig: sql`${i.dueDate}`,
    total: sql`${i.total}`,
  };
  const sortKey = sp.sort && sortCols[sp.sort] ? sp.sort : "nummer";
  const dir = sp.dir === "asc" ? "asc" : "desc";
  const statusCond =
    status === "ueberfaellig"
      ? and(inArray(i.status, ["gesendet", "teilbezahlt"]), lt(i.dueDate, today))
      : status === "offen"
        ? inArray(i.status, ["gesendet", "teilbezahlt"])
        : status
          ? eq(i.status, status as (typeof invoiceStatuses)[number])
          : undefined;
  const [rows, all, due] = await Promise.all([
    db()
      .select({ d: i, c })
      .from(i)
      .innerJoin(c, eq(c.id, i.customerId))
      .where(
        and(
          eq(i.kind, kind),
          statusCond,
          year ? sql`extract(year from ${i.issueDate}) = ${Number(year)}` : undefined,
          term ? or(ilike(i.number, `%${term}%`), ilike(i.title, `%${term}%`), ilike(c.company, `%${term}%`), ilike(c.lastName, `%${term}%`)) : undefined,
        ),
      )
      .orderBy(dir === "asc" ? sql`${sortCols[sortKey]} asc nulls last` : sql`${sortCols[sortKey]} desc nulls last`, sql`${i.id} desc`)
      .limit(1000),
    db().select({ status: i.status, dueDate: i.dueDate, total: i.total, paidAmount: i.paidAmount, kind: i.kind }).from(i).where(eq(i.kind, "rechnung")),
    dueSubscriptions(),
  ]);
  const openSum = all.reduce((a, x) => a + openAmount(x), 0);
  const overdue = all.filter((x) => invoiceDisplayStatus(x, today) === "ueberfaellig");
  const drafts = all.filter((x) => x.status === "entwurf");
  const count = (s: string) => all.filter((x) => (s === "ueberfaellig" ? invoiceDisplayStatus(x, today) === s : x.status === s)).length;
  const base = "/admin/rechnungen";
  const params = { status, q: term, sort: sp.sort, dir: sp.dir, art: sp.art, jahr: year };
  const labels = kind === "gutschrift" ? creditStatusLabels : invoiceStatusLabels;
  const years = Array.from({ length: 4 }, (_, k) => String(Number(today.slice(0, 4)) - k));

  return (
    <>
      <PageHeader
        title={kind === "gutschrift" ? "Gutschriften" : "Rechnungen"}
        actions={
          <>
            <a href={`/api/admin/export/rechnungen${year ? `?jahr=${year}` : ""}`} className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> CSV
            </a>
            <LinkButton href="/admin/rechnungen/neu" icon="plus">
              Neue Rechnung
            </LinkButton>
          </>
        }
      />
      {sp.abos && (
        <Notice tone={Number(sp.abos) > 0 ? "ok" : "info"}>
          {Number(sp.abos) > 0 ? `${sp.abos} Abo-Rechnungen als Entwurf erstellt. Bitte prüfen und versenden.` : "Keine fälligen Abos gefunden."}
        </Notice>
      )}
      {due.rows.length > 0 && kind === "rechnung" && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3">
          <p className="text-[14px] text-accent">
            <Icon name="repeat" className="mr-2 inline h-4 w-4" />
            {due.rows.length} Abo{due.rows.length === 1 ? "" : "s"} bis {due.horizon.split("-").reverse().join(".")} zur Verrechnung fällig.
          </p>
          <form action={billDueSubscriptionsAction}>
            <button className={btn.dark}>Fällige Abos verrechnen</button>
          </form>
        </div>
      )}
      {kind === "rechnung" && (
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Offen total" value={`CHF ${chf(openSum)}`} href={qs(base, {}, { status: "offen" })} />
          <Stat label="Überfällig" value={String(overdue.length)} tone={overdue.length ? "warn" : undefined} sub={`CHF ${chf(overdue.reduce((a, x) => a + openAmount(x), 0))}`} href={qs(base, {}, { status: "ueberfaellig" })} />
          <Stat label="Entwürfe" value={String(drafts.length)} href={qs(base, {}, { status: "entwurf" })} />
          <Stat label="Angezeigt" value={`CHF ${chf(rows.reduce((a, r) => a + r.d.total, 0))}`} sub={`${rows.length} Dokumente`} />
        </div>
      )}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterChips active={kind === "gutschrift" ? "gutschrift" : undefined} href={(v) => qs(base, {}, { art: v })} items={[[undefined, "Rechnungen"], ["gutschrift", "Gutschriften"]]} />
          <form className="ml-auto flex gap-2">
            {status && <input type="hidden" name="status" value={status} />}
            {sp.art && <input type="hidden" name="art" value={sp.art} />}
            <select name="jahr" defaultValue={year ?? ""} className="input w-auto">
              <option value="">Alle Jahre</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <input name="q" defaultValue={term} placeholder="Nummer, Titel, Kunde …" className="input w-52" />
            <button className="rounded-full border border-line bg-surface px-3 text-[13px] hover:border-accent">Filtern</button>
          </form>
        </div>
        <FilterChips
          active={status}
          href={(v) => qs(base, params, { status: v })}
          items={[
            [undefined, "Alle"],
            ...(kind === "rechnung" ? ([["offen", "Offen + Teilbezahlt"], ["ueberfaellig", "Überfällig", count("ueberfaellig")]] as [string, string, number?][]) : []),
            ...invoiceStatuses.map((s) => [s, labels[s], kind === "rechnung" ? count(s) : undefined] as [string, string, number | undefined]),
          ]}
        />
      </div>
      <DocTable
        base={base}
        showOpen={kind === "rechnung"}
        sort={{ key: sortKey, dir }}
        href={(k, d) => qs(base, params, { sort: k, dir: d })}
        rows={rows.map(({ d, c }) => {
          const st = invoiceDisplayStatus(d, today);
          return {
            id: d.id,
            number: d.number,
            title: d.title,
            customer: c,
            date: d.issueDate,
            second: d.dueDate,
            total: d.total,
            open: openAmount(d),
            status: st,
            statusLabel: labels[st] ?? st,
            negative: d.kind === "gutschrift",
            note: d.reminderLevel > 0 ? `${d.reminderLevel}. Mahnung` : d.items.some((x) => x.subscriptionId) ? "Abo" : undefined,
          };
        })}
        secondLabel={kind === "gutschrift" ? "Datum" : "Fällig"}
        empty="Keine Rechnungen gefunden."
      />
    </>
  );
}

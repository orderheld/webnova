import { PendingButton } from "@/components/admin/feedback";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import Link from "next/link";
import { Badge, Empty, FilterChips, LinkButton, PageHeader, Stat, Table, btn, qs, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { subscriptionStatuses, type SubscriptionStatus } from "@/db/schema";
import { yearlyValue } from "@/lib/admin/billing";
import { billDueSubscriptionsAction } from "@/lib/admin/finance-actions";
import { intervalLabels, subscriptionCategoryLabels, subscriptionStatusLabels } from "@/lib/admin/labels";
import { addDaysIso, chf, fmtDate, todayIso } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Abos" };

type SP = { status?: string; q?: string; kunde?: string; art?: string; sort?: string; dir?: string };

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = schema.subscriptions;
  const c = schema.customers;
  const status = subscriptionStatuses.includes(sp.status as SubscriptionStatus) ? (sp.status as SubscriptionStatus) : sp.status === "alle" ? "alle" : undefined;
  const term = sp.q?.trim();
  const customerId = Number(sp.kunde) || null;
  const sortCols: Record<string, ReturnType<typeof sql>> = {
    naechste: sql`${s.nextBillingDate}`,
    kunde: sql`lower(coalesce(${c.company}, ${c.lastName}))`,
    betrag: sql`${s.amount}`,
    titel: sql`lower(${s.title})`,
  };
  const sortKey = sp.sort && sortCols[sp.sort] ? sp.sort : "naechste";
  const dir = sp.dir === "desc" ? "desc" : "asc";
  const [rows, settings, all] = await Promise.all([
    db()
      .select({ s, c })
      .from(s)
      .innerJoin(c, eq(c.id, s.customerId))
      .where(
        and(
          status === "alle" ? undefined : eq(s.status, status ?? "aktiv"),
          customerId ? eq(s.customerId, customerId) : undefined,
          sp.art ? eq(s.category, sp.art) : undefined,
          term ? or(ilike(s.title, `%${term}%`), ilike(c.company, `%${term}%`), ilike(c.lastName, `%${term}%`)) : undefined,
        ),
      )
      .orderBy(dir === "asc" ? sql`${sortCols[sortKey]} asc nulls last` : sql`${sortCols[sortKey]} desc nulls last`)
      .limit(1000),
    getSettings(),
    db().select().from(s),
  ]);
  const today = todayIso();
  const horizon = addDaysIso(today, settings.subscriptionLeadDays);
  const active = all.filter((x) => x.status === "aktiv");
  const arr = active.reduce((a, x) => a + yearlyValue(x), 0);
  const isDue = (x: typeof s.$inferSelect) => x.status === "aktiv" && x.nextBillingDate <= horizon && (!x.endDate || x.nextBillingDate <= x.endDate);
  const due = all.filter(isDue);
  const next60 = active.filter((x) => x.nextBillingDate <= addDaysIso(today, 60) && (!x.endDate || x.nextBillingDate <= x.endDate));
  const base = "/admin/abos";
  const params = { status: sp.status, q: term, kunde: sp.kunde, art: sp.art, sort: sp.sort, dir: sp.dir };
  const n = (st: string) => all.filter((x) => x.status === st).length;

  return (
    <>
      <PageHeader
        eyebrow="Finanzen"
        title="Abos & wiederkehrende Leistungen"
        sub="Hosting, Wartung, Domains, SEO-Betreuung und Lizenzen. Verrechnung jeweils im Voraus."
        actions={
          <>
            {due.length > 0 && (
              <form action={billDueSubscriptionsAction}>
                <PendingButton className={btn.dark}>Fällige Abos verrechnen ({due.length})</PendingButton>
              </form>
            )}
            <LinkButton href="/admin/abos/neu" variant={due.length ? "ghost" : "dark"} icon="plus">
              Neues Abo
            </LinkButton>
          </>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Wiederkehrend pro Jahr" value={`CHF ${chf(arr)}`} sub={`${active.length} aktive Abos`} />
        <Stat label="Pro Monat (Durchschnitt)" value={`CHF ${chf(arr / 12)}`} />
        <Stat label={`Fällig bis ${fmtDate(horizon)}`} value={String(due.length)} sub={`CHF ${chf(due.reduce((a, x) => a + x.amount, 0))}`} tone={due.length ? "warn" : undefined} />
        <Stat label="Verlängerungen 60 Tage" value={String(next60.length)} sub={`CHF ${chf(next60.reduce((a, x) => a + x.amount, 0))}`} />
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <FilterChips
          active={status}
          href={(v) => qs(base, params, { status: v })}
          items={[[undefined, "Aktiv", n("aktiv")], ["pausiert", "Pausiert", n("pausiert")], ["gekuendigt", "Gekündigt", n("gekuendigt")], ["alle", "Alle", all.length]]}
        />
        <form className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
          <select name="art" defaultValue={sp.art ?? ""} className="input w-auto">
            <option value="">Alle Arten</option>
            {Object.entries(subscriptionCategoryLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <input name="q" defaultValue={term} placeholder="Abo oder Kunde …" className="input min-w-0 flex-1 sm:w-48 sm:flex-none" />
          <PendingButton className={btn.ghost}>Filtern</PendingButton>
        </form>
      </div>
      {customerId && rows[0] && (
        <p className="mb-3 text-[13px] text-muted">
          Gefiltert auf {customerName(rows[0].c)} ·{" "}
          <Link href={qs(base, params, { kunde: undefined })} className="text-accent hover:underline">
            Filter entfernen
          </Link>
        </p>
      )}
      {rows.length === 0 ? (
        <Empty action={<LinkButton href="/admin/abos/neu" icon="plus">Abo anlegen</LinkButton>}>Keine Abos gefunden.</Empty>
      ) : (
        <Table
          minWidth={900}
          sort={{ key: sortKey, dir }}
          href={(k, d) => qs(base, params, { sort: k, dir: d })}
          head={[
            { label: "Abo", key: "titel" },
            { label: "Kunde", key: "kunde" },
            { label: "Art" },
            { label: "Betrag", key: "betrag", align: "right" },
            { label: "Intervall" },
            { label: "Beginn" },
            { label: "Nächste Verrechnung", key: "naechste" },
            { label: "Status" },
          ]}
        >
          {rows.map(({ s, c }) => (
            <tr key={s.id} className="hover:bg-bg/60">
              <td className={td}>
                <Link href={`/admin/abos/${s.id}`} className="font-medium hover:text-accent">
                  {s.title}
                </Link>
                {s.firstYearIncluded && <p className="text-[11.5px] text-muted">1. Jahr inbegriffen</p>}
              </td>
              <td className={td}>
                <Link href={`/admin/kunden/${c.id}`} className="hover:text-accent">
                  {customerName(c)}
                </Link>
              </td>
              <td className={`${td} text-ink-soft`}>{subscriptionCategoryLabels[s.category] ?? s.category}</td>
              <td className={tdNum}>{chf(s.amount)}</td>
              <td className={`${td} text-ink-soft`}>{intervalLabels[s.interval]}</td>
              <td className={`${td} whitespace-nowrap text-muted`}>{fmtDate(s.startDate)}</td>
              <td className={`${td} whitespace-nowrap ${isDue(s) ? "font-medium text-danger" : ""}`}>
                {s.endDate && s.nextBillingDate > s.endDate ? <span className="text-muted">endet {fmtDate(s.endDate)}</span> : fmtDate(s.nextBillingDate)}
              </td>
              <td className={td}>
                <Badge status={s.status} label={subscriptionStatusLabels[s.status]} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

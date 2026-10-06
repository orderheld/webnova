import { and, desc, eq, inArray, lt, sql } from "drizzle-orm";
import Link from "next/link";
import { Badge, Card, Empty, LinkButton, PageHeader, Stat } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { label } from "@/lib/leads/options";
import { chf, fmtDate, todayIso } from "@/lib/admin/money";

export const metadata = { title: "Übersicht" };

export default async function Dashboard() {
  const d = db();
  const today = todayIso();
  const yearStart = `${today.slice(0, 4)}-01-01`;
  const [[newLeads], [openQuotes], [openInvoices], [overdue], [paidYear], recentLeads, dueInvoices] = await Promise.all([
    d.select({ n: sql<number>`count(*)::int` }).from(schema.leads).where(eq(schema.leads.status, "neu")),
    d
      .select({ n: sql<number>`count(*)::int`, sum: sql<number>`coalesce(sum(${schema.quotes.total}),0)::float` })
      .from(schema.quotes)
      .where(inArray(schema.quotes.status, ["entwurf", "gesendet"])),
    d
      .select({ n: sql<number>`count(*)::int`, sum: sql<number>`coalesce(sum(${schema.invoices.total}),0)::float` })
      .from(schema.invoices)
      .where(eq(schema.invoices.status, "gesendet")),
    d
      .select({ n: sql<number>`count(*)::int`, sum: sql<number>`coalesce(sum(${schema.invoices.total}),0)::float` })
      .from(schema.invoices)
      .where(and(eq(schema.invoices.status, "gesendet"), lt(schema.invoices.dueDate, today))),
    d
      .select({ sum: sql<number>`coalesce(sum(${schema.invoices.total}),0)::float` })
      .from(schema.invoices)
      .where(and(eq(schema.invoices.status, "bezahlt"), sql`${schema.invoices.paidAt} >= ${yearStart}`)),
    d.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(6),
    d
      .select({ inv: schema.invoices, company: schema.customers.company, first: schema.customers.firstName, last: schema.customers.lastName })
      .from(schema.invoices)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
      .where(eq(schema.invoices.status, "gesendet"))
      .orderBy(schema.invoices.dueDate)
      .limit(6),
  ]);

  return (
    <>
      <PageHeader
        title="Übersicht"
        sub={new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        actions={
          <>
            <LinkButton href="/admin/kunden/neu" variant="ghost" icon="plus">
              Kunde
            </LinkButton>
            <LinkButton href="/admin/offerten/neu" variant="ghost" icon="plus">
              Offerte
            </LinkButton>
            <LinkButton href="/admin/rechner/neu" icon="calc">
              Kosten schätzen
            </LinkButton>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Neue Anfragen" value={String(newLeads.n)} href="/admin/anfragen" />
        <Stat label="Offene Offerten" value={`CHF ${chf(openQuotes.sum)}`} sub={`${openQuotes.n} Offerten`} href="/admin/offerten" />
        <Stat
          label="Offene Rechnungen"
          value={`CHF ${chf(openInvoices.sum)}`}
          sub={overdue.n > 0 ? `${overdue.n} überfällig (CHF ${chf(overdue.sum)})` : `${openInvoices.n} Rechnungen`}
          href="/admin/rechnungen"
        />
        <Stat label={`Bezahlt ${today.slice(0, 4)}`} value={`CHF ${chf(paidYear.sum)}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Neueste Anfragen" actions={<Link href="/admin/anfragen" className="text-[13px] text-muted hover:text-ink">Alle →</Link>}>
          {recentLeads.length === 0 ? (
            <Empty>Noch keine Anfragen. Sie erscheinen hier, sobald jemand das Formular ausfüllt.</Empty>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {recentLeads.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/anfragen/${l.id}`} className="flex items-center justify-between gap-4 py-3 hover:opacity-80">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium">{l.company || l.name}</p>
                      <p className="truncate text-[13px] text-muted">
                        {l.services.map((s) => label("services", s)).join(", ")} · Budget {label("budget", l.budget)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[12px] text-muted">{fmtDate(l.createdAt)}</span>
                      <Badge status={l.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Offene Rechnungen" actions={<Link href="/admin/rechnungen" className="text-[13px] text-muted hover:text-ink">Alle →</Link>}>
          {dueInvoices.length === 0 ? (
            <Empty>Keine offenen Rechnungen.</Empty>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {dueInvoices.map(({ inv, company, first, last }) => (
                <li key={inv.id}>
                  <Link href={`/admin/rechnungen/${inv.id}`} className="flex items-center justify-between gap-4 py-3 hover:opacity-80">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium">
                        {inv.number} · {company || [first, last].filter(Boolean).join(" ")}
                      </p>
                      <p className="text-[13px] text-muted">fällig {fmtDate(inv.dueDate)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[14px] font-medium tabular-nums">CHF {chf(inv.total)}</span>
                      {inv.dueDate < today && <Badge status="ueberfaellig" />}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

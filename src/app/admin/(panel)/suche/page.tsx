import { desc, eq, ilike, or, sql } from "drizzle-orm";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { InvoiceBadge } from "@/components/admin/lists";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { leadStageLabels } from "@/lib/admin/labels";
import { chf, fmtDate } from "@/lib/admin/money";
import { customerName, personName } from "@/lib/admin/queries";

export const metadata = { title: "Suche" };

const LIMIT = 12;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  const pat = `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
  const d = db();
  const C = schema.customers;
  const full = sql`coalesce(${C.firstName},'') || ' ' || coalesce(${C.lastName},'')`;

  const results =
    q.length < 2
      ? null
      : await Promise.all([
          d
            .select()
            .from(C)
            .where(or(ilike(C.company, pat), ilike(full, pat), ilike(C.email, pat), ilike(C.phone, pat), ilike(C.city, pat), ilike(C.website, pat)))
            .orderBy(desc(C.createdAt))
            .limit(LIMIT),
          d
            .select({ k: schema.contacts, c: C })
            .from(schema.contacts)
            .innerJoin(C, eq(C.id, schema.contacts.customerId))
            .where(
              or(
                ilike(sql`coalesce(${schema.contacts.firstName},'') || ' ' || coalesce(${schema.contacts.lastName},'')`, pat),
                ilike(schema.contacts.email, pat),
                ilike(schema.contacts.phone, pat),
              ),
            )
            .limit(LIMIT),
          d
            .select()
            .from(schema.leads)
            .where(
              or(
                ilike(schema.leads.name, pat),
                ilike(schema.leads.company, pat),
                ilike(schema.leads.email, pat),
                ilike(schema.leads.phone, pat),
                ilike(schema.leads.city, pat),
                ilike(schema.leads.websiteUrl, pat),
              ),
            )
            .orderBy(desc(schema.leads.createdAt))
            .limit(LIMIT),
          d
            .select({ p: schema.projects, c: C })
            .from(schema.projects)
            .innerJoin(C, eq(C.id, schema.projects.customerId))
            .where(or(ilike(schema.projects.name, pat), ilike(schema.projects.description, pat), ilike(C.company, pat)))
            .orderBy(desc(schema.projects.createdAt))
            .limit(LIMIT),
          d
            .select({ x: schema.quotes, c: C })
            .from(schema.quotes)
            .innerJoin(C, eq(C.id, schema.quotes.customerId))
            .where(or(ilike(schema.quotes.number, pat), ilike(schema.quotes.title, pat), ilike(C.company, pat), ilike(full, pat)))
            .orderBy(desc(schema.quotes.createdAt))
            .limit(LIMIT),
          d
            .select({ x: schema.invoices, c: C })
            .from(schema.invoices)
            .innerJoin(C, eq(C.id, schema.invoices.customerId))
            .where(or(ilike(schema.invoices.number, pat), ilike(schema.invoices.title, pat), ilike(C.company, pat), ilike(full, pat)))
            .orderBy(desc(schema.invoices.createdAt))
            .limit(LIMIT),
          d
            .select({ s: schema.subscriptions, c: C })
            .from(schema.subscriptions)
            .innerJoin(C, eq(C.id, schema.subscriptions.customerId))
            .where(or(ilike(schema.subscriptions.title, pat), ilike(schema.subscriptions.description, pat), ilike(C.company, pat)))
            .limit(LIMIT),
        ]);

  const total = results ? results.reduce((a, r) => a + r.length, 0) : 0;

  return (
    <>
      <PageHeader title="Suche" sub={results ? `${total} Treffer für «${q}»` : "Kunden, Kontakte, Leads, Projekte, Offerten, Rechnungen und Abos"} />
      <form action="/admin/suche" className="relative mb-6 max-w-xl">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input name="q" defaultValue={q} autoFocus placeholder="Suchbegriff, z. B. Firmenname, Nummer, E-Mail" className="input pl-10!" aria-label="Suchbegriff" />
      </form>
      {!results ? (
        <Empty icon="search">Mindestens zwei Zeichen eingeben.</Empty>
      ) : total === 0 ? (
        <Empty icon="search">Nichts gefunden. Versuchen Sie einen anderen Begriff.</Empty>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {(() => {
            const [customers, contacts, leads, projects, quotes, invoices, subs] = results;
            return (
              <>
                <Group title="Kunden" n={customers.length}>
                  {customers.map((c) => (
                    <Row key={c.id} href={`/admin/kunden/${c.id}`} title={customerName(c)} sub={[c.city, c.email].filter(Boolean).join(" · ")} right={c.archived ? <Badge status="archiviert" label="Archiviert" /> : null} />
                  ))}
                </Group>
                <Group title="Kontakte" n={contacts.length}>
                  {contacts.map(({ k, c }) => (
                    <Row key={k.id} href={`/admin/kunden/${c.id}`} title={personName(k) || k.email || "Kontakt"} sub={[customerName(c), k.role, k.email].filter(Boolean).join(" · ")} />
                  ))}
                </Group>
                <Group title="Leads" n={leads.length}>
                  {leads.map((l) => (
                    <Row key={l.id} href={`/admin/anfragen/${l.id}`} title={l.company || l.name} sub={[l.company ? l.name : null, l.city, l.email].filter(Boolean).join(" · ")} right={<Badge status={l.status} label={leadStageLabels[l.status]} />} />
                  ))}
                </Group>
                <Group title="Projekte" n={projects.length}>
                  {projects.map(({ p, c }) => (
                    <Row key={p.id} href={`/admin/projekte/${p.id}`} title={p.name} sub={customerName(c)} right={<Badge status={p.status} />} />
                  ))}
                </Group>
                <Group title="Offerten" n={quotes.length}>
                  {quotes.map(({ x, c }) => (
                    <Row key={x.id} href={`/admin/offerten/${x.id}`} title={`${x.number} · ${x.title}`} sub={`${customerName(c)} · ${fmtDate(x.issueDate)} · CHF ${chf(x.total)}`} right={<Badge status={x.status} />} />
                  ))}
                </Group>
                <Group title="Rechnungen" n={invoices.length}>
                  {invoices.map(({ x, c }) => (
                    <Row key={x.id} href={`/admin/rechnungen/${x.id}`} title={`${x.number} · ${x.title}`} sub={`${customerName(c)} · ${fmtDate(x.issueDate)} · CHF ${chf(x.total)}`} right={<InvoiceBadge inv={x} />} />
                  ))}
                </Group>
                <Group title="Abos" n={subs.length}>
                  {subs.map(({ s, c }) => (
                    <Row key={s.id} href={`/admin/abos/${s.id}`} title={s.title} sub={`${customerName(c)} · nächste Rechnung ${fmtDate(s.nextBillingDate)}`} right={<Badge status={s.status} />} />
                  ))}
                </Group>
              </>
            );
          })()}
        </div>
      )}
    </>
  );
}

function Group({ title, n, children }: { title: string; n: number; children: React.ReactNode }) {
  if (n === 0) return null;
  return (
    <Card title={`${title} (${n}${n === LIMIT ? "+" : ""})`} padded={false}>
      <ul className="divide-y divide-line">{children}</ul>
    </Card>
  );
}

function Row({ href, title, sub, right }: { href: string; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg/60 sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium">{title}</p>
          {sub && <p className="truncate text-[12.5px] text-muted">{sub}</p>}
        </div>
        {right}
      </Link>
    </li>
  );
}

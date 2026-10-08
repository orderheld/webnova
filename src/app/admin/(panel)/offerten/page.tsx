import { and, eq, ilike, or, sql } from "drizzle-orm";
import { DocTable } from "@/components/admin/doc-table";
import { FilterChips, LinkButton, PAGE_SIZE, PageHeader, Pager, pageParam, qs } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { quoteStatuses, type QuoteStatus } from "@/db/schema";
import { quoteStatusLabels } from "@/lib/admin/labels";
import { chf } from "@/lib/admin/money";

export const metadata = { title: "Offerten" };

type SP = { status?: string; q?: string; sort?: string; dir?: string; seite?: string };

export default async function QuotesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filter = quoteStatuses.includes(sp.status as QuoteStatus) ? (sp.status as QuoteStatus) : undefined;
  const q = schema.quotes;
  const c = schema.customers;
  const term = sp.q?.trim();
  const sortCols: Record<string, ReturnType<typeof sql>> = {
    nummer: sql`${q.number}`,
    kunde: sql`lower(coalesce(${c.company}, ${c.lastName}))`,
    datum: sql`${q.issueDate}`,
    faellig: sql`${q.validUntil}`,
    total: sql`${q.total}`,
  };
  const sortKey = sp.sort && sortCols[sp.sort] ? sp.sort : "nummer";
  const dir = sp.dir === "asc" ? "asc" : "desc";
  const page = pageParam(sp.seite);
  const where = and(
    filter ? eq(q.status, filter) : undefined,
    term ? or(ilike(q.number, `%${term}%`), ilike(q.title, `%${term}%`), ilike(c.company, `%${term}%`), ilike(c.lastName, `%${term}%`)) : undefined,
  );
  const [rows, [agg], counts] = await Promise.all([
    db()
      .select({
        d: {
          id: q.id,
          number: q.number,
          title: q.title,
          issueDate: q.issueDate,
          validUntil: q.validUntil,
          total: q.total,
          status: q.status,
          recurring: sql<boolean>`jsonb_path_exists(${q.items}, '$[*] ? (exists(@.recurring) && @.recurring != null)')`,
        },
        c: { id: c.id, company: c.company, firstName: c.firstName, lastName: c.lastName },
      })
      .from(q)
      .innerJoin(c, eq(c.id, q.customerId))
      .where(where)
      .orderBy(dir === "asc" ? sql`${sortCols[sortKey]} asc nulls last` : sql`${sortCols[sortKey]} desc nulls last`, sql`${q.id} desc`)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db().select({ n: sql<number>`count(*)::int`, sum: sql<number>`coalesce(sum(${q.total}), 0)::float` }).from(q).innerJoin(c, eq(c.id, q.customerId)).where(where),
    db().select({ s: q.status, n: sql<number>`count(*)::int` }).from(q).groupBy(q.status),
  ]);
  const base = "/admin/offerten";
  const params = { status: filter, q: term, sort: sp.sort, dir: sp.dir };
  return (
    <>
      <PageHeader
        eyebrow="Verkauf" title="Offerten" sub={`${agg.n} Offerte${agg.n === 1 ? "" : "n"} · CHF ${chf(agg.sum)}`} actions={<LinkButton href="/admin/offerten/neu" icon="plus">Neue Offerte</LinkButton>} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <FilterChips
          active={filter}
          href={(v) => qs(base, params, { status: v })}
          items={[[undefined, "Alle", counts.reduce((a, x) => a + x.n, 0)], ...quoteStatuses.map((s) => [s, quoteStatusLabels[s], counts.find((x) => x.s === s)?.n ?? 0] as [string, string, number])]}
        />
        <form className="ml-auto">
          {filter && <input type="hidden" name="status" value={filter} />}
          <input name="q" defaultValue={term} placeholder="Nummer, Titel, Kunde …" className="input w-64" />
        </form>
      </div>
      <DocTable
        base={base}
        sort={{ key: sortKey, dir }}
        href={(k, d) => qs(base, params, { sort: k, dir: d })}
        rows={rows.map(({ d, c }) => ({
          id: d.id,
          number: d.number,
          title: d.title,
          customer: c,
          date: d.issueDate,
          second: d.validUntil,
          total: d.total,
          status: d.status,
          statusLabel: quoteStatusLabels[d.status],
          note: d.recurring ? "inkl. wiederkehrend" : undefined,
        }))}
        secondLabel="Gültig bis"
        empty="Keine Offerten gefunden."
      />
      <Pager page={page} total={agg.n} href={(n) => qs(base, params, { seite: n > 1 ? String(n) : undefined })} />
    </>
  );
}

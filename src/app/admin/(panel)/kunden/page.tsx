import { and, eq, ilike, or, sql } from "drizzle-orm";
import Link from "next/link";
import { Empty, FilterChips, LinkButton, PageHeader, Table, qs, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { chf } from "@/lib/admin/money";

export const metadata = { title: "Kunden" };

type SP = { q?: string; sort?: string; dir?: string; ansicht?: string };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const term = sp.q?.trim();
  const archived = sp.ansicht === "archiv";
  const c = schema.customers;
  const like = `%${term}%`;
  const projects = sql<number>`(select count(*)::int from projects p where p.customer_id = "customers"."id" and p.status <> 'abgeschlossen')`;
  const open = sql<number>`(select coalesce(sum(i.total - i.paid_amount),0)::float from invoices i where i.customer_id = "customers"."id" and i.kind = 'rechnung' and i.status in ('gesendet','teilbezahlt'))`;
  const revenue = sql<number>`(select coalesce(sum(p.amount),0)::float from payments p join invoices i on i.id = p.invoice_id where i.customer_id = "customers"."id" and i.kind = 'rechnung')`;
  const arr = sql<number>`(select coalesce(sum(s.amount * 12.0 / case s.interval when 'monat' then 1 when 'quartal' then 3 when 'halbjahr' then 6 else 12 end),0)::float from subscriptions s where s.customer_id = "customers"."id" and s.status = 'aktiv')`;
  const name = sql`lower(coalesce(${c.company}, ${c.lastName}, ${c.firstName}))`;
  const sortCols: Record<string, ReturnType<typeof sql>> = { name, ort: sql`lower(${c.city})`, projekte: projects, offen: open, umsatz: revenue, abos: arr };
  const sortKey = sp.sort && sortCols[sp.sort] ? sp.sort : "name";
  const dir = sp.dir === "desc" ? "desc" : sp.dir === "asc" ? "asc" : sortKey === "name" || sortKey === "ort" ? "asc" : "desc";
  const rows = await db()
    .select({ c, projects, open, revenue, arr })
    .from(c)
    .where(
      and(
        eq(c.archived, archived),
        term
          ? or(
              ilike(c.company, like),
              ilike(c.firstName, like),
              ilike(c.lastName, like),
              ilike(c.email, like),
              ilike(c.city, like),
              ilike(c.phone, like),
              sql`exists (select 1 from contacts k where k.customer_id = "customers"."id" and (k.first_name ilike ${like} or k.last_name ilike ${like} or k.email ilike ${like}))`,
            )
          : undefined,
      ),
    )
    .orderBy(dir === "asc" ? sql`${sortCols[sortKey]} asc nulls last` : sql`${sortCols[sortKey]} desc nulls last`)
    .limit(1000);
  const base = "/admin/kunden";
  const params = { q: term, sort: sp.sort, dir: sp.dir, ansicht: sp.ansicht };
  return (
    <>
      <PageHeader
        title="Kunden"
        sub={`${rows.length} ${archived ? "archivierte " : ""}Kunden`}
        actions={
          <LinkButton href="/admin/kunden/neu" icon="plus">
            Neuer Kunde
          </LinkButton>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <form className="flex-1">
          {archived && <input type="hidden" name="ansicht" value="archiv" />}
          <input name="q" defaultValue={term} placeholder="Suchen nach Firma, Name, Kontaktperson, E-Mail, Ort …" className="input max-w-md" />
        </form>
        <FilterChips active={archived ? "archiv" : undefined} href={(v) => qs(base, params, { ansicht: v })} items={[[undefined, "Aktiv"], ["archiv", "Archiv"]]} />
      </div>
      {rows.length === 0 ? (
        <Empty action={<LinkButton href="/admin/kunden/neu" icon="plus">Kunde anlegen</LinkButton>}>Keine Kunden gefunden. Kunden entstehen auch beim Umwandeln eines Leads.</Empty>
      ) : (
        <Table
          minWidth={860}
          sort={{ key: sortKey, dir }}
          href={(k, d) => qs(base, params, { sort: k, dir: d })}
          head={[
            { label: "Kunde", key: "name" },
            { label: "Kontakt" },
            { label: "Ort", key: "ort" },
            { label: "Aktive Projekte", key: "projekte", align: "right" },
            { label: "Abos / Jahr", key: "abos", align: "right" },
            { label: "Bezahlt total", key: "umsatz", align: "right" },
            { label: "Offen CHF", key: "offen", align: "right" },
          ]}
        >
          {rows.map(({ c, projects, open, revenue, arr }) => (
            <tr key={c.id} className="hover:bg-bg/60">
              <td className={td}>
                <Link href={`/admin/kunden/${c.id}`} className="font-medium hover:text-accent">
                  {c.company || [c.firstName, c.lastName].filter(Boolean).join(" ")}
                </Link>
                {c.company && <p className="text-[12px] text-muted">{[c.firstName, c.lastName].filter(Boolean).join(" ")}</p>}
              </td>
              <td className={`${td} text-ink-soft`}>
                {c.email}
                <p className="text-[12px] text-muted">{c.phone}</p>
              </td>
              <td className={`${td} text-ink-soft`}>{[c.zip, c.city].filter(Boolean).join(" ")}</td>
              <td className={tdNum}>{projects || "–"}</td>
              <td className={tdNum}>{arr > 0 ? chf(arr) : "–"}</td>
              <td className={tdNum}>{revenue > 0 ? chf(revenue) : "–"}</td>
              <td className={`${tdNum} ${open > 0 ? "font-medium" : ""}`}>{open > 0 ? chf(open) : "–"}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

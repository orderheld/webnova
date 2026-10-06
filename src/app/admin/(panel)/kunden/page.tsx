import { asc, ilike, or, sql } from "drizzle-orm";
import Link from "next/link";
import { Empty, LinkButton, PageHeader, Table } from "@/components/admin/ui";
import { db, schema } from "@/db";

export const metadata = { title: "Kunden" };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const term = q?.trim();
  const c = schema.customers;
  const rows = await db()
    .select({
      c,
      quotes: sql<number>`(select count(*)::int from quotes where quotes.customer_id = ${c.id})`,
      open: sql<number>`(select coalesce(sum(total),0)::float from invoices where invoices.customer_id = ${c.id} and invoices.status = 'gesendet')`,
    })
    .from(c)
    .where(
      term
        ? or(ilike(c.company, `%${term}%`), ilike(c.firstName, `%${term}%`), ilike(c.lastName, `%${term}%`), ilike(c.email, `%${term}%`), ilike(c.city, `%${term}%`))
        : undefined,
    )
    .orderBy(asc(sql`coalesce(${c.company}, ${c.lastName})`))
    .limit(500);
  return (
    <>
      <PageHeader
        title="Kunden"
        sub={`${rows.length} Kunden`}
        actions={
          <LinkButton href="/admin/kunden/neu" icon="plus">
            Neuer Kunde
          </LinkButton>
        }
      />
      <form className="mb-5">
        <input name="q" defaultValue={term} placeholder="Suchen nach Firma, Name, E-Mail, Ort …" className="input max-w-md bg-surface" />
      </form>
      {rows.length === 0 ? (
        <Empty>Noch keine Kunden. Legen Sie einen Kunden an oder übernehmen Sie eine Anfrage.</Empty>
      ) : (
        <Table head={["Kunde", "Kontakt", "Ort", "Offerten", "Offen CHF"]}>
          {rows.map(({ c, quotes, open }) => (
            <tr key={c.id} className="hover:bg-bg/60">
              <td className="px-4 py-3">
                <Link href={`/admin/kunden/${c.id}`} className="font-medium hover:text-accent">
                  {c.company || [c.firstName, c.lastName].filter(Boolean).join(" ")}
                </Link>
                {c.company && <p className="text-[12px] text-muted">{[c.firstName, c.lastName].filter(Boolean).join(" ")}</p>}
              </td>
              <td className="px-4 py-3 text-ink-soft">
                {c.email}
                <p className="text-[12px] text-muted">{c.phone}</p>
              </td>
              <td className="px-4 py-3 text-ink-soft">{[c.zip, c.city].filter(Boolean).join(" ")}</td>
              <td className="px-4 py-3 tabular-nums">{quotes}</td>
              <td className="px-4 py-3 tabular-nums">{open > 0 ? open.toFixed(2) : "–"}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

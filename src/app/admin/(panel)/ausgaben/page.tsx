import { and, eq, ilike, or, sql } from "drizzle-orm";
import Link from "next/link";
import { Modal } from "@/components/admin/action-form";
import { ExpenseForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { Bar, Card, Empty, PageHeader, Stat, Table, btn, qs, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { expenseCategoryLabels } from "@/lib/admin/labels";
import { chf, fmtDate, todayIso } from "@/lib/admin/money";
import { customerName, customerOptions, projectOptions } from "@/lib/admin/queries";

export const metadata = { title: "Ausgaben" };

type SP = { jahr?: string; kategorie?: string; q?: string; sort?: string; dir?: string };

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const today = todayIso();
  const year = /^\d{4}$/.test(sp.jahr ?? "") ? sp.jahr! : today.slice(0, 4);
  const e = schema.expenses;
  const term = sp.q?.trim();
  const sortCols: Record<string, ReturnType<typeof sql>> = { datum: sql`${e.date}`, betrag: sql`${e.amount}`, kategorie: sql`${e.category}` };
  const sortKey = sp.sort && sortCols[sp.sort] ? sp.sort : "datum";
  const dir = sp.dir === "asc" ? "asc" : "desc";
  const [rows, customers, projects] = await Promise.all([
    db()
      .select({ e, c: schema.customers, p: schema.projects })
      .from(e)
      .leftJoin(schema.customers, eq(schema.customers.id, e.customerId))
      .leftJoin(schema.projects, eq(schema.projects.id, e.projectId))
      .where(
        and(
          sql`extract(year from ${e.date}) = ${Number(year)}`,
          sp.kategorie ? eq(e.category, sp.kategorie) : undefined,
          term ? or(ilike(e.description, `%${term}%`), ilike(e.supplier, `%${term}%`)) : undefined,
        ),
      )
      .orderBy(dir === "asc" ? sql`${sortCols[sortKey]} asc` : sql`${sortCols[sortKey]} desc`, sql`${e.id} desc`)
      .limit(2000),
    customerOptions(),
    projectOptions(),
  ]);
  const total = rows.reduce((a, r) => a + r.e.amount, 0);
  const vat = rows.reduce((a, r) => a + r.e.vatAmount, 0);
  const byCat = new Map<string, number>();
  for (const r of rows) byCat.set(r.e.category, (byCat.get(r.e.category) ?? 0) + r.e.amount);
  const cats = [...byCat.entries()].sort((a, b) => b[1] - a[1]);
  const month = rows.filter((r) => r.e.date.slice(0, 7) === today.slice(0, 7)).reduce((a, r) => a + r.e.amount, 0);
  const base = "/admin/ausgaben";
  const params = { jahr: sp.jahr, kategorie: sp.kategorie, q: term, sort: sp.sort, dir: sp.dir };
  const years = Array.from({ length: 4 }, (_, k) => String(Number(today.slice(0, 4)) - k));

  return (
    <>
      <PageHeader
        eyebrow="Finanzen"
        title="Ausgaben"
        sub={`Geschäftsjahr ${year}`}
        actions={
          <>
            <a href={`/api/admin/export/ausgaben?jahr=${year}`} className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> CSV
            </a>
            <Modal label="Ausgabe erfassen" title="Ausgabe erfassen" icon="plus" variant="dark" wide>
              <ExpenseForm customers={customers} projects={projects} />
            </Modal>
          </>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={`Ausgaben ${year}`} value={`CHF ${chf(total)}`} sub={`${rows.length} Belege`} />
        <Stat label="Diesen Monat" value={`CHF ${chf(month)}`} />
        <Stat label="Vorsteuer (MWST)" value={`CHF ${chf(vat)}`} />
        <Stat label="Grösste Kategorie" value={cats[0] ? expenseCategoryLabels[cats[0][0]] ?? cats[0][0] : "–"} sub={cats[0] ? `CHF ${chf(cats[0][1])}` : undefined} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <form className="mb-4 flex flex-wrap gap-2">
            <select name="jahr" defaultValue={year} className="input w-auto">
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <select name="kategorie" defaultValue={sp.kategorie ?? ""} className="input w-auto">
              <option value="">Alle Kategorien</option>
              {Object.entries(expenseCategoryLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input name="q" defaultValue={term} placeholder="Beschreibung, Lieferant …" className="input min-w-0 flex-1 sm:w-56 sm:flex-none" />
            <button className={btn.ghost}>Filtern</button>
          </form>
          {rows.length === 0 ? (
            <Empty icon="wallet">Keine Ausgaben in diesem Zeitraum.</Empty>
          ) : (
            <Table
              minWidth={720}
              sort={{ key: sortKey, dir }}
              href={(k, d) => qs(base, params, { sort: k, dir: d })}
              head={[{ label: "Datum", key: "datum" }, { label: "Beschreibung" }, { label: "Kategorie", key: "kategorie" }, { label: "Zuordnung" }, { label: "Betrag", key: "betrag", align: "right" }]}
            >
              {rows.map(({ e, c, p }) => (
                <tr key={e.id} className="hover:bg-bg/60">
                  <td className={`${td} whitespace-nowrap text-muted`}>{fmtDate(e.date)}</td>
                  <td className={td}>
                    <Link href={`/admin/ausgaben/${e.id}`} className="font-medium hover:text-accent">
                      {e.description}
                    </Link>
                    {e.supplier && <p className="text-[12px] text-muted">{e.supplier}</p>}
                  </td>
                  <td className={`${td} text-ink-soft`}>{expenseCategoryLabels[e.category] ?? e.category}</td>
                  <td className={`${td} text-[13px] text-muted`}>
                    {p ? (
                      <Link href={`/admin/projekte/${p.id}`} className="hover:text-accent">
                        {p.name}
                      </Link>
                    ) : c ? (
                      <Link href={`/admin/kunden/${c.id}`} className="hover:text-accent">
                        {customerName(c)}
                      </Link>
                    ) : (
                      "–"
                    )}
                  </td>
                  <td className={tdNum}>{chf(e.amount)}</td>
                </tr>
              ))}
            </Table>
          )}
        </div>
        <Card title="Nach Kategorie">
          {cats.length === 0 ? (
            <p className="text-[14px] text-muted">Keine Daten.</p>
          ) : (
            <ul className="space-y-3">
              {cats.map(([k, v]) => (
                <li key={k}>
                  <Link href={qs(base, params, { kategorie: k })} className="mb-1 flex justify-between text-[13px] hover:text-accent">
                    <span>{expenseCategoryLabels[k] ?? k}</span>
                    <span className="tabular-nums">{chf(v)}</span>
                  </Link>
                  <Bar value={v} max={cats[0][1]} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

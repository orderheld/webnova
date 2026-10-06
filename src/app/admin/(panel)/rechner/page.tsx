import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Empty, LinkButton, PageHeader, Table } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { chf, fmtDate } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";

export const metadata = { title: "Kostenrechner" };

export default async function EstimatesPage() {
  const rows = await db()
    .select({ e: schema.estimates, c: schema.customers })
    .from(schema.estimates)
    .leftJoin(schema.customers, eq(schema.customers.id, schema.estimates.customerId))
    .orderBy(desc(schema.estimates.updatedAt));
  return (
    <>
      <PageHeader
        title="Kostenrechner"
        sub="Interne Aufwandschätzung mit Checkliste. Nur für Sie sichtbar."
        actions={<LinkButton href="/admin/rechner/neu" icon="plus">Neue Schätzung</LinkButton>}
      />
      {rows.length === 0 ? (
        <Empty>Noch keine Schätzungen gespeichert.</Empty>
      ) : (
        <Table head={["Projekt", "Kunde", "Stunden", "Total CHF", "Aktualisiert"]}>
          {rows.map(({ e, c }) => (
            <tr key={e.id} className="hover:bg-bg/60">
              <td className="px-4 py-3 font-medium">
                <Link href={`/admin/rechner/${e.id}`} className="hover:text-accent">
                  {e.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-soft">{c ? customerName(c) : "–"}</td>
              <td className="px-4 py-3 tabular-nums">{e.totalHours}</td>
              <td className="px-4 py-3 tabular-nums">{chf(e.total)}</td>
              <td className="px-4 py-3 text-muted">{fmtDate(e.updatedAt)}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Empty, LinkButton, PageHeader, Table, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { chf0, fmtDate } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";

export const metadata = { title: "Rechner" };

export default async function EstimatesPage() {
  const rows = await db()
    .select({
      id: schema.estimates.id,
      name: schema.estimates.name,
      total: schema.estimates.total,
      hours: schema.estimates.totalHours,
      updatedAt: schema.estimates.updatedAt,
      company: schema.customers.company,
      firstName: schema.customers.firstName,
      lastName: schema.customers.lastName,
    })
    .from(schema.estimates)
    .leftJoin(schema.customers, eq(schema.customers.id, schema.estimates.customerId))
    .orderBy(desc(schema.estimates.updatedAt))
    .limit(200);
  return (
    <>
      <PageHeader
        title="Rechner"
        sub="Projektpreis aus Paket und Zusatzleistungen kalkulieren und direkt als Offerte übernehmen"
        actions={
          <>
            <LinkButton href="/admin/rechner/preise" variant="ghost" icon="settings">
              Preise bearbeiten
            </LinkButton>
            <LinkButton href="/admin/rechner/neu" icon="plus">
              Neue Kalkulation
            </LinkButton>
          </>
        }
      />
      {rows.length === 0 ? (
        <Empty action={<LinkButton href="/admin/rechner/neu" icon="plus">Neue Kalkulation</LinkButton>}>Noch keine Kalkulationen gespeichert.</Empty>
      ) : (
        <Table head={["Bezeichnung", "Kunde", { label: "Projektpreis CHF", align: "right" }, { label: "Aufwand", align: "right" }, { label: "CHF/h", align: "right" }, "Aktualisiert"]}>
          {rows.map((e) => (
            <tr key={e.id} className="hover:bg-bg/60">
              <td className={`${td} font-medium`}>
                <Link href={`/admin/rechner/${e.id}`} className="hover:text-accent">
                  {e.name}
                </Link>
              </td>
              <td className={`${td} text-ink-soft`}>{e.company || e.lastName || e.firstName ? customerName(e) : "–"}</td>
              <td className={tdNum}>{chf0(e.total)}</td>
              <td className={tdNum}>{e.hours ? `${e.hours.toLocaleString("de-CH")} h` : "–"}</td>
              <td className={tdNum}>{e.hours ? chf0(e.total / e.hours) : "–"}</td>
              <td className={`${td} text-muted`}>{fmtDate(e.updatedAt)}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

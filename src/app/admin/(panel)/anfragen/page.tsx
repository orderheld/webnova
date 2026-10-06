import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Badge, Empty, PageHeader, Table } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { leadStatuses, type LeadStatus } from "@/db/schema";
import { fmtDate } from "@/lib/admin/money";
import { label } from "@/lib/leads/options";

export const metadata = { title: "Anfragen" };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = leadStatuses.includes(status as LeadStatus) ? (status as LeadStatus) : undefined;
  const rows = await db()
    .select()
    .from(schema.leads)
    .where(filter ? eq(schema.leads.status, filter) : undefined)
    .orderBy(desc(schema.leads.createdAt))
    .limit(300);
  return (
    <>
      <PageHeader title="Anfragen" sub="Alle Anfragen aus dem Formular und den Landingpages" />
      <div className="mb-5 flex flex-wrap gap-2">
        {[undefined, ...leadStatuses].map((s) => (
          <Link
            key={s ?? "alle"}
            href={s ? `/admin/anfragen?status=${s}` : "/admin/anfragen"}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] capitalize ${filter === s ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink"}`}
          >
            {s ?? "Alle"}
          </Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <Empty>Keine Anfragen{filter ? ` mit Status «${filter}»` : ""}.</Empty>
      ) : (
        <Table head={["Datum", "Kontakt", "Leistungen", "Webseite", "Budget", "Status"]}>
          {rows.map((l) => (
            <tr key={l.id} className="hover:bg-bg/60">
              <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(l.createdAt)}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/anfragen/${l.id}`} className="font-medium hover:text-accent">
                  {l.company || l.name}
                </Link>
                <p className="text-[12px] text-muted">{l.company ? l.name : l.email}</p>
              </td>
              <td className="px-4 py-3 text-ink-soft">{l.services.map((s) => label("services", s)).join(", ")}</td>
              <td className="px-4 py-3 text-ink-soft">{l.hasWebsite === null ? "–" : l.hasWebsite ? "Ja" : "Nein"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{label("budget", l.budget)}</td>
              <td className="px-4 py-3">
                <Badge status={l.status} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

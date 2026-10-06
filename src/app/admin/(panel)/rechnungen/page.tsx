import { DocTable } from "@/components/admin/doc-table";
import { LinkButton, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { invoiceStatuses, type InvoiceStatus } from "@/db/schema";
import { todayIso } from "@/lib/admin/money";
import { desc, eq } from "drizzle-orm";

export const metadata = { title: "Rechnungen" };

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = invoiceStatuses.includes(status as InvoiceStatus) ? (status as InvoiceStatus) : undefined;
  const today = todayIso();
  const rows = await db()
    .select({ d: schema.invoices, c: schema.customers })
    .from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
    .where(filter ? eq(schema.invoices.status, filter) : undefined)
    .orderBy(desc(schema.invoices.createdAt))
    .limit(500);
  return (
    <>
      <PageHeader title="Rechnungen" actions={<LinkButton href="/admin/rechnungen/neu" icon="plus">Neue Rechnung</LinkButton>} />
      <DocTable
        base="/admin/rechnungen"
        statuses={invoiceStatuses}
        filter={filter}
        rows={rows.map(({ d, c }) => ({
          id: d.id,
          number: d.number,
          title: d.title,
          customer: c,
          date: d.issueDate,
          second: d.dueDate,
          total: d.total,
          status: d.status === "gesendet" && d.dueDate < today ? "ueberfaellig" : d.status,
        }))}
        secondLabel="Fällig"
      />
    </>
  );
}

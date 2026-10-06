import { DocTable } from "@/components/admin/doc-table";
import { LinkButton, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { quoteStatuses, type QuoteStatus } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const metadata = { title: "Offerten" };

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = quoteStatuses.includes(status as QuoteStatus) ? (status as QuoteStatus) : undefined;
  const rows = await db()
    .select({ d: schema.quotes, c: schema.customers })
    .from(schema.quotes)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.quotes.customerId))
    .where(filter ? eq(schema.quotes.status, filter) : undefined)
    .orderBy(desc(schema.quotes.createdAt))
    .limit(500);
  return (
    <>
      <PageHeader title="Offerten" actions={<LinkButton href="/admin/offerten/neu" icon="plus">Neue Offerte</LinkButton>} />
      <DocTable
        base="/admin/offerten"
        statuses={quoteStatuses}
        filter={filter}
        rows={rows.map(({ d, c }) => ({ id: d.id, number: d.number, title: d.title, customer: c, date: d.issueDate, second: d.validUntil, total: d.total, status: d.status }))}
        secondLabel="Gültig bis"
      />
    </>
  );
}

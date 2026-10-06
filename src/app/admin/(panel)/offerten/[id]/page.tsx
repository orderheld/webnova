import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DocumentEditor } from "@/components/admin/document-editor";
import { SendDialog } from "@/components/admin/send-dialog";
import { Badge, PageHeader, btn } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db, schema } from "@/db";
import { quoteStatuses } from "@/db/schema";
import { deleteQuoteAction, mailDraft, quoteToInvoiceAction, setQuoteStatusAction } from "@/lib/admin/actions";
import { fmtDate } from "@/lib/admin/money";
import { customerName, customerOptions } from "@/lib/admin/queries";

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [row] = await db()
    .select({ q: schema.quotes, c: schema.customers })
    .from(schema.quotes)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.quotes.customerId))
    .where(eq(schema.quotes.id, id));
  if (!row) notFound();
  const { q, c } = row;
  const [customers, draft, invoices] = await Promise.all([
    customerOptions(),
    mailDraft("quote", id),
    db().select({ id: schema.invoices.id, number: schema.invoices.number }).from(schema.invoices).where(eq(schema.invoices.quoteId, id)),
  ]);
  return (
    <>
      <PageHeader
        title={`Offerte ${q.number}`}
        sub={`${customerName(c)}${q.sentAt ? ` · gesendet am ${fmtDate(q.sentAt)}` : ""}`}
        actions={
          <>
            <Badge status={q.status} />
            <a href={`/api/admin/pdf/quote/${q.id}`} target="_blank" className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> PDF
            </a>
            {draft && <SendDialog kind="quote" id={q.id} draft={draft} sentAt={q.sentAt?.toISOString() ?? null} />}
          </>
        }
      />
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-[20px] border border-line bg-surface p-3">
        <span className="px-2 text-[13px] text-muted">Status setzen:</span>
        {quoteStatuses.map((s) => (
          <form key={s} action={setQuoteStatusAction.bind(null, q.id, s)}>
            <button className={`rounded-full border px-3 py-1.5 text-[13px] capitalize ${q.status === s ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>{s}</button>
          </form>
        ))}
        <span className="flex-1" />
        {invoices.map((i) => (
          <Link key={i.id} href={`/admin/rechnungen/${i.id}`} className={btn.ghost}>
            Rechnung {i.number}
          </Link>
        ))}
        <form action={quoteToInvoiceAction.bind(null, q.id)}>
          <button className={btn.dark}>
            <Icon name="receipt" className="h-4 w-4" /> In Rechnung umwandeln
          </button>
        </form>
      </div>
      <DocumentEditor
        kind="quote"
        id={q.id}
        customers={customers}
        initial={{
          customerId: q.customerId,
          title: q.title,
          intro: q.intro ?? "",
          outro: q.outro ?? "",
          items: q.items,
          discountPercent: q.discountPercent,
          vatRate: q.vatRate,
          issueDate: q.issueDate,
          secondDate: q.validUntil ?? "",
        }}
      />
      <form action={deleteQuoteAction.bind(null, q.id)} className="mt-8">
        <ConfirmButton message="Offerte endgültig löschen?" className={btn.danger}>
          Offerte löschen
        </ConfirmButton>
      </form>
    </>
  );
}

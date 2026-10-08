import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DocumentEditor } from "@/components/admin/document-editor";
import { Icon } from "@/components/admin/icons";
import { SendDialog } from "@/components/admin/send-dialog";
import { Badge, PageHeader, btn, btnSm } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { quoteStatuses } from "@/db/schema";
import { deleteQuoteAction, mailDraft, quoteToInvoiceAction, setQuoteStatusAction } from "@/lib/admin/actions";
import { duplicateQuoteAction, subscriptionsFromQuoteAction } from "@/lib/admin/finance-actions";
import { quoteStatusLabels } from "@/lib/admin/labels";
import { fmtDate, todayIso } from "@/lib/admin/money";
import { projectFromQuoteAction } from "@/lib/admin/project-actions";
import { allProjectOptions, customerName, customerOptions, productOptions, routeId, templateOptions } from "@/lib/admin/queries";

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  if (!id) notFound();
  const [row] = await db()
    .select({ q: schema.quotes, c: schema.customers })
    .from(schema.quotes)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.quotes.customerId))
    .where(eq(schema.quotes.id, id));
  if (!row) notFound();
  const { q, c } = row;
  const [customers, draft, invoices, projects, products, templates, subs, lead] = await Promise.all([
    customerOptions(),
    mailDraft("quote", id),
    db().select({ id: schema.invoices.id, number: schema.invoices.number }).from(schema.invoices).where(eq(schema.invoices.quoteId, id)),
    allProjectOptions(),
    productOptions(),
    templateOptions(),
    db().select({ id: schema.subscriptions.id }).from(schema.subscriptions).where(eq(schema.subscriptions.quoteId, id)),
    q.leadId ? db().select().from(schema.leads).where(eq(schema.leads.id, q.leadId)).then((r) => r[0]) : Promise.resolve(undefined),
  ]);
  const project = q.projectId ? projects.find((p) => p.id === q.projectId) : undefined;
  const hasRecurring = q.items.some((it) => it.recurring);
  return (
    <>
      <PageHeader
        back={{ href: "/admin/offerten", label: "Offerten" }}
        title={`Offerte ${q.number}`}
        badge={<Badge status={q.status} label={quoteStatusLabels[q.status]} />}
        sub={
          <>
            <Link href={`/admin/kunden/${c.id}`} className="hover:text-accent">
              {customerName(c)}
            </Link>
            {q.sentAt ? ` · gesendet am ${fmtDate(q.sentAt)}` : ""}
            {lead && (
              <>
                {" · "}
                <Link href={`/admin/anfragen/${lead.id}`} className="hover:text-accent">
                  Lead {lead.company || lead.name}
                </Link>
              </>
            )}
          </>
        }
        actions={
          <>
            <a href={`/api/admin/pdf/quote/${q.id}`} target="_blank" className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> PDF
            </a>
            <form action={duplicateQuoteAction.bind(null, q.id)}>
              <button className={btn.ghost}>
                <Icon name="copy" className="h-4 w-4" /> Duplizieren
              </button>
            </form>
            {draft && <SendDialog kind="quote" id={q.id} draft={draft} sentAt={q.sentAt?.toISOString() ?? null} />}
          </>
        }
      />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-2.5">
        <span className="px-1 text-[12.5px] text-muted">Status</span>
        {quoteStatuses.map((s) => (
          <form key={s} action={setQuoteStatusAction.bind(null, q.id, s)}>
            <button className={`rounded-full px-3 py-1.5 text-[13px] ${q.status === s ? "bg-accent text-white" : "hover:bg-bg"}`}>{quoteStatusLabels[s]}</button>
          </form>
        ))}
        <span className="flex-1" />
        {invoices.map((i) => (
          <Link key={i.id} href={`/admin/rechnungen/${i.id}`} className={btnSm.ghost}>
            <Icon name="receipt" className="h-3.5 w-3.5" /> {i.number}
          </Link>
        ))}
        {project ? (
          <Link href={`/admin/projekte/${project.id}`} className={btnSm.ghost}>
            <Icon name="folder" className="h-3.5 w-3.5" /> {project.name}
          </Link>
        ) : (
          <form action={projectFromQuoteAction.bind(null, q.id)} className="flex items-center gap-1.5">
            <select name="templateId" defaultValue="" className="input w-auto py-1.5 text-[13px]" aria-label="Projektvorlage">
              <option value="">Ohne Vorlage</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button className={btnSm.ghost}>
              <Icon name="folder" className="h-3.5 w-3.5" /> Projekt anlegen
            </button>
          </form>
        )}
        {hasRecurring && subs.length === 0 && (
          <form action={subscriptionsFromQuoteAction.bind(null, q.id)} className="flex items-center gap-1.5">
            <input type="date" name="startDate" defaultValue={todayIso()} className="input w-auto py-1.5 text-[13px]" aria-label="Leistungsbeginn" />
            <button className={btnSm.ghost}>
              <Icon name="repeat" className="h-3.5 w-3.5" /> Abos anlegen
            </button>
          </form>
        )}
        {subs.length > 0 && (
          <Link href={`/admin/abos?kunde=${c.id}`} className={btnSm.ghost}>
            <Icon name="repeat" className="h-3.5 w-3.5" /> {subs.length} Abo{subs.length === 1 ? "" : "s"}
          </Link>
        )}
        <form action={quoteToInvoiceAction.bind(null, q.id)}>
          <ConfirmButton
            message={hasRecurring && subs.length === 0 ? "Rechnung erstellen? Wiederkehrende Positionen werden automatisch als Abos angelegt." : "Rechnung aus dieser Offerte erstellen?"}
            className={btnSm.dark}
          >
            <Icon name="receipt" className="h-3.5 w-3.5" /> In Rechnung umwandeln
          </ConfirmButton>
        </form>
      </div>
      <DocumentEditor
        kind="quote"
        id={q.id}
        customers={customers}
        projects={projects}
        products={products}
        initial={{
          customerId: q.customerId,
          projectId: q.projectId,
          title: q.title,
          intro: q.intro ?? "",
          outro: q.outro ?? "",
          notes: q.notes ?? "",
          items: q.items,
          discountPercent: q.discountPercent,
          vatRate: q.vatRate,
          issueDate: q.issueDate,
          secondDate: q.validUntil ?? "",
        }}
      />
      <form action={deleteQuoteAction.bind(null, q.id)} className="mt-8">
        <ConfirmButton
          message={`Offerte ${q.number} (Status: ${quoteStatusLabels[q.status]}) endgültig löschen?${invoices.length ? `\n\nVerknüpfte Rechnungen (${invoices.map((x) => x.number).join(", ")}) bleiben bestehen.` : ""}`}
          className={btn.danger}
        >
          Offerte löschen
        </ConfirmButton>
      </form>
    </>
  );
}

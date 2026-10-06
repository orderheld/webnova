import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DocumentEditor } from "@/components/admin/document-editor";
import { SendDialog } from "@/components/admin/send-dialog";
import { Badge, PageHeader, btn } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db, schema } from "@/db";
import { deleteInvoiceAction, mailDraft, setInvoiceStatusAction } from "@/lib/admin/actions";
import { chf, fmtDate, todayIso } from "@/lib/admin/money";
import { customerName, customerOptions } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";

export default async function InvoiceDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fehler?: string }> }) {
  const id = Number((await params).id);
  const { fehler } = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const [row] = await db()
    .select({ i: schema.invoices, c: schema.customers })
    .from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
    .where(eq(schema.invoices.id, id));
  if (!row) notFound();
  const { i, c } = row;
  const [customers, draft, s] = await Promise.all([customerOptions(), mailDraft("invoice", id), getSettings()]);
  const today = todayIso();
  const overdue = i.status === "gesendet" && i.dueDate < today;
  const locked = i.status === "bezahlt" || i.status === "storniert";

  async function markPaid(fd: FormData) {
    "use server";
    await setInvoiceStatusAction(id, "bezahlt", String(fd.get("paidAt") || ""));
  }

  return (
    <>
      <PageHeader
        title={`Rechnung ${i.number}`}
        sub={`${customerName(c)} · CHF ${chf(i.total)}${i.sentAt ? ` · gesendet am ${fmtDate(i.sentAt)}` : ""}${i.paidAt ? ` · bezahlt am ${fmtDate(i.paidAt)}` : ""}`}
        actions={
          <>
            <Badge status={overdue ? "ueberfaellig" : i.status} />
            <a href={`/api/admin/pdf/invoice/${i.id}`} target="_blank" className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> PDF
            </a>
            {draft && !locked && <SendDialog kind="invoice" id={i.id} draft={draft} sentAt={i.sentAt?.toISOString() ?? null} />}
          </>
        }
      />
      {!s.iban && (
        <p className="mb-5 rounded-2xl bg-amber-100 px-4 py-3 text-[14px] text-amber-900">
          Für den QR-Einzahlungsschein bitte die IBAN in den <Link href="/admin/einstellungen" className="underline">Einstellungen</Link> hinterlegen.
        </p>
      )}
      {fehler === "storno" && (
        <p className="mb-5 rounded-2xl bg-danger/10 px-4 py-3 text-[14px] text-danger">
          Versendete Rechnungen können nicht gelöscht werden. Bitte stornieren.
        </p>
      )}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[20px] border border-line bg-surface p-3">
        {i.status !== "bezahlt" && i.status !== "storniert" && (
          <form action={markPaid} className="flex flex-wrap items-center gap-2">
            <span className="px-2 text-[13px] text-muted">Zahlung erhalten am</span>
            <input type="date" name="paidAt" defaultValue={today} className="input w-auto py-2" />
            <button className={btn.dark}>
              <Icon name="check" className="h-4 w-4" /> Als bezahlt markieren
            </button>
          </form>
        )}
        {i.status === "bezahlt" && (
          <form action={setInvoiceStatusAction.bind(null, i.id, "gesendet", undefined)}>
            <button className={btn.ghost}>Zahlung zurücksetzen</button>
          </form>
        )}
        <span className="flex-1" />
        {i.quoteId && (
          <Link href={`/admin/offerten/${i.quoteId}`} className={btn.ghost}>
            Zur Offerte
          </Link>
        )}
        {i.status !== "storniert" && i.status !== "entwurf" && (
          <form action={setInvoiceStatusAction.bind(null, i.id, "storniert", undefined)}>
            <ConfirmButton message="Rechnung stornieren?" className={btn.danger}>
              Stornieren
            </ConfirmButton>
          </form>
        )}
      </div>
      <DocumentEditor
        kind="invoice"
        id={i.id}
        customers={customers}
        locked={locked}
        initial={{
          customerId: i.customerId,
          title: i.title,
          intro: i.intro ?? "",
          outro: i.outro ?? "",
          items: i.items,
          discountPercent: i.discountPercent,
          vatRate: i.vatRate,
          issueDate: i.issueDate,
          secondDate: i.dueDate,
        }}
      />
      {i.status === "entwurf" && (
        <form action={deleteInvoiceAction.bind(null, i.id)} className="mt-8">
          <ConfirmButton message="Rechnungsentwurf löschen?" className={btn.danger}>
            Entwurf löschen
          </ConfirmButton>
        </form>
      )}
    </>
  );
}

import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Modal } from "@/components/admin/action-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DocumentEditor } from "@/components/admin/document-editor";
import { PaymentForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { InvoiceBadge, invoiceDisplayStatus } from "@/components/admin/lists";
import { SendDialog } from "@/components/admin/send-dialog";
import { Card, Notice, PageHeader, btn, btnSm, iconBtn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { deleteInvoiceAction, mailDraft, setInvoiceStatusAction } from "@/lib/admin/actions";
import { openAmount } from "@/lib/admin/billing";
import { createReminderAction, creditNoteAction, deletePaymentAction, deleteReminderAction, duplicateInvoiceAction, markInvoicesSentAction } from "@/lib/admin/finance-actions";
import { paymentMethodLabels } from "@/lib/admin/labels";
import { chf, fmtDate, todayIso } from "@/lib/admin/money";
import { allProjectOptions, customerName, customerOptions, productOptions, routeId } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";

export default async function InvoiceDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fehler?: string; mahnung?: string }> }) {
  const id = routeId((await params).id);
  const { fehler, mahnung } = await searchParams;
  if (!id) notFound();
  const [row] = await db()
    .select({ i: schema.invoices, c: schema.customers })
    .from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
    .where(eq(schema.invoices.id, id));
  if (!row) notFound();
  const { i, c } = row;
  const [customers, draft, s, projects, products, payments, reminders, credits, original, timeCount] = await Promise.all([
    customerOptions(),
    mailDraft("invoice", id),
    getSettings(),
    allProjectOptions(),
    productOptions(),
    db().select().from(schema.payments).where(eq(schema.payments.invoiceId, id)).orderBy(asc(schema.payments.date)),
    db().select().from(schema.invoiceReminders).where(eq(schema.invoiceReminders.invoiceId, id)).orderBy(asc(schema.invoiceReminders.level)),
    db().select({ id: schema.invoices.id, number: schema.invoices.number }).from(schema.invoices).where(eq(schema.invoices.creditForId, id)),
    i.creditForId ? db().select({ id: schema.invoices.id, number: schema.invoices.number }).from(schema.invoices).where(eq(schema.invoices.id, i.creditForId)).then((r) => r[0]) : Promise.resolve(undefined),
    db().select({ id: schema.timeEntries.id }).from(schema.timeEntries).where(eq(schema.timeEntries.invoiceId, id)),
  ]);
  const reminderDrafts = await Promise.all(reminders.map((r) => mailDraft("reminder", r.id)));
  const today = todayIso();
  const credit = i.kind === "gutschrift";
  const label = credit ? "Gutschrift" : "Rechnung";
  const st = invoiceDisplayStatus(i, today);
  const locked = i.status === "bezahlt" || i.status === "storniert";
  const open = openAmount(i);
  const project = i.projectId ? projects.find((p) => p.id === i.projectId) : undefined;
  const canRemind = !credit && open > 0 && i.status !== "entwurf" && i.reminderLevel < 3;

  return (
    <>
      <PageHeader
        back={{ href: credit ? "/admin/rechnungen?art=gutschrift" : "/admin/rechnungen", label: credit ? "Gutschriften" : "Rechnungen" }}
        title={`${label} ${i.number}`}
        badge={<InvoiceBadge inv={i} />}
        sub={
          <>
            <Link href={`/admin/kunden/${c.id}`} className="hover:text-accent">
              {customerName(c)}
            </Link>
            {` · CHF ${chf(i.total)}`}
            {i.sentAt ? ` · gesendet am ${fmtDate(i.sentAt)}` : ""}
            {i.paidAt ? ` · bezahlt am ${fmtDate(i.paidAt)}` : ""}
          </>
        }
        actions={
          <>
            <a href={`/api/admin/pdf/invoice/${i.id}`} target="_blank" className={btn.ghost}>
              <Icon name="download" className="h-4 w-4" /> PDF
            </a>
            <form action={duplicateInvoiceAction.bind(null, i.id)}>
              <button className={btn.ghost}>
                <Icon name="copy" className="h-4 w-4" /> Duplizieren
              </button>
            </form>
            {draft && i.status !== "storniert" && <SendDialog kind="invoice" id={i.id} draft={draft} sentAt={i.sentAt?.toISOString() ?? null} />}
          </>
        }
      />
      {!s.iban && !credit && (
        <Notice tone="warn">
          Für den QR-Einzahlungsschein bitte die IBAN in den{" "}
          <Link href="/admin/einstellungen" className="underline">
            Einstellungen
          </Link>{" "}
          hinterlegen.
        </Notice>
      )}
      {fehler === "storno" && <Notice tone="error">Versendete Rechnungen können nicht gelöscht werden. Bitte stornieren oder eine Gutschrift erstellen.</Notice>}
      {st === "ueberfaellig" && (
        <Notice tone="error">
          Seit {fmtDate(i.dueDate)} überfällig, offen CHF {chf(open)}.{i.reminderLevel > 0 ? ` Bereits ${i.reminderLevel}. Mahnung erstellt.` : ""}
        </Notice>
      )}

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <Card
          title={credit ? "Erstattung" : "Zahlungen"}
          className="lg:col-span-2"
          actions={
            i.status !== "storniert" && open > 0 ? (
              <Modal label={credit ? "Erstattung erfassen" : "Zahlung erfassen"} title={credit ? "Erstattung erfassen" : "Zahlung erfassen"} icon="plus" size="sm" variant="dark">
                <PaymentForm invoiceId={i.id} open={open} />
              </Modal>
            ) : undefined
          }
        >
          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-bg p-3">
              <p className="text-[12px] text-muted">Total</p>
              <p className="text-[18px] font-semibold tabular-nums">{chf(i.total)}</p>
            </div>
            <div className="rounded-xl bg-bg p-3">
              <p className="text-[12px] text-muted">{credit ? "Erstattet" : "Bezahlt"}</p>
              <p className="text-[18px] font-semibold tabular-nums text-success">{chf(i.paidAmount)}</p>
            </div>
            <div className="rounded-xl bg-bg p-3">
              <p className="text-[12px] text-muted">Offen</p>
              <p className={`text-[18px] font-semibold tabular-nums ${open > 0 ? "text-danger" : ""}`}>{chf(open)}</p>
            </div>
          </div>
          {payments.length === 0 ? (
            <p className="text-[14px] text-muted">Noch keine Zahlungen erfasst.</p>
          ) : (
            <ul className="-my-1 divide-y divide-line">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-[14px]">
                  <span>
                    {fmtDate(p.date)} · {paymentMethodLabels[p.method] ?? p.method}
                    {p.note && <span className="text-muted"> · {p.note}</span>}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-medium tabular-nums">CHF {chf(p.amount)}</span>
                    <form action={deletePaymentAction.bind(null, p.id)}>
                      <ConfirmButton message="Zahlung löschen?" className={iconBtn}>
                        <Icon name="trash" className="h-3.5 w-3.5" />
                        <span className="sr-only">Löschen</span>
                      </ConfirmButton>
                    </form>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {i.status !== "storniert" && open > 0 && i.status !== "entwurf" && (
            <form
              action={async (fd: FormData) => {
                "use server";
                await setInvoiceStatusAction(id, "bezahlt", String(fd.get("paidAt") || ""));
              }}
              className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4"
            >
              <span className="text-[13px] text-muted">Restbetrag vollständig erhalten am</span>
              <input type="date" name="paidAt" defaultValue={today} className="input w-auto py-1.5" />
              <button className={btnSm.dark}>
                <Icon name="check" className="h-3.5 w-3.5" /> Als bezahlt markieren
              </button>
            </form>
          )}
        </Card>

        <Card title="Aktionen">
          <div className="flex flex-col gap-2">
            {i.status === "entwurf" && (
              <form action={markInvoicesSentAction.bind(null, [i.id])}>
                <button className={`${btnSm.ghost} w-full`}>Als versendet markieren (Post)</button>
              </form>
            )}
            {!credit && i.status !== "entwurf" && (
              <form action={creditNoteAction.bind(null, i.id)}>
                <ConfirmButton message="Gutschrift zu dieser Rechnung erstellen?" className={`${btnSm.ghost} w-full`}>
                  Gutschrift erstellen
                </ConfirmButton>
              </form>
            )}
            {canRemind && (
              <form action={createReminderAction.bind(null, i.id)}>
                <ConfirmButton message={`${i.reminderLevel + 1}. Mahnung erstellen?`} className={`${btnSm.dark} w-full`}>
                  <Icon name="bell" className="h-3.5 w-3.5" /> {i.reminderLevel === 0 ? "Zahlungserinnerung" : `${i.reminderLevel + 1}. Mahnung`} erstellen
                </ConfirmButton>
              </form>
            )}
            {i.status === "bezahlt" && (
              <form action={setInvoiceStatusAction.bind(null, i.id, "gesendet", undefined)}>
                <ConfirmButton message="Alle Zahlungen löschen und Rechnung wieder öffnen?" className={`${btnSm.ghost} w-full`}>
                  Zahlung zurücksetzen
                </ConfirmButton>
              </form>
            )}
            {i.status !== "storniert" && i.status !== "entwurf" && (
              <form action={setInvoiceStatusAction.bind(null, i.id, "storniert", undefined)}>
                <ConfirmButton message={`${label} stornieren?`} className={`${btnSm.danger} w-full`}>
                  Stornieren
                </ConfirmButton>
              </form>
            )}
            {i.status === "entwurf" && (
              <form action={deleteInvoiceAction.bind(null, i.id)}>
                <ConfirmButton message="Entwurf löschen? Verrechnete Zeiten und Abos werden wieder freigegeben." className={`${btnSm.danger} w-full`}>
                  Entwurf löschen
                </ConfirmButton>
              </form>
            )}
          </div>
          <ul className="mt-4 space-y-1.5 border-t border-line pt-3 text-[13.5px]">
            {i.quoteId && (
              <li>
                <Link href={`/admin/offerten/${i.quoteId}`} className="text-accent hover:underline">
                  Zur Offerte
                </Link>
              </li>
            )}
            {project && (
              <li>
                <Link href={`/admin/projekte/${project.id}`} className="text-accent hover:underline">
                  Projekt: {project.name}
                </Link>
              </li>
            )}
            {original && (
              <li>
                <Link href={`/admin/rechnungen/${original.id}`} className="text-accent hover:underline">
                  Zu Rechnung {original.number}
                </Link>
              </li>
            )}
            {credits.map((g) => (
              <li key={g.id}>
                <Link href={`/admin/rechnungen/${g.id}`} className="text-accent hover:underline">
                  Gutschrift {g.number}
                </Link>
              </li>
            ))}
            {timeCount.length > 0 && <li className="text-muted">{timeCount.length} Zeiteinträge verrechnet</li>}
          </ul>
        </Card>
      </div>

      {reminders.length > 0 && (
        <Card title="Mahnungen" className="mb-5">
          <ul className="-my-1 divide-y divide-line">
            {reminders.map((r, k) => (
              <li key={r.id} className={`flex flex-wrap items-center justify-between gap-3 py-2.5 text-[14px] ${String(r.id) === mahnung ? "rounded-lg bg-accent-soft/50 px-2" : ""}`}>
                <span>
                  <span className="font-medium">{r.level === 1 ? "Zahlungserinnerung" : `${r.level}. Mahnung`}</span> vom {fmtDate(r.date)} · neue Frist {fmtDate(r.dueDate)}
                  {r.fee > 0 && ` · Gebühr CHF ${chf(r.fee)}`}
                  {r.sentAt && <span className="text-muted"> · gesendet {fmtDate(r.sentAt)}</span>}
                </span>
                <span className="flex items-center gap-2">
                  <a href={`/api/admin/pdf/reminder/${r.id}`} target="_blank" className={btnSm.ghost}>
                    <Icon name="download" className="h-3.5 w-3.5" /> PDF
                  </a>
                  {reminderDrafts[k] && <SendDialog kind="reminder" id={r.id} draft={reminderDrafts[k]!} sentAt={r.sentAt?.toISOString() ?? null} label="Senden" small />}
                  <form action={deleteReminderAction.bind(null, r.id)}>
                    <ConfirmButton message="Mahnung löschen?" className={iconBtn}>
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      <span className="sr-only">Löschen</span>
                    </ConfirmButton>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <DocumentEditor
        kind="invoice"
        id={i.id}
        credit={credit}
        customers={customers}
        projects={projects}
        products={products}
        locked={locked}
        initial={{
          customerId: i.customerId,
          projectId: i.projectId,
          title: i.title,
          intro: i.intro ?? "",
          outro: i.outro ?? "",
          notes: i.notes ?? "",
          items: i.items,
          discountPercent: i.discountPercent,
          vatRate: i.vatRate,
          issueDate: i.issueDate,
          secondDate: i.dueDate,
        }}
      />
    </>
  );
}

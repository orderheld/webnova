import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Modal } from "@/components/admin/action-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CopyButton } from "@/components/admin/copy-button";
import { PendingButton } from "@/components/admin/feedback";
import { Icon } from "@/components/admin/icons";
import { PreviewSendDialog } from "@/components/admin/preview-send";
import { PreviewEditForm, PreviewFileButton } from "@/components/admin/preview-upload";
import { Badge, Card, KeyValues, PageHeader, btn, btnSm } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { fmtDate, fmtDateTime } from "@/lib/admin/money";
import { deletePreviewAction, deletePreviewPdfAction, markPreviewSentAction, setPreviewActiveAction } from "@/lib/admin/preview-actions";
import { mb } from "@/lib/admin/preview-files";
import { previewChatText, previewMailDraft, previewPdf, previewUrl } from "@/lib/admin/previews";
import { customerName, customerOptions, routeId } from "@/lib/admin/queries";
import { whatsappNumber } from "@/lib/admin/whatsapp";

export const metadata = { title: "Vorschau" };

export default async function PreviewDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  if (!id) notFound();
  const [p] = await db().select().from(schema.previews).where(eq(schema.previews.id, id));
  if (!p) notFound();
  const f = schema.previewFiles;
  const [customer, customers, pdf, files] = await Promise.all([
    p.customerId ? db().select().from(schema.customers).where(eq(schema.customers.id, p.customerId)).then((r) => r[0]) : undefined,
    customerOptions(),
    previewPdf(p),
    db()
      .select({ path: f.path, size: f.size })
      .from(f)
      .where(and(eq(f.previewId, p.id), eq(f.kind, "site"), eq(f.version, p.version)))
      .orderBy(asc(f.path)),
  ]);
  const [draft, chat] = await Promise.all([previewMailDraft(p, !!pdf), previewChatText(p, !!pdf)]);
  const url = previewUrl(p.token);
  const online = p.active && p.version > 0;
  const wa = whatsappNumber(p.contactPhone);

  return (
    <>
      <PageHeader
        back={{ href: "/admin/vorschauen", label: "Vorschauen" }}
        title={p.title}
        badge={
          online ? (
            <Badge status="aktiv" label="Online" />
          ) : (
            <Badge status={p.version === 0 ? "entwurf" : "pausiert"} label={p.version === 0 ? "Upload unvollständig" : "Link ausgeschaltet"} />
          )
        }
        sub={
          <>
            {customer ? (
              <Link href={`/admin/kunden/${customer.id}`} className="hover:text-accent">
                {customerName(customer)}
              </Link>
            ) : (
              "Noch kein Kunde"
            )}
            {` · erstellt am ${fmtDate(p.createdAt)}`}
            {p.sentAt ? ` · gesendet am ${fmtDate(p.sentAt)}${p.sentTo ? ` an ${p.sentTo}` : ""}` : ""}
          </>
        }
        actions={
          <>
            {online && (
              <a href={url} target="_blank" rel="noopener" className={btn.ghost}>
                <Icon name="external" className="h-4 w-4" /> Öffnen
              </a>
            )}
            <Modal label="Bearbeiten" title="Vorschau bearbeiten" icon="edit" wide>
              <PreviewEditForm p={p} customers={customers} />
            </Modal>
            {online && <PreviewSendDialog id={p.id} draft={draft} sentAt={p.sentAt?.toISOString() ?? null} pdfName={pdf?.path ?? null} />}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Link für den Kunden">
            {p.version === 0 ? (
              <div className="space-y-3">
                <p className="text-[14px] text-ink-soft">Der Upload wurde nicht fertig. Bitte das ZIP nochmals hochladen, der Link bleibt derselbe.</p>
                <PreviewFileButton id={p.id} kind="site" label="ZIP hochladen" />
              </div>
            ) : (
              <>
                <p className="select-all break-all rounded-xl bg-bg px-4 py-3 font-mono text-[14px] text-ink">{url}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton text={url} label="Link kopieren" done="Link kopiert" />
                  {online && (
                    <a href={url} target="_blank" rel="noopener" className={btnSm.ghost}>
                      <Icon name="external" className="h-3.5 w-3.5" /> Öffnen
                    </a>
                  )}
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                  Der Link enthält nur einen Zufallscode, keinen Namen. Google und andere Suchmaschinen nehmen ihn nicht auf, und er funktioniert, bis du ihn
                  ausschaltest oder löschst.
                </p>
              </>
            )}
          </Card>

          {online && (
            <Card title="Per WhatsApp senden">
              {/* calt off: Inter would draw the x in a link code like "1x9" as a multiplication sign */}
              <pre className="whitespace-pre-wrap rounded-xl bg-bg px-4 py-3 font-sans text-[13.5px] leading-relaxed text-ink-soft [font-feature-settings:'calt'_0]">{chat}</pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyButton text={chat} label="Text kopieren" done="Text kopiert" />
                <a href={`https://wa.me/${wa ?? ""}?text=${encodeURIComponent(chat)}`} target="_blank" rel="noopener noreferrer" className={btnSm.ghost}>
                  <Icon name="chat" className="h-3.5 w-3.5" /> In WhatsApp öffnen{wa ? "" : " (Kontakt wählen)"}
                </a>
                <form action={markPreviewSentAction.bind(null, p.id, "WhatsApp")}>
                  <PendingButton className={btnSm.ghost}>
                    <Icon name="check" className="h-3.5 w-3.5" /> Als gesendet vermerken
                  </PendingButton>
                </form>
              </div>
              <p className="mt-3 text-[12.5px] text-muted">
                {pdf ? "Das PDF in WhatsApp gleich danach als Dokument anhängen. " : ""}Den Text kannst du unter Einstellungen &gt; Firma &amp; Texte
                anpassen.
              </p>
            </Card>
          )}

          {p.version > 0 && (
            <Card title="Dateien" actions={<PreviewFileButton id={p.id} kind="site" label="Neue Version hochladen" />}>
              <p className="text-[14px] text-ink-soft">
                Version {p.version} · {p.fileCount} {p.fileCount === 1 ? "Datei" : "Dateien"} · {mb(p.totalBytes)}. Eine neue Version ersetzt die Dateien, der Link bleibt gleich.
              </p>
              <details className="mt-3 text-[13px]">
                <summary className="cursor-pointer text-bright hover:text-accent">Alle Dateien anzeigen</summary>
                <ul className="mt-2 divide-y divide-line rounded-xl border border-line">
                  {files.map((x) => (
                    <li key={x.path} className="flex justify-between gap-4 px-3 py-1.5">
                      <span className="min-w-0 break-all font-mono text-[12.5px]">{x.path}</span>
                      <span className="shrink-0 tabular-nums text-muted">{mb(x.size)}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Geöffnet">
            <p className="font-display text-[28px] font-semibold tracking-[-0.02em] text-ink">{p.views}×</p>
            <KeyValues
              rows={[
                ["Erstmals", p.firstViewedAt ? fmtDateTime(p.firstViewedAt) : "–"],
                ["Zuletzt", p.lastViewedAt ? fmtDateTime(p.lastViewedAt) : "–"],
              ]}
            />
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              Zählt jeden Besuch der Vorschau einmal, auch wenn der Kunde dazwischen neu lädt; nach 30 Minuten Pause zählt der nächste. Deine eigenen
              Aufrufe (im Admin angemeldet) und Link-Vorschauen von WhatsApp zählen nicht. Bei jedem Besuch kommt eine Mitteilung aufs Handy.
            </p>
          </Card>

          <Card title="PDF-Vorschlag">
            {pdf ? (
              <>
                <p className="flex items-center gap-2 text-[14px]">
                  <Icon name="file" className="h-4 w-4 shrink-0 text-bright" />
                  <span className="min-w-0 break-all">{pdf.path}</span>
                  <span className="shrink-0 text-muted">{mb(pdf.size)}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`/api/admin/vorschauen/${p.id}/pdf`} target="_blank" className={btnSm.ghost}>
                    <Icon name="external" className="h-3.5 w-3.5" /> Öffnen
                  </a>
                  <PreviewFileButton id={p.id} kind="pdf" label="Ersetzen" />
                  <form action={deletePreviewPdfAction.bind(null, p.id)}>
                    <ConfirmButton message="PDF entfernen?" className={btnSm.danger}>
                      Entfernen
                    </ConfirmButton>
                  </form>
                </div>
              </>
            ) : (
              <>
                <p className="mb-3 text-[14px] text-muted">Noch kein PDF. Es geht mit der E-Mail an den Kunden.</p>
                <PreviewFileButton id={p.id} kind="pdf" label="PDF hochladen" />
              </>
            )}
          </Card>

          <Card title="Kontakt">
            <KeyValues
              rows={[
                ["Anrede", p.contactName || "–"],
                ["E-Mail", p.contactEmail ? <a href={`mailto:${p.contactEmail}`} className="hover:text-accent">{p.contactEmail}</a> : "–"],
                ["Handy", p.contactPhone || "–"],
                ["Sprache", p.language === "fr" ? "Französisch" : "Deutsch"],
                ...(p.note ? ([["Notiz", <span key="n" className="whitespace-pre-line">{p.note}</span>]] as [string, React.ReactNode][]) : []),
              ]}
            />
          </Card>

          <Card title="Link verwalten">
            <div className="flex flex-wrap gap-2">
              {p.version > 0 && (
                <form action={setPreviewActiveAction.bind(null, p.id, !p.active)}>
                  <PendingButton className={btnSm.ghost}>
                    <Icon name={p.active ? "pause" : "play"} className="h-3.5 w-3.5" /> {p.active ? "Link ausschalten" : "Link einschalten"}
                  </PendingButton>
                </form>
              )}
              <form action={deletePreviewAction.bind(null, p.id)}>
                <ConfirmButton message="Vorschau mit allen Dateien endgültig löschen? Der Link funktioniert danach nicht mehr." className={btnSm.danger}>
                  <Icon name="trash" className="h-3.5 w-3.5" /> Löschen
                </ConfirmButton>
              </form>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">Ausgeschaltet zeigt der Link «nicht mehr verfügbar», die Dateien bleiben.</p>
          </Card>
        </div>
      </div>
    </>
  );
}

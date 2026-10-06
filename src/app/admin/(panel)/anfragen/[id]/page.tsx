import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge, Card, Field, PageHeader, btn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { leadStatuses } from "@/db/schema";
import { deleteLeadAction, leadToCustomerAction, updateLeadAction } from "@/lib/admin/actions";
import { fmtDate } from "@/lib/admin/money";
import { label } from "@/lib/leads/options";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [l] = await db().select().from(schema.leads).where(eq(schema.leads.id, id));
  if (!l) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Name", l.name],
    ["Firma", l.company || "–"],
    ["E-Mail", <a key="e" href={`mailto:${l.email}`} className="text-accent hover:underline">{l.email}</a>],
    ["Telefon", l.phone ? <a key="p" href={`tel:${l.phone.replace(/\s/g, "")}`} className="text-accent hover:underline">{l.phone}</a> : "–"],
    ["Bevorzugter Kontakt", label("preferredContact", l.preferredContact)],
    ["Leistungen", l.services.map((s) => label("services", s)).join(", ")],
    ["Webseite vorhanden", l.hasWebsite === null ? "–" : l.hasWebsite ? `Ja${l.websiteUrl ? ` (${l.websiteUrl})` : ""}` : "Nein"],
    ["Unternehmensgrösse", label("companySize", l.companySize)],
    ["Branche", l.industry || "–"],
    ["Budget (CHF)", label("budget", l.budget)],
    ["Zeitplan", label("timeline", l.timeline)],
    ["Sprache", l.locale.toUpperCase()],
    ["Quelle", `${l.source}${l.pageUrl ? ` · ${l.pageUrl}` : ""}`],
  ];
  return (
    <>
      <PageHeader
        title={l.company || l.name}
        sub={`Anfrage #${l.id} vom ${fmtDate(l.createdAt)}`}
        actions={
          <>
            <Badge status={l.status} />
            {l.customerId ? (
              <Link href={`/admin/kunden/${l.customerId}`} className={btn.ghost}>
                Zum Kunden
              </Link>
            ) : (
              <form action={leadToCustomerAction.bind(null, l.id)}>
                <button className={btn.dark}>Als Kunde anlegen</button>
              </form>
            )}
            <Link href={`/admin/rechner/neu?anfrage=${l.id}`} className={btn.ghost}>
              Kosten schätzen
            </Link>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Angaben" className="lg:col-span-2">
          <dl className="grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-[180px_1fr]">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {l.message && (
            <div className="mt-6 rounded-2xl bg-bg p-4 text-[14px] leading-relaxed whitespace-pre-line">{l.message}</div>
          )}
        </Card>
        <Card title="Bearbeitung">
          <form action={updateLeadAction.bind(null, l.id)} className="space-y-4">
            <Field label="Status">
              <select name="status" defaultValue={l.status} className="input capitalize">
                {leadStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Interne Notizen">
              <textarea name="notes" defaultValue={l.notes ?? ""} rows={6} className="input" />
            </Field>
            <button className={`${btn.dark} w-full`}>Speichern</button>
          </form>
          <form action={deleteLeadAction.bind(null, l.id)} className="mt-4 border-t border-line pt-4">
            <ConfirmButton message="Anfrage endgültig löschen?" className={`${btn.danger} w-full`}>Anfrage löschen</ConfirmButton>
          </form>
        </Card>
      </div>
    </>
  );
}

import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { SubscriptionForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { InvoiceRows } from "@/components/admin/lists";
import { Badge, Card, KeyValues, Notice, PageHeader, btn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { periodOf, yearlyValue } from "@/lib/admin/billing";
import { billSubscriptionNowAction, deleteSubscriptionAction, setSubscriptionStatusAction } from "@/lib/admin/finance-actions";
import { intervalLabels, subscriptionCategoryLabels, subscriptionStatusLabels } from "@/lib/admin/labels";
import { chf, fmtDate } from "@/lib/admin/money";
import { allProjectOptions, customerName, customerOptions, productOptions, routeId } from "@/lib/admin/queries";

export default async function SubscriptionDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fehler?: string }> }) {
  const id = routeId((await params).id);
  const { fehler } = await searchParams;
  if (!id) notFound();
  const [row] = await db()
    .select({ s: schema.subscriptions, c: schema.customers })
    .from(schema.subscriptions)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.subscriptions.customerId))
    .where(eq(schema.subscriptions.id, id));
  if (!row) notFound();
  const { s, c } = row;
  const [invoices, customers, projects, products] = await Promise.all([
    db()
      .select()
      .from(schema.invoices)
      .where(sql`${schema.invoices.items} @> ${JSON.stringify([{ subscriptionId: id }])}::jsonb`)
      .orderBy(desc(schema.invoices.issueDate)),
    customerOptions(),
    allProjectOptions(),
    productOptions(),
  ]);
  const project = s.projectId ? projects.find((p) => p.id === s.projectId) : undefined;
  const next = periodOf(s, s.nextBillingDate);
  const ended = s.endDate && s.nextBillingDate > s.endDate;
  // upcoming billing dates (preview)
  const preview: string[] = [];
  let d = s.nextBillingDate;
  for (let k = 0; k < 4 && (!s.endDate || d <= s.endDate); k++) {
    preview.push(d);
    d = periodOf(s, d).next;
  }

  return (
    <>
      <PageHeader
        back={{ href: "/admin/abos", label: "Abos" }}
        title={s.title}
        badge={<Badge status={s.status} label={subscriptionStatusLabels[s.status]} />}
        sub={
          <>
            <Link href={`/admin/kunden/${c.id}`} className="hover:text-accent">
              {customerName(c)}
            </Link>
            {` · CHF ${chf(s.amount)} ${intervalLabels[s.interval]}`}
          </>
        }
        actions={
          <>
            {s.status === "aktiv" && !ended && (
              <form action={billSubscriptionNowAction.bind(null, s.id)}>
                <ConfirmButton message={`Periode ${fmtDate(next.from)} bis ${fmtDate(next.to)} jetzt als Rechnungsentwurf verrechnen?`} className={btn.dark}>
                  <Icon name="receipt" className="h-4 w-4" /> Jetzt verrechnen
                </ConfirmButton>
              </form>
            )}
            {s.status === "aktiv" && (
              <form action={setSubscriptionStatusAction.bind(null, s.id, "pausiert")}>
                <button className={btn.ghost}>
                  <Icon name="pause" className="h-4 w-4" /> Pausieren
                </button>
              </form>
            )}
            {s.status !== "aktiv" && (
              <form action={setSubscriptionStatusAction.bind(null, s.id, "aktiv")}>
                <button className={btn.ghost}>
                  <Icon name="play" className="h-4 w-4" /> Reaktivieren
                </button>
              </form>
            )}
            {s.status !== "gekuendigt" && (
              <form action={setSubscriptionStatusAction.bind(null, s.id, "gekuendigt")}>
                <ConfirmButton message="Abo kündigen? Es läuft bis zum Ende der bereits verrechneten Periode." className={btn.danger}>
                  Kündigen
                </ConfirmButton>
              </form>
            )}
          </>
        }
      />
      {fehler === "ende" && <Notice tone="warn">Keine weitere Periode zu verrechnen (Abo beendet).</Notice>}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5">
          <Card title="Übersicht">
            <KeyValues
              rows={[
                ["Kunde", <Link key="c" href={`/admin/kunden/${c.id}`} className="text-accent hover:underline">{customerName(c)}</Link>],
                ["Projekt", project ? <Link key="p" href={`/admin/projekte/${project.id}`} className="text-accent hover:underline">{project.name}</Link> : "–"],
                ["Art", subscriptionCategoryLabels[s.category] ?? s.category],
                ["Betrag", `CHF ${chf(s.amount)} ${intervalLabels[s.interval]}`],
                ["Pro Jahr", `CHF ${chf(yearlyValue(s))}`],
                ["Leistungsbeginn", fmtDate(s.startDate)],
                ["1. Jahr inbegriffen", s.firstYearIncluded ? "Ja, Verrechnung ab Jahr 2" : "Nein"],
                ["Nächste Verrechnung", ended ? "–" : `${fmtDate(s.nextBillingDate)} (Periode bis ${fmtDate(next.to)})`],
                ["Läuft bis", s.endDate ? fmtDate(s.endDate) : "unbefristet"],
              ]}
            />
            {s.notes && <p className="mt-4 whitespace-pre-line rounded-xl bg-bg p-3 text-[13px]">{s.notes}</p>}
          </Card>
          {preview.length > 0 && s.status === "aktiv" && (
            <Card title="Kommende Verrechnungen">
              <ul className="space-y-1.5 text-[14px]">
                {preview.map((p) => (
                  <li key={p} className="flex justify-between">
                    <span>{fmtDate(p)}</span>
                    <span className="tabular-nums text-muted">CHF {chf(s.amount)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <Card title={`Rechnungen (${invoices.length})`}>
            <InvoiceRows invoices={invoices} />
          </Card>
        </div>
        <Card title="Bearbeiten" className="lg:col-span-2">
          <SubscriptionForm sub={s} customers={customers} projects={projects} products={products} />
          <form action={deleteSubscriptionAction.bind(null, s.id)} className="mt-6 border-t border-line pt-4">
            <ConfirmButton message="Abo endgültig löschen? Bereits erstellte Rechnungen bleiben erhalten." className={btn.danger}>
              Abo löschen
            </ConfirmButton>
          </form>
        </Card>
      </div>
    </>
  );
}

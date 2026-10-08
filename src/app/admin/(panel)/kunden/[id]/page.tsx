import { desc, eq, inArray, or } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Modal } from "@/components/admin/action-form";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CustomerForm } from "@/components/admin/customer-form";
import { ContactForm, ProjectForm, SubscriptionForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { InvoiceRows, ProjectRows, QuoteRows, SubscriptionRows } from "@/components/admin/lists";
import { Badge, Card, KeyValues, LinkButton, Notice, PageHeader, Stat, btn, iconBtn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { archiveCustomerAction, deleteCustomerAction } from "@/lib/admin/actions";
import { openAmount, yearlyValue } from "@/lib/admin/billing";
import { deleteContactAction } from "@/lib/admin/crm-actions";
import { expenseCategoryLabels, leadStageLabels } from "@/lib/admin/labels";
import { chf, fmtDate } from "@/lib/admin/money";
import { allProjectOptions, customerName, customerOptions, productOptions, routeId, templateOptions } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";

export default async function CustomerDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fehler?: string }> }) {
  const id = routeId((await params).id);
  const { fehler } = await searchParams;
  if (!id) notFound();
  const [c] = await db().select().from(schema.customers).where(eq(schema.customers.id, id));
  if (!c) notFound();
  const [contacts, quotes, invoices, estimates, projects, subs, leads, expenses, customers, templates, projectOpts, products, s] = await Promise.all([
    db().select().from(schema.contacts).where(eq(schema.contacts.customerId, id)).orderBy(desc(schema.contacts.isPrimary), schema.contacts.id),
    db().select().from(schema.quotes).where(eq(schema.quotes.customerId, id)).orderBy(desc(schema.quotes.createdAt)),
    db().select().from(schema.invoices).where(eq(schema.invoices.customerId, id)).orderBy(desc(schema.invoices.createdAt)),
    db().select().from(schema.estimates).where(eq(schema.estimates.customerId, id)).orderBy(desc(schema.estimates.updatedAt)),
    db().select().from(schema.projects).where(eq(schema.projects.customerId, id)).orderBy(desc(schema.projects.updatedAt)),
    db().select().from(schema.subscriptions).where(eq(schema.subscriptions.customerId, id)).orderBy(schema.subscriptions.nextBillingDate),
    db().select().from(schema.leads).where(eq(schema.leads.customerId, id)).orderBy(desc(schema.leads.createdAt)),
    db().select().from(schema.expenses).where(eq(schema.expenses.customerId, id)).orderBy(desc(schema.expenses.date)).limit(20),
    customerOptions(),
    templateOptions(),
    allProjectOptions(),
    productOptions(),
    getSettings(),
  ]);
  const activities = await db()
    .select()
    .from(schema.activities)
    .where(
      or(
        eq(schema.activities.customerId, id),
        projects.length ? inArray(schema.activities.projectId, projects.map((p) => p.id)) : undefined,
        leads.length ? inArray(schema.activities.leadId, leads.map((l) => l.id)) : undefined,
      ),
    )
    .orderBy(desc(schema.activities.occurredAt))
    .limit(60);
  const name = customerName(c);
  const real = invoices.filter((i) => i.kind === "rechnung");
  const open = real.reduce((a, i) => a + openAmount(i), 0);
  const paid = real.reduce((a, i) => a + (i.status === "storniert" ? 0 : i.paidAmount), 0);
  const credits = invoices.filter((i) => i.kind === "gutschrift" && i.status !== "storniert").reduce((a, i) => a + i.total, 0);
  const arr = subs.filter((x) => x.status === "aktiv").reduce((a, x) => a + yearlyValue(x), 0);
  const active = projects.filter((p) => p.status !== "abgeschlossen");

  return (
    <>
      <PageHeader
        back={{ href: "/admin/kunden", label: "Kunden" }}
        title={name}
        badge={c.archived ? <Badge status="abgelehnt" label="Archiviert" /> : undefined}
        sub={[c.company ? [c.firstName, c.lastName].filter(Boolean).join(" ") : null, [c.zip, c.city].filter(Boolean).join(" "), `Kunde seit ${fmtDate(c.createdAt)}`].filter(Boolean).join(" · ")}
        actions={
          <>
            <Modal label="Projekt" title="Neues Projekt" icon="plus" wide>
              <ProjectForm customers={customers} templates={templates} defaults={{ customerId: c.id, hourlyRate: s.hourlyRate }} />
            </Modal>
            <LinkButton href={`/admin/offerten/neu?kunde=${c.id}`} variant="ghost" icon="file">
              Offerte
            </LinkButton>
            <LinkButton href={`/admin/rechnungen/neu?kunde=${c.id}`} variant="ghost" icon="receipt">
              Rechnung
            </LinkButton>
            <Modal label="Abo" title="Neues Abo" icon="repeat" wide>
              <SubscriptionForm customers={customers} projects={projectOpts} products={products} defaults={{ customerId: c.id }} />
            </Modal>
            <Modal label="Bearbeiten" title="Stammdaten bearbeiten" icon="edit" variant="dark" wide>
              <CustomerForm customer={c} />
            </Modal>
          </>
        }
      />
      {fehler === "dokumente" && (
        <Notice tone="error">Kunde kann nicht gelöscht werden, solange Offerten, Rechnungen, Projekte oder Abos existieren. Archivieren Sie den Kunden stattdessen.</Notice>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Bezahlt total" value={`CHF ${chf(paid - credits)}`} sub={credits ? `nach Gutschriften CHF ${chf(credits)}` : `${real.length} Rechnungen`} />
        <Stat label="Offen" value={`CHF ${chf(open)}`} tone={open > 0 ? "warn" : undefined} />
        <Stat label="Abos pro Jahr" value={`CHF ${chf(arr)}`} sub={`${subs.filter((x) => x.status === "aktiv").length} aktiv`} />
        <Stat label="Aktive Projekte" value={String(active.length)} sub={`${projects.length} total`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title={`Projekte (${projects.length})`}>
            <ProjectRows projects={projects} />
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Card title={`Offerten (${quotes.length})`} actions={<LinkButton size="sm" variant="ghost" href={`/admin/offerten/neu?kunde=${c.id}`} icon="plus">Neu</LinkButton>}>
              <QuoteRows quotes={quotes} />
            </Card>
            <Card title={`Rechnungen (${invoices.length})`} actions={<LinkButton size="sm" variant="ghost" href={`/admin/rechnungen/neu?kunde=${c.id}`} icon="plus">Neu</LinkButton>}>
              <InvoiceRows invoices={invoices} />
            </Card>
          </div>
          <Card title={`Abos (${subs.length})`}>
            <SubscriptionRows subs={subs} />
          </Card>
          <ActivityFeed
            activities={activities}
            target={{ customerId: c.id }}
            links={{ projects: new Map(projects.map((p) => [p.id, p.name])), leads: new Map(leads.map((l) => [l.id, `Lead ${l.company || l.name}`])) }}
          />
        </div>

        <div className="space-y-5">
          <Card title="Stammdaten">
            <KeyValues
              rows={[
                ["E-Mail", c.email ? <a href={`mailto:${c.email}`} className="text-accent hover:underline">{c.email}</a> : "–"],
                ["Telefon", c.phone ? <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-accent hover:underline">{c.phone}</a> : "–"],
                ["Adresse", [c.street, [c.zip, c.city].filter(Boolean).join(" "), c.country !== "CH" ? c.country : ""].filter(Boolean).join(", ") || "–"],
                ["Webseite", c.website ? <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">{c.website.replace(/^https?:\/\//, "")}</a> : "–"],
                ["Branche", c.industry || "–"],
                ["UID", c.vatNumber || "–"],
                ["Sprache", c.language.toUpperCase()],
              ]}
            />
            {c.notes && <p className="mt-4 whitespace-pre-line rounded-xl bg-bg p-3 text-[13px]">{c.notes}</p>}
          </Card>

          <Card
            title={`Kontakte (${contacts.length})`}
            actions={
              <Modal label="Kontakt" title="Neuer Kontakt" icon="plus" size="sm">
                <ContactForm customerId={c.id} />
              </Modal>
            }
          >
            {contacts.length === 0 ? (
              <p className="text-[14px] text-muted">Noch keine Kontaktpersonen.</p>
            ) : (
              <ul className="-my-2 divide-y divide-line">
                {contacts.map((k) => (
                  <li key={k.id} className="flex items-start justify-between gap-2 py-2.5">
                    <div className="min-w-0 text-[14px]">
                      <p className="font-medium">
                        {[k.firstName, k.lastName].filter(Boolean).join(" ")}
                        {k.isPrimary && <span className="ml-2 rounded bg-accent-soft px-1.5 text-[11px] text-accent">Hauptkontakt</span>}
                      </p>
                      {k.role && <p className="text-[12px] text-muted">{k.role}</p>}
                      <p className="text-[13px]">
                        {k.email && <a href={`mailto:${k.email}`} className="text-accent hover:underline">{k.email}</a>}
                        {k.email && k.phone && " · "}
                        {k.phone && <a href={`tel:${k.phone.replace(/\s/g, "")}`} className="hover:underline">{k.phone}</a>}
                      </p>
                    </div>
                    <div className="flex shrink-0">
                      <Modal label={<Icon name="edit" className="h-3.5 w-3.5" />} title="Kontakt bearbeiten" triggerClassName={iconBtn}>
                        <ContactForm customerId={c.id} contact={k} />
                      </Modal>
                      <form action={deleteContactAction.bind(null, k.id)}>
                        <ConfirmButton message="Kontakt löschen?" className={iconBtn}>
                          <Icon name="trash" className="h-3.5 w-3.5" />
                          <span className="sr-only">Löschen</span>
                        </ConfirmButton>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {leads.length > 0 && (
            <Card title="Leads">
              <ul className="-my-2 divide-y divide-line">
                {leads.map((l) => (
                  <li key={l.id}>
                    <Link href={`/admin/anfragen/${l.id}`} className="flex items-center justify-between gap-2 py-2.5 text-[14px] hover:opacity-80">
                      <span className="truncate">{l.company || l.name} · {fmtDate(l.createdAt)}</span>
                      <Badge status={l.status} label={leadStageLabels[l.status]} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {estimates.length > 0 && (
            <Card title="Kostenschätzungen">
              <ul className="-my-2 divide-y divide-line">
                {estimates.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/rechner/${e.id}`} className="flex justify-between gap-3 py-2.5 text-[14px] hover:text-accent">
                      <span className="truncate">{e.name}</span>
                      <span className="tabular-nums text-muted">CHF {chf(e.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {expenses.length > 0 && (
            <Card title="Ausgaben für diesen Kunden">
              <ul className="-my-2 divide-y divide-line">
                {expenses.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/ausgaben/${e.id}`} className="flex justify-between gap-3 py-2.5 text-[14px] hover:text-accent">
                      <span className="truncate">
                        {fmtDate(e.date)} · {e.description} <span className="text-muted">({expenseCategoryLabels[e.category] ?? e.category})</span>
                      </span>
                      <span className="tabular-nums">{chf(e.amount)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="Verwaltung">
            <div className="flex flex-wrap gap-2">
              <form action={archiveCustomerAction.bind(null, c.id, !c.archived)}>
                <button className={btn.ghost}>{c.archived ? "Wiederherstellen" : "Archivieren"}</button>
              </form>
              <form action={deleteCustomerAction.bind(null, c.id)}>
                <ConfirmButton message="Kunde endgültig löschen? Kontakte und Aktivitäten werden mitgelöscht." className={btn.danger}>
                  Löschen
                </ConfirmButton>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

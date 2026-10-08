import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Modal } from "@/components/admin/action-form";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Icon } from "@/components/admin/icons";
import { LeadDetailsCard } from "@/components/admin/lead-details";
import { ConvertLeadForm, LeadForm } from "@/components/admin/lead-forms";
import { Badge, Card, KeyValues, LinkButton, PageHeader, Stars, btn, btnSm } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { leadStatuses } from "@/db/schema";
import { deleteLeadAction, setLeadFollowUpAction, setLeadStageAction, snoozeFollowUpAction } from "@/lib/admin/crm-actions";
import { leadSourceLabels, leadStageLabels } from "@/lib/admin/labels";
import { chf, fmtDate, todayIso } from "@/lib/admin/money";
import { customerOptions, routeId, templateOptions } from "@/lib/admin/queries";
import { label } from "@/lib/leads/options";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  if (!id) notFound();
  const [l] = await db().select().from(schema.leads).where(eq(schema.leads.id, id));
  if (!l) notFound();
  const [activities, quotes, projects, estimates, customers, templates, customer] = await Promise.all([
    db().select().from(schema.activities).where(eq(schema.activities.leadId, id)).orderBy(desc(schema.activities.occurredAt)),
    db().select().from(schema.quotes).where(eq(schema.quotes.leadId, id)).orderBy(desc(schema.quotes.createdAt)),
    db().select().from(schema.projects).where(eq(schema.projects.leadId, id)),
    db().select().from(schema.estimates).where(eq(schema.estimates.leadId, id)),
    customerOptions(),
    templateOptions(),
    l.customerId ? db().select().from(schema.customers).where(eq(schema.customers.id, l.customerId)).then((r) => r[0]) : Promise.resolve(undefined),
  ]);
  const today = todayIso();
  const fromForm = l.source === "anfrage";
  const rows: [string, React.ReactNode][] = [
    ["Kontaktperson", l.name],
    ["Firma", l.company || "–"],
    ["E-Mail", l.email ? <a href={`mailto:${l.email}`} className="text-accent hover:underline">{l.email}</a> : "–"],
    ["Telefon", l.phone ? <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="text-accent hover:underline">{l.phone}</a> : "–"],
    ["Adresse", [l.street, [l.zip, l.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || "–"],
    ["Branche", l.industry || "–"],
    [
      "Webseite",
      l.websiteUrl ? (
        <a href={l.websiteUrl.startsWith("http") ? l.websiteUrl : `https://${l.websiteUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
          {l.websiteUrl.replace(/^https?:\/\//, "")} <Icon name="external" className="h-3 w-3" />
        </a>
      ) : l.hasWebsite === false ? (
        "Keine"
      ) : (
        "–"
      ),
    ],
    ["Bewertung Webseite", <span key="r" className="inline-flex items-center gap-2"><Stars value={l.websiteRating} />{l.websiteNotes && <span className="text-[13px] text-muted">{l.websiteNotes}</span>}</span>],
    ["Potenzial", l.value ? `CHF ${chf(l.value)}` : "–"],
    ["Quelle", `${leadSourceLabels[l.source] ?? l.source}${l.pageUrl ? ` · ${l.pageUrl}` : ""}`],
  ];
  if (fromForm || l.services.length)
    rows.push(
      ["Leistungen", l.services.map((s) => label("services", s)).join(", ") || "–"],
      ["Budget (CHF)", label("budget", l.budget)],
      ["Zeitplan", label("timeline", l.timeline)],
      ["Unternehmensgrösse", label("companySize", l.companySize)],
      ["Bevorzugter Kontakt", label("preferredContact", l.preferredContact)],
      ["Sprache", l.locale.toUpperCase()],
    );
  if (l.lostReason) rows.push(["Grund Verlust", l.lostReason]);

  const followDue = l.followUpAt && l.followUpAt <= today && l.status !== "gewonnen" && l.status !== "verloren";

  return (
    <>
      <PageHeader
        back={{ href: "/admin/anfragen", label: "Leads" }}
        title={l.company || l.name}
        badge={<Badge status={l.status} label={leadStageLabels[l.status]} />}
        sub={`${fromForm ? "Anfrage" : "Lead"} #${l.id} vom ${fmtDate(l.createdAt)}${l.company ? ` · ${l.name}` : ""}`}
        actions={
          <>
            {l.phone && (
              <a href={`tel:${l.phone.replace(/\s/g, "")}`} className={btn.ghost}>
                <Icon name="phone" className="h-4 w-4" /> Anrufen
              </a>
            )}
            {l.email && (
              <a href={`mailto:${l.email}`} className={btn.ghost}>
                <Icon name="mail" className="h-4 w-4" /> E-Mail
              </a>
            )}
            <Modal label="Bearbeiten" title="Lead bearbeiten" icon="edit" wide>
              <LeadForm lead={l} />
            </Modal>
            <LinkButton href={`/admin/rechner/neu?anfrage=${l.id}`} variant="ghost" icon="calc">
              Kosten schätzen
            </LinkButton>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-1.5 rounded-2xl border border-line bg-surface p-2">
        <span className="px-2 text-[12.5px] text-muted">Phase</span>
        {leadStatuses.map((s) => (
          <form key={s} action={setLeadStageAction.bind(null, l.id, s)}>
            <button className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${l.status === s ? "bg-accent text-white" : "hover:bg-bg"}`}>{leadStageLabels[s]}</button>
          </form>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Angaben">
            <KeyValues rows={rows} />
            {l.message && <div className="mt-5 whitespace-pre-line rounded-xl bg-bg p-4 text-[14px] leading-relaxed">{l.message}</div>}
            {l.notes && (
              <div className="mt-4">
                <p className="mb-1 text-[12.5px] font-medium text-muted">Interne Notizen</p>
                <p className="whitespace-pre-line text-[14px]">{l.notes}</p>
              </div>
            )}
          </Card>
          <LeadDetailsCard details={l.details} />
          <ActivityFeed activities={activities} target={{ leadId: l.id }} followUp />
        </div>

        <div className="space-y-5">
          <Card title="Follow-up">
            <p className={`text-[22px] font-semibold ${followDue ? "text-danger" : ""}`}>{l.followUpAt ? fmtDate(l.followUpAt) : "Kein Termin"}</p>
            {followDue && <p className="text-[13px] text-danger">Fällig</p>}
            <form
              action={async (fd: FormData) => {
                "use server";
                await setLeadFollowUpAction(id, String(fd.get("date") || "") || null);
              }}
              className="mt-3 flex gap-2"
            >
              <input type="date" name="date" defaultValue={l.followUpAt ?? ""} className="input flex-1" aria-label="Follow-up Datum" />
              <button className={btnSm.ghost}>Setzen</button>
            </form>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                [1, "Morgen"],
                [3, "+3 Tage"],
                [7, "+1 Woche"],
                [30, "+1 Monat"],
              ].map(([d, t]) => (
                <form key={d} action={snoozeFollowUpAction.bind(null, l.id, Number(d))}>
                  <button className="rounded-full border border-line px-2.5 py-1 text-[12px] hover:border-accent">{t}</button>
                </form>
              ))}
            </div>
          </Card>

          <Card title={customer ? "Verknüpft" : "Umwandeln"}>
            {customer && (
              <Link href={`/admin/kunden/${customer.id}`} className="mb-3 flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2 text-[14px] font-medium text-accent">
                <Icon name="user" className="h-4 w-4" /> Kunde: {customer.company || [customer.firstName, customer.lastName].filter(Boolean).join(" ")}
              </Link>
            )}
            {!customer && <p className="mb-3 text-[13px] text-muted">Lead in einem Schritt zu Kunde, Projekt (mit Aufgaben aus Vorlage) und Offerte machen.</p>}
            <Modal label={customer ? "Projekt / Offerte erstellen" : "In Kunde umwandeln"} title="Lead umwandeln" variant="dark" icon="arrowRight" triggerClassName={`${btn.dark} w-full`}>
              <ConvertLeadForm lead={l} customers={customers} templates={templates} />
            </Modal>
            {(quotes.length > 0 || projects.length > 0 || estimates.length > 0) && (
              <ul className="mt-4 space-y-1.5 text-[14px]">
                {projects.map((p) => (
                  <li key={`p${p.id}`}>
                    <Link href={`/admin/projekte/${p.id}`} className="flex items-center justify-between gap-2 hover:text-accent">
                      <span className="flex items-center gap-2 truncate"><Icon name="folder" className="h-4 w-4 text-muted" /> {p.name}</span>
                      <Badge status={p.status} />
                    </Link>
                  </li>
                ))}
                {quotes.map((q) => (
                  <li key={`q${q.id}`}>
                    <Link href={`/admin/offerten/${q.id}`} className="flex items-center justify-between gap-2 hover:text-accent">
                      <span className="flex items-center gap-2 truncate"><Icon name="file" className="h-4 w-4 text-muted" /> {q.number}</span>
                      <span className="text-[13px] tabular-nums text-muted">CHF {chf(q.total)}</span>
                    </Link>
                  </li>
                ))}
                {estimates.map((e) => (
                  <li key={`e${e.id}`}>
                    <Link href={`/admin/rechner/${e.id}`} className="flex items-center justify-between gap-2 hover:text-accent">
                      <span className="flex items-center gap-2 truncate"><Icon name="calc" className="h-4 w-4 text-muted" /> {e.name}</span>
                      <span className="text-[13px] tabular-nums text-muted">CHF {chf(e.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <form action={deleteLeadAction.bind(null, l.id)}>
            <ConfirmButton message="Lead mit allen Aktivitäten endgültig löschen?" className={`${btn.danger} w-full`}>
              Lead löschen
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}

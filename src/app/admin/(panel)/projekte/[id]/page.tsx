import { PendingButton } from "@/components/admin/feedback";
import { asc, desc, eq, or } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Modal } from "@/components/admin/action-form";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { LinkForm, ProjectForm, SubscriptionForm, TaskForm, TimeForm } from "@/components/admin/forms";
import { Icon } from "@/components/admin/icons";
import { InvoiceRows, QuoteRows, SubscriptionRows } from "@/components/admin/lists";
import { Badge, Bar, Card, KeyValues, LinkButton, Notice, PageHeader, Stat, btn, btnSm, iconBtn } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { projectStatuses } from "@/db/schema";
import {
  billTimeAction,
  deleteLinkAction,
  deleteProjectAction,
  deleteTaskAction,
  deleteTimeAction,
  duplicateProjectAction,
  moveTaskAction,
  setProjectStatusAction,
  toggleTaskAction,
} from "@/lib/admin/project-actions";
import { projectStatusLabels } from "@/lib/admin/labels";
import { chf, fmtDate, fmtHours, todayIso } from "@/lib/admin/money";
import { allProjectOptions, customerName, customerOptions, productOptions, routeId } from "@/lib/admin/queries";

export default async function ProjectDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fehler?: string }> }) {
  const id = routeId((await params).id);
  const { fehler } = await searchParams;
  if (!id) notFound();
  const [row] = await db()
    .select({ p: schema.projects, c: schema.customers })
    .from(schema.projects)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.projects.customerId))
    .where(eq(schema.projects.id, id));
  if (!row) notFound();
  const { p, c } = row;
  const [tasks, times, quotes, invoices, subs, activities, customers, projectOpts, products, quoteOpts] = await Promise.all([
    db().select().from(schema.projectTasks).where(eq(schema.projectTasks.projectId, id)).orderBy(asc(schema.projectTasks.sortOrder), asc(schema.projectTasks.id)),
    db().select().from(schema.timeEntries).where(eq(schema.timeEntries.projectId, id)).orderBy(desc(schema.timeEntries.date), desc(schema.timeEntries.id)),
    db()
      .select()
      .from(schema.quotes)
      .where(or(eq(schema.quotes.projectId, id), p.quoteId ? eq(schema.quotes.id, p.quoteId) : undefined))
      .orderBy(desc(schema.quotes.createdAt)),
    db().select().from(schema.invoices).where(eq(schema.invoices.projectId, id)).orderBy(desc(schema.invoices.createdAt)),
    db().select().from(schema.subscriptions).where(eq(schema.subscriptions.projectId, id)),
    db().select().from(schema.activities).where(eq(schema.activities.projectId, id)).orderBy(desc(schema.activities.occurredAt)).limit(50),
    customerOptions(),
    allProjectOptions(),
    productOptions(),
    db().select({ id: schema.quotes.id, number: schema.quotes.number, title: schema.quotes.title }).from(schema.quotes).where(eq(schema.quotes.customerId, p.customerId)),
  ]);
  const today = todayIso();
  const done = tasks.filter((t) => t.done).length;
  const totalHours = times.reduce((a, t) => a + t.hours, 0);
  const open = times.filter((t) => t.billable && !t.invoiceId);
  const openValue = open.reduce((a, t) => a + t.hours * t.rate, 0);
  const invoiced = invoices.filter((i) => i.kind === "rechnung" && i.status !== "storniert").reduce((a, i) => a + i.total, 0);
  const effective = totalHours > 0 && invoiced > 0 ? invoiced / totalHours : null;
  const nextTask = tasks.find((t) => !t.done);

  return (
    <>
      <PageHeader
        back={{ href: "/admin/projekte", label: "Projekte" }}
        title={p.name}
        badge={<Badge status={p.status} label={projectStatusLabels[p.status]} />}
        sub={
          <>
            <Link href={`/admin/kunden/${c.id}`} className="hover:text-accent">
              {customerName(c)}
            </Link>
            {p.startDate && ` · Start ${fmtDate(p.startDate)}`}
            {p.dueDate && ` · Termin ${fmtDate(p.dueDate)}`}
            {p.liveDate && ` · Live seit ${fmtDate(p.liveDate)}`}
          </>
        }
        actions={
          <>
            <LinkButton href={`/admin/offerten/neu?kunde=${c.id}&projekt=${p.id}`} variant="ghost" icon="file">
              Offerte
            </LinkButton>
            <LinkButton href={`/admin/rechnungen/neu?kunde=${c.id}&projekt=${p.id}`} variant="ghost" icon="receipt">
              Rechnung
            </LinkButton>
            <Modal label="Abo" title="Abo für dieses Projekt" icon="repeat" wide>
              <SubscriptionForm customers={customers} projects={projectOpts} products={products} defaults={{ customerId: c.id, projectId: p.id }} />
            </Modal>
            <form action={duplicateProjectAction.bind(null, p.id)}>
              <PendingButton className={btn.ghost}>
                <Icon name="copy" className="h-4 w-4" /> Duplizieren
              </PendingButton>
            </form>
            <Modal label="Bearbeiten" title="Projekt bearbeiten" icon="edit" variant="dark" wide>
              <ProjectForm project={p} customers={customers} quotes={quoteOpts.map((q) => ({ id: q.id, name: `${q.number} · ${q.title}` }))} />
            </Modal>
          </>
        }
      />
      {fehler === "keine-stunden" && <Notice tone="warn">Keine offenen, verrechenbaren Stunden vorhanden.</Notice>}

      <div className="mb-5 flex flex-wrap items-center gap-1 rounded-2xl border border-line bg-surface shadow-xs p-2">
        {projectStatuses.map((s, i) => {
          const idx = projectStatuses.indexOf(p.status);
          return (
            <form key={s} action={setProjectStatusAction.bind(null, p.id, s)} className="flex items-center">
              {i > 0 && <span className={`mx-0.5 h-px w-3 ${i <= idx ? "bg-accent" : "bg-line"}`} />}
              <PendingButton
                className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                  s === p.status ? "bg-accent text-white" : i < idx ? "text-accent hover:bg-accent-soft" : "text-muted hover:bg-bg"
                }`}
              >
                {i < idx && <Icon name="check" className="mr-1 inline h-3 w-3" />}
                {projectStatusLabels[s]}
              </PendingButton>
            </form>
          );
        })}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Aufgaben" value={`${done} / ${tasks.length}`} sub={tasks.length ? <Bar value={done} max={tasks.length} /> : "Noch keine"} />
        <Stat label="Erfasste Zeit" value={fmtHours(totalHours)} sub={effective ? `Effektiv CHF ${chf(effective)}/h` : undefined} />
        <Stat label="Unverrechnet" value={`CHF ${chf(openValue)}`} sub={`${fmtHours(open.reduce((a, t) => a + t.hours, 0))} verrechenbar`} />
        <Stat label="Fakturiert" value={`CHF ${chf(invoiced)}`} sub={p.budget ? `Budget CHF ${chf(p.budget)}` : undefined} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title={`Aufgaben & Meilensteine`} actions={nextTask ? <span className="text-[12.5px] text-muted">Als Nächstes: {nextTask.title}</span> : undefined}>
            <div className="mb-4">
              <TaskForm projectId={p.id} />
            </div>
            {tasks.length === 0 ? (
              <p className="text-[14px] text-muted">Noch keine Aufgaben. Mit einer Projektvorlage werden sie automatisch angelegt.</p>
            ) : (
              <ul className="-mx-2 divide-y divide-line">
                {tasks.map((t) => {
                  const late = !t.done && t.dueDate && t.dueDate < today;
                  return (
                    <li key={t.id} className={`group flex items-center gap-2 px-2 py-2 ${t.milestone ? "bg-accent-soft/40" : ""}`}>
                      <form action={toggleTaskAction.bind(null, t.id)}>
                        <PendingButton className={`grid h-6 w-6 place-items-center rounded-md border ${t.done ? "border-accent bg-accent text-white" : "border-line bg-surface hover:border-accent"}`} aria-label={t.done ? "Als offen markieren" : "Erledigt"}>
                          {t.done && <Icon name="check" className="h-3.5 w-3.5" />}
                        </PendingButton>
                      </form>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[14px] ${t.done ? "text-muted line-through" : ""} ${t.milestone ? "font-semibold" : ""}`}>
                          {t.milestone && <Icon name="flag" className="mr-1.5 inline h-3.5 w-3.5 text-accent" />}
                          {t.title}
                        </p>
                        {t.notes && <p className="truncate text-[12px] text-muted">{t.notes}</p>}
                      </div>
                      <span className={`shrink-0 text-[12.5px] tabular-nums ${late ? "font-medium text-danger" : "text-muted"}`}>{t.dueDate ? fmtDate(t.dueDate) : ""}</span>
                      <div className="flex shrink-0 items-center sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                        <form action={moveTaskAction.bind(null, t.id, -1)}>
                          <PendingButton className={iconBtn} aria-label="Nach oben">
                            <Icon name="up" className="h-3.5 w-3.5" />
                          </PendingButton>
                        </form>
                        <form action={moveTaskAction.bind(null, t.id, 1)}>
                          <PendingButton className={iconBtn} aria-label="Nach unten">
                            <Icon name="down" className="h-3.5 w-3.5" />
                          </PendingButton>
                        </form>
                        <Modal label={<Icon name="edit" className="h-3.5 w-3.5" />} title="Aufgabe bearbeiten" triggerClassName={iconBtn}>
                          <TaskForm projectId={p.id} task={t} />
                        </Modal>
                        <form action={deleteTaskAction.bind(null, t.id)}>
                          <ConfirmButton message="Aufgabe löschen?" className={iconBtn}>
                            <Icon name="trash" className="h-3.5 w-3.5" />
                            <span className="sr-only">Löschen</span>
                          </ConfirmButton>
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card
            title="Zeiterfassung"
            actions={
              open.length > 0 ? (
                <form action={billTimeAction.bind(null, p.id)}>
                  <ConfirmButton message={`${open.length} offene Einträge (CHF ${chf(openValue)}) als Rechnungsentwurf verrechnen?`} className={btnSm.dark}>
                    <Icon name="receipt" className="h-3.5 w-3.5" /> Stunden verrechnen
                  </ConfirmButton>
                </form>
              ) : undefined
            }
          >
            <div className="mb-4 rounded-xl bg-bg/70 p-3">
              <TimeForm projectId={p.id} defaultRate={p.hourlyRate} />
            </div>
            {times.length === 0 ? (
              <p className="text-[14px] text-muted">Noch keine Zeit erfasst.</p>
            ) : (
              <div className="-mx-4 overflow-x-auto sm:-mx-5">
                <table className="w-full min-w-[560px] text-[14px]">
                  <thead>
                    <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wider text-muted">
                      <th className="px-4 py-2 font-medium sm:px-5">Datum</th>
                      <th className="px-2 py-2 font-medium">Tätigkeit</th>
                      <th className="px-2 py-2 text-right font-medium">Std.</th>
                      <th className="px-2 py-2 text-right font-medium">CHF</th>
                      <th className="px-2 py-2 font-medium">Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {times.map((t) => (
                      <tr key={t.id}>
                        <td className="whitespace-nowrap px-4 py-2 text-muted sm:px-5">{fmtDate(t.date)}</td>
                        <td className="px-2 py-2">{t.description}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{t.hours}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{chf(t.hours * t.rate)}</td>
                        <td className="px-2 py-2 text-[12.5px]">
                          {t.invoiceId ? (
                            <Link href={`/admin/rechnungen/${t.invoiceId}`} className="text-accent hover:underline">
                              verrechnet
                            </Link>
                          ) : t.billable ? (
                            <span className="text-warn">offen</span>
                          ) : (
                            <span className="text-muted">intern</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap pr-3 text-right">
                          {!t.invoiceId && (
                            <span className="inline-flex">
                              <Modal label={<Icon name="edit" className="h-3.5 w-3.5" />} title="Zeiteintrag bearbeiten" triggerClassName={iconBtn}>
                                <TimeForm projectId={p.id} entry={t} />
                              </Modal>
                              <form action={deleteTimeAction.bind(null, t.id)}>
                                <ConfirmButton message="Zeiteintrag löschen?" className={iconBtn}>
                                  <Icon name="trash" className="h-3.5 w-3.5" />
                                  <span className="sr-only">Löschen</span>
                                </ConfirmButton>
                              </form>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <ActivityFeed activities={activities} target={{ projectId: p.id, customerId: c.id }} title="Projektjournal" />
        </div>

        <div className="space-y-5">
          <Card title="Details">
            <KeyValues
              rows={[
                ["Kunde", <Link key="c" href={`/admin/kunden/${c.id}`} className="text-accent hover:underline">{customerName(c)}</Link>],
                ["Status", projectStatusLabels[p.status]],
                ["Start", fmtDate(p.startDate)],
                ["Termin", fmtDate(p.dueDate)],
                ["Live seit", fmtDate(p.liveDate)],
                ["Budget", p.budget ? `CHF ${chf(p.budget)}` : "–"],
                ["Stundensatz", p.hourlyRate ? `CHF ${chf(p.hourlyRate)}` : "–"],
              ]}
            />
            {p.description && <p className="mt-4 whitespace-pre-line text-[14px]">{p.description}</p>}
            {p.notes && <p className="mt-3 whitespace-pre-line rounded-xl bg-bg p-3 text-[13px]">{p.notes}</p>}
          </Card>

          <Card title="Dateien & Links">
            {p.links.length > 0 && (
              <ul className="mb-4 space-y-1.5">
                {p.links.map((l, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <a href={l.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-2 text-[14px] text-accent hover:underline">
                      <Icon name="link" className="h-4 w-4 shrink-0" />
                      <span className="truncate">{l.label}</span>
                    </a>
                    <form action={deleteLinkAction.bind(null, p.id, i)}>
                      <ConfirmButton message="Link entfernen?" className={iconBtn}>
                        <Icon name="trash" className="h-3.5 w-3.5" />
                        <span className="sr-only">Entfernen</span>
                      </ConfirmButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <LinkForm projectId={p.id} />
          </Card>

          <Card title={`Offerten (${quotes.length})`}>
            <QuoteRows quotes={quotes} />
          </Card>
          <Card title={`Rechnungen (${invoices.length})`}>
            <InvoiceRows invoices={invoices} />
          </Card>
          <Card title={`Abos (${subs.length})`}>
            <SubscriptionRows subs={subs} />
          </Card>

          <form action={deleteProjectAction.bind(null, p.id)}>
            <ConfirmButton message="Projekt mit allen Aufgaben und Zeiteinträgen löschen? Rechnungen bleiben erhalten." className={`${btn.danger} w-full`}>
              Projekt löschen
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}

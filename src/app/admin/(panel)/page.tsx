import { and, asc, desc, eq, gt, inArray, isNotNull, isNull, lte, notInArray, or, sql } from "drizzle-orm";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { InvoiceBadge, invoiceDisplayStatus } from "@/components/admin/lists";
import { Badge, Card, Empty, LinkButton, PageHeader, Stat, btn, btnSm } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { leadStatuses } from "@/db/schema";
import { dueSubscriptions, openAmount } from "@/lib/admin/billing";
import { snoozeFollowUpAction } from "@/lib/admin/crm-actions";
import { billDueSubscriptionsAction } from "@/lib/admin/finance-actions";
import { activityTypeLabels, intervalUnit, leadStageLabels } from "@/lib/admin/labels";
import { addDaysIso, chf, chf0, fmtDate, fmtDateTime, fmtHours, todayIso } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";
import { dashboardFigures } from "@/lib/admin/reports";

export const metadata = { title: "Übersicht" };

const stageBar: Record<string, string> = {
  neu: "bg-sky-500",
  kontaktiert: "bg-indigo-500",
  gespraech: "bg-violet-500",
  offerte: "bg-amber-500",
  gewonnen: "bg-emerald-600",
  verloren: "bg-zinc-400",
};

export default async function Dashboard() {
  const d = db();
  const today = todayIso();
  const monthStart = `${today.slice(0, 7)}-01`;
  const yearStart = `${today.slice(0, 4)}-01-01`;
  const in60 = addDaysIso(today, 60);
  const in30 = addDaysIso(today, 30);

  const [stages, followUps, activeProjects, nextTasks, taskCounts, openInvoices, renewals, due, unbilled, recent, figures] = await Promise.all([
    d
      .select({ status: schema.leads.status, n: sql<number>`count(*)::int`, value: sql<number>`coalesce(sum(${schema.leads.value}),0)::float` })
      .from(schema.leads)
      .groupBy(schema.leads.status),
    d
      .select()
      .from(schema.leads)
      .where(and(isNotNull(schema.leads.followUpAt), lte(schema.leads.followUpAt, today), notInArray(schema.leads.status, ["gewonnen", "verloren"])))
      .orderBy(asc(schema.leads.followUpAt))
      .limit(8),
    d
      .select({ p: schema.projects, c: schema.customers })
      .from(schema.projects)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.projects.customerId))
      .where(notInArray(schema.projects.status, ["live", "abgeschlossen"]))
      .orderBy(sql`${schema.projects.dueDate} asc nulls last`),
    // next open task per project (DISTINCT ON) instead of loading every open task
    d
      .selectDistinctOn([schema.projectTasks.projectId], {
        projectId: schema.projectTasks.projectId,
        title: schema.projectTasks.title,
        dueDate: schema.projectTasks.dueDate,
        milestone: schema.projectTasks.milestone,
      })
      .from(schema.projectTasks)
      .where(eq(schema.projectTasks.done, false))
      .orderBy(schema.projectTasks.projectId, sql`${schema.projectTasks.dueDate} asc nulls last`, asc(schema.projectTasks.sortOrder)),
    d
      .select({ projectId: schema.projectTasks.projectId, n: sql<number>`count(*)::int` })
      .from(schema.projectTasks)
      .where(eq(schema.projectTasks.done, false))
      .groupBy(schema.projectTasks.projectId),
    d
      .select({
        i: {
          id: schema.invoices.id,
          number: schema.invoices.number,
          dueDate: schema.invoices.dueDate,
          total: schema.invoices.total,
          paidAmount: schema.invoices.paidAmount,
          status: schema.invoices.status,
          kind: schema.invoices.kind,
          reminderLevel: schema.invoices.reminderLevel,
        },
        c: { company: schema.customers.company, firstName: schema.customers.firstName, lastName: schema.customers.lastName },
      })
      .from(schema.invoices)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
      .where(and(eq(schema.invoices.kind, "rechnung"), inArray(schema.invoices.status, ["gesendet", "teilbezahlt"])))
      .orderBy(asc(schema.invoices.dueDate)),
    d
      .select({ s: schema.subscriptions, c: schema.customers })
      .from(schema.subscriptions)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.subscriptions.customerId))
      .where(
        and(
          eq(schema.subscriptions.status, "aktiv"),
          lte(schema.subscriptions.nextBillingDate, in60),
          or(isNull(schema.subscriptions.endDate), sql`${schema.subscriptions.nextBillingDate} <= ${schema.subscriptions.endDate}`),
        ),
      )
      .orderBy(asc(schema.subscriptions.nextBillingDate)),
    dueSubscriptions(),
    d
      .select({
        hours: sql<number>`coalesce(sum(${schema.timeEntries.hours}),0)::float`,
        value: sql<number>`coalesce(sum(${schema.timeEntries.hours} * ${schema.timeEntries.rate}),0)::float`,
      })
      .from(schema.timeEntries)
      .where(and(eq(schema.timeEntries.billable, true), isNull(schema.timeEntries.invoiceId))),
    d.select().from(schema.activities).where(gt(schema.activities.occurredAt, sql`now() - interval '14 days'`)).orderBy(desc(schema.activities.occurredAt)).limit(8),
    dashboardFigures(monthStart, yearStart, today),
  ]);
  const { monthRev, yearRev, monthIn, yearIn, yearExp } = figures;

  const stageMap = new Map(stages.map((s) => [s.status, s]));
  const pipelineMax = Math.max(1, ...stages.map((s) => s.n));
  const openPipeline = stages.filter((s) => !["gewonnen", "verloren"].includes(s.status));
  const pipelineValue = openPipeline.reduce((a, s) => a + s.value, 0);
  const pipelineCount = openPipeline.reduce((a, s) => a + s.n, 0);

  const taskByProject = new Map(nextTasks.map((t) => [t.projectId, t]));
  const openTaskCount = new Map(taskCounts.map((t) => [t.projectId, t.n]));

  const overdue = openInvoices.filter(({ i }) => invoiceDisplayStatus(i, today) === "ueberfaellig");
  const openSum = openInvoices.reduce((a, { i }) => a + openAmount(i), 0);
  const overdueSum = overdue.reduce((a, { i }) => a + openAmount(i), 0);
  const r30 = renewals.filter(({ s }) => s.nextBillingDate <= in30);
  const r60 = renewals.filter(({ s }) => s.nextBillingDate > in30);
  const sumOf = (rows: typeof renewals) => rows.reduce((a, { s }) => a + s.amount, 0);

  return (
    <>
      <PageHeader
        title="Übersicht"
        sub={new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        actions={
          <>
            <LinkButton href="/admin/anfragen/neu" variant="ghost" icon="plus">
              Lead
            </LinkButton>
            <LinkButton href="/admin/projekte/neu" variant="ghost" icon="plus">
              Projekt
            </LinkButton>
            <LinkButton href="/admin/offerten/neu" icon="plus">
              Offerte
            </LinkButton>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Umsatz diesen Monat" value={`CHF ${chf0(monthRev)}`} sub={`Eingang CHF ${chf0(monthIn)}`} href="/admin/auswertung" />
        <Stat label={`Umsatz ${today.slice(0, 4)}`} value={`CHF ${chf0(yearRev)}`} sub={`Eingang CHF ${chf0(yearIn)} · Ausgaben CHF ${chf0(yearExp)}`} href="/admin/auswertung" />
        <Stat label="Offene Rechnungen" value={`CHF ${chf0(openSum)}`} sub={`${openInvoices.length} offen`} href="/admin/rechnungen?status=offen" />
        <Stat
          label="Überfällig"
          value={`CHF ${chf0(overdueSum)}`}
          sub={overdue.length ? `${overdue.length} Rechnung${overdue.length === 1 ? "" : "en"}` : "Alles im Plan"}
          tone={overdue.length ? "warn" : undefined}
          href="/admin/rechnungen?status=ueberfaellig"
        />
      </div>

      {due.rows.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3">
          <Icon name="repeat" className="h-5 w-5 text-accent" />
          <p className="flex-1 text-[14px]">
            <span className="font-semibold">{due.rows.length} Abo{due.rows.length === 1 ? "" : "s"}</span> bis {fmtDate(due.horizon)} fällig, total CHF {chf(due.rows.reduce((a, s) => a + s.amount, 0))} exkl. MWST.
          </p>
          <form action={billDueSubscriptionsAction}>
            <button className={btn.dark}>Fällige Abos verrechnen</button>
          </form>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card
            title="Pipeline"
            actions={
              <Link href="/admin/pipeline" className="text-[13px] font-medium text-accent">
                Kanban öffnen
              </Link>
            }
          >
            <p className="mb-3 text-[13px] text-muted">
              {pipelineCount} offene Leads{pipelineValue > 0 ? ` · geschätzter Wert CHF ${chf0(pipelineValue)}` : ""}
            </p>
            <ul className="space-y-2">
              {leadStatuses.map((st) => {
                const row = stageMap.get(st);
                const n = row?.n ?? 0;
                return (
                  <li key={st}>
                    <Link href={`/admin/anfragen?status=${st}`} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-[13.5px] hover:text-accent">
                      <span>{leadStageLabels[st]}</span>
                      <span className="h-2.5 overflow-hidden rounded-full bg-bg">
                        <span className={`block h-full rounded-full ${stageBar[st]}`} style={{ width: `${(n / pipelineMax) * 100}%` }} />
                      </span>
                      <span className="text-right font-medium tabular-nums">{n}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card
            title={`Aktive Projekte (${activeProjects.length})`}
            padded={false}
            actions={
              <Link href="/admin/projekte" className="text-[13px] font-medium text-accent">
                Alle Projekte
              </Link>
            }
          >
            {activeProjects.length === 0 ? (
              <div className="p-5">
                <Empty>Keine aktiven Projekte.</Empty>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {activeProjects.map(({ p, c }) => {
                  const t = taskByProject.get(p.id);
                  const late = t?.dueDate && t.dueDate < today;
                  return (
                    <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 sm:px-5">
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/projekte/${p.id}`} className="font-medium hover:text-accent">
                          {p.name}
                        </Link>
                        <p className="truncate text-[12.5px] text-muted">
                          {customerName(c)}
                          {p.dueDate ? ` · Termin ${fmtDate(p.dueDate)}` : ""}
                        </p>
                      </div>
                      <div className="min-w-0 basis-full text-[13px] sm:basis-[44%]">
                        {t ? (
                          <p className="truncate">
                            <span className="text-muted">Nächste Aufgabe: </span>
                            {t.milestone && <Icon name="flag" className="mr-1 inline h-3.5 w-3.5 text-accent" />}
                            {t.title}
                            {t.dueDate && <span className={late ? " font-medium text-danger" : " text-muted"}> · {fmtDate(t.dueDate)}</span>}
                          </p>
                        ) : (
                          <p className="text-muted">Keine offenen Aufgaben</p>
                        )}
                        <p className="text-[12px] text-muted">{openTaskCount.get(p.id) ?? 0} offene Aufgaben</p>
                      </div>
                      <Badge status={p.status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card
            title={`Offene Rechnungen (${openInvoices.length})`}
            padded={false}
            actions={
              <Link href="/admin/rechnungen?status=offen" className="text-[13px] font-medium text-accent">
                Alle offenen
              </Link>
            }
          >
            {openInvoices.length === 0 ? (
              <div className="p-5">
                <Empty>Keine offenen Rechnungen.</Empty>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {openInvoices.slice(0, 8).map(({ i, c }) => (
                  <li key={i.id} className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] sm:px-5">
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/rechnungen/${i.id}`} className="font-medium hover:text-accent">
                        {i.number}
                      </Link>
                      <span className="ml-2 text-muted">{customerName(c)}</span>
                      <p className={`text-[12px] ${invoiceDisplayStatus(i, today) === "ueberfaellig" ? "text-danger" : "text-muted"}`}>
                        fällig {fmtDate(i.dueDate)}
                        {i.reminderLevel > 0 ? ` · ${i.reminderLevel}. Mahnung` : ""}
                      </p>
                    </div>
                    <span className="tabular-nums">CHF {chf(openAmount(i))}</span>
                    <InvoiceBadge inv={i} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title={`Follow-ups fällig (${followUps.length})`} padded={false}>
            {followUps.length === 0 ? (
              <p className="px-4 py-4 text-[13.5px] text-muted sm:px-5">Heute nichts nachzufassen.</p>
            ) : (
              <ul className="divide-y divide-line">
                {followUps.map((l) => (
                  <li key={l.id} className="px-4 py-3 sm:px-5">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/anfragen/${l.id}`} className="font-medium hover:text-accent">
                          {l.company || l.name}
                        </Link>
                        <p className={`text-[12.5px] ${l.followUpAt! < today ? "text-danger" : "text-muted"}`}>
                          {l.followUpAt === today ? "heute" : `seit ${fmtDate(l.followUpAt)}`} · {leadStageLabels[l.status]}
                        </p>
                      </div>
                      {l.phone && (
                        <a href={`tel:${l.phone}`} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-bg hover:text-ink" aria-label="Anrufen">
                          <Icon name="phone" className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      {[1, 3, 7].map((n) => (
                        <form key={n} action={snoozeFollowUpAction.bind(null, l.id, n)}>
                          <button className={btnSm.ghost}>+{n} T.</button>
                        </form>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card
            title="Verlängerungen"
            padded={false}
            actions={
              <Link href="/admin/abos" className="text-[13px] font-medium text-accent">
                Alle Abos
              </Link>
            }
          >
            {[
              ["Nächste 30 Tage", r30],
              ["31 bis 60 Tage", r60],
            ].map(([title, rows]) => {
              const list = rows as typeof renewals;
              return (
                <div key={title as string} className="border-b border-line last:border-b-0">
                  <p className="flex items-center justify-between bg-bg/60 px-4 py-2 text-[12px] font-medium uppercase tracking-wider text-muted sm:px-5">
                    <span>{title as string}</span>
                    <span className="tabular-nums normal-case tracking-normal">CHF {chf(sumOf(list))}</span>
                  </p>
                  {list.length === 0 ? (
                    <p className="px-4 py-3 text-[13px] text-muted sm:px-5">Keine.</p>
                  ) : (
                    <ul className="divide-y divide-line">
                      {list.map(({ s, c }) => (
                        <li key={s.id} className="flex items-center gap-2 px-4 py-2.5 text-[13px] sm:px-5">
                          <div className="min-w-0 flex-1">
                            <Link href={`/admin/abos/${s.id}`} className="font-medium hover:text-accent">
                              {s.title}
                            </Link>
                            <p className="truncate text-[12px] text-muted">{customerName(c)}</p>
                          </div>
                          <div className="text-right">
                            <p className={s.nextBillingDate <= today ? "font-medium text-danger" : ""}>{fmtDate(s.nextBillingDate)}</p>
                            <p className="text-[12px] tabular-nums text-muted">
                              {chf(s.amount)} / {intervalUnit[s.interval]}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </Card>

          <Card title="Nicht verrechnete Stunden">
            <p className="text-[22px] font-semibold tabular-nums">{fmtHours(unbilled[0].hours)} h</p>
            <p className="text-[13px] text-muted">Wert CHF {chf(unbilled[0].value)} exkl. MWST</p>
            <Link href="/admin/zeit?status=offen" className="mt-2 inline-block text-[13px] font-medium text-accent">
              Zur Zeiterfassung
            </Link>
          </Card>

          <Card title="Letzte Aktivitäten" padded={false}>
            {recent.length === 0 ? (
              <p className="px-4 py-4 text-[13.5px] text-muted sm:px-5">Keine Aktivitäten in den letzten 14 Tagen.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((a) => {
                  const href = a.projectId ? `/admin/projekte/${a.projectId}` : a.leadId ? `/admin/anfragen/${a.leadId}` : a.customerId ? `/admin/kunden/${a.customerId}` : null;
                  return (
                    <li key={a.id} className="px-4 py-2.5 text-[13px] sm:px-5">
                      <p className="text-[11.5px] text-muted">
                        {fmtDateTime(a.occurredAt)} · {activityTypeLabels[a.type]}
                      </p>
                      {href ? (
                        <Link href={href} className="line-clamp-2 hover:text-accent">
                          {a.body}
                        </Link>
                      ) : (
                        <p className="line-clamp-2">{a.body}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

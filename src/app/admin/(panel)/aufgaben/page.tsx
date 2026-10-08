import { PendingButton } from "@/components/admin/feedback";
import { and, asc, eq, ne, sql } from "drizzle-orm";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { Card, Empty, FilterChips, PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { toggleTaskAction } from "@/lib/admin/project-actions";
import { addDaysIso, fmtDate, todayIso } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";

export const metadata = { title: "Aufgaben" };

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ zeitraum?: string }> }) {
  const { zeitraum } = await searchParams;
  const today = todayIso();
  const t = schema.projectTasks;
  const rows = await db()
    .select({ t, p: schema.projects, c: schema.customers })
    .from(t)
    .innerJoin(schema.projects, eq(schema.projects.id, t.projectId))
    .innerJoin(schema.customers, eq(schema.customers.id, schema.projects.customerId))
    .where(and(eq(t.done, false), ne(schema.projects.status, "abgeschlossen")))
    .orderBy(sql`${t.dueDate} asc nulls last`, asc(t.sortOrder))
    .limit(500);
  const week = addDaysIso(today, 7);
  const groups: [string, typeof rows][] = [
    ["Überfällig", rows.filter((r) => r.t.dueDate && r.t.dueDate < today)],
    ["Heute", rows.filter((r) => r.t.dueDate === today)],
    ["Nächste 7 Tage", rows.filter((r) => r.t.dueDate && r.t.dueDate > today && r.t.dueDate <= week)],
    ["Später", rows.filter((r) => r.t.dueDate && r.t.dueDate > week)],
    ["Ohne Termin", rows.filter((r) => !r.t.dueDate)],
  ];
  const visible = zeitraum === "woche" ? groups.slice(0, 3) : groups;
  return (
    <>
      <PageHeader
        eyebrow="Projekte" title="Aufgaben" sub="Alle offenen Aufgaben aus laufenden Projekten" />
      <div className="mb-4">
        <FilterChips active={zeitraum} href={(v) => (v ? `/admin/aufgaben?zeitraum=${v}` : "/admin/aufgaben")} items={[[undefined, "Alle", rows.length], ["woche", "Bis in 7 Tagen"]]} />
      </div>
      {rows.length === 0 ? (
        <Empty icon="checkSquare">Keine offenen Aufgaben. Alles erledigt.</Empty>
      ) : (
        <div className="space-y-5">
          {visible
            .filter(([, list]) => list.length)
            .map(([title, list]) => (
              <Card key={title} title={`${title} (${list.length})`}>
                <ul className="-my-1 divide-y divide-line">
                  {list.map(({ t, p, c }) => (
                    <li key={t.id} className="flex items-center gap-3 py-2">
                      <form action={toggleTaskAction.bind(null, t.id)}>
                        <PendingButton className="grid h-6 w-6 place-items-center rounded-md border border-line hover:border-accent" aria-label="Erledigt">
                          <span className="sr-only">Erledigt</span>
                        </PendingButton>
                      </form>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[14px] ${t.milestone ? "font-semibold" : ""}`}>
                          {t.milestone && <Icon name="flag" className="mr-1.5 inline h-3.5 w-3.5 text-accent" />}
                          {t.title}
                        </p>
                        <p className="truncate text-[12px] text-muted">
                          <Link href={`/admin/projekte/${p.id}`} className="hover:text-accent">
                            {p.name}
                          </Link>{" "}
                          · {customerName(c)}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[13px] tabular-nums ${t.dueDate && t.dueDate < today ? "font-medium text-danger" : "text-muted"}`}>{fmtDate(t.dueDate)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
        </div>
      )}
    </>
  );
}

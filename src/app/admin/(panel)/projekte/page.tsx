import { and, eq, ilike, ne, or, sql } from "drizzle-orm";
import Link from "next/link";
import { Bar, Badge, Empty, FilterChips, LinkButton, PageHeader, Table, qs, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { projectStatuses, type ProjectStatus } from "@/db/schema";
import { projectStatusLabels } from "@/lib/admin/labels";
import { chf0, fmtDate, fmtHours, todayIso } from "@/lib/admin/money";
import { customerName } from "@/lib/admin/queries";

export const metadata = { title: "Projekte" };

type SP = { status?: string; q?: string; sort?: string; dir?: string; ansicht?: string };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const status = projectStatuses.includes(sp.status as ProjectStatus) ? (sp.status as ProjectStatus) : sp.status === "alle" ? "alle" : undefined;
  const p = schema.projects;
  const c = schema.customers;
  const term = sp.q?.trim();
  const tasksTotal = sql<number>`(select count(*)::int from project_tasks t where t.project_id = ${p.id})`;
  const tasksDone = sql<number>`(select count(*)::int from project_tasks t where t.project_id = ${p.id} and t.done)`;
  const nextTask = sql<string | null>`(select t.title || '|' || coalesce(t.due_date::text,'') from project_tasks t where t.project_id = ${p.id} and not t.done order by t.due_date asc nulls last, t.sort_order limit 1)`;
  const hours = sql<number>`(select coalesce(sum(e.hours),0)::float from time_entries e where e.project_id = ${p.id})`;
  const unbilled = sql<number>`(select coalesce(sum(e.hours * e.rate),0)::float from time_entries e where e.project_id = ${p.id} and e.billable and e.invoice_id is null)`;
  const sortCols: Record<string, ReturnType<typeof sql>> = {
    name: sql`lower(${p.name})`,
    kunde: sql`lower(coalesce(${c.company}, ${c.lastName}))`,
    status: sql`array_position(array['planung','design','entwicklung','review','live','abgeschlossen'], ${p.status}::text)`,
    termin: sql`${p.dueDate}`,
    stunden: hours,
    aktualisiert: sql`${p.updatedAt}`,
  };
  const sortKey = sp.sort && sortCols[sp.sort] ? sp.sort : "aktualisiert";
  const dir = sp.dir === "asc" ? "asc" : sp.dir === "desc" ? "desc" : sortKey === "aktualisiert" ? "desc" : "asc";
  const [rows, counts] = await Promise.all([
    db()
      .select({ p, c, tasksTotal, tasksDone, nextTask, hours, unbilled })
      .from(p)
      .innerJoin(c, eq(c.id, p.customerId))
      .where(
        and(
          status === "alle" ? undefined : status ? eq(p.status, status) : ne(p.status, "abgeschlossen"),
          term ? or(ilike(p.name, `%${term}%`), ilike(c.company, `%${term}%`), ilike(c.lastName, `%${term}%`)) : undefined,
        ),
      )
      .orderBy(dir === "asc" ? sql`${sortCols[sortKey]} asc nulls last` : sql`${sortCols[sortKey]} desc nulls last`)
      .limit(500),
    db().select({ s: p.status, n: sql<number>`count(*)::int` }).from(p).groupBy(p.status),
  ]);
  const n = (s: string) => counts.find((x) => x.s === s)?.n ?? 0;
  const today = todayIso();
  const base = "/admin/projekte";
  const params = { status: sp.status, q: term, sort: sp.sort, dir: sp.dir, ansicht: sp.ansicht };
  const board = sp.ansicht === "board";

  return (
    <>
      <PageHeader
        title="Projekte"
        sub="Von der Planung bis zum Go-live"
        actions={
          <>
            <LinkButton href={qs(base, params, { ansicht: board ? undefined : "board" })} variant="ghost" icon={board ? "list" : "kanban"}>
              {board ? "Liste" : "Board"}
            </LinkButton>
            <LinkButton href="/admin/projekte/neu" icon="plus">
              Neues Projekt
            </LinkButton>
          </>
        }
      />
      <div className="mb-4 flex flex-col gap-3">
        <FilterChips
          active={status}
          href={(v) => qs(base, params, { status: v })}
          items={[
            [undefined, "Aktiv", counts.filter((x) => x.s !== "abgeschlossen").reduce((a, x) => a + x.n, 0)],
            ...projectStatuses.map((s) => [s, projectStatusLabels[s], n(s)] as [string, string, number]),
            ["alle", "Alle"],
          ]}
        />
        <form>
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
          {board && <input type="hidden" name="ansicht" value="board" />}
          <input name="q" defaultValue={term} placeholder="Projekt oder Kunde suchen …" className="input max-w-md" />
        </form>
      </div>
      {rows.length === 0 ? (
        <Empty action={<LinkButton href="/admin/projekte/neu" icon="plus">Projekt anlegen</LinkButton>}>Keine Projekte gefunden.</Empty>
      ) : board ? (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="grid min-w-[1000px] grid-cols-6 gap-3">
            {projectStatuses.map((s) => (
              <section key={s} className="rounded-2xl border border-line bg-bg/70 p-2">
                <h2 className="px-2 pb-2 pt-1 text-[13px] font-semibold">
                  {projectStatusLabels[s]} <span className="font-normal text-muted">{rows.filter((r) => r.p.status === s).length}</span>
                </h2>
                <div className="space-y-2">
                  {rows
                    .filter((r) => r.p.status === s)
                    .map((r) => (
                      <Link key={r.p.id} href={`/admin/projekte/${r.p.id}`} className="block rounded-xl border border-line bg-surface p-3 hover:border-accent/50">
                        <p className="text-[14px] font-medium leading-snug">{r.p.name}</p>
                        <p className="truncate text-[12px] text-muted">{customerName(r.c)}</p>
                        {r.tasksTotal > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <Bar value={r.tasksDone} max={r.tasksTotal} />
                            <span className="text-[11px] tabular-nums text-muted">
                              {r.tasksDone}/{r.tasksTotal}
                            </span>
                          </div>
                        )}
                      </Link>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <Table
          minWidth={980}
          sort={{ key: sortKey, dir }}
          href={(k, d) => qs(base, params, { sort: k, dir: d })}
          head={[
            { label: "Projekt", key: "name" },
            { label: "Kunde", key: "kunde" },
            { label: "Status", key: "status" },
            { label: "Fortschritt" },
            { label: "Nächste Aufgabe" },
            { label: "Termin", key: "termin" },
            { label: "Stunden", key: "stunden", align: "right" },
            { label: "Unverrechnet", align: "right" },
          ]}
        >
          {rows.map((r) => {
            const [taskTitle, taskDue] = (r.nextTask ?? "").split("|");
            const late = r.p.dueDate && r.p.dueDate < today && r.p.status !== "live" && r.p.status !== "abgeschlossen";
            return (
              <tr key={r.p.id} className="hover:bg-bg/60">
                <td className={td}>
                  <Link href={`/admin/projekte/${r.p.id}`} className="font-medium hover:text-accent">
                    {r.p.name}
                  </Link>
                </td>
                <td className={td}>
                  <Link href={`/admin/kunden/${r.c.id}`} className="text-ink-soft hover:text-accent">
                    {customerName(r.c)}
                  </Link>
                </td>
                <td className={td}>
                  <Badge status={r.p.status} label={projectStatusLabels[r.p.status]} />
                </td>
                <td className={`${td} w-[140px]`}>
                  {r.tasksTotal > 0 ? (
                    <div className="flex items-center gap-2">
                      <Bar value={r.tasksDone} max={r.tasksTotal} />
                      <span className="text-[12px] tabular-nums text-muted">
                        {r.tasksDone}/{r.tasksTotal}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted">–</span>
                  )}
                </td>
                <td className={`${td} max-w-[220px]`}>
                  {taskTitle ? (
                    <>
                      <p className="truncate">{taskTitle}</p>
                      {taskDue && <p className={`text-[12px] ${taskDue < today ? "text-danger" : "text-muted"}`}>{fmtDate(taskDue)}</p>}
                    </>
                  ) : (
                    <span className="text-muted">–</span>
                  )}
                </td>
                <td className={`${td} whitespace-nowrap ${late ? "font-medium text-danger" : "text-muted"}`}>{fmtDate(r.p.dueDate)}</td>
                <td className={tdNum}>{r.hours ? fmtHours(r.hours) : "–"}</td>
                <td className={tdNum}>{r.unbilled > 0 ? `CHF ${chf0(r.unbilled)}` : "–"}</td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}

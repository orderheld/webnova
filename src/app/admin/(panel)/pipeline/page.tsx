import { and, desc, gte, inArray, lte, notInArray, or, sql } from "drizzle-orm";
import Link from "next/link";
import { LeadKanban } from "@/components/admin/kanban";
import { Card, LinkButton, PageHeader, Stat } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { leadStatuses } from "@/db/schema";
import { chf0, fmtDate, todayIso, addDaysIso } from "@/lib/admin/money";
import { label } from "@/lib/leads/options";

export const metadata = { title: "Pipeline" };

export default async function PipelinePage({ searchParams }: { searchParams: Promise<{ alle?: string }> }) {
  const { alle } = await searchParams;
  const l = schema.leads;
  const today = todayIso();
  const since = addDaysIso(today, -90);
  // closed deals only from the last 90 days, unless "alle"
  const [rows, due, [{ n: inOfferCount }]] = await Promise.all([
    db()
      .select()
      .from(l)
      .where(alle ? undefined : or(notInArray(l.status, ["gewonnen", "verloren"]), gte(l.updatedAt, new Date(`${since}T00:00:00Z`))))
      .orderBy(sql`${l.followUpAt} asc nulls last`, desc(l.createdAt))
      .limit(600),
    db()
      .select()
      .from(l)
      .where(and(lte(l.followUpAt, today), notInArray(l.status, ["gewonnen", "verloren"])))
      .orderBy(l.followUpAt)
      .limit(20),
    db().select({ n: sql<number>`count(*)::int` }).from(l).where(inArray(l.status, ["offerte"])),
  ]);
  const open = rows.filter((r) => !["gewonnen", "verloren"].includes(r.status));
  const pipelineValue = open.reduce((a, r) => a + (r.value ?? 0), 0);
  const won = rows.filter((r) => r.status === "gewonnen");
  const lost = rows.filter((r) => r.status === "verloren");
  const rate = won.length + lost.length > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : null;
  const inOffer = [{ n: inOfferCount }];

  return (
    <>
      <PageHeader
        eyebrow="Verkauf"
        title="Pipeline"
        sub="Leads per Drag & Drop durch die Phasen ziehen"
        actions={
          <>
            <LinkButton href={alle ? "/admin/pipeline" : "/admin/pipeline?alle=1"} variant="ghost">
              {alle ? "Nur aktuelle" : "Alle abgeschlossenen zeigen"}
            </LinkButton>
            <LinkButton href="/admin/anfragen" variant="ghost" icon="list">
              Liste
            </LinkButton>
            <LinkButton href="/admin/anfragen/neu" icon="plus">
              Neuer Lead
            </LinkButton>
          </>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Offene Leads" value={String(open.length)} icon="inbox" />
        <Stat label="Pipeline-Potenzial" value={`CHF ${chf0(pipelineValue)}`} icon="chart" />
        <Stat label="In Offertphase" value={String(inOffer[0].n)} icon="file" />
        <Stat label="Abschlussquote (90 Tage)" value={rate === null ? "–" : `${rate} %`} sub={`${won.length} gewonnen, ${lost.length} verloren`} />
      </div>
      {due.length > 0 && (
        <Card title={`Follow-ups fällig (${due.length})`} className="mb-5">
          <ul className="flex flex-wrap gap-2">
            {due.map((d) => (
              <li key={d.id}>
                <Link href={`/admin/anfragen/${d.id}`} className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-3 py-1 text-[13px] font-medium text-danger ring-1 ring-inset ring-danger/20 transition-colors hover:ring-danger/40">
                  {d.company || d.name} <span className="font-normal opacity-80">{fmtDate(d.followUpAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <LeadKanban
        stages={leadStatuses}
        today={today}
        cards={rows.map((r) => ({
          id: r.id,
          title: r.company || r.name,
          sub: [r.company ? r.name : null, r.city, r.services.length ? r.services.map((s) => label("services", s)).join(", ") : r.industry].filter(Boolean).join(" · "),
          status: r.status,
          value: r.value,
          followUpAt: r.followUpAt,
          rating: r.websiteRating,
          source: r.source,
        }))}
      />
    </>
  );
}

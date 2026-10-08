import { and, desc, eq, ilike, lte, notInArray, or, sql, type SQL } from "drizzle-orm";
import Link from "next/link";
import { Badge, Empty, FilterChips, LinkButton, PageHeader, Stars, Table, qs, td, tdNum } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { leadStatuses, type LeadStatus } from "@/db/schema";
import { leadSourceLabels, leadStageLabels } from "@/lib/admin/labels";
import { chf0, fmtDate, todayIso } from "@/lib/admin/money";
import { label } from "@/lib/leads/options";

export const metadata = { title: "Leads & Anfragen" };

type SP = { status?: string; q?: string; quelle?: string; sort?: string; dir?: string; faellig?: string };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filter = leadStatuses.includes(sp.status as LeadStatus) ? (sp.status as LeadStatus) : undefined;
  const l = schema.leads;
  const today = todayIso();
  const term = sp.q?.trim();
  const conds: (SQL | undefined)[] = [
    filter ? eq(l.status, filter) : undefined,
    sp.quelle === "web" ? eq(l.source, "anfrage") : sp.quelle === "manuell" ? sql`${l.source} <> 'anfrage'` : undefined,
    sp.faellig ? and(lte(l.followUpAt, today), notInArray(l.status, ["gewonnen", "verloren"])) : undefined,
    term
      ? or(ilike(l.name, `%${term}%`), ilike(l.company, `%${term}%`), ilike(l.email, `%${term}%`), ilike(l.city, `%${term}%`), ilike(l.industry, `%${term}%`), ilike(l.phone, `%${term}%`))
      : undefined,
  ];
  const sortCols = { erstellt: l.createdAt, name: sql`lower(coalesce(${l.company}, ${l.name}))`, wert: l.value, followup: l.followUpAt, bewertung: l.websiteRating, phase: l.status };
  const sortKey = (sp.sort ?? "erstellt") as keyof typeof sortCols;
  const col = sortCols[sortKey] ?? l.createdAt;
  const dir = sp.dir === "asc" ? "asc" : sp.dir === "desc" ? "desc" : sortKey === "erstellt" ? "desc" : "asc";
  const [rows, counts] = await Promise.all([
    db()
      .select()
      .from(l)
      .where(and(...conds))
      .orderBy(dir === "asc" ? sql`${col} asc nulls last` : sql`${col} desc nulls last`, desc(l.id))
      .limit(500),
    db().select({ s: l.status, n: sql<number>`count(*)::int` }).from(l).groupBy(l.status),
  ]);
  const count = (s: string) => counts.find((c) => c.s === s)?.n ?? 0;
  const base = "/admin/anfragen";
  const params = { status: filter, q: term, quelle: sp.quelle, sort: sp.sort, dir: sp.dir, faellig: sp.faellig };

  return (
    <>
      <PageHeader
        title="Leads & Anfragen"
        sub="Anfragen aus dem Webformular und eigene Akquise an einem Ort"
        actions={
          <>
            <LinkButton href="/admin/pipeline" variant="ghost" icon="kanban">
              Pipeline
            </LinkButton>
            <LinkButton href="/admin/anfragen/neu" icon="plus">
              Neuer Lead
            </LinkButton>
          </>
        }
      />
      <div className="mb-4 flex flex-col gap-3">
        <FilterChips
          active={filter}
          href={(v) => qs(base, params, { status: v })}
          items={[[undefined, "Alle", counts.reduce((a, c) => a + c.n, 0)], ...leadStatuses.map((s) => [s, leadStageLabels[s], count(s)] as [string, string, number])]}
        />
        <form className="flex flex-wrap items-center gap-2">
          <input name="q" defaultValue={term} placeholder="Suchen: Firma, Name, Ort, Branche …" className="input max-w-sm flex-1" />
          <select name="quelle" defaultValue={sp.quelle ?? ""} className="input w-auto">
            <option value="">Alle Quellen</option>
            <option value="web">Webformular</option>
            <option value="manuell">Eigene Akquise / manuell</option>
          </select>
          <label className="flex items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" name="faellig" value="1" defaultChecked={!!sp.faellig} className="h-4 w-4" /> Follow-up fällig
          </label>
          {filter && <input type="hidden" name="status" value={filter} />}
          <button className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] hover:border-accent">Filtern</button>
        </form>
      </div>
      {rows.length === 0 ? (
        <Empty action={<LinkButton href="/admin/anfragen/neu" icon="plus">Lead erfassen</LinkButton>}>Keine Leads gefunden.</Empty>
      ) : (
        <Table
          minWidth={920}
          sort={{ key: sortKey, dir }}
          href={(k, d) => qs(base, params, { sort: k, dir: d })}
          head={[
            { label: "Kontakt", key: "name" },
            { label: "Quelle" },
            { label: "Interesse / Branche" },
            { label: "Webseite", key: "bewertung" },
            { label: "Potenzial", key: "wert", align: "right" },
            { label: "Follow-up", key: "followup" },
            { label: "Phase", key: "phase" },
            { label: "Erfasst", key: "erstellt" },
          ]}
        >
          {rows.map((r) => {
            const due = r.followUpAt && r.followUpAt <= today && r.status !== "gewonnen" && r.status !== "verloren";
            return (
              <tr key={r.id} className="hover:bg-bg/60">
                <td className={td}>
                  <Link href={`/admin/anfragen/${r.id}`} className="font-medium hover:text-accent">
                    {r.company || r.name}
                  </Link>
                  <p className="text-[12px] text-muted">{[r.company ? r.name : r.email, r.city].filter(Boolean).join(" · ")}</p>
                </td>
                <td className={`${td} text-ink-soft`}>{leadSourceLabels[r.source] ?? r.source}</td>
                <td className={`${td} max-w-[220px] truncate text-ink-soft`}>
                  {r.services.length ? r.services.map((s) => label("services", s)).join(", ") : r.industry || "–"}
                </td>
                <td className={td}>
                  <Stars value={r.websiteRating} />
                </td>
                <td className={tdNum}>{r.value ? chf0(r.value) : "–"}</td>
                <td className={`${td} whitespace-nowrap ${due ? "font-medium text-danger" : "text-muted"}`}>{fmtDate(r.followUpAt)}</td>
                <td className={td}>
                  <Badge status={r.status} label={leadStageLabels[r.status]} />
                </td>
                <td className={`${td} whitespace-nowrap text-muted`}>{fmtDate(r.createdAt)}</td>
              </tr>
            );
          })}
        </Table>
      )}
      <p className="mt-3 text-[12.5px] text-muted">{rows.length} Einträge</p>
    </>
  );
}

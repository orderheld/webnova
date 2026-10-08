import "server-only";
import { sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { manualLeadSources } from "./labels";

/* Visitor statistics of the public site (table page_views, filled by src/app/api/p). */

export const visitorRanges = [
  ["heute", "Heute"],
  ["gestern", "Gestern"],
  ["7", "7 Tage"],
  ["30", "30 Tage"],
] as const;
export type VisitorRange = (typeof visitorRanges)[number][0];
export const isVisitorRange = (v: unknown): v is VisitorRange => visitorRanges.some(([k]) => k === v);
export const rangeLabel = (r: VisitorRange) => visitorRanges.find(([k]) => k === r)![1];

/** Minutes without a page view after which a visitor no longer counts as live. */
export const LIVE_MINUTES = 5;

/** Midnight in Zurich, `daysAgo` days back, as a timestamptz expression. */
const dayStart = (daysAgo: number) =>
  sql.raw(`((date_trunc('day', now() at time zone 'Europe/Zurich') - interval '${Math.trunc(daysAgo)} days') at time zone 'Europe/Zurich')`);

function rangeFilter(range: VisitorRange): SQL {
  if (range === "gestern") return sql`created_at >= ${dayStart(1)} and created_at < ${dayStart(0)}`;
  return sql`created_at >= ${dayStart(range === "7" ? 6 : range === "30" ? 29 : 0)}`;
}

/** Visitors live now and today, for the sidebar and the dashboard. */
export async function visitorPulse() {
  const res = await db().execute<{ live: number; today: number }>(sql`
    select (count(distinct visitor) filter (where created_at > now() - make_interval(mins => ${LIVE_MINUTES})))::int as live,
      count(distinct visitor)::int as today
    from page_views where created_at >= ${dayStart(0)}`);
  return res.rows[0] ?? { live: 0, today: 0 };
}

export type LiveVisitor = {
  path: string;
  device: string;
  country: string | null;
  region: string | null;
  lastSeen: Date;
  firstSeen: Date;
  views: number;
  source: string | null;
};

/** Visitors with a page view in the last minutes: current page, pages and source of the day. */
export async function liveVisitors(): Promise<LiveVisitor[]> {
  // raw queries return timestamps as text, so times come back as epoch milliseconds
  const res = await db().execute<Omit<LiveVisitor, "lastSeen" | "firstSeen"> & { lastSeen: number; firstSeen: number }>(sql`
    with live as (
      select distinct on (visitor) visitor, path, device, country, region, created_at
      from page_views where created_at > now() - make_interval(mins => ${LIVE_MINUTES})
      order by visitor, created_at desc
    )
    select l.path, l.device, l.country, l.region, s.views, s.source,
      (extract(epoch from l.created_at) * 1000)::float8 as "lastSeen", (extract(epoch from s.first_seen) * 1000)::float8 as "firstSeen"
    from live l
    cross join lateral (
      select min(created_at) as first_seen, count(*)::int as views,
        (array_agg(source order by created_at) filter (where source is not null))[1] as source
      from page_views p where p.visitor = l.visitor and p.created_at > now() - interval '1 day'
    ) s
    order by l.created_at desc
    limit 50`);
  return res.rows.map((r) => ({ ...r, lastSeen: new Date(r.lastSeen), firstSeen: new Date(r.firstSeen) }));
}

export interface VisitorReport {
  visitors: number;
  views: number;
  leads: number;
  /** visitors and views per hour (today, yesterday) or per day, keyed "0".."23" or "YYYY-MM-DD" */
  series: Map<string, { visitors: number; views: number }>;
  pages: { path: string; views: number; visitors: number }[];
  sources: { source: string | null; visitors: number }[];
  devices: { device: string; visitors: number }[];
  countries: { country: string | null; visitors: number }[];
  cantons: { region: string | null; visitors: number }[];
  /** page views per language ("de", "fr") */
  languages: { lang: string; views: number }[];
  /** first page view ever counted */
  since: Date | null;
}

export async function visitorReport(range: VisitorRange): Promise<VisitorReport> {
  const d = db();
  const w = rangeFilter(range);
  const bucket =
    range === "heute" || range === "gestern"
      ? sql`extract(hour from created_at at time zone 'Europe/Zurich')::int::text`
      : sql`to_char(created_at at time zone 'Europe/Zurich', 'YYYY-MM-DD')`;
  const manual = sql.join(
    manualLeadSources.map((s) => sql`${s}`),
    sql`, `,
  );
  const [totals, series, pages, sources, devices, countries, cantons, languages, leads, since] = await Promise.all([
    d.execute<{ views: number; visitors: number }>(sql`select count(*)::int as views, count(distinct visitor)::int as visitors from page_views where ${w}`),
    d.execute<{ k: string; visitors: number; views: number }>(
      sql`select ${bucket} as k, count(distinct visitor)::int as visitors, count(*)::int as views from page_views where ${w} group by 1`,
    ),
    d.execute<{ path: string; views: number; visitors: number }>(
      sql`select path, count(*)::int as views, count(distinct visitor)::int as visitors from page_views where ${w} group by path order by views desc, path limit 12`,
    ),
    // each visitor once, with the first source they came from in the range
    d.execute<{ source: string | null; visitors: number }>(sql`
      select source, count(*)::int as visitors from (
        select (array_agg(source order by created_at) filter (where source is not null))[1] as source
        from page_views where ${w} group by visitor
      ) f group by source order by visitors desc limit 40`),
    d.execute<{ device: string; visitors: number }>(
      sql`select device, count(distinct visitor)::int as visitors from page_views where ${w} group by device order by visitors desc`,
    ),
    d.execute<{ country: string | null; visitors: number }>(
      sql`select country, count(distinct visitor)::int as visitors from page_views where ${w} group by country order by visitors desc limit 8`,
    ),
    d.execute<{ region: string | null; visitors: number }>(
      sql`select region, count(distinct visitor)::int as visitors from page_views where ${w} and country = 'CH' group by region order by visitors desc limit 8`,
    ),
    d.execute<{ lang: string; views: number }>(
      sql`select split_part(path, '/', 2) as lang, count(*)::int as views from page_views where ${w} group by 1 order by views desc`,
    ),
    // requests that came in through the website forms (manually entered leads left out)
    d.execute<{ n: number }>(sql`select count(*)::int as n from leads where ${w} and source not in (${manual})`),
    d.execute<{ since: number | null }>(sql`select (extract(epoch from min(created_at)) * 1000)::float8 as since from page_views`),
  ]);
  return {
    visitors: totals.rows[0]?.visitors ?? 0,
    views: totals.rows[0]?.views ?? 0,
    leads: leads.rows[0]?.n ?? 0,
    series: new Map(series.rows.map((r) => [r.k, { visitors: r.visitors, views: r.views }])),
    pages: pages.rows,
    sources: sources.rows,
    devices: devices.rows,
    countries: countries.rows,
    cantons: cantons.rows,
    languages: languages.rows,
    since: since.rows[0]?.since ? new Date(since.rows[0].since) : null,
  };
}

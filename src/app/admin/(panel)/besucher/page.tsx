import { AutoRefresh } from "@/components/admin/auto-refresh";
import { ColumnChart, type BarDatum } from "@/components/admin/charts";
import { Icon } from "@/components/admin/icons";
import { Card, FilterChips, PageHeader, Stat } from "@/components/admin/ui";
import { addDaysIso, fmtDate, todayIso, zurichHour } from "@/lib/admin/money";
import { cantonName, countryName, deviceIcons, deviceLabels, groupSources, pageLabel, placeLabel, sourceLabel } from "@/lib/admin/visitor-labels";
import { LIVE_MINUTES, isVisitorRange, liveVisitors, rangeLabel, visitorRanges, visitorReport, type VisitorRange } from "@/lib/admin/visitors";

export const metadata = { title: "Besucher" };

const ZURICH = "Europe/Zurich";
const clock = (d: Date, seconds = false) =>
  d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", ...(seconds ? { second: "2-digit" } : {}), timeZone: ZURICH });
const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);
const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "short", timeZone: "UTC" }).slice(0, 2);
const dayMonth = (iso: string) => `${Number(iso.slice(8, 10))}.${Number(iso.slice(5, 7))}.`;
const num = (n: number) => n.toLocaleString("de-CH");
const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`;

function ago(d: Date, now: Date) {
  const min = Math.floor((now.getTime() - d.getTime()) / 60_000);
  return min < 1 ? "gerade eben" : `vor ${min} Min.`;
}

const rangeSub: Record<VisitorRange, string> = { heute: "heute", gestern: "gestern", "7": "in den letzten 7 Tagen", "30": "in den letzten 30 Tagen" };

export default async function VisitorsPage({ searchParams }: { searchParams: Promise<{ zeitraum?: string }> }) {
  const { zeitraum } = await searchParams;
  const range: VisitorRange = isVisitorRange(zeitraum) ? zeitraum : "heute";
  const [live, r] = await Promise.all([liveVisitors(), visitorReport(range)]);
  const now = new Date();
  const today = todayIso();

  // Chart: per hour for a single day, per day otherwise. Missing buckets are zero.
  const hourly = range === "heute" || range === "gestern";
  const nowHour = zurichHour(now);
  const detail = (k: string) => {
    const b = r.series.get(k);
    return `${num(b?.visitors ?? 0)} Besucher · ${plural(b?.views ?? 0, "Aufruf", "Aufrufe")}`;
  };
  const chart: BarDatum[] = hourly
    ? Array.from({ length: 24 }, (_, h) => ({
        key: String(h),
        label: h % 3 === 0 ? String(h) : "",
        title: `${h}:00 bis ${h + 1}:00 Uhr`,
        value: r.series.get(String(h))?.visitors ?? 0,
        highlight: range === "heute" && h === nowHour,
        detail: detail(String(h)),
      }))
    : Array.from({ length: Number(range) }, (_, i) => {
        const back = Number(range) - 1 - i;
        const iso = addDaysIso(today, -back);
        return {
          key: iso,
          label: range === "7" ? `${weekday(iso)} ${dayMonth(iso)}` : back % 5 === 0 ? dayMonth(iso) : "",
          title: new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }),
          value: r.series.get(iso)?.visitors ?? 0,
          highlight: back === 0,
          detail: detail(iso),
        };
      });

  const sources = groupSources(r.sources);
  const google = sources.find((s) => s.label === "Google")?.visitors ?? 0;
  const empty = r.views === 0;
  const noData = <p className="text-[13.5px] text-muted">Noch keine Aufrufe in diesem Zeitraum.</p>;

  return (
    <>
      <AutoRefresh seconds={15} />
      <PageHeader
        eyebrow="Webseite"
        title="Besucher"
        sub={`Anonym gezählt, ohne Cookies und ohne Google Analytics${r.since ? ` · seit ${fmtDate(r.since)}` : ""}`}
        actions={
          <FilterChips
            items={visitorRanges.map(([k, label]) => [k, label])}
            active={range}
            href={(v) => (v && v !== "heute" ? `/admin/besucher?zeitraum=${v}` : "/admin/besucher")}
          />
        }
      />

      <Card
        className="mb-5"
        title={
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              {live.length > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/50" />}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${live.length > 0 ? "bg-success" : "bg-[#b8c2cc]"}`} />
            </span>
            Jetzt auf der Webseite
          </span>
        }
        actions={<span className="text-[12px] tabular-nums text-muted">Aktualisiert {clock(now, true)}</span>}
      >
        <div className="flex items-baseline gap-2.5">
          <p className="font-display text-[34px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink">{live.length}</p>
          <p className="text-[13.5px] text-muted">Besucher in den letzten {LIVE_MINUTES} Minuten aktiv</p>
        </div>
        {live.length === 0 ? (
          <p className="mt-3 text-[13.5px] text-muted">Gerade ist niemand auf der Webseite. Die Ansicht aktualisiert sich von selbst.</p>
        ) : (
          <ul className="-mx-4 mt-3 divide-y divide-line border-t border-line sm:-mx-5">
            {live.map((v, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3 sm:px-5">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-bright-soft text-bright" title={deviceLabels[v.device]}>
                  <Icon name={deviceIcons[v.device] ?? "monitor"} className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex min-w-0 items-center gap-2">
                    <a href={v.path} target="_blank" className="truncate text-[14px] font-medium text-ink hover:text-accent">
                      {pageLabel(v.path)}
                    </a>
                    <span className="shrink-0 rounded border border-line px-1 text-[10.5px] font-semibold uppercase text-muted">{v.path.slice(1, 3)}</span>
                  </p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
                    {placeLabel(v.country, v.region)} · {sourceLabel(v.source)} · {plural(v.views, "Seite", "Seiten")} seit {clock(v.firstSeen)}
                  </p>
                </div>
                <span className="shrink-0 pt-0.5 text-[12px] tabular-nums text-muted">{ago(v.lastSeen, now)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <section aria-label="Kennzahlen" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Besucher" icon="users" value={num(r.visitors)} sub={rangeSub[range]} />
        <Stat
          label="Seitenaufrufe"
          icon="file"
          value={num(r.views)}
          sub={r.visitors ? `${(r.views / r.visitors).toLocaleString("de-CH", { maximumFractionDigits: 1 })} Seiten pro Besucher` : "–"}
        />
        <Stat
          label="Anfragen über die Webseite"
          icon="inbox"
          value={String(r.leads)}
          sub={r.visitors ? `${((r.leads / r.visitors) * 100).toLocaleString("de-CH", { maximumFractionDigits: 1 })} % der Besucher` : rangeSub[range]}
          href="/admin/anfragen"
        />
        <Stat label="Über Google" icon="search" value={`${pct(google, r.visitors)} %`} sub={`${num(google)} Besucher aus der Google-Suche`} />
      </section>

      <Card title={hourly ? `Besucher pro Stunde, ${rangeLabel(range).toLowerCase()}` : `Besucher pro Tag, letzte ${rangeLabel(range)}`} className="mb-5">
        <ColumnChart data={chart} label="Besucher" integer format={(v) => `${num(v)} Besucher`} height={160} />
      </Card>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Card title="Meistbesuchte Seiten" actions={<span className="text-[12px] text-muted">Aufrufe</span>}>
          {empty ? (
            noData
          ) : (
            <RankList
              rows={r.pages.map((p) => ({
                key: p.path,
                label: (
                  <a href={p.path} target="_blank" className="hover:text-accent">
                    {pageLabel(p.path)}
                  </a>
                ),
                sub: p.path,
                value: p.views,
              }))}
            />
          )}
        </Card>
        <Card title="Woher die Besucher kommen" actions={<span className="text-[12px] text-muted">Besucher</span>}>
          {empty ? (
            noData
          ) : (
            <>
              <RankList rows={sources.slice(0, 10).map((s) => ({ key: s.label, label: s.label, value: s.visitors }))} />
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                «Direkt»: Adresse eingetippt, Lesezeichen oder Apps wie WhatsApp und E-Mail, die keine Herkunft mitsenden.
              </p>
            </>
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Geräte und Sprache">
          {empty ? (
            noData
          ) : (
            <>
              <RankList
                rows={r.devices.map((d) => ({
                  key: d.device,
                  label: (
                    <span className="inline-flex items-center gap-2">
                      <Icon name={deviceIcons[d.device] ?? "monitor"} className="h-4 w-4 text-bright" />
                      {deviceLabels[d.device] ?? d.device}
                    </span>
                  ),
                  value: d.visitors,
                  display: `${pct(d.visitors, r.visitors)} %`,
                }))}
              />
              <div className="mt-4 border-t border-line pt-3">
                <p className="mb-1.5 px-2.5 text-[12px] text-muted">Aufrufe nach Sprache</p>
                <RankList
                  rows={r.languages.map((l) => ({
                    key: l.lang,
                    label: l.lang === "fr" ? "Französisch" : l.lang === "de" ? "Deutsch" : l.lang,
                    value: l.views,
                    display: `${pct(l.views, r.views)} %`,
                  }))}
                />
              </div>
            </>
          )}
        </Card>
        <Card title="Länder" actions={<span className="text-[12px] text-muted">Besucher</span>}>
          {empty ? noData : <RankList rows={r.countries.map((c) => ({ key: c.country ?? "-", label: countryName(c.country), value: c.visitors }))} />}
        </Card>
        <Card title="Kantone" actions={<span className="text-[12px] text-muted">Besucher</span>}>
          {r.cantons.length === 0 ? (
            <p className="text-[13.5px] text-muted">Noch keine Besucher aus der Schweiz in diesem Zeitraum.</p>
          ) : (
            <RankList rows={r.cantons.map((c) => ({ key: c.region ?? "-", label: cantonName(c.region), value: c.visitors }))} />
          )}
        </Card>
      </div>

      <p className="mt-6 max-w-3xl text-[12.5px] leading-relaxed text-muted">
        So wird gezählt: Jeder Seitenaufruf wird ohne Cookies erfasst, die IP-Adresse wird nicht gespeichert. Besucher werden über eine anonyme Kennung
        unterschieden, die jeden Tag wechselt. Suchmaschinen und Bots werden herausgefiltert, ebenso Aufrufe aus einem Browser, in dem der Admin angemeldet ist.
        Live heisst: mindestens ein Seitenaufruf in den letzten {LIVE_MINUTES} Minuten.
      </p>
    </>
  );
}

/** Ranked rows with a light bar behind the label, relative to the largest value. */
function RankList({ rows }: { rows: { key: string; label: React.ReactNode; sub?: string; value: number; display?: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-1">
      {rows.map((r) => (
        <li key={r.key} className="relative flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-[13.5px]">
          <span className="absolute inset-y-0 left-0 rounded-lg bg-bright-soft" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} aria-hidden="true" />
          <span className="relative min-w-0 flex-1">
            <span className="block truncate text-ink">{r.label}</span>
            {r.sub && <span className="block truncate text-[11.5px] text-muted">{r.sub}</span>}
          </span>
          <span className="relative shrink-0 font-medium tabular-nums text-ink">{r.display ?? num(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

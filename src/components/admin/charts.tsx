import { chf0 } from "@/lib/admin/money";

export interface BarDatum {
  key: string;
  /** short axis label, e.g. "Okt" */
  label: string;
  /** full label for the tooltip, e.g. "Oktober 2026" */
  title: string;
  value: number;
  highlight?: boolean;
}

/**
 * Single-series column chart in Schieferblau. Calm by design: one hue, thin columns with rounded
 * tops, a recessive grid, a direct label on the highlighted column only and a tooltip on hover or
 * keyboard focus. Server component, no client JS.
 */
export function ColumnChart({ data, unit = "CHF", height = 180, label }: { data: BarDatum[]; unit?: string; height?: number; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const ticks = [top, top / 2, 0];
  return (
    <figure aria-label={label} className="min-w-0">
      <div className="flex gap-2 sm:gap-3">
        <div className="relative w-8 shrink-0 text-right text-[10.5px] sm:w-12 sm:text-[11px] tabular-nums text-muted" style={{ height }} aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}>
              {short(t)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {ticks.map((t, i) => (
              <span
                key={t}
                className={`absolute inset-x-0 border-t ${i === ticks.length - 1 ? "border-[#cfd8e1]" : "border-dashed border-line"}`}
                style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
              />
            ))}
          </div>
          <ol className="relative flex items-end gap-[2px] sm:gap-1.5" style={{ height }}>
            {data.map((d) => {
              const h = d.value > 0 ? Math.max(2, (d.value / top) * 100) : 0;
              return (
                <li key={d.key} className="group relative flex h-full flex-1 items-end justify-center outline-none" tabIndex={0} aria-label={`${d.title}: ${unit} ${chf0(d.value)}`}>
                  <span className="absolute inset-x-0 bottom-0 top-0 rounded-md transition-colors group-hover:bg-bright-soft/70 group-focus-visible:bg-bright-soft/70" />
                  <span
                    className={`relative w-full max-w-[28px] rounded-t-[4px] transition-colors ${d.highlight ? "bg-accent" : "bg-[#8fa6bb] group-hover:bg-bright"}`}
                    style={{ height: `${h}%` }}
                  />
                  {d.highlight && d.value > 0 && (
                    <span className="absolute -translate-y-full whitespace-nowrap pb-1 text-[11px] font-semibold tabular-nums text-ink" style={{ bottom: `${h}%` }}>
                      {short(d.value)}
                    </span>
                  )}
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-[12px] shadow-card group-hover:block group-focus-visible:block">
                    <span className="block font-semibold text-ink">{d.title}</span>
                    <span className="block tabular-nums text-ink-soft">
                      {unit} {chf0(d.value)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-2 flex gap-[2px] sm:gap-1.5" aria-hidden="true">
            {data.map((d) => (
              <span key={d.key} className={`min-w-0 flex-1 overflow-hidden text-center text-[9.5px] sm:text-[11px] ${d.highlight ? "font-semibold text-ink" : "text-muted"}`}>
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

function niceStep(max: number) {
  const raw = max / 2;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

/** 12400 -> "12.4k", 950 -> "950" */
function short(n: number) {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toLocaleString("de-CH", { maximumFractionDigits: 1 })}k`;
  return chf0(n);
}

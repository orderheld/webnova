import Link from "next/link";
import { statusLabel, statusTone } from "@/lib/admin/labels";
import { Icon } from "./icons";

export function PageHeader({
  title,
  sub,
  actions,
  back,
  badge,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-accent">
          <Icon name="arrowLeft" className="h-3.5 w-3.5" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] font-semibold tracking-[-0.02em] md:text-[28px]">{title}</h1>
            {badge}
          </div>
          {sub && <div className="mt-1 text-[14px] text-muted">{sub}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({
  children,
  className = "",
  title,
  actions,
  padded = true,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  padded?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`rounded-2xl border border-line bg-surface ${className}`}>
      {title && (
        <div className="flex min-h-[52px] flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 sm:px-5">
          <h2 className="text-[15px] font-semibold">{title}</h2>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padded ? "p-4 sm:p-5" : ""}>{children}</div>
    </section>
  );
}

export function Badge({ status, label, className = "" }: { status: string; label?: string; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusTone(status)} ${className}`}>
      {label ?? statusLabel(status)}
    </span>
  );
}

export function LinkButton({
  href,
  children,
  variant = "dark",
  icon,
  size = "md",
  target,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "ghost" | "accent";
  icon?: string;
  size?: "sm" | "md";
  target?: string;
}) {
  const cls = size === "sm" ? btnSm[variant] : btn[variant];
  return (
    <Link href={href} className={cls} target={target}>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </Link>
  );
}

const base = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 whitespace-nowrap";
export const btn = {
  dark: `${base} bg-accent px-4 py-2 text-[14px] text-white hover:bg-ink`,
  accent: `${base} bg-accent px-4 py-2 text-[14px] text-white hover:bg-ink`,
  ghost: `${base} border border-line bg-surface px-4 py-2 text-[14px] hover:border-accent hover:text-accent`,
  danger: `${base} px-4 py-2 text-[14px] text-danger hover:bg-danger/10`,
};
export const btnSm = {
  dark: `${base} bg-accent px-3 py-1.5 text-[13px] text-white hover:bg-ink`,
  accent: `${base} bg-accent px-3 py-1.5 text-[13px] text-white hover:bg-ink`,
  ghost: `${base} border border-line bg-surface px-3 py-1.5 text-[13px] hover:border-accent hover:text-accent`,
  danger: `${base} px-3 py-1.5 text-[13px] text-danger hover:bg-danger/10`,
};
export const iconBtn = "grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink";

export function Field({ label, children, className = "", hint }: { label: string; children: React.ReactNode; className?: string; hint?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[12.5px] font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Empty({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-10 text-center text-[14px] text-muted">
      {children}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export interface SortSpec {
  key: string;
  dir: "asc" | "desc";
}

/** Table with optional sortable headers (links that set ?sort=key&dir=asc|desc). */
export function Table({
  head,
  children,
  sort,
  href,
  minWidth = 640,
}: {
  head: (React.ReactNode | { label: string; key?: string; align?: "right" })[];
  children: React.ReactNode;
  sort?: SortSpec;
  href?: (key: string, dir: "asc" | "desc") => string;
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full text-left text-[14px]" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-line text-[11.5px] uppercase tracking-wider text-muted">
            {head.map((h, i) => {
              if (h && typeof h === "object" && "label" in h) {
                const active = sort?.key === h.key;
                const nextDir = active && sort?.dir === "asc" ? "desc" : "asc";
                return (
                  <th key={i} className={`whitespace-nowrap px-4 py-2.5 font-medium ${h.align === "right" ? "text-right" : ""}`}>
                    {h.key && href ? (
                      <Link href={href(h.key, nextDir)} className={`inline-flex items-center gap-1 hover:text-ink ${active ? "text-ink" : ""}`}>
                        {h.label}
                        {active && <Icon name={sort?.dir === "asc" ? "up" : "down"} className="h-3 w-3" />}
                      </Link>
                    ) : (
                      h.label
                    )}
                  </th>
                );
              }
              return (
                <th key={i} className="whitespace-nowrap px-4 py-2.5 font-medium">
                  {h as React.ReactNode}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export const td = "px-4 py-2.5 align-middle";
export const tdNum = "px-4 py-2.5 text-right tabular-nums whitespace-nowrap";

export function Stat({ label, value, sub, href, tone }: { label: string; value: string; sub?: React.ReactNode; href?: string; tone?: "warn" | "ok" }) {
  const inner = (
    <>
      <p className="text-[12.5px] font-medium text-muted">{label}</p>
      <p className={`mt-1.5 text-[24px] font-semibold tracking-tight tabular-nums ${tone === "warn" ? "text-danger" : ""}`}>{value}</p>
      {sub && <div className="mt-0.5 text-[12.5px] text-muted">{sub}</div>}
    </>
  );
  const cls = "block rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Pill links for filters, e.g. statuses. `items` are [value, label]; value undefined = "Alle". */
export function FilterChips({ items, active, href }: { items: [string | undefined, string, number?][]; active?: string; href: (v?: string) => string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([v, label, n]) => (
        <Link
          key={v ?? "alle"}
          href={href(v)}
          className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${active === v ? "border-accent bg-accent text-white" : "border-line bg-surface hover:border-accent"}`}
        >
          {label}
          {n !== undefined && <span className={`ml-1.5 tabular-nums ${active === v ? "text-white/70" : "text-muted"}`}>{n}</span>}
        </Link>
      ))}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "error" | "ok"; children: React.ReactNode }) {
  const t = {
    info: "bg-accent-soft text-accent",
    warn: "bg-amber-50 text-amber-900 border border-amber-200",
    error: "bg-danger/10 text-danger",
    ok: "bg-emerald-50 text-emerald-800",
  }[tone];
  return <div className={`mb-5 rounded-xl px-4 py-3 text-[14px] ${t}`}>{children}</div>;
}

export function KeyValues({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[minmax(110px,40%)_1fr] gap-x-4 gap-y-2 text-[14px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted">{k}</dt>
          <dd className="min-w-0 break-words">{v ?? "–"}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Simple horizontal bar, value relative to max. */
export function Bar({ value, max, className = "bg-accent" }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.max(2, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-bg">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Stars({ value }: { value: number | null }) {
  if (!value) return <span className="text-muted">–</span>;
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" title={`${value} von 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" className={`h-3.5 w-3.5 ${i <= value ? "fill-current" : "text-zinc-300"}`} />
      ))}
    </span>
  );
}

/** Builds a URL for the current list with changed search params. */
export function qs(base: string, params: Record<string, string | undefined | null>, patch: Record<string, string | undefined | null>) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...params, ...patch })) if (v) u.set(k, v);
  const s = u.toString();
  return s ? `${base}?${s}` : base;
}

export const PAGE_SIZE = 50;

/** Page number from ?seite=, 1-based. */
export const pageParam = (raw?: string) => Math.max(1, Math.min(10_000, Number.parseInt(raw ?? "1", 10) || 1));

/** Previous / next links below long lists; renders nothing for a single page. */
export function Pager({ page, total, href, size = PAGE_SIZE }: { page: number; total: number; href: (page: number) => string; size?: number }) {
  const pages = Math.max(1, Math.ceil(total / size));
  if (pages <= 1) return null;
  const link = "rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] hover:border-accent hover:text-accent";
  return (
    <nav className="mt-4 flex items-center justify-between gap-3 text-[13px] text-muted" aria-label="Seiten">
      <span className="tabular-nums">
        {(page - 1) * size + 1} bis {Math.min(total, page * size)} von {total}
      </span>
      <span className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={link}>
            Zurück
          </Link>
        ) : null}
        <span className="px-1 py-1.5 tabular-nums">
          Seite {page} von {pages}
        </span>
        {page < pages ? (
          <Link href={href(page + 1)} className={link}>
            Weiter
          </Link>
        ) : null}
      </span>
    </nav>
  );
}

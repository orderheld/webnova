import Link from "next/link";
import { statusLabel, statusTone } from "@/lib/admin/labels";
import { Icon } from "./icons";

export function PageHeader({
  title,
  sub,
  actions,
  back,
  badge,
  eyebrow,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  badge?: React.ReactNode;
  /** short caps label above the title, like the section labels on the website */
  eyebrow?: React.ReactNode;
}) {
  return (
    <header className="mb-6 border-b border-line pb-5 md:mb-7">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-bright">
          <Icon name="arrowLeft" className="h-3.5 w-3.5" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          {eyebrow && <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-bright">{eyebrow}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[30px]">{title}</h1>
            {badge}
          </div>
          {sub && <div className="mt-1.5 text-[14px] text-muted">{sub}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
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
    <section id={id} className={`rounded-2xl border border-line bg-surface shadow-xs ${className}`}>
      {title && (
        <div className="flex min-h-[54px] flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
          <h2 className="font-display text-[15.5px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padded ? "p-4 sm:p-5" : ""}>{children}</div>
    </section>
  );
}

export function Badge({ status, label, className = "" }: { status: string; label?: string; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-medium leading-none ring-1 ring-inset ${statusTone(status)} ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" aria-hidden="true" />
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

/*
 * Buttons: one primary (Schieferblau fill), one secondary (white with hairline), a quiet danger.
 * Pills like on the website; disabled state fades, focus ring comes from globals.css.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50";
const primary = "bg-accent text-white shadow-xs hover:bg-night active:bg-night";
const secondary = "border border-line bg-surface text-ink shadow-xs hover:border-accent/35 hover:bg-bg hover:text-accent";
const quiet = "text-danger hover:bg-danger-soft";
export const btn = {
  dark: `${base} ${primary} px-4 py-2 text-[14px]`,
  accent: `${base} ${primary} px-4 py-2 text-[14px]`,
  ghost: `${base} ${secondary} px-4 py-2 text-[14px]`,
  danger: `${base} ${quiet} px-4 py-2 text-[14px]`,
};
export const btnSm = {
  dark: `${base} ${primary} px-3 py-1.5 text-[13px]`,
  accent: `${base} ${primary} px-3 py-1.5 text-[13px]`,
  ghost: `${base} ${secondary} px-3 py-1.5 text-[13px]`,
  danger: `${base} ${quiet} px-3 py-1.5 text-[13px]`,
};
export const iconBtn = "grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink";
/** Small text link in card headers ("Alle ansehen"). */
export const cardLink = "inline-flex items-center gap-1 text-[13px] font-medium text-bright transition-colors hover:text-accent";

export function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={cardLink}>
      {children}
      <Icon name="arrowRight" className="h-3.5 w-3.5" />
    </Link>
  );
}

export function Field({ label, children, className = "", hint }: { label: string; children: React.ReactNode; className?: string; hint?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Empty({ children, action, icon = "inbox" }: { children: React.ReactNode; action?: React.ReactNode; icon?: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#cfd8e1] bg-surface/60 px-6 py-12 text-center text-[14px] text-muted">
      <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-bright-soft text-bright">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="max-w-sm">{children}</div>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
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
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-xs">
      <table className="w-full text-left text-[14px]" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-line bg-bg/70 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">
            {head.map((h, i) => {
              if (h && typeof h === "object" && "label" in h) {
                const active = sort?.key === h.key;
                const nextDir = active && sort?.dir === "asc" ? "desc" : "asc";
                return (
                  <th key={i} className={`whitespace-nowrap px-4 py-3 font-semibold ${h.align === "right" ? "text-right" : ""}`}>
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
                <th key={i} className="whitespace-nowrap px-4 py-3 font-semibold">
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

export const td = "px-4 py-3 align-middle";
export const tdNum = "px-4 py-3 text-right tabular-nums whitespace-nowrap";
/** Hover tint for clickable table rows. */
export const trHover = "transition-colors hover:bg-bg/70";

export function Stat({
  label,
  value,
  sub,
  href,
  tone,
  icon,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  href?: string;
  tone?: "warn" | "ok";
  icon?: string;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-medium text-muted">{label}</p>
        {icon && (
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
              tone === "warn" ? "bg-danger-soft text-danger" : tone === "ok" ? "bg-success-soft text-success" : "bg-bright-soft text-bright"
            }`}
          >
            <Icon name={icon} className="h-4 w-4" />
          </span>
        )}
      </div>
      <p
        className={`mt-1 font-display text-[22px] font-semibold tracking-[-0.02em] tabular-nums sm:text-[25px] ${
          tone === "warn" ? "text-danger" : tone === "ok" ? "text-success" : "text-ink"
        }`}
      >
        {value}
      </p>
      {sub && <div className="mt-1 text-[12.5px] leading-snug text-muted">{sub}</div>}
    </>
  );
  const cls = "block min-w-0 rounded-2xl border border-line bg-surface p-4 shadow-xs sm:p-5";
  return href ? (
    <Link href={href} className={`${cls} transition-[border-color,box-shadow] duration-200 hover:border-accent/30 hover:shadow-card`}>
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
          className={`rounded-full border px-3 py-1 text-[13px] font-medium transition-colors ${
            active === v ? "border-accent bg-accent text-white" : "border-line bg-surface text-ink-soft hover:border-accent/35 hover:text-accent"
          }`}
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
    info: "bg-bright-soft text-accent ring-bright/15",
    warn: "bg-warn-soft text-warn ring-warn/20",
    error: "bg-danger-soft text-danger ring-danger/20",
    ok: "bg-success-soft text-success ring-success/20",
  }[tone];
  return <div className={`mb-5 rounded-xl px-4 py-3 text-[14px] ring-1 ring-inset ${t}`}>{children}</div>;
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
    <span className="inline-flex items-center gap-0.5 text-bright" title={`${value} von 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" className={`h-3.5 w-3.5 ${i <= value ? "fill-current" : "text-line"}`} />
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
  const link = btnSm.ghost;
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

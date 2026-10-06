import Link from "next/link";
import { Icon } from "@/components/icons";

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-medium tracking-[-0.03em] md:text-[34px]">{title}</h1>
        {sub && <p className="mt-1 text-[14px] text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "", title, actions }: { children: React.ReactNode; className?: string; title?: string; actions?: React.ReactNode }) {
  return (
    <section className={`rounded-[20px] border border-line bg-surface ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="text-[15px] font-medium">{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

const tones: Record<string, string> = {
  neu: "bg-accent-soft text-accent",
  kontaktiert: "bg-amber-100 text-amber-800",
  offerte: "bg-violet-100 text-violet-800",
  gewonnen: "bg-emerald-100 text-emerald-800",
  verloren: "bg-zinc-200 text-zinc-600",
  entwurf: "bg-zinc-100 text-zinc-600",
  gesendet: "bg-accent-soft text-accent",
  angenommen: "bg-emerald-100 text-emerald-800",
  abgelehnt: "bg-zinc-200 text-zinc-600",
  bezahlt: "bg-emerald-100 text-emerald-800",
  storniert: "bg-zinc-200 text-zinc-500 line-through",
  ueberfaellig: "bg-red-100 text-red-700",
};
const labels: Record<string, string> = { ueberfaellig: "überfällig" };

export function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium capitalize ${tones[status] ?? "bg-zinc-100 text-zinc-700"}`}>
      {labels[status] ?? status}
    </span>
  );
}

export function LinkButton({ href, children, variant = "dark", icon }: { href: string; children: React.ReactNode; variant?: "dark" | "ghost" | "accent"; icon?: string }) {
  const v = {
    dark: "bg-ink text-white hover:bg-accent",
    accent: "bg-accent text-white hover:bg-ink",
    ghost: "border border-line bg-surface hover:border-ink",
  }[variant];
  return (
    <Link href={href} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors ${v}`}>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </Link>
  );
}

export const btn = {
  dark: "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent disabled:opacity-50",
  accent: "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-ink disabled:opacity-50",
  ghost: "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] font-medium transition-colors hover:border-ink disabled:opacity-50",
  danger: "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium text-danger transition-colors hover:bg-danger/10",
};

export function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[20px] border border-dashed border-line px-6 py-14 text-center text-[14px] text-muted">{children}</div>;
}

export function Table({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-line text-[12px] uppercase tracking-wider text-muted">
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Stat({ label, value, sub, href }: { label: string; value: string; sub?: string; href?: string }) {
  const inner = (
    <>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-2 text-[30px] font-medium tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-[13px] text-muted">{sub}</p>}
    </>
  );
  const cls = "block rounded-[20px] border border-line bg-surface p-5 transition-colors hover:border-ink/30";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

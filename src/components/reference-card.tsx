import Image from "next/image";
import type { Reference } from "@/content/references";
import type { Locale } from "@/content/types";
import { Icon } from "./icons";

const t = {
  de: { visit: "Website ansehen" },
  fr: { visit: "Voir le site" },
};

/** Showcase card for a client project: browser mock-up with screenshot (or brand panel) plus facts. */
export function ReferenceCard({ r, locale, large = false }: { r: Reference; locale: Locale; large?: boolean }) {
  const c = r.content[locale];
  return (
    <article className="reveal group flex h-full flex-col overflow-hidden rounded-[30px] border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-night hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]">
      <div className="relative overflow-hidden bg-night p-3 pb-0 sm:p-5 sm:pb-0">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-70" />
        <div className="relative overflow-hidden rounded-t-[16px] border border-b-0 border-white/10 bg-night-2 transition-transform duration-700 group-hover:-translate-y-1">
          <div className="flex items-center gap-1.5 px-3.5 py-2.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-2 truncate rounded-full bg-white/5 px-3 py-0.5 font-mono text-[11px] text-white/45">{r.domain}</span>
          </div>
          <div className={`relative ${large ? "aspect-[16/9.5]" : "aspect-[16/10]"} overflow-hidden`}>
            {r.image ? (
              <Image
                src={r.image}
                alt={`${r.name} – ${c.industry}`}
                fill
                sizes={large ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 400px, 100vw"}
                className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center" style={{ background: r.colors.bg, color: r.colors.fg }}>
                <span className="h-1 w-10 rounded-full" style={{ background: r.colors.accent }} />
                <span className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-none tracking-[-0.04em]">{r.name}</span>
                <span className="text-[12px] uppercase tracking-[0.25em] opacity-60">{c.industry}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-7">
        <div>
          <p className="flex items-center gap-2 text-[13px] text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: r.colors.accent }} />
            {c.industry}
            {c.place && <> · {c.place}</>}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.5rem,2.4vw,1.9rem)] font-bold leading-tight tracking-[-0.03em]">{r.name}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.summary}</p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {c.scope.map((s) => (
            <li key={s} className="rounded-full bg-bg px-3 py-1.5 text-[12.5px] text-ink-soft">
              {s}
            </li>
          ))}
        </ul>
        {r.url && (
          <a
            href={r.url}
            target="_blank"
            rel="noopener"
            className="mt-auto inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 text-[14px] font-semibold transition-colors hover:border-night hover:bg-night hover:text-white"
          >
            {t[locale].visit} <Icon name="arrowUpRight" className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

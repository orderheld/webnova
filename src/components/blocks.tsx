import Link from "next/link";
import type { Faq, Locale, Section } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { ButtonLink } from "./button";
import { Icon } from "./icons";

export function Breadcrumbs({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-10 text-[13px] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.url ? (
              <Link href={it.url} className="transition-colors hover:text-accent">
                {it.name}
              </Link>
            ) : (
              <span className="text-ink-soft">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  crumbs,
  aside,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  crumbs?: { name: string; url?: string }[];
  /** Optional visual on the right (desktop) or below (mobile). */
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative border-b border-line bg-bg">
      <div className="container-x pb-16 pt-8 md:pb-24 md:pt-12">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={aside ? "grid items-center gap-14 lg:grid-cols-12" : ""}>
          <div className={aside ? "lg:col-span-7" : ""}>
            {eyebrow && <p className="eyebrow mb-6 animate-rise">{eyebrow}</p>}
            <h1 className={`display max-w-5xl animate-rise [animation-delay:80ms] ${aside ? "text-[clamp(2.4rem,4.8vw,4rem)]" : "text-[clamp(2.4rem,5.4vw,4.4rem)]"}`}>{title}</h1>
            {lead && <p className="mt-7 max-w-2xl animate-rise text-[18px] leading-relaxed text-ink-soft [animation-delay:160ms] md:text-[20px]">{lead}</p>}
            {children && <div className="animate-rise [animation-delay:240ms]">{children}</div>}
          </div>
          {aside && (
            <div className="animate-rise [animation-delay:300ms] lg:col-span-5">
              <div className="mx-auto max-w-[520px]">{aside}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Prose({ sections }: { sections: Section[] }) {
  return (
    <div className="prose-wn">
      {sections.map((s, i) => (
        <div key={i}>
          <h2>{s.h2}</h2>
          {s.paragraphs.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
          {s.bullets && s.bullets.length > 0 && (
            <ul>
              {s.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function FaqList({ locale, faq }: { locale: Locale; faq: Faq[] }) {
  const d = getDict(locale);
  if (!faq.length) return null;
  return (
    <section className="container-x py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="reveal md:col-span-4">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="h-section">{d.common.faq}</h2>
        </div>
        <div className="space-y-3 md:col-span-8">
          {faq.map((f, i) => (
            <details key={i} className="reveal group rounded-2xl border border-line bg-surface px-6 py-5 transition-colors open:border-accent/40 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-[18px] font-medium leading-snug tracking-[-0.01em] md:text-[19px]">
                {f.q}
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg transition-all duration-300 group-open:rotate-45 group-open:bg-accent group-open:text-white">
                  <Icon name="plus" className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-4 max-w-2xl pb-1 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="container-x pb-20 md:pb-28">
      <div className="reveal relative isolate overflow-hidden rounded-2xl bg-accent px-6 py-14 text-white sm:px-12 md:px-16 md:py-20">
        <div className="relative grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="eyebrow mb-5 !text-accent-light">{d.cta.badge}</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">{d.cta.title}</h2>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/75">{d.cta.text}</p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
            <ButtonLink href={href(locale, "request")} variant="accent">
              {d.cta.button}
            </ButtonLink>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 px-2 py-2 text-[15px] text-white/65 hover:text-white">
              <Icon name="phone" className="h-4 w-4" /> {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((f, i) => (
        <div key={i} className="reveal rounded-2xl border border-line bg-surface p-8">
          <span className="mb-6 block font-display text-[14px] font-semibold text-bright">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-[19px] font-semibold tracking-tight">{f.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.text}</p>
        </div>
      ))}
    </div>
  );
}

export function CardLink({
  href,
  title,
  text,
  icon,
  meta,
}: {
  href: string;
  title: string;
  text?: string;
  icon?: string;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="reveal group relative isolate flex h-full flex-col justify-between gap-10 overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:border-accent/50 hover:shadow-soft"
    >
      <div>
        {icon && (
          <span className="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-bright-soft text-bright transition-colors duration-300 group-hover:bg-bright group-hover:text-white">
            <Icon name={icon} className="h-[22px] w-[22px]" />
          </span>
        )}
        {meta && <p className="mb-3 text-[13px] text-muted">{meta}</p>}
        <h3 className="font-display text-[20px] font-semibold leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent">{title}</h3>
        {text && <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>}
      </div>
      <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-bright">
        <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

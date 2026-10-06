import Link from "next/link";
import type { Faq, Locale, Section } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { ButtonLink } from "./button";
import { Icon } from "./icons";

export function Breadcrumbs({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-white/45">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.url ? (
              <Link href={it.url} className="transition-colors hover:text-accent">
                {it.name}
              </Link>
            ) : (
              <span className="text-white/75">{it.name}</span>
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
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  crumbs?: { name: string; url?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -right-32 -top-20 -z-10 h-[460px] w-[460px] animate-drift rounded-full bg-accent/20 blur-[130px]" />
      <div className="container-x pb-20 pt-8 md:pb-28 md:pt-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && (
          <p className="mb-7 inline-flex animate-rise items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13px] text-white/75">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {eyebrow}
          </p>
        )}
        <h1 className="display max-w-5xl animate-rise text-[clamp(2.6rem,7vw,5.8rem)] [animation-delay:80ms]">{title}</h1>
        {lead && <p className="mt-8 max-w-2xl animate-rise text-[19px] leading-relaxed text-white/70 [animation-delay:160ms] md:text-[21px]">{lead}</p>}
        {children && <div className="animate-rise [animation-delay:240ms]">{children}</div>}
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
            <details key={i} className="reveal group rounded-[22px] border border-line bg-surface px-6 py-5 transition-colors open:border-night [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-[18px] font-semibold leading-snug tracking-[-0.01em] md:text-[19px]">
                {f.q}
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg transition-all duration-300 group-open:rotate-45 group-open:bg-accent">
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
      <div className="reveal relative isolate overflow-hidden rounded-[36px] bg-night px-6 py-16 text-white sm:px-12 md:px-16 md:py-24">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[460px] w-[460px] animate-drift rounded-full bg-accent/35 blur-[120px]" />
        <RotatingBadge text={d.cta.badge} />
        <div className="relative grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="font-display text-[clamp(2.3rem,5.4vw,4.6rem)] font-extrabold leading-[1] tracking-[-0.045em]">{d.cta.title}</h2>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/70">{d.cta.text}</p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
            <ButtonLink href={href(locale, "request")}>
              {d.cta.button}
            </ButtonLink>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 px-2 py-2 text-[15px] text-white/70 hover:text-white">
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <div key={i} className="reveal group rounded-[24px] border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-night">
          <span className="mb-6 grid h-11 w-11 place-items-center rounded-2xl bg-night font-display text-[14px] font-bold text-accent transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-[19px] font-bold tracking-tight">{f.title}</h3>
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
      className="reveal group relative isolate flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[28px] border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-night hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]"
    >
      <div>
        {icon && (
          <span className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-night text-accent transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
            <Icon name={icon} className="h-[22px] w-[22px]" />
          </span>
        )}
        {meta && <p className="mb-3 text-[13px] text-muted">{meta}</p>}
        <h3 className="font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">{title}</h3>
        {text && <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>}
      </div>
      <span className="grid h-10 w-10 place-items-center self-end rounded-full border border-line transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent">
        <Icon name="arrowUpRight" className="h-4 w-4" />
      </span>
    </Link>
  );
}

/** Slowly rotating circular text badge, purely decorative. */
function RotatingBadge({ text }: { text: string }) {
  return (
    <div aria-hidden="true" className="absolute right-8 top-8 hidden h-28 w-28 md:block">
      <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
        </defs>
        <text className="fill-white/70 text-[9.5px] font-semibold uppercase tracking-[0.2em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto grid h-11 w-11 place-items-center rounded-full bg-accent text-night">
        <Icon name="arrowUpRight" className="h-5 w-5" />
      </span>
    </div>
  );
}

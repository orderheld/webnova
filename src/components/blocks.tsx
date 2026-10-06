import Link from "next/link";
import type { Faq, Locale, Section } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { ButtonLink } from "./button";
import { Icon } from "./icons";

export function Breadcrumbs({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.url ? (
              <Link href={it.url} className="hover:text-ink">
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
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  crumbs?: { name: string; url?: string }[];
}) {
  return (
    <section className="container-x pb-16 pt-10 md:pb-24 md:pt-16">
      {crumbs && <Breadcrumbs items={crumbs} />}
      {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
      <h1 className="display max-w-5xl text-[clamp(2.6rem,7vw,5.8rem)]">{title}</h1>
      {lead && <p className="mt-8 max-w-2xl text-[19px] leading-relaxed text-ink-soft md:text-[21px]">{lead}</p>}
      {children}
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
        <div className="md:col-span-4">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="h-section">{d.common.faq}</h2>
        </div>
        <div className="divide-y divide-line border-y border-line md:col-span-8">
          {faq.map((f, i) => (
            <details key={i} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[18px] font-medium leading-snug md:text-[20px]">
                {f.q}
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 group-open:rotate-45">
                  <Icon name="plus" className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
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
      <div className="relative overflow-hidden rounded-[32px] bg-night px-6 py-16 text-white sm:px-12 md:px-16 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-accent/40 blur-[120px]" />
        <div className="relative grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.035em]">{d.cta.title}</h2>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/70">{d.cta.text}</p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
            <ButtonLink href={href(locale, "request")} variant="light">
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
    <div className="grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <div key={i} className="bg-surface p-8">
          <span className="mb-6 grid h-10 w-10 place-items-center rounded-full bg-accent-soft font-mono text-[13px] text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-[19px] font-medium tracking-tight">{f.title}</h3>
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
      className="group relative flex h-full flex-col justify-between gap-10 rounded-[28px] border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]"
    >
      <div>
        {icon && (
          <span className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-bg text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            <Icon name={icon} className="h-[22px] w-[22px]" />
          </span>
        )}
        {meta && <p className="mb-3 text-[13px] text-muted">{meta}</p>}
        <h3 className="text-[22px] font-medium leading-tight tracking-tight">{title}</h3>
        {text && <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>}
      </div>
      <span className="grid h-10 w-10 place-items-center self-end rounded-full border border-line transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
        <Icon name="arrowUpRight" className="h-4 w-4" />
      </span>
    </Link>
  );
}

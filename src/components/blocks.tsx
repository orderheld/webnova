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
              <Link href={it.url} className="transition-colors hover:text-bright">
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
    <section className="surface-tint relative border-b border-line">
      <div className="container-x pb-16 pt-8 md:pb-24 md:pt-12">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={aside ? "grid items-center gap-14 lg:grid-cols-12" : ""}>
          <div className={aside ? "lg:col-span-7" : ""}>
            {eyebrow && <p className="eyebrow mb-6 animate-rise">{eyebrow}</p>}
            <h1 className={`display max-w-5xl animate-rise [animation-delay:80ms] ${aside ? "text-[clamp(2.4rem,4.8vw,4rem)]" : "text-[clamp(2.4rem,5.4vw,4.4rem)]"}`}>{title}</h1>
            {lead && <p className="mt-7 max-w-2xl animate-rise text-[18px] leading-relaxed text-ink-soft [animation-delay:160ms] md:text-[19px]">{lead}</p>}
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

const faqAsk = {
  de: { q: "Ihre Frage ist nicht dabei?", a: "Rufen Sie uns an oder schreiben Sie uns. Wir antworten persönlich." },
  fr: { q: "Votre question n'y est pas ?", a: "Appelez-nous ou écrivez-nous. Nous répondons personnellement." },
};

export function FaqList({ locale, faq }: { locale: Locale; faq: Faq[] }) {
  const d = getDict(locale);
  const t = faqAsk[locale];
  if (!faq.length) return null;
  return (
    <section className="container-x section-y">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="reveal md:col-span-4">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="h-section">{d.common.faq}</h2>
          <div className="mt-8 hidden rounded-2xl bg-bg-2 p-6 md:block">
            <p className="font-display text-[17px] font-semibold tracking-[-0.01em]">{t.q}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{t.a}</p>
            <div className="mt-4 flex flex-col gap-2 text-[15px]">
              <a href={site.phoneHref} className="inline-flex items-center gap-2 font-medium text-accent hover:text-bright">
                <Icon name="phone" className="h-4 w-4 text-bright" /> {site.phone}
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-accent hover:text-bright">
                <Icon name="chat" className="h-4 w-4 text-bright" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="space-y-3 md:col-span-8">
          {faq.map((f, i) => (
            <details key={i} className="card reveal group transition-colors open:border-accent/30 hover:border-accent/30 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-2xl px-6 py-5 font-display text-[18px] font-medium leading-snug tracking-[-0.01em] md:text-[19px]">
                {f.q}
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bright-soft text-bright transition-all duration-300 group-open:rotate-45 group-open:bg-accent group-open:text-white">
                  <Icon name="plus" className="h-4 w-4" />
                </span>
              </summary>
              <p className="-mt-1 max-w-2xl px-6 pb-6 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const contactPerson = {
  de: { role: "Inhaber, Ihr Ansprechpartner", whatsapp: "WhatsApp schreiben" },
  fr: { role: "Propriétaire, votre interlocuteur", whatsapp: "Écrire sur WhatsApp" },
};

/** The person behind every answer: initials badge plus name and role (real facts from the imprint). */
export function ContactPerson({ locale, dark = false }: { locale: Locale; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[15px] font-semibold ${
          dark ? "bg-white/10 text-white ring-1 ring-inset ring-white/20" : "bg-accent text-white"
        }`}
      >
        FD
      </span>
      <span className="leading-tight">
        <span className={`block text-[15px] font-semibold ${dark ? "text-white" : "text-ink"}`}>Ferhat Demir</span>
        <span className={`block text-[13.5px] ${dark ? "text-white/70" : "text-muted"}`}>{contactPerson[locale].role}</span>
      </span>
    </div>
  );
}

/** Real facts only: free first consultation, answer within one working day, personal and direct. */
export function TrustList({ locale, dark = false, className = "" }: { locale: Locale; dark?: boolean; className?: string }) {
  const d = getDict(locale);
  return (
    <ul className={`space-y-2.5 text-[15px] ${dark ? "text-white/85" : "text-ink-soft"} ${className}`}>
      {d.lp.trust.map((t) => (
        <li key={t} className="flex items-center gap-2.5">
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${dark ? "bg-accent-light/15 text-accent-light" : "bg-bright-soft text-bright"}`}>
            <Icon name="check" className="h-3 w-3" strokeWidth={3} />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="container-x pb-20 md:pb-28">
      <div className="reveal relative isolate overflow-hidden rounded-3xl bg-accent px-6 py-12 text-white sm:px-12 md:px-16 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_100%_0%,rgb(159_195_236/0.18),transparent_70%)]" />
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <p className="eyebrow-light mb-5">{d.cta.badge}</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.1] tracking-[-0.02em]">{d.cta.title}</h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/80 md:text-[18px]">{d.cta.text}</p>
            <TrustList locale={locale} dark className="mt-8 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:space-y-0" />
          </div>
          <div className="md:col-span-5 md:pl-6">
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 sm:p-7">
              <ContactPerson locale={locale} dark />
              <ButtonLink href={href(locale, "request")} variant="accent" className="mt-6 w-full">
                {d.cta.button}
              </ButtonLink>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={site.phoneHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-3 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/[0.06]">
                  <Icon name="phone" className="h-4 w-4 text-accent-light" /> {d.common.callUs}
                </a>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-3 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/[0.06]">
                  <Icon name="chat" className="h-4 w-4 text-accent-light" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Sidebar call to action on content pages: dark card, the request button, trust facts and the phone line. */
export function CtaCard({ locale, title, text }: { locale: Locale; title: string; text?: string }) {
  const d = getDict(locale);
  return (
    <div className="surface-night overflow-hidden rounded-2xl p-7 text-white shadow-lift sm:p-8">
      <h2 className="font-display text-[24px] font-semibold leading-tight tracking-[-0.02em]">{title}</h2>
      {text && <p className="mt-3 text-[15px] leading-relaxed text-white/75">{text}</p>}
      <TrustList locale={locale} dark className="mt-6" />
      <ButtonLink href={href(locale, "request")} variant="accent" className="mt-7 w-full">
        {d.nav.cta}
      </ButtonLink>
      <a href={site.phoneHref} className="mt-3 flex min-h-11 items-center justify-center gap-2 text-[15px] text-white/80 transition-colors hover:text-white">
        <Icon name="phone" className="h-4 w-4 text-accent-light" /> {site.phone}
      </a>
      <div className="mt-5 border-t border-white/10 pt-5">
        <ContactPerson locale={locale} dark />
      </div>
    </div>
  );
}

export function FeatureGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((f, i) => (
        <div key={i} className="card reveal p-7 md:p-8">
          <span className="mb-6 grid h-9 w-9 place-items-center rounded-full bg-bright-soft font-display text-[14px] font-semibold text-bright">
            {i + 1}
          </span>
          <h3 className="text-[19px] font-semibold tracking-tight">{f.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.text}</p>
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
      className="card card-hover reveal group relative isolate flex h-full flex-col justify-between gap-8 overflow-hidden p-7"
    >
      <div>
        {icon && (
          <span className="icon-tile mb-7 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            <Icon name={icon} className="h-[22px] w-[22px]" />
          </span>
        )}
        {meta && <p className="mb-3 text-[13px] text-muted">{meta}</p>}
        <h3 className="font-display text-[20px] font-semibold leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent">{title}</h3>
        {text && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</p>}
      </div>
      <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-bright transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
        <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

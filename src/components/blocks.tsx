import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";
import type { Faq, Locale, Section } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href } from "@/lib/routes";
import { site } from "@/lib/site";
import { ButtonLink } from "./button";
import { Icon } from "./icons";

export function Breadcrumbs({ items, dark = false }: { items: { name: string; url?: string }[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-10 text-[13.5px] leading-snug md:mb-14 ${dark ? "text-white/55" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.url ? (
              <Link href={it.url} className={`transition-colors ${dark ? "hover:text-white" : "hover:text-accent"}`}>
                {it.name}
              </Link>
            ) : (
              <span className={dark ? "text-white/80" : "text-ink-soft"}>{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Page hero on the dark Schieferblau stage: breadcrumb, small label, the keyword H1, the benefit
 * subline and the lead, with an optional visual on the right (`aside`). Buttons passed as children
 * should use the dark variants ("accent", "ghostLight").
 */
export function PageHero({
  eyebrow,
  title,
  subline,
  lead,
  children,
  crumbs,
  aside,
}: {
  eyebrow?: string;
  title: string;
  /** Benefit line under a keyword H1 (beyondweb pattern: keyword H1, benefit subline). */
  subline?: string;
  lead?: string;
  children?: React.ReactNode;
  crumbs?: { name: string; url?: string }[];
  /** Optional visual on the right (desktop) or below (mobile). */
  aside?: React.ReactNode;
  /** @deprecated no longer drawn */
  backdrop?: React.ReactNode;
}) {
  return (
    <section className="stage-night relative isolate overflow-hidden text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_70%_at_85%_10%,#000,transparent)]" />
      <div className="container-x pb-16 pt-8 md:pb-24 md:pt-10">
        {crumbs && <Breadcrumbs items={crumbs} dark />}
        <div className={aside ? "grid items-center gap-12 lg:grid-cols-12 lg:gap-10" : ""}>
          <div className={aside ? "lg:col-span-7" : "max-w-5xl"}>
            {eyebrow && <p className="eyebrow-light mb-5 md:mb-6">{eyebrow}</p>}
            {/* The H1 is the LCP element: rendered visible on load, never faded in. */}
            <h1 className={`display text-balance break-words hyphens-auto ${aside ? "text-[clamp(2.3rem,4.6vw,3.9rem)]" : "text-[clamp(2.3rem,5.4vw,4.6rem)]"}`}>{title}</h1>
            {subline && <p className="mt-5 max-w-3xl font-display text-[clamp(1.25rem,2.1vw,1.65rem)] font-medium leading-[1.3] text-accent-light">{subline}</p>}
            {lead && <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75 md:text-[18px]">{lead}</p>}
            {children && <div className="[&>*:first-child]:mt-9">{children}</div>}
          </div>
          {aside && (
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[540px]">{aside}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Renders text with inline links written as [label](route-id), e.g. "[SEO](service:seo)" or
 * "[Webdesign Biel](city:biel)". Route ids are resolved per locale, unknown ids render as plain text.
 */
export function RichText({ text, locale }: { text: string; locale?: Locale }) {
  if (!locale || !text.includes("](")) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    parts.push(text.slice(last, m.index));
    const [, label, id] = m;
    parts.push(
      hasRoute(id) ? (
        <Link key={m.index} href={href(locale, id)} className="font-medium text-bright underline decoration-bright/30 underline-offset-[3px] hover:decoration-bright">
          {label}
        </Link>
      ) : (
        label
      ),
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

/** URL fragment for a heading, e.g. "Schritt 1: Profil" -> "schritt-1-profil". */
export function anchorId(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function Prose({ sections, locale, anchors = false }: { sections: Section[]; locale?: Locale; anchors?: boolean }) {
  return (
    <div className="prose-wn">
      {sections.map((s, i) => (
        <div key={i}>
          <h2 id={anchors ? anchorId(s.h2) : undefined} className={anchors ? "scroll-mt-28" : undefined}>
            {s.h2}
          </h2>
          {s.paragraphs.map((p, j) => (
            <p key={j}>
              <RichText text={p} locale={locale} />
            </p>
          ))}
          {s.bullets && s.bullets.length > 0 && (
            <ul>
              {s.bullets.map((b, j) => (
                <li key={j}>
                  <RichText text={b} locale={locale} />
                </li>
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

export function FaqList({ locale, faq, id }: { locale: Locale; faq: Faq[]; id?: string }) {
  const d = getDict(locale);
  const t = faqAsk[locale];
  if (!faq.length) return null;
  return (
    <section id={id} className="section-y scroll-mt-20 bg-bg-2">
      <div className="container-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="kicker mb-5">FAQ</p>
          <h2 className="h-section">{d.common.faq}</h2>
          <div className="mt-10 hidden rounded-2xl bg-white p-6 ring-1 ring-line md:block">
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
            <details key={i} className="group rounded-2xl bg-white px-5 ring-1 ring-line transition-shadow open:shadow-card sm:px-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-x-4 py-5 font-display text-[17px] font-medium leading-[1.4] transition-colors hover:text-accent md:text-[18.5px]">
                {f.q}
                <span aria-hidden="true" className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-all duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-white">
                  <Icon name="plus" className="h-4 w-4" />
                </span>
              </summary>
              <p className="-mt-1 max-w-2xl pb-6 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
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

const founder = photos.founder!;

/** The person behind every answer: small portrait plus name and role (real facts from the imprint). */
export function ContactPerson({ locale, dark = false, role }: { locale: Locale; dark?: boolean; role?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-bg-2 ${dark ? "ring-2 ring-white/25" : "ring-2 ring-white shadow-card"}`}>
        <Image src={founder.src} alt={founder.alt[locale]} fill sizes="48px" className="object-cover object-[50%_18%] scale-[1.35] origin-[50%_22%]" />
      </span>
      <span className="leading-tight">
        <span className={`block text-[15px] font-semibold ${dark ? "text-white" : "text-ink"}`}>Ferhat Demir</span>
        <span className={`block text-[13.5px] ${dark ? "text-white/70" : "text-muted"}`}>{role ?? contactPerson[locale].role}</span>
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

/** Closing call to action before the footer: a dark Schieferblau panel with the owner's portrait and the two next steps. */
export function CtaBand({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="container-x pb-20 md:pb-28">
      <div className="stage-night relative isolate overflow-hidden rounded-[2rem] px-6 py-12 text-white sm:px-10 md:px-14 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(60%_80%_at_100%_0%,#000,transparent)]" />
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="kicker-light mb-5">{d.cta.badge}</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.012em] text-balance">{d.cta.title}</h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/75">{d.cta.text}</p>
            <HeroCtas locale={locale} className="mt-8" />
            <p className="mt-6 text-[13.5px] text-white/55">{d.lp.trust.join(" · ")}</p>
          </div>
          <div className="hidden md:col-span-4 md:block">
            <div className="relative mx-auto aspect-[4/5] max-w-[260px] overflow-hidden rounded-3xl bg-bg-2 ring-4 ring-white/10">
              <Image src={founder.src} alt={founder.alt[locale]} fill sizes="260px" className="object-cover object-top" />
            </div>
            <p className="mt-4 text-center text-[14px] text-white/70">
              <span className="font-semibold text-white">Ferhat Demir</span> · {contactPerson[locale].role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Sidebar call to action on content pages: framed panel with a Schieferblau top rule, trust facts and the phone line. */
export function CtaCard({ locale, title, text }: { locale: Locale; title: string; text?: string }) {
  const d = getDict(locale);
  return (
    <div className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
      <div className="stage-accent h-2" />
      <div className="p-7 sm:p-8">
      <p className="label mb-4">{d.cta.badge}</p>
      <h2 className="font-display text-[24px] font-semibold leading-tight tracking-[-0.01em]">{title}</h2>
      {text && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</p>}
      <TrustList locale={locale} className="mt-6" />
      <ButtonLink href={href(locale, "request")} className="mt-7 w-full">
        {d.nav.cta}
      </ButtonLink>
      <a href={site.phoneHref} className="mt-3 flex min-h-11 items-center justify-center gap-2 text-[15px] text-ink-soft transition-colors hover:text-accent">
        <Icon name="phone" className="h-4 w-4 text-bright" /> {site.phone}
      </a>
      <div className="mt-5 border-t border-line pt-5">
        <ContactPerson locale={locale} />
      </div>
      </div>
    </div>
  );
}

/** Feature cards with a number tile. `reveal` is kept for compatibility. */
export function FeatureGrid({ items }: { items: { title: string; text: string }[]; reveal?: boolean }) {
  return (
    <ol className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((f, i) => (
        <li key={i} className="card-soft reveal p-6 hover:-translate-y-0.5 hover:shadow-card">
          <span className="num-tile">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-5 font-display text-[19px] font-semibold leading-[1.3]">{f.title}</h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{f.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Link card: optional icon tile, meta line, title, text and an arrow. */
export function CardLink({
  href,
  title,
  text,
  meta,
  icon,
}: {
  href: string;
  title: string;
  text?: string;
  icon?: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="card-soft card-hover group flex h-full flex-col p-6">
      {icon && (
        <span className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-bright-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
          <Icon name={icon} className="h-5 w-5" />
        </span>
      )}
      {meta && <p className="meta mb-3">{meta}</p>}
      <h3 className="font-display text-[19px] font-semibold leading-[1.3] transition-colors group-hover:text-accent">{title}</h3>
      {text && <p className="mt-2.5 line-clamp-4 text-[15px] leading-relaxed text-ink-soft">{text}</p>}
      <span className="mt-auto flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-bright transition-colors group-hover:text-accent">
        <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
        <Icon name="arrow" className="h-4 w-4" />
      </span>
    </Link>
  );
}

const ctaText = {
  de: { call: "Kostenloses Erstgespräch", note: "Kostenlos & unverbindlich · Antwort innert 1 Arbeitstag" },
  fr: { call: "Premier entretien gratuit", note: "Gratuit et sans engagement · réponse en 1 jour ouvrable" },
};

/** The one consistent pair of next steps: "Projekt anfragen" (form) and the free first call (phone). */
export function HeroCtas({ locale, dark = true, note = false, className = "" }: { locale: Locale; dark?: boolean; note?: boolean; className?: string }) {
  const d = getDict(locale);
  const t = ctaText[locale];
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={href(locale, "request")} variant={dark ? "accent" : "primary"}>
          {d.nav.cta}
        </ButtonLink>
        <ButtonLink href={site.phoneHref} variant={dark ? "ghostLight" : "ghost"} arrow={false} icon="phone">
          {t.call}
        </ButtonLink>
      </div>
      {note && <p className={`mt-4 text-[13.5px] ${dark ? "text-white/55" : "text-muted"}`}>{t.note}</p>}
    </div>
  );
}

export function callLabel(locale: Locale) {
  return ctaText[locale].call;
}

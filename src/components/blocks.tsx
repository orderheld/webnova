import Link from "next/link";
import type { Faq, Locale, Section } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href } from "@/lib/routes";
import { site } from "@/lib/site";
import { ButtonLink } from "./button";
import { Icon } from "./icons";

export function Breadcrumbs({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="meta mb-10 md:mb-14">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">·</span>}
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

/**
 * Editorial page hero on white: breadcrumb meta line, small label, a large keyword H1, the benefit
 * subline and the lead. Optional visual on the right (`aside`) or a drawing behind it (`backdrop`).
 */
export function PageHero({
  eyebrow,
  title,
  subline,
  lead,
  children,
  crumbs,
  aside,
  backdrop,
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
  /** Decorative layer painted behind the hero content (e.g. a city skyline). */
  backdrop?: React.ReactNode;
}) {
  return (
    <section className="relative isolate border-b border-line bg-bg">
      {backdrop}
      <div className={`container-x pt-8 md:pt-10 ${backdrop ? "pb-[clamp(170px,19vw,280px)]" : "pb-16 md:pb-24"}`}>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={aside ? "grid items-end gap-14 lg:grid-cols-12" : ""}>
          <div className={aside ? "lg:col-span-7" : ""}>
            {eyebrow && <p className="eyebrow mb-6 md:mb-8">{eyebrow}</p>}
            {/* The H1 is the LCP element: rendered visible on load, never faded in. */}
            <h1 className={`display text-balance break-words hyphens-auto ${aside ? "max-w-4xl text-[clamp(2.4rem,5vw,4.25rem)]" : "max-w-6xl text-[clamp(2.25rem,6vw,5.25rem)]"}`}>{title}</h1>
            {subline && (
              <p className="mt-5 max-w-3xl font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-snug tracking-[-0.015em] text-accent">{subline}</p>
            )}
            {(lead || children) && (
              <div className={`mt-10 grid gap-8 border-t border-line pt-8 ${aside ? "" : "md:grid-cols-12"}`}>
                {lead && <p className={`text-[18px] leading-relaxed text-ink-soft md:text-[19px] ${aside ? "" : "md:col-span-7"}`}>{lead}</p>}
                {children && <div className={aside ? "" : "md:col-span-5 md:[&>*:first-child]:mt-0"}>{children}</div>}
              </div>
            )}
          </div>
          {aside && (
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[520px]">{aside}</div>
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
    <section id={id} className="container-x section-y scroll-mt-20">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="kicker mb-8">FAQ</p>
          <h2 className="h-section">{d.common.faq}</h2>
          <div className="mt-10 hidden border-t border-line pt-6 md:block">
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
        <div className="border-t border-ink md:col-span-8">
          {faq.map((f, i) => (
            <details key={i} className="group border-b border-line [&_summary::-webkit-details-marker]:hidden">
              <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-start gap-x-3 py-6 font-display text-[18px] font-medium leading-snug tracking-[-0.01em] transition-colors hover:text-accent md:text-[20px]">
                <span className="pt-1 text-[12.5px] font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                {f.q}
                <span aria-hidden="true" className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-all duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-white">
                  <Icon name="plus" className="h-4 w-4" />
                </span>
              </summary>
              <p className="-mt-2 max-w-2xl pb-7 pl-[3.25rem] text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
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

/** Closing call to action before the footer: a large statement on a heavy rule, the owner and the direct lines. */
export function CtaBand({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="container-x pb-20 md:pb-28">
      <div className="grid gap-10 border-t-2 border-accent pt-10 md:grid-cols-12 md:pt-14">
        <div className="md:col-span-7">
          <p className="eyebrow mb-6">{d.cta.badge}</p>
          <h2 className="font-display text-[clamp(2.2rem,4.6vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-balance">{d.cta.title}</h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft md:text-[18px]">{d.cta.text}</p>
          <p className="meta mt-6">{d.lp.trust.join(" · ")}</p>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:self-end">
          <ContactPerson locale={locale} />
          <ButtonLink href={href(locale, "request")} className="mt-6 w-full">
            {d.cta.button}
          </ButtonLink>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ButtonLink href={site.phoneHref} variant="ghost" arrow={false} icon="phone" className="px-3">
              {d.common.callUs}
            </ButtonLink>
            <ButtonLink href={site.whatsappHref} variant="ghost" arrow={false} icon="chat" className="px-3">
              WhatsApp
            </ButtonLink>
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
    <div className="border border-line border-t-[3px] border-t-accent bg-surface p-7 sm:p-8">
      <p className="label mb-4">{d.cta.badge}</p>
      <h2 className="font-display text-[24px] font-semibold leading-tight tracking-[-0.02em]">{title}</h2>
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
  );
}

/** Numbered feature columns on hairlines. `reveal` is kept for compatibility (no effect). */
export function FeatureGrid({ items }: { items: { title: string; text: string }[]; reveal?: boolean }) {
  return (
    <ol className={`grid gap-x-8 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((f, i) => (
        <li key={i} className="border-t border-ink pb-10 pt-6">
          <span className="font-display text-[14px] font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.015em]">{f.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Editorial link tile: heavy top rule, meta line, title, text and an arrow link. `icon` is accepted but not drawn. */
export function CardLink({
  href,
  title,
  text,
  meta,
}: {
  href: string;
  title: string;
  text?: string;
  icon?: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="group flex h-full flex-col border-t border-ink pb-8 pt-6">
      {meta && <p className="meta mb-3">{meta}</p>}
      <h3 className="font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent">{title}</h3>
      {text && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</p>}
      <span className="mt-auto flex items-center gap-2 pt-6 text-[14.5px] font-semibold text-bright transition-colors group-hover:text-accent">
        <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
        <Icon name="arrow" className="h-4 w-4" />
      </span>
    </Link>
  );
}

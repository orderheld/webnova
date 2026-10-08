import { ButtonLink } from "@/components/button";
import Image from "next/image";
import { CtaBand, FeatureGrid, PageHero, Prose } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { ReferenceCard } from "@/components/reference-card";
import { references } from "@/content/references";
import { legal } from "@/content/legal";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import { site, type Weekday } from "@/lib/site";

export function AboutPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <>
      <PageHero
        eyebrow={d.pages.aboutEyebrow}
        title={d.pages.aboutH1}
        lead={d.pages.aboutLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.about }]}
      />
      <section className="container-x grid gap-12 pb-20 pt-14 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={d.pages.aboutSections} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-2xl border border-line bg-surface p-8">
            <ul className="space-y-5 text-[16px]">
              {d.home.why.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{w.title}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href={href(locale, "contact")} variant="dark" className="mt-8 w-full">
              {d.nav.contact}
            </ButtonLink>
          </div>
        </aside>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

export function ReferencesPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <>
      <PageHero
        eyebrow={d.nav.references}
        title={d.pages.referencesH1}
        lead={d.pages.referencesLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.references }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={href(locale, "request")} variant="primary">{d.hero.primary}</ButtonLink>
        </div>
      </PageHero>
      <section className="container-x relative z-10 -mt-10 grid gap-5 pb-24 md:grid-cols-2">
        {references.map((r) => (
          <ReferenceCard key={r.key} r={r} locale={locale} large />
        ))}
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

const refText = {
  de: { challenge: "Ausgangslage", solution: "Unsere Lösung", highlights: "Was das Projekt ausmacht", scope: "Leistungen", more: "Weitere Projekte", all: "Alle Referenzen" },
  fr: { challenge: "Point de départ", solution: "Notre solution", highlights: "Ce qui fait ce projet", scope: "Prestations", more: "Autres projets", all: "Toutes les références" },
};

export function ReferencePage({ locale, refKey }: { locale: Locale; refKey: string }) {
  const d = getDict(locale);
  const t = refText[locale];
  const r = references.find((x) => x.key === refKey)!;
  const c = r.content[locale];
  const url = href(locale, `reference:${r.key}`);
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: d.nav.references, url: href(locale, "references") },
    { name: r.name, url },
  ];
  const others = references.filter((x) => x.key !== r.key);
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero
        eyebrow={[c.industry, c.place].filter(Boolean).join(" · ")}
        title={r.name}
        lead={c.summary}
        crumbs={[crumbs[0], crumbs[1], { name: r.name }]}
      />
      <section className="container-x relative z-10 -mt-10">
        <div className="overflow-hidden rounded-2xl border border-line bg-bg p-3 pb-0 sm:p-5 sm:pb-0">
          <div className="overflow-hidden rounded-t-[16px] border border-b-0 border-line bg-surface">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="ml-2 truncate rounded-full bg-bg px-3 py-0.5 text-[11px] text-muted">{r.domain}</span>
            </div>
            <div className="relative aspect-[16/8]">
              {r.image ? (
                <Image src={r.image} alt={`${r.name}: ${c.industry}`} fill priority sizes="(min-width: 1240px) 1180px, 100vw" className="object-cover object-top" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center" style={{ background: r.colors.bg, color: r.colors.fg }}>
                  <span className="h-1 w-12 rounded-full" style={{ background: r.colors.accent }} />
                  <span className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.04em]">{r.name}</span>
                  <span className="text-[13px] uppercase tracking-[0.25em] opacity-60">{c.industry}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
          <div>
            <p className="eyebrow mb-4">{t.challenge}</p>
            <p className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-snug tracking-[-0.02em]">{c.challenge}</p>
          </div>
          <div>
            <p className="eyebrow mb-4">{t.solution}</p>
            <div className="space-y-5 text-[17px] leading-[1.75] text-ink-soft">
              {c.solution.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-2xl border border-line bg-surface p-8">
            <p className="text-[13px] uppercase tracking-[0.12em] text-muted">{t.scope}</p>
            <ul className="mt-4 space-y-3">
              {c.scope.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <ButtonLink href={href(locale, "request")} className="mt-8 w-full">
              {d.nav.cta}
            </ButtonLink>
          </div>
        </aside>
      </section>

      <section className="container-x pb-20">
        <h2 className="h-section mb-10">{t.highlights}</h2>
        <FeatureGrid items={c.highlights} />
      </section>

      <section className="container-x pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="h-section">{t.more}</h2>
          <ButtonLink href={href(locale, "references")} variant="ghost">
            {t.all}
          </ButtonLink>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {others.map((o) => (
            <ReferenceCard key={o.key} r={o} locale={locale} />
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

const dayShort: Record<Locale, Record<Weekday, string>> = {
  de: { Monday: "Mo", Tuesday: "Di", Wednesday: "Mi", Thursday: "Do", Friday: "Fr", Saturday: "Sa", Sunday: "So" },
  fr: { Monday: "lu", Tuesday: "ma", Wednesday: "me", Thursday: "je", Friday: "ve", Saturday: "sa", Sunday: "di" },
};

function dayRange(locale: Locale, days: Weekday[]) {
  const t = dayShort[locale];
  return days.length > 2 ? `${t[days[0]]}–${t[days[days.length - 1]]}` : days.map((x) => t[x]).join(", ");
}

export function ContactPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const mapsHref =
    site.google.maps ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Webnova ${site.address.street} ${site.address.zip} ${site.address.city}`)}`;
  const channels = [
    { icon: "phone", label: d.common.callUs, value: site.phone, href: site.phoneHref },
    { icon: "mail", label: d.common.writeUs, value: site.email, href: `mailto:${site.email}` },
    { icon: "chat", label: d.common.whatsapp, value: site.phone, href: site.whatsappHref },
  ];
  return (
    <>
      <PageHero
        eyebrow={d.pages.contactEyebrow}
        title={d.pages.contactH1}
        lead={d.pages.contactLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.contact }]}
      />
      <section className="container-x relative z-10 -mt-10 grid gap-10 pb-24 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group flex items-center gap-5 rounded-2xl border border-line bg-surface p-6 transition-all hover:border-ink/30"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-bg text-ink transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon name={c.icon} />
              </span>
              <span>
                <span className="block text-[13px] text-muted">{c.label}</span>
                <span className="block font-display text-[19px] font-semibold tracking-tight">{c.value}</span>
              </span>
            </a>
          ))}
          <div className="rounded-2xl border border-line bg-surface p-6 ">
            <p className="text-[13px] uppercase tracking-[0.12em] text-muted">{d.pages.office}</p>
            <p className="mt-3 text-[18px] leading-snug">
              Webnova
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {locale === "fr" ? "Granges (SO)" : `${site.address.city} SO`}
            </p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[14px] text-ink underline-offset-4 hover:underline"
            >
              {d.pages.openInMaps} <Icon name="arrowUpRight" className="h-4 w-4" />
            </a>
            {site.openingHours.length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[13px] uppercase tracking-[0.12em] text-muted">{d.pages.hours}</p>
                <dl className="mt-3 space-y-1 text-[15px]">
                  {site.openingHours.map((h) => (
                    <div key={h.days.join()} className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{dayRange(locale, h.days)}</dt>
                      <dd>
                        {h.opens}–{h.closes}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {site.google.review && (
              <ButtonLink href={site.google.review} variant="ghost" arrow={false} className="mt-6 w-full">
                {d.pages.reviewOnGoogle}
              </ButtonLink>
            )}
          </div>
        </div>
        <div className="lg:col-span-7">
          <LeadForm
            locale={locale}
            t={d.form}
            thanksHref={href(locale, "thanks")}
            privacyHref={href(locale, "legal:datenschutz")}
            source="kontakt"
          />
        </div>
      </section>
    </>
  );
}

export function RequestPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-surface">
      <div className="container-x grid gap-12 pb-24 pt-10 md:pt-16 lg:grid-cols-12">
        <div className="animate-rise lg:col-span-4">
          <p className="eyebrow mb-6">
            {d.common.free}
          </p>
          <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">{d.form.title}</h1>
          <p className="mt-6 text-[18px] leading-relaxed text-ink-soft">{d.form.lead}</p>
          <ul className="mt-10 space-y-4 text-[15px] text-ink-soft">
            {d.lp.trust.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-white">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-line pt-8 text-[15px] text-ink-soft">
            <a href={site.phoneHref} className="flex items-center gap-3 hover:text-ink">
              <Icon name="phone" className="h-4 w-4 text-ink" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="mt-3 flex items-center gap-3 hover:text-ink">
              <Icon name="mail" className="h-4 w-4 text-ink" /> {site.email}
            </a>
          </div>
        </div>
        <div className="animate-rise [animation-delay:150ms] lg:col-span-8">
          <LeadForm locale={locale} t={d.form} thanksHref={href(locale, "thanks")} privacyHref={href(locale, "legal:datenschutz")} />
        </div>
      </div>
    </section>
  );
}

export function ThanksPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-surface">
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center py-24">
        <span className="relative mb-8 grid h-20 w-20 animate-pop place-items-center rounded-full bg-accent text-white">
          <Icon name="check" className="relative h-9 w-9" strokeWidth={2.6} />
        </span>
        <h1 className="display max-w-3xl animate-rise text-[clamp(2.4rem,6vw,4.8rem)]">{d.thanks.title}</h1>
        <p className="mt-6 max-w-xl animate-rise text-[19px] leading-relaxed text-ink-soft [animation-delay:120ms]">{d.thanks.text}</p>
        <ButtonLink href={href(locale, "home")} className="mt-10">
          {d.thanks.back}
        </ButtonLink>
      </div>
    </section>
  );
}

export function LegalPage({ locale, legalKey }: { locale: Locale; legalKey: keyof typeof legal }) {
  const d = getDict(locale);
  const l = legal[legalKey][locale];
  return (
    <>
      <PageHero title={l.title} crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: l.title }]} />
      <section className="container-x pb-24 pt-10 md:pt-14">
        <div className="max-w-3xl">
          <Prose sections={l.sections} />
        </div>
      </section>
    </>
  );
}

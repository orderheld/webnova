import { ButtonLink } from "@/components/button";
import Image from "next/image";
import { ContactPerson, CtaBand, FeatureGrid, HeroCtas, PageHero, Prose, TrustList } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { ContactList, PortraitCard } from "@/components/editorial";
import { LeadForm } from "@/components/lead-form";
import { ReferenceCard } from "@/components/reference-card";
import { references } from "@/content/references";
import { legal } from "@/content/legal";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { JsonLd, breadcrumbLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

export function AboutPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.about, url: href(locale, "about") }])} />
      <PageHero
        eyebrow={d.pages.aboutEyebrow}
        title={d.pages.aboutH1}
        lead={d.pages.aboutLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.about }]}
        aside={<PortraitCard locale={locale} priority className="mx-auto max-w-[380px]" />}
      >
        <HeroCtas locale={locale} />
      </PageHero>
      <section className="container-x grid gap-12 pb-20 pt-14 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={d.pages.aboutSections} />
        </div>
        <aside className="lg:col-span-4">
          <div className="card sticky top-28 p-8">
            <ContactPerson locale={locale} />
            <ul className="mt-7 space-y-4 border-t border-line pt-7 text-[16px]">
              {d.home.why.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-bright-soft text-bright">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{w.title}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href={href(locale, "request")} className="mt-8 w-full">
              {d.nav.cta}
            </ButtonLink>
            <ButtonLink href={href(locale, "contact")} variant="ghost" arrow={false} className="mt-3 w-full">
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
      <JsonLd data={breadcrumbLd([{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.references, url: href(locale, "references") }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: d.pages.referencesMetaTitle,
          itemListElement: references.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: r.name,
            url: `${site.url}${href(locale, `reference:${r.key}`)}`,
          })),
        }}
      />
      <PageHero
        eyebrow={d.nav.references}
        title={d.pages.referencesH1}
        lead={d.pages.referencesLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.references }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={href(locale, "request")} variant="accent">{d.nav.cta}</ButtonLink>
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: `${r.name}: ${c.industry}`,
          description: c.summary,
          url: `${site.url}${url}`,
          inLanguage: locale === "de" ? "de-CH" : "fr-CH",
          creator: { "@id": orgId },
          about: { "@type": "Organization", name: r.name, url: `https://${r.domain}` },
          keywords: c.scope.join(", "),
          ...(r.image && { image: `${site.url}${r.image}` }),
        }}
      />
      <PageHero
        eyebrow={[c.industry, c.place].filter(Boolean).join(" · ")}
        title={r.name}
        lead={c.summary}
        crumbs={[crumbs[0], crumbs[1], { name: r.name }]}
      />
      <section className="container-x relative z-10 -mt-10">
        <div className="overflow-hidden rounded-3xl border border-line bg-bg-2 p-3 pb-0 shadow-lift sm:p-5 sm:pb-0">
          <div className="overflow-hidden rounded-t-[16px] border border-b-0 border-line bg-surface">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="ml-2 truncate rounded-full bg-bg-2 px-3 py-0.5 text-[11px] text-muted">{r.domain}</span>
            </div>
            <div className="relative aspect-[16/8]">
              {r.image ? (
                <Image src={r.image} alt={`${r.name}: ${c.industry}`} fill priority sizes="(min-width: 1240px) 1180px, 100vw" className="object-cover object-top" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center" style={{ background: r.colors.bg, color: r.colors.fg }}>
                  <span className="h-1 w-12 rounded-full" style={{ background: r.colors.accent }} />
                  <span className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.015em]">{r.name}</span>
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
            <p className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-snug tracking-[-0.01em]">{c.challenge}</p>
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
          <div className="card sticky top-28 p-8">
            <p className="eyebrow">{t.scope}</p>
            <ul className="mt-4 space-y-3">
              {c.scope.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-bright-soft text-bright">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <ButtonLink href={href(locale, "request")} className="mt-8 w-full">
              {d.nav.cta}
            </ButtonLink>
            <p className="mt-3 text-center text-[13px] text-muted">{d.common.free}</p>
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

export function ContactPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const mapsHref =
    site.google.maps ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Webnova ${site.address.street} ${site.address.zip} ${site.address.city}`)}`;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.contact, url: href(locale, "contact") }])} />
      <PageHero
        eyebrow={d.pages.contactEyebrow}
        title={d.pages.contactH1}
        lead={d.pages.contactLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.contact }]}
        aside={<PortraitCard locale={locale} priority className="mx-auto max-w-[340px]" />}
      />
      <section className="container-x grid gap-12 pb-24 pt-14 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="kicker mb-8">{d.nav.contact}</p>
          <ContactPerson locale={locale} />
          <TrustList locale={locale} className="mb-8 mt-6" />
          <ContactList locale={locale} hours />
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6 text-[14px]">
            {d.pages.openInMaps} <Icon name="arrow" className="h-4 w-4 -rotate-45" />
          </a>
          {site.google.review && (
            <ButtonLink href={site.google.review} variant="ghost" arrow={false} className="mt-6 w-full">
              {d.pages.reviewOnGoogle}
            </ButtonLink>
          )}
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
    <section className="surface-tint relative isolate overflow-hidden border-b border-line">
      <div className="container-x grid gap-10 pb-20 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-24">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">
            {d.common.free}
          </p>
          <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">{d.form.title}</h1>
          <p className="mt-6 text-[18px] leading-relaxed text-ink-soft">{d.form.lead}</p>
          <TrustList locale={locale} className="mt-8" />
          <div className="mt-10 hidden border-t border-line pt-8 lg:block">
            <ContactPerson locale={locale} />
            <div className="mt-5 space-y-2.5 text-[15px] text-ink-soft">
              <a href={site.phoneHref} className="flex items-center gap-3 transition-colors hover:text-accent">
                <Icon name="phone" className="h-4 w-4 text-bright" /> {site.phone}
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-accent">
                <Icon name="chat" className="h-4 w-4 text-bright" /> WhatsApp
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition-colors hover:text-accent">
                <Icon name="mail" className="h-4 w-4 text-bright" /> {site.email}
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <LeadForm locale={locale} t={d.form} thanksHref={href(locale, "thanks")} privacyHref={href(locale, "legal:datenschutz")} />
          <div className="mt-8 border-t border-line pt-8 lg:hidden">
            <ContactPerson locale={locale} />
            <div className="mt-5 flex flex-wrap gap-2">
              <ButtonLink href={site.phoneHref} variant="ghost" arrow={false} icon="phone">{site.phone}</ButtonLink>
              <ButtonLink href={site.whatsappHref} variant="ghost" arrow={false} icon="chat">WhatsApp</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const nextSteps = {
  de: {
    title: "So geht es weiter",
    steps: [
      { title: "Wir sehen uns Ihre Angaben an", text: "Ihre Anfrage geht direkt an Ferhat Demir, Ihren persönlichen Ansprechpartner." },
      { title: "Persönliche Antwort", text: "Innert eines Arbeitstages melden wir uns, so wie Sie es gewünscht haben." },
      { title: "Kostenloses Erstgespräch", text: "Wir klären Ziele und Umfang. Danach erhalten Sie eine transparente Offerte." },
    ],
    meanwhile: "In der Zwischenzeit",
  },
  fr: {
    title: "La suite",
    steps: [
      { title: "Nous examinons vos informations", text: "Votre demande arrive directement chez Ferhat Demir, votre interlocuteur personnel." },
      { title: "Réponse personnelle", text: "Nous vous répondons en un jour ouvrable, par le moyen que vous avez choisi." },
      { title: "Premier entretien gratuit", text: "Nous clarifions objectifs et envergure. Vous recevez ensuite un devis transparent." },
    ],
    meanwhile: "En attendant",
  },
};

export function ThanksPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const t = nextSteps[locale];
  return (
    <section className="surface-tint relative isolate overflow-hidden border-b border-line">
      <div className="container-x py-20 md:py-28">
        <span className="mb-8 grid h-16 w-16 animate-pop place-items-center rounded-full bg-accent text-white shadow-lift">
          <Icon name="check" className="h-8 w-8" strokeWidth={2.6} />
        </span>
        <h1 className="display max-w-3xl text-[clamp(2.4rem,6vw,4.4rem)]">{d.thanks.title}</h1>
        <p className="mt-6 max-w-xl text-[19px] leading-relaxed text-ink-soft">{d.thanks.text}</p>

        <h2 className="eyebrow mb-5 mt-14">{t.title}</h2>
        <ol className="grid max-w-5xl gap-4 md:grid-cols-3">
          {t.steps.map((s, n) => (
            <li key={s.title} className="card p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-bright-soft font-display text-[14px] font-semibold text-bright">{n + 1}</span>
              <h3 className="mt-5 font-display text-[18px] font-semibold tracking-[-0.01em]">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <ButtonLink href={href(locale, "home")}>{d.thanks.back}</ButtonLink>
          <ButtonLink href={href(locale, "guides")} variant="ghost" arrow={false}>
            {t.meanwhile}: {d.nav.guides}
          </ButtonLink>
        </div>
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
      <section className="container-x pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="max-w-3xl">
          <Prose sections={l.sections} />
        </div>
      </section>
    </>
  );
}

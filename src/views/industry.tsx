import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList, FeatureGrid, HeroCtas, PageHero, Prose, callLabel } from "@/components/blocks";
import { Art, ServiceArt } from "@/components/service-art";
import type { SampleKey } from "@/components/visuals";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { ReferenceCard } from "@/components/reference-card";
import { ContactSection, FaqSection, FitSection, LocationsSection, NextSteps, ProcessSection, TrustFacts } from "@/components/sections";
import { serviceFaqTemplates, topUpFaq } from "@/content/structure";
import { guides } from "@/content/guides";
import { industries } from "@/content/industries";
import { industryUi } from "@/content/industries/ui";
import { problems } from "@/content/problems";
import { references } from "@/content/references";
import { services } from "@/content/services";
import type { LeadService, Locale, Point } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href } from "@/lib/routes";
import { JsonLd, breadcrumbLd, faqLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

const FORM_ID = "anfrage";

/* ---------- Hubs ---------- */

export function IndustriesPage({ locale, focus }: { locale: Locale; focus: "industries" | "problems" }) {
  const d = getDict(locale);
  const u = industryUi[locale];
  const isProblems = focus === "problems";
  const self = isProblems ? u.problems : u.industries;
  const crumbs = [{ name: d.common.home, url: href(locale, "home") }, { name: self, url: href(locale, focus) }];

  const industryGrid = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {industries.map((i) => (
        <CardLink
          key={i.key}
          href={href(locale, `industry:${i.key}`)}
          icon={i.icon}
          title={i.content[locale].navLabel}
          text={i.content[locale].needsLead}
        />
      ))}
      <div className="reveal flex flex-col justify-between gap-8 rounded-2xl bg-accent p-7 text-white sm:col-span-2">
        <div>
          <h3 className="font-display text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold leading-tight tracking-[-0.015em]">{u.otherTitle}</h3>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">{u.otherText}</p>
        </div>
        <div>
          <ButtonLink href={href(locale, "request")} variant="accent">
            {d.nav.cta}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
  const problemGrid = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {problems.map((p) => (
        <CardLink
          key={p.key}
          href={href(locale, `problem:${p.key}`)}
          icon={p.icon}
          title={p.content[locale].navLabel}
          text={p.content[locale].h1}
        />
      ))}
    </div>
  );
  const industriesBlock = (
    <SectionHead eyebrow={u.industries} title={u.hubIndustriesTitle} lead={u.hubIndustriesLead}>
      {industryGrid}
    </SectionHead>
  );
  const problemsBlock = (
    <SectionHead eyebrow={u.hubProblemsEyebrow} title={u.hubProblemsTitle} lead={u.hubProblemsLead}>
      {problemGrid}
    </SectionHead>
  );

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: (isProblems ? problems.map((p) => `problem:${p.key}`) : industries.map((i) => `industry:${i.key}`)).map((id, n) => ({
            "@type": "ListItem",
            position: n + 1,
            url: `${site.url}${href(locale, id)}`,
          })),
        }}
      />
      <PageHero
        eyebrow={isProblems ? u.problemsEyebrow : u.hubEyebrow}
        title={isProblems ? u.problemsH1 : u.hubH1}
        lead={isProblems ? u.problemsLead : u.hubLead}
        crumbs={[crumbs[0], { name: self }]}
        aside={isProblems ? <Art kind="seo" locale={locale} dark /> : <Art kind="website" sample="restaurant" locale={locale} dark />}
      >
        <HeroCtas locale={locale} />
      </PageHero>
      <section className="container-x py-20 md:py-28">{isProblems ? problemsBlock : industriesBlock}</section>
      <section className="bg-bg-2 py-20 md:py-28">
        <div className="container-x">{isProblems ? industriesBlock : problemsBlock}</div>
      </section>
      <div className="pt-20 md:pt-28">
        <CtaBand locale={locale} />
      </div>
    </>
  );
}

/* ---------- Industry page ---------- */

export function IndustryPage({ locale, industryKey }: { locale: Locale; industryKey: string }) {
  const d = getDict(locale);
  const u = industryUi[locale];
  const ind = industries.find((x) => x.key === industryKey)!;
  const c = ind.content[locale];
  const url = href(locale, `industry:${ind.key}`);
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: u.industries, url: href(locale, "industries") },
    { name: c.navLabel, url },
  ];
  const ref = ind.reference && hasRoute(`reference:${ind.reference}`) ? references.find((r) => r.key === ind.reference) : undefined;
  const others = industries.filter((x) => x.key !== ind.key);
  const relatedProblems = problems.filter((p) => p.industries.includes(ind.key));

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.h1,
          description: c.meta.description,
          serviceType: locale === "de" ? "Webdesign" : "Création de site internet",
          audience: { "@type": "BusinessAudience", name: c.navLabel },
          provider: { "@id": orgId },
          areaServed: { "@type": "Country", name: "Switzerland" },
          url: `${site.url}${url}`,
        }}
      />

      <PageHero
        eyebrow={c.eyebrow}
        title={c.h1}
        lead={c.lead}
        crumbs={[crumbs[0], crumbs[1], { name: c.navLabel }]}
        aside={industryArt(ind.key, locale)}
      >
        <HeroButtons locale={locale} />
      </PageHero>

      <TrustFacts locale={locale} />

      <section className="container-x py-20 md:py-28">
        <div className="mb-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="kicker mb-6">{u.painEyebrow}</p>
            <h2 className="h-section">{c.painTitle}</h2>
          </div>
          <div className="lg:col-span-5">
            <CheckCard title={u.promisesTitle} items={c.promises} locale={locale} />
          </div>
        </div>
        <FeatureGrid items={c.pains} />
      </section>

      <NightGrid eyebrow={u.needsEyebrow} title={c.needsTitle} lead={c.needsLead} items={c.needs} />

      <ProseWithAside locale={locale} sections={c.sections} ctaTitle={c.ctaTitle} ctaText={c.ctaText} />

      {ref && (
        <section className="container-x py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="reveal lg:col-span-5">
              <p className="kicker mb-8">{u.proofEyebrow}</p>
              <h2 className="h-section">{u.proofTitle}</h2>
              <p className="mt-6 text-[18px] leading-relaxed text-ink-soft">{u.proofText}</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <ReferenceCard r={ref} locale={locale} />
            </div>
          </div>
        </section>
      )}

      <ServiceCards locale={locale} keys={ind.services} />

      <ProcessSection locale={locale} />

      <FitSection locale={locale} />

      <NextSteps locale={locale} />

      <ContactSection locale={locale} />

      <GuideCards locale={locale} keys={ind.guides} />

      <FaqSection
        locale={locale}
        faq={topUpFaq(
          c.faq,
          serviceFaqTemplates(
            locale,
            c.navLabel,
            false,
            locale === "de" ? `Was kostet eine Webseite für ${c.navLabel}?` : `Combien coûte un site pour le secteur ${c.navLabel} ?`,
          ),
          9,
        )}
      />

      <Chips
        label={u.problems}
        links={relatedProblems.map((p) => ({ href: href(locale, `problem:${p.key}`), label: p.content[locale].navLabel }))}
      />
      <Chips
        label={u.otherIndustries}
        links={others.map((x) => ({ href: href(locale, `industry:${x.key}`), label: x.content[locale].navLabel }))}
      />

      <LocationsSection locale={locale} />

      <FormSection locale={locale} title={c.ctaTitle} text={c.ctaText} preset={ind.preset} industry={c.formLabel} source={`branche-${ind.key}`} />
    </>
  );
}

/* ---------- Problem page ---------- */

export function ProblemPage({ locale, problemKey }: { locale: Locale; problemKey: string }) {
  const d = getDict(locale);
  const u = industryUi[locale];
  const p = problems.find((x) => x.key === problemKey)!;
  const c = p.content[locale];
  const url = href(locale, `problem:${p.key}`);
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: u.problems, url: href(locale, "problems") },
    { name: c.navLabel, url },
  ];
  const inds = p.industries.map((k) => industries.find((i) => i.key === k)).filter((x) => x !== undefined);
  const others = problems.filter((x) => x.key !== p.key);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.h1,
          description: c.meta.description,
          serviceType: c.navLabel,
          provider: { "@id": orgId },
          areaServed: { "@type": "Country", name: "Switzerland" },
          url: `${site.url}${url}`,
        }}
      />
      <JsonLd data={faqLd(c.faq)} />

      <PageHero
        eyebrow={c.eyebrow}
        title={c.h1}
        lead={c.lead}
        crumbs={[crumbs[0], crumbs[1], { name: c.navLabel }]}
        aside={<ServiceArt service={p.services[0] ?? "webdesign"} locale={locale} dark />}
      >
        <HeroButtons locale={locale} />
      </PageHero>

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker mb-6">{u.causesEyebrow}</p>
            <h2 className="h-section">{c.causesTitle}</h2>
            <div className="mt-10">
              <CheckCard title={c.symptomsTitle} items={c.symptoms} locale={locale} numbered />
            </div>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {c.causes.map((w, n) => (
              <li key={n} className="card-soft reveal mb-3 grid grid-cols-[3rem_1fr] gap-4 p-6">
                <span className="num-tile">{String(n + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[20px] font-semibold tracking-tight">{w.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{w.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <NightGrid eyebrow={u.solutionEyebrow} title={c.solutionTitle} lead={c.solutionLead} items={c.steps} numbered />

      <ProseWithAside locale={locale} sections={c.sections} ctaTitle={c.ctaTitle} ctaText={c.ctaText} />

      <ServiceCards locale={locale} keys={p.services} />

      <GuideCards locale={locale} keys={p.guides} />

      <FaqList locale={locale} faq={c.faq} />

      <Chips label={u.commonIn} links={inds.map((i) => ({ href: href(locale, `industry:${i.key}`), label: i.content[locale].navLabel }))} />
      <Chips label={u.problems} links={others.map((x) => ({ href: href(locale, `problem:${x.key}`), label: x.content[locale].navLabel }))} />

      <FormSection locale={locale} title={c.ctaTitle} text={c.ctaText} preset={p.preset} source={`loesung-${p.key}`} />
    </>
  );
}

/* ---------- Shared pieces (built only from existing tokens and patterns) ---------- */

function SectionHead({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <>
      <div className="mb-12 md:mb-16">
        <p className="kicker mb-5">{eyebrow}</p>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <h2 className="h-section md:col-span-8">{title}</h2>
          {lead && <p className="text-[16.5px] leading-relaxed text-ink-soft md:col-span-4">{lead}</p>}
        </div>
      </div>
      {children}
    </>
  );
}

function HeroButtons({ locale }: { locale: Locale }) {
  const u = industryUi[locale];
  return (
    <div className="mt-9 flex flex-wrap gap-3">
      <ButtonLink href={`#${FORM_ID}`} variant="accent">
        {u.heroCta}
      </ButtonLink>
      <ButtonLink href={site.phoneHref} variant="ghostLight" arrow={false} icon="phone">
        {callLabel(locale)}
      </ButtonLink>
    </div>
  );
}

const industrySample: Record<string, SampleKey> = {
  "coiffeur-beauty": "coiffeur",
  fitness: "coiffeur",
  gastronomie: "restaurant",
  "cafe-baeckerei": "restaurant",
  handwerk: "schreinerei",
  autogewerbe: "schreinerei",
  immobilien: "schreinerei",
  treuhand: "treuhand",
  praxis: "treuhand",
};

/** Hero visual for an industry page: a fictional sample design from a fitting branch, or the shop scene. */
function industryArt(key: string, locale: Locale) {
  if (key === "detailhandel") return <Art kind="shop" locale={locale} dark />;
  return <Art kind="website" sample={industrySample[key] ?? "treuhand"} locale={locale} dark />;
}

function CheckCard({ title, items, locale, numbered = false }: { title: string; items: string[]; locale: Locale; numbered?: boolean }) {
  const d = getDict(locale);
  return (
    <div className="rounded-3xl bg-surface p-7 text-ink shadow-lift ring-1 ring-line sm:p-8">
      <p className="label mb-6">{title}</p>
      <ul className="space-y-4 text-[16px] leading-snug text-ink-soft">
        {items.map((t, n) => (
          <li key={t} className="flex items-start gap-3">
            {numbered ? (
              <span className="w-7 shrink-0 pt-0.5 font-display text-[14px] font-semibold text-bright">{String(n + 1).padStart(2, "0")}</span>
            ) : (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-white">
                <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
              </span>
            )}
            <span className={numbered ? "" : "pt-0.5"}>{t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t border-line pt-6">
        <ButtonLink href={`#${FORM_ID}`} className="w-full">
          {d.nav.cta}
        </ButtonLink>
        <p className="mt-3 text-center text-[13px] text-muted">{d.common.free}</p>
      </div>
    </div>
  );
}

function NightGrid({ eyebrow, title, lead, items, numbered = false }: { eyebrow: string; title: string; lead: string; items: Point[]; numbered?: boolean }) {
  return (
    <section className="stage-night py-20 text-white md:py-28">
      <div className="container-x">
        <div className="mb-12 md:mb-16">
          <p className="kicker-light mb-5">{eyebrow}</p>
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <h2 className="h-section md:col-span-8">{title}</h2>
            <p className="text-[16.5px] leading-relaxed text-white/70 md:col-span-4">{lead}</p>
          </div>
        </div>
        <div className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((it, n) => (
            <div key={it.title} className="card-glass reveal flex flex-col p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-display text-[14px] font-semibold tabular-nums text-accent">
                {numbered ? String(n + 1).padStart(2, "0") : <Icon name="check" className="h-4 w-4" strokeWidth={2.8} />}
              </span>
              <h3 className="mt-5 font-display text-[20px] font-semibold leading-snug tracking-[-0.01em]">{it.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProseWithAside({ locale, sections, ctaTitle, ctaText }: { locale: Locale; sections: { h2: string; paragraphs: string[]; bullets?: string[] }[]; ctaTitle: string; ctaText: string }) {
  const d = getDict(locale);
  return (
    <section className="container-x grid gap-12 py-12 md:py-16 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <Prose sections={sections} />
      </div>
      <aside className="lg:col-span-4 lg:pt-14">
        <div className="sticky top-28 overflow-hidden rounded-3xl bg-surface p-8 shadow-card ring-1 ring-line">
          <h2 className="font-display text-[24px] font-semibold leading-[1.25]">{ctaTitle}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{ctaText}</p>
          <ButtonLink href={`#${FORM_ID}`} className="mt-8 w-full">
            {d.nav.cta}
          </ButtonLink>
          <p className="mt-4 text-center text-[13px] text-muted">{d.common.free}</p>
        </div>
      </aside>
    </section>
  );
}

function ServiceCards({ locale, keys }: { locale: Locale; keys: string[] }) {
  const u = industryUi[locale];
  const list = keys.map((k) => services.find((s) => s.key === k)).filter((x) => x !== undefined);
  if (!list.length) return null;
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHead eyebrow={u.servicesEyebrow} title={u.servicesTitle}>
        <div className={`grid gap-4 sm:grid-cols-2 ${list.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {list.map((s) => (
            <CardLink key={s.key} href={href(locale, `service:${s.key}`)} icon={s.icon} title={s.content[locale].navLabel} text={s.content[locale].lead} />
          ))}
        </div>
      </SectionHead>
    </section>
  );
}

function GuideCards({ locale, keys }: { locale: Locale; keys: string[] }) {
  const d = getDict(locale);
  const u = industryUi[locale];
  const list = keys
    .filter((k) => hasRoute(`guide:${k}`))
    .map((k) => guides.find((g) => g.key === k))
    .filter((x) => x !== undefined);
  if (!list.length) return null;
  return (
    <section className="container-x pt-20 md:pt-28">
      <SectionHead eyebrow={u.guidesEyebrow} title={u.guidesTitle}>
        <div className="grid gap-4 md:grid-cols-3">
          {list.map((g) => (
            <CardLink
              key={g.key}
              href={href(locale, `guide:${g.key}`)}
              meta={`${g.readingMinutes} ${d.common.minutes}`}
              title={g.content[locale].h1}
              text={g.content[locale].lead}
            />
          ))}
        </div>
      </SectionHead>
    </section>
  );
}

function Chips({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  if (!links.length) return null;
  return (
    <section className="container-x pb-10">
      <p className="eyebrow mb-4">{label}</p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function FormSection({
  locale,
  title,
  text,
  preset,
  industry = "",
  source,
}: {
  locale: Locale;
  title: string;
  text: string;
  preset: LeadService[];
  industry?: string;
  source: string;
}) {
  const d = getDict(locale);
  const u = industryUi[locale];
  return (
    <section id={FORM_ID} className="stage-night mt-10 scroll-mt-20 py-20 text-white md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5 lg:pt-6">
          <p className="eyebrow mb-5 !text-accent-light">{u.formEyebrow}</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.015em]">{title}</h2>
          <p className="mt-6 text-[18px] leading-relaxed text-white/75">{text}</p>
          <ul className="mt-10 space-y-4 text-[15px] text-white/80">
            {d.lp.trust.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-accent">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-3 border-t border-white/10 pt-8 text-[15px]">
            <a href={site.phoneHref} className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
              <Icon name="phone" className="h-4 w-4 text-accent-light" /> {site.phone}
            </a>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
              <Icon name="chat" className="h-4 w-4 text-accent-light" /> {d.common.whatsapp}
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <LeadForm
            locale={locale}
            t={d.form}
            thanksHref={href(locale, "thanks")}
            privacyHref={href(locale, "legal:datenschutz")}
            source={source}
            preset={preset}
            presetIndustry={industry}
            dark
          />
        </div>
      </div>
    </section>
  );
}


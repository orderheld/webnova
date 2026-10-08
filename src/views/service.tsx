import Link from "next/link";
import { CardLink, CtaBand, CtaCard, FeatureGrid, HeroCtas, PageHero, Prose } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { ServiceArt } from "@/components/service-art";
import {
  BenefitsSection,
  ContactSection,
  FaqSection,
  FitSection,
  LocationsSection,
  NextSteps,
  ProblemsSection,
  ProcessSection,
  SectionHead,
  ServicesGrid,
} from "@/components/sections";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { industries } from "@/content/industries";
import { industryUi } from "@/content/industries/ui";
import { problems } from "@/content/problems";
import { services } from "@/content/services";
import { localServices } from "@/content/local";
import type { Locale } from "@/content/types";
import { serviceFaqTemplates, serviceSublines, structure, topUpFaq } from "@/content/structure";
import { getDict } from "@/i18n/dict";
import { serviceGroups } from "@/lib/nav";
import { hasRoute, href, localId } from "@/lib/routes";
import { JsonLd, breadcrumbLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

export function ServicesPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  // Same grouping as the mega menu; services added later appear automatically.
  const groups = serviceGroups(locale);
  const checkHref = hasRoute("page:website-check") ? href(locale, "page:website-check") : undefined;
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: d.common.home, url: href(locale, "home") },
          { name: d.pages.servicesTitle, url: href(locale, "services") },
        ])}
      />
      <PageHero
        eyebrow={d.pages.servicesTitle}
        title={d.pages.servicesH1}
        lead={d.pages.servicesLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.pages.servicesTitle }]}
        aside={<ServiceArt service="webdesign" locale={locale} dark />}
      >
        <HeroCtas locale={locale} />
      </PageHero>
      {groups.map((g, gi) => {
        // Services are the cards (four per row when they fill it); the free check is a slim row below them.
        const cards = g.items.filter((it) => it.href !== checkHref);
        const check = g.items.find((it) => it.href === checkHref);
        return (
          <section key={g.key} className={`container-x pb-20 ${gi === 0 ? "pt-16 md:pt-24" : ""}`}>
            <h2 className="eyebrow mb-6">{g.label}</h2>
            <div className={`grid gap-4 sm:grid-cols-2 ${cards.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {cards.map((it) => (
                <CardLink key={it.href} href={it.href} icon={it.icon} title={it.label} text={it.text} />
              ))}
            </div>
            {check && (
              <Link
                href={check.href}
                className="group mt-4 flex items-center gap-4 rounded-2xl bg-bright-soft p-5 ring-1 ring-inset ring-line transition-colors hover:ring-accent/30 sm:px-6"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-accent">
                  <Icon name={check.icon} className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[17px] font-semibold transition-colors group-hover:text-accent">{check.label}</span>
                  {check.text && <span className="mt-0.5 block text-[14.5px] leading-relaxed text-ink-soft">{check.text}</span>}
                </span>
                <Icon name="arrow" className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </section>
        );
      })}
      <FitSection locale={locale} />
      <NextSteps locale={locale} />
      <div className="pt-20 md:pt-28">
        <CtaBand locale={locale} />
      </div>
    </>
  );
}

export function ServicePage({ locale, serviceKey }: { locale: Locale; serviceKey: string }) {
  const d = getDict(locale);
  const st = structure[locale];
  const s = services.find((x) => x.key === serviceKey)!;
  const c = s.content[locale];
  const url = href(locale, `service:${s.key}`);
  const pos = s.group === "pos";
  // Local landing pages for this service: its own city pages, else SEO or webdesign per city.
  const local = localServices.filter((l) => l.service === s.key);
  const regionLinks = local.length
    ? local.map((l) => ({
        href: href(locale, localId(s.key, l.city)),
        label: `${c.navLabel} ${cities.find((x) => x.key === l.city)!.content[locale].name}`,
      }))
    : s.key === "seo"
      ? cities
          .filter((x) => x.seo)
          .map((x) => ({ href: href(locale, `citySeo:${x.key}`), label: `${c.navLabel} ${x.content[locale].name}` }))
      : !pos
        ? cities.filter((x) => x.priority === "A").map((x) => ({
            href: href(locale, `city:${x.key}`),
            label: `${locale === "de" ? "Webdesign" : "Site internet"} ${x.content[locale].name}`,
          }))
        : [];
  const industryLinks = industries
    .filter((i) => i.services.some((k) => k === s.key || (s.key === "kassensystem" && k.startsWith("kassensystem-"))))
    .map((i) => ({ href: href(locale, `industry:${i.key}`), label: i.content[locale].navLabel }));
  const problemKeys = problems.filter((p) => p.services.includes(s.key)).map((p) => p.key);
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: d.pages.servicesTitle, url: href(locale, "services") },
    { name: c.navLabel, url },
  ];
  const serviceGuides = guides.filter((g) => g.related.includes(s.key)).slice(0, 3);
  const faq = topUpFaq(c.faq, serviceFaqTemplates(locale, c.navLabel, pos), 10);
  const benefits = c.benefits ?? (pos ? st.posBenefits : d.home.why);
  const hasProcess = !pos || Boolean(c.process);
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
          areaServed: [
            { "@type": "Country", name: locale === "de" ? "Schweiz" : "Suisse" },
            ...cities.filter((x) => x.priority === "A").map((x) => ({ "@type": "City", name: x.content[locale].name })),
          ],
          availableLanguage: ["de", "fr"],
          url: `${site.url}${url}`,
        }}
      />

      <PageHero
        eyebrow={c.eyebrow}
        title={c.h1}
        subline={serviceSublines[s.key]?.[locale]}
        lead={c.lead}
        crumbs={[crumbs[0], crumbs[1], { name: c.navLabel }]}
        aside={<ServiceArt service={s.key} locale={locale} dark />}
      >
        <HeroCtas locale={locale} note />
      </PageHero>


      <section className="container-x section-y">
        <SectionHead
          eyebrow={locale === "de" ? "Leistungsumfang" : "Prestations"}
          title={locale === "de" ? "Das erhalten Sie" : "Ce que vous obtenez"}
          lead={c.ctaText}
        />
        <FeatureGrid items={c.features} />
      </section>

      <div className="bg-bg-2">
        <ProblemsSection
          locale={locale}
          points={c.problems ?? (pos ? st.posProblems : undefined)}
          keys={problemKeys.length >= 2 ? problemKeys : undefined}
          title={c.problemsTitle}
        />
      </div>

      <section className="container-x grid gap-12 pb-12 pt-20 md:pt-28 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={c.sections} locale={locale} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <CtaCard locale={locale} title={c.ctaTitle} text={c.ctaText} />
          </div>
        </aside>
      </section>

      <BenefitsSection locale={locale} items={benefits} title={c.benefitsTitle} />


      {hasProcess && <ProcessSection locale={locale} steps={c.process} />}

      <FitSection locale={locale} fit={c.fit} pos={pos} />

      {/* The three next steps repeat the process above; only shown where there is no process section. */}
      {!hasProcess && <NextSteps locale={locale} />}

      <ContactSection locale={locale} />

      <LocationsSection
        locale={locale}
        groups={[
          { label: locale === "de" ? `${c.navLabel} in Ihrer Region` : `${c.navLabel} dans votre région`, links: regionLinks },
          { label: industryUi[locale].forIndustry, links: industryLinks },
        ]}
      />

      <FaqSection locale={locale} faq={faq} />

      {serviceGuides.length > 0 && (
        <section className="container-x pb-20 pt-20 md:pt-28">
          <SectionHead eyebrow={d.nav.guides} title={locale === "de" ? "Passende Ratgeber" : "Conseils utiles"} />
          <div className="grid gap-4 md:grid-cols-3">
            {serviceGuides.map((g) => (
              <CardLink key={g.key} href={href(locale, `guide:${g.key}`)} meta={`${g.readingMinutes} ${d.common.minutes}`} title={g.content[locale].h1} text={g.content[locale].lead} />
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-line">
        <ServicesGrid locale={locale} current={url} title={d.common.related} compact />
      </div>
      <CtaBand locale={locale} />
    </>
  );
}

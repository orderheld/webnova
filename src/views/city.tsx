import Link from "next/link";
import { testimonials } from "@/content/testimonials";
import { CardLink, CtaBand, CtaCard, FeatureGrid, HeroCtas, PageHero, Prose } from "@/components/blocks";
import {
  ContactSection,
  FaqSection,
  FitSection,
  LocationsSection,
  NextSteps,
  ProblemsSection,
  ProcessSection,
  ReferencesSection,
  ServicesGrid,
} from "@/components/sections";
import { problems } from "@/content/problems";
import { cityFaqTemplates, structure, topUpFaq } from "@/content/structure";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { Art, serviceArt } from "@/components/service-art";
import { localServices } from "@/content/local";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href, localId } from "@/lib/routes";
import { JsonLd, breadcrumbLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

const cityLabel = (locale: Locale, name: string) => `${locale === "de" ? "Webdesign" : "Site internet"} ${name}`;

const regionsIntro = {
  de: "Unsere Kundinnen und Kunden sind in der ganzen Region zuhause: in Bern, Biel/Bienne, Solothurn und weit darüber hinaus. Für jede Stadt haben wir eine eigene Seite mit lokalen Besonderheiten, typischen Branchen und den Leistungen, die dort am meisten gefragt sind, von der neuen Webseite über SEO bis zum Kassensystem. In der Kernregion kommen wir für Gespräche gerne vorbei. Projekte in der übrigen Schweiz betreuen wir genauso persönlich, per Videocall und bei Bedarf vor Ort. Zweisprachige Webseiten auf Deutsch und Französisch gehören für uns zum Alltag.",
  fr: "Nos clients sont dans toute la région : à Bienne, Berne, Soleure et bien au-delà. Pour chaque ville, nous avons une page dédiée avec ses particularités locales, les branches typiques et les prestations les plus demandées, du nouveau site au référencement jusqu'au système de caisse. Dans notre région principale, nous passons volontiers vous voir. Les projets dans le reste de la Suisse sont suivis tout aussi personnellement, par visioconférence et sur place si nécessaire. Les sites bilingues en français et en allemand font partie de notre quotidien.",
};

export function RegionsPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const groups = [
    { label: d.pages.coreRegion, items: cities.filter((c) => c.priority === "A") },
    { label: d.pages.moreRegions, items: cities.filter((c) => c.priority !== "A") },
  ];
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: d.common.home, url: href(locale, "home") },
          { name: d.nav.regions, url: href(locale, "regions") },
        ])}
      />
      <PageHero
        eyebrow={d.nav.regions}
        title={d.pages.regionsH1}
        lead={d.pages.regionsLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.regions }]}
        aside={<Art kind="local" locale={locale} dark />}
      >
        <HeroCtas locale={locale} />
      </PageHero>
      <section className="container-x grid gap-8 pt-16 md:pt-24 lg:grid-cols-12">
        <p className="text-[18px] leading-relaxed text-ink-soft lg:col-span-8">{regionsIntro[locale]}</p>
      </section>
      {groups.map((g, gi) => (
        <section key={g.label} className={`container-x pb-16 ${gi === 0 ? "pt-12" : ""}`}>
          <h2 className="eyebrow mb-6">
            {g.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {g.items.map((c) => (
              <CardLink
                key={c.key}
                href={href(locale, `city:${c.key}`)}
                title={cityLabel(locale, c.content[locale].name)}
              />
            ))}
          </div>
        </section>
      ))}
      <section className="container-x pb-20">
        <h2 className="eyebrow mb-6">
          {d.pages.seoPages}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {cities
            .filter((c) => c.priority === "A")
            .map((c) => (
              <div key={c.key} className="card p-6">
                <h3 className="mb-4 font-display text-[20px] font-semibold tracking-tight">{c.content[locale].name}</h3>
                <div className="flex flex-wrap gap-2">
                  {cityServiceLinks(locale, c.key).map((l) => (
                    <Link key={l.id} href={l.href} className={chip}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

const chip =
  "rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-accent/40 hover:bg-bright-soft hover:text-accent";

/** Every service page that exists for a city: webdesign, SEO and the service × city pages. */
export function cityServiceLinks(locale: Locale, cityKey: string) {
  const city = cities.find((c) => c.key === cityKey)!;
  const name = city.content[locale].name;
  const links = [{ id: `city:${cityKey}`, label: cityLabel(locale, name) }];
  if (city.seo) links.push({ id: `citySeo:${cityKey}`, label: `${locale === "de" ? "SEO" : "Référencement"} ${name}` });
  for (const ls of localServices.filter((l) => l.city === cityKey)) {
    const s = services.find((x) => x.key === ls.service)!;
    links.push({ id: localId(ls.service, cityKey), label: `${s.content[locale].navLabel} ${name}` });
  }
  return links.map((l) => ({ ...l, href: href(locale, l.id) }));
}

/** What a city page is about, for the local cost question ("Was kostet ein Onlineshop in Bern?"). */
const cityTopic: Record<string, Record<Locale, string>> = {
  webdesign: { de: "eine Webseite", fr: "un site internet" },
  seo: { de: "SEO", fr: "le référencement" },
  onlineshop: { de: "ein Onlineshop", fr: "une boutique en ligne" },
  "website-redesign": { de: "ein Website-Redesign", fr: "une refonte de site" },
  kassensystem: { de: "ein Kassensystem", fr: "un système de caisse" },
  "online-marketing": { de: "Online-Marketing", fr: "le marketing digital" },
  branding: { de: "ein Corporate Design", fr: "une identité visuelle" },
  wartung: { de: "die Website-Wartung", fr: "la maintenance d'un site" },
};

/** "SEO Bern: mehr Sichtbarkeit" -> keyword H1 "SEO Bern" plus benefit subline "Mehr Sichtbarkeit". */
function splitTitle(h1: string): { title: string; subline?: string } {
  const m = h1.match(/^(.+?)\s?:\s(.+)$/);
  if (!m) return { title: h1 };
  return { title: m[1], subline: m[2].charAt(0).toUpperCase() + m[2].slice(1) };
}

export function CityPage({
  locale,
  cityKey,
  variant,
  serviceKey,
}: {
  locale: Locale;
  cityKey: string;
  variant: "webdesign" | "seo" | "local";
  serviceKey?: string;
}) {
  const d = getDict(locale);
  const city = cities.find((c) => c.key === cityKey)!;
  const service = serviceKey ? services.find((s) => s.key === serviceKey)! : undefined;
  const c =
    variant === "seo"
      ? city.seo![locale]
      : variant === "local"
        ? localServices.find((l) => l.service === serviceKey && l.city === cityKey)!.content[locale]
        : city.content[locale];
  const id = variant === "seo" ? `citySeo:${city.key}` : variant === "local" ? localId(serviceKey!, city.key) : `city:${city.key}`;
  const url = href(locale, id);
  const cityName = city.content[locale].name;
  const pos = service?.group === "pos";
  // Keyword H1 first ("Webdesign Agentur Bern"), the page's own headline becomes the benefit line.
  const heading =
    variant === "webdesign"
      ? { title: locale === "de" ? `Webdesign Agentur ${cityName}` : `Agence web à ${cityName}`, subline: splitTitle(c.h1).subline ?? c.h1 }
      : splitTitle(c.h1);
  const crumbs = service
    ? [
        { name: d.common.home, url: href(locale, "home") },
        { name: service.content[locale].navLabel, url: href(locale, `service:${service.key}`) },
        { name: heading.title, url },
      ]
    : [
        { name: d.common.home, url: href(locale, "home") },
        { name: d.nav.regions, url: href(locale, "regions") },
        { name: heading.title, url },
      ];
  const nearby = city.nearby.map((k) => cities.find((x) => x.key === k)).filter((x) => x !== undefined);
  // Same service in nearby cities where that page exists, otherwise their webdesign page.
  const nearbyLinks = nearby.map((n) => {
    const local = service && hasRoute(localId(service.key, n.key));
    return {
      href: href(locale, local ? localId(service!.key, n.key) : `city:${n.key}`),
      label: local ? `${service!.content[locale].navLabel} ${n.content[locale].name}` : cityLabel(locale, n.content[locale].name),
    };
  });
  const sameCity = cityServiceLinks(locale, city.key).filter((l) => l.id !== id);
  const serviceKeys =
    variant === "seo"
      ? ["seo", "online-marketing", "webdesign", "website-redesign"]
      : service
        ? [service.key, ...service.related, "webdesign"].filter((k, i, a) => a.indexOf(k) === i).slice(0, 4)
        : ["webdesign", "website-redesign", "onlineshop", "seo"];
  const quotes = testimonials.filter((t) => t.city === city.key && t.locale === locale);
  // Guides for this city first, then guides about the services shown here.
  const cityGuides = [
    ...guides.filter((g) => g.cities?.includes(city.key)),
    ...guides.filter((g) => g.related.some((k) => serviceKeys.includes(k))),
  ]
    .filter((g, i, a) => a.indexOf(g) === i)
    .slice(0, 3);
  const topicKey = variant === "local" ? serviceKey! : variant;
  const faq = topUpFaq(c.faq, cityFaqTemplates(locale, cityName, cityTopic[topicKey]?.[locale] ?? cityTopic.webdesign[locale], pos), 10);
  const problemKeys = problems.filter((p) => p.services.some((k) => serviceKeys.includes(k))).map((p) => p.key);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.h1,
          description: c.meta.description,
          provider: { "@id": orgId },
          serviceType: service ? service.content[locale].navLabel : variant === "seo" ? (locale === "de" ? "Suchmaschinenoptimierung" : "Référencement naturel") : locale === "de" ? "Webdesign" : "Création de sites internet",
          areaServed: {
            "@type": "City",
            name: cityName,
            geo: { "@type": "GeoCoordinates", latitude: city.geo.lat, longitude: city.geo.lng },
            containedInPlace: { "@type": "AdministrativeArea", name: `${locale === "de" ? "Kanton" : "Canton"} ${city.canton}` },
          },
          availableLanguage: ["de", "fr"],
          url: `${site.url}${url}`,
        }}
      />

      <PageHero
        eyebrow={service ? `${service.content[locale].navLabel} · ${cityName} ${city.canton}` : `${cityName} · ${city.canton}`}
        title={heading.title}
        subline={heading.subline}
        lead={c.lead}
        crumbs={[crumbs[0], crumbs[1], { name: cityName }]}
        aside={<Art kind={service ? (serviceArt[service.key]?.kind ?? "local") : variant === "seo" ? "seo" : "local"} variant={serviceArt[service?.key ?? ""]?.variant} sample={serviceArt[service?.key ?? ""]?.sample} city={cityName} locale={locale} dark />}
      >
        <HeroCtas locale={locale} note />
      </PageHero>


      {service && (
        <section className="container-x pt-20 md:pt-28">
          <h2 className="eyebrow mb-6">{locale === "de" ? "Das erhalten Sie" : "Ce que vous obtenez"}</h2>
          <FeatureGrid items={service.content[locale].features.slice(0, 3)} />
        </section>
      )}

      <section className="container-x grid gap-12 pb-12 pt-16 md:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={c.sections} locale={locale} />
        </div>
        <aside className="space-y-4 lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <CtaCard
              locale={locale}
              title={locale === "de" ? `Ihr Projekt in ${cityName}` : `Votre projet à ${cityName}`}
              text={d.cta.text}
            />
          </div>
        </aside>
      </section>

      {quotes.length > 0 && (
        <section className="container-x py-16">
          <p className="eyebrow mb-8">{d.pages.testimonialsEyebrow}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {quotes.map((q) => (
              <figure key={q.name} className="card p-8">
                <blockquote className="text-[17px] leading-relaxed">{locale === "fr" ? `«\u00a0${q.quote}\u00a0»` : `«${q.quote}»`}</blockquote>
                <figcaption className="mt-6 text-[14px] text-muted">
                  <span className="font-semibold text-ink">{q.name}</span>
                  {q.company && `, ${q.company}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {pos ? (
        <div className="mt-12 bg-bg-2">
          <ProblemsSection locale={locale} points={service?.content[locale].problems ?? structure[locale].posProblems} />
        </div>
      ) : (
        <div className="mt-12 bg-bg-2">
          <ProblemsSection
            locale={locale}
            keys={problemKeys.length >= 2 ? problemKeys : undefined}
            lead={locale === "de" ? `Diese Anliegen hören wir von KMU in ${cityName} und der ganzen Schweiz am häufigsten.` : `Ce que nous entendons le plus souvent de la part des PME à ${cityName} et dans toute la Suisse.`}
          />
        </div>
      )}

      <ServicesGrid
        locale={locale}
        current={service ? href(locale, `service:${service.key}`) : undefined}
        title={locale === "de" ? `Leistungen für KMU in ${cityName}` : `Nos services pour les PME à ${cityName}`}
      />

      {!pos && <ReferencesSection locale={locale} />}

      {!pos && <ProcessSection locale={locale} />}

      <FitSection locale={locale} pos={pos} />

      <NextSteps locale={locale} />

      <ContactSection locale={locale} />

      <FaqSection locale={locale} faq={faq} />

      {cityGuides.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="h-section mb-10">{locale === "de" ? "Ratgeber für KMU" : "Conseils pour PME"}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {cityGuides.map((g) => (
              <CardLink key={g.key} href={href(locale, `guide:${g.key}`)} meta={`${g.readingMinutes} ${d.common.minutes}`} title={g.content[locale].h1} />
            ))}
          </div>
        </section>
      )}

      <LocationsSection
        locale={locale}
        current={city.key}
        title={locale === "de" ? `${cityName} und die ganze Schweiz` : `${cityName} et toute la Suisse`}
        groups={[
          { label: locale === "de" ? `Mehr für ${cityName}` : `Plus pour ${cityName}`, links: sameCity },
          { label: d.common.nearby, links: nearbyLinks },
        ]}
      />
      <div className="pt-20 md:pt-28">
        <CtaBand locale={locale} />
      </div>
    </>
  );
}

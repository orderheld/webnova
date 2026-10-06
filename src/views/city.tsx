import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList, FeatureGrid, PageHero, Prose } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { localServices } from "@/content/local";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href, localId } from "@/lib/routes";
import { JsonLd, breadcrumbLd, faqLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

const cityLabel = (locale: Locale, name: string) => `${locale === "de" ? "Webdesign" : "Site internet"} ${name}`;

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
      />
      {groups.map((g, gi) => (
        <section key={g.label} className={`container-x pb-16 ${gi === 0 ? "pt-16 md:pt-24" : ""}`}>
          <h2 className="mb-6 flex items-center gap-3 font-sans text-[14px] font-semibold uppercase tracking-[0.14em] text-muted">
            <span className="h-2 w-2 rounded-full bg-accent ring-4 ring-accent/25" />
            {g.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {g.items.map((c) => (
              <CardLink
                key={c.key}
                href={href(locale, `city:${c.key}`)}
                meta={c.minutesFromOffice > 0 ? `~${c.minutesFromOffice} ${d.common.minutesFromOffice}` : undefined}
                title={cityLabel(locale, c.content[locale].name)}
              />
            ))}
          </div>
        </section>
      ))}
      <section className="container-x pb-20">
        <h2 className="mb-6 flex items-center gap-3 font-sans text-[14px] font-semibold uppercase tracking-[0.14em] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent ring-4 ring-accent/25" />
          {d.pages.seoPages}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {cities
            .filter((c) => c.priority === "A")
            .map((c) => (
              <div key={c.key} className="rounded-[24px] border border-line bg-surface p-6">
                <h3 className="mb-4 font-display text-[20px] font-bold tracking-tight">{c.content[locale].name}</h3>
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
  "rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-night hover:bg-night hover:text-white";
const chipDark =
  "rounded-full border border-night bg-night px-4 py-2 text-[14px] text-white transition-colors hover:bg-accent hover:text-night";

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
  const crumbs = service
    ? [
        { name: d.common.home, url: href(locale, "home") },
        { name: service.content[locale].navLabel, url: href(locale, `service:${service.key}`) },
        { name: c.h1, url },
      ]
    : [
        { name: d.common.home, url: href(locale, "home") },
        { name: d.nav.regions, url: href(locale, "regions") },
        { name: c.h1, url },
      ];
  const nearby = city.nearby.map((k) => cities.find((x) => x.key === k)).filter((x) => x !== undefined);
  // Same service in nearby cities where that page exists, otherwise their webdesign page.
  const nearbyLinks = nearby.map((n) => {
    const local = service && hasRoute(localId(service.key, n.key));
    return {
      key: n.key,
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
  const shown = serviceKeys.map((k) => services.find((s) => s.key === k)!).filter(Boolean);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.h1,
          description: c.meta.description,
          ...(service && { serviceType: service.content[locale].navLabel }),
          provider: { "@id": orgId },
          areaServed: {
            "@type": "City",
            name: cityName,
            geo: { "@type": "GeoCoordinates", latitude: city.geo.lat, longitude: city.geo.lng },
          },
          url: `${site.url}${url}`,
        }}
      />
      <JsonLd data={faqLd(c.faq)} />

      <PageHero
        eyebrow={service ? `${service.content[locale].navLabel} · ${cityName} ${city.canton}` : `${cityName} · ${city.canton}`}
        title={c.h1}
        lead={c.lead}
        crumbs={[crumbs[0], crumbs[1], { name: cityName }]}
      >
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href={href(locale, "request")}>{d.hero.primary}</ButtonLink>
          <ButtonLink href={site.phoneHref} variant="ghostLight" arrow={false}>
            {site.phone}
          </ButtonLink>
          {city.minutesFromOffice > 0 && (
            <span className="ml-1 inline-flex items-center gap-2 text-[14px] text-white/55">
              <Icon name="pin" className="h-4 w-4 text-accent" /> ~{city.minutesFromOffice} {d.common.minutesFromOffice}
            </span>
          )}
        </div>
      </PageHero>

      {service && (
        <section className="container-x relative z-10 -mt-10">
          <FeatureGrid items={service.content[locale].features.slice(0, 3)} />
        </section>
      )}

      <section className="container-x grid gap-12 pb-12 pt-16 md:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={c.sections} />
        </div>
        <aside className="space-y-4 lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-[28px] bg-night p-8 text-white shadow-[inset_0_0_0_1px_rgba(210,255,40,0.15)]">
              <p className="text-[13px] uppercase tracking-[0.12em] text-white/50">{d.pages.office}</p>
              <p className="mt-3 text-[18px] leading-snug">
                Webnova
                <br />
                {site.address.street}
                <br />
                {site.address.zip} {locale === "fr" ? "Granges" : site.address.city}
              </p>
              <ButtonLink href={href(locale, "request")} className="mt-8 w-full">
                {d.nav.cta}
              </ButtonLink>
              <p className="mt-4 text-center text-[13px] text-white/50">{d.common.free}</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="container-x py-16">
        <h2 className="h-section mb-10">{d.common.related}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((s) => (
            <CardLink key={s.key} href={href(locale, `service:${s.key}`)} icon={s.icon} title={s.content[locale].navLabel} />
          ))}
        </div>
      </section>

      <FaqList locale={locale} faq={c.faq} />

      <section className="container-x pb-10">
        <p className="eyebrow mb-4">{locale === "de" ? `Mehr für ${cityName}` : `Plus pour ${cityName}`}</p>
        <div className="flex flex-wrap gap-2">
          {sameCity.map((l) => (
            <Link key={l.id} href={l.href} className={chipDark}>
              {l.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="container-x pb-20">
        <p className="eyebrow mb-4">{d.common.nearby}</p>
        <div className="flex flex-wrap gap-2">
          {nearbyLinks.map((n) => (
            <Link key={n.key} href={n.href} className={chip}>
              {n.label}
            </Link>
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

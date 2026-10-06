import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList, PageHero, Prose } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
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
        <div className="flex flex-wrap gap-2">
          {cities
            .filter((c) => c.seo)
            .map((c) => (
              <Link
                key={c.key}
                href={href(locale, `citySeo:${c.key}`)}
                className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-night hover:bg-night hover:text-white"
              >
                {locale === "de" ? "SEO" : "Référencement"} {c.content[locale].name}
              </Link>
            ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

export function CityPage({ locale, cityKey, variant }: { locale: Locale; cityKey: string; variant: "webdesign" | "seo" }) {
  const d = getDict(locale);
  const city = cities.find((c) => c.key === cityKey)!;
  const c = variant === "seo" ? city.seo![locale] : city.content[locale];
  const id = variant === "seo" ? `citySeo:${city.key}` : `city:${city.key}`;
  const url = href(locale, id);
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: d.nav.regions, url: href(locale, "regions") },
    { name: c.h1, url },
  ];
  const nearby = city.nearby.map((k) => cities.find((x) => x.key === k)).filter((x) => x !== undefined);
  const serviceKeys =
    variant === "seo"
      ? ["seo", "online-marketing", "webdesign", "website-redesign"]
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
          provider: { "@id": orgId },
          areaServed: {
            "@type": "City",
            name: city.content[locale].name,
            geo: { "@type": "GeoCoordinates", latitude: city.geo.lat, longitude: city.geo.lng },
          },
          url: `${site.url}${url}`,
        }}
      />
      <JsonLd data={faqLd(c.faq)} />

      <PageHero
        eyebrow={`${city.content[locale].name} · ${city.canton}`}
        title={c.h1}
        lead={c.lead}
        crumbs={[crumbs[0], crumbs[1], { name: city.content[locale].name }]}
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

      <section className="container-x pb-20">
        <p className="eyebrow mb-4">{d.common.nearby}</p>
        <div className="flex flex-wrap gap-2">
          {variant === "seo" && (
            <Link
              href={href(locale, `city:${city.key}`)}
              className="rounded-full border border-night bg-night px-4 py-2 text-[14px] text-white transition-colors hover:bg-accent hover:text-night"
            >
              {cityLabel(locale, city.content[locale].name)}
            </Link>
          )}
          {variant === "webdesign" && city.seo && (
            <Link
              href={href(locale, `citySeo:${city.key}`)}
              className="rounded-full border border-night bg-night px-4 py-2 text-[14px] text-white transition-colors hover:bg-accent hover:text-night"
            >
              {locale === "de" ? "SEO" : "Référencement"} {city.content[locale].name}
            </Link>
          )}
          {nearby.map((n) => (
            <Link
              key={n.key}
              href={href(locale, `city:${n.key}`)}
              className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-night hover:bg-night hover:text-white"
            >
              {cityLabel(locale, n.content[locale].name)}
            </Link>
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

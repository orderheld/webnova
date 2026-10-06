import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList, FeatureGrid, PageHero, Prose } from "@/components/blocks";
import { cities } from "@/content/cities";
import { services } from "@/content/services";
import { localServices } from "@/content/local";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href, localId } from "@/lib/routes";
import { JsonLd, breadcrumbLd, faqLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

export function ServicesPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const groups = [
    { key: "web", label: locale === "de" ? "Web & Shop" : "Web & boutique" },
    { key: "marketing", label: locale === "de" ? "Sichtbarkeit & Marke" : "Visibilité & marque" },
    { key: "pos", label: d.nav.pos },
  ] as const;
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
      />
      {groups.map((g, gi) => (
        <section key={g.key} className={`container-x pb-20 ${gi === 0 ? "pt-16 md:pt-24" : ""}`}>
          <h2 className="eyebrow mb-6">
            {g.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((s) => s.group === g.key)
              .map((s) => (
                <CardLink
                  key={s.key}
                  href={href(locale, `service:${s.key}`)}
                  icon={s.icon}
                  title={s.content[locale].navLabel}
                  text={s.content[locale].lead}
                />
              ))}
          </div>
        </section>
      ))}
      <CtaBand locale={locale} />
    </>
  );
}

export function ServicePage({ locale, serviceKey }: { locale: Locale; serviceKey: string }) {
  const d = getDict(locale);
  const s = services.find((x) => x.key === serviceKey)!;
  const c = s.content[locale];
  const url = href(locale, `service:${s.key}`);
  const related = s.related.map((k) => services.find((x) => x.key === k)).filter((x) => x !== undefined);
  const isWeb = s.group !== "pos";
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
      : isWeb
        ? cities.filter((x) => x.priority === "A").map((x) => ({
            href: href(locale, `city:${x.key}`),
            label: `${locale === "de" ? "Webdesign" : "Site internet"} ${x.content[locale].name}`,
          }))
        : [];
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: d.pages.servicesTitle, url: href(locale, "services") },
    { name: c.navLabel, url },
  ];
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

      <PageHero eyebrow={c.eyebrow} title={c.h1} lead={c.lead} crumbs={[crumbs[0], crumbs[1], { name: c.navLabel }]}>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={href(locale, "request")}>{d.hero.primary}</ButtonLink>
          <ButtonLink href={site.phoneHref} variant="ghost" arrow={false}>
            {site.phone}
          </ButtonLink>
        </div>
      </PageHero>

      <section className="container-x relative z-10 -mt-10 pb-20 md:pb-28">
        <FeatureGrid items={c.features} />
      </section>

      <section className="container-x grid gap-12 pb-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose sections={c.sections} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28 overflow-hidden rounded-[24px] border border-line bg-surface p-8 ">
            <h2 className="text-[26px] font-bold leading-tight tracking-[-0.03em]">{c.ctaTitle}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{c.ctaText}</p>
            <ButtonLink href={href(locale, "request")} className="mt-8 w-full">
              {d.nav.cta}
            </ButtonLink>
            <p className="mt-4 text-center text-[13px] text-muted">{d.common.free}</p>
          </div>
        </aside>
      </section>

      {regionLinks.length > 0 && (
        <section className="container-x pt-8">
          <p className="eyebrow mb-4">{d.nav.regions}</p>
          <div className="flex flex-wrap gap-2">
            {regionLinks.map((l) => (
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
      )}

      <FaqList locale={locale} faq={c.faq} />

      {related.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="h-section mb-10">{d.common.related}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <CardLink
                key={r.key}
                href={href(locale, `service:${r.key}`)}
                icon={r.icon}
                title={r.content[locale].navLabel}
                text={r.content[locale].lead}
              />
            ))}
          </div>
        </section>
      )}
      <CtaBand locale={locale} />
    </>
  );
}

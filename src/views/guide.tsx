import Link from "next/link";
import { CardLink, CtaBand, FaqList, PageHero, Prose, anchorId } from "@/components/blocks";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { getRoute } from "@/lib/routes";
import { JsonLd, breadcrumbLd, faqLd, ogImageUrl, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

const fmtDate = (locale: Locale, iso: string) =>
  new Date(iso).toLocaleDateString(locale === "de" ? "de-CH" : "fr-CH", { day: "numeric", month: "long", year: "numeric" });

export function GuidesPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.guides, url: href(locale, "guides") }])} />
      <PageHero
        eyebrow={d.nav.guides}
        title={d.pages.guidesH1}
        lead={d.pages.guidesLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.guides }]}
      />
      <section className="container-x pb-24 pt-16 md:pt-24">
        <h2 className="sr-only">{locale === "de" ? "Alle Ratgeber" : "Tous les conseils"}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {guides.map((g) => (
            <CardLink
              key={g.key}
              href={href(locale, `guide:${g.key}`)}
              meta={`${fmtDate(locale, g.date)} · ${g.readingMinutes} ${d.common.minutes}`}
              title={g.content[locale].h1}
              text={g.content[locale].lead}
            />
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

export function GuidePage({ locale, guideKey }: { locale: Locale; guideKey: string }) {
  const d = getDict(locale);
  const g = guides.find((x) => x.key === guideKey)!;
  const c = g.content[locale];
  const url = href(locale, `guide:${g.key}`);
  const related = g.related.map((k) => services.find((s) => s.key === k)).filter((x) => x !== undefined);
  const guideCities = (g.cities ?? []).map((k) => cities.find((c) => c.key === k)).filter((x) => x !== undefined);
  // Other guides: those sharing a service first, then the newest.
  const more = guides
    .filter((x) => x.key !== g.key)
    .sort((a, b) => Number(b.related.some((k) => g.related.includes(k))) - Number(a.related.some((k) => g.related.includes(k))))
    .slice(0, 3);
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: d.common.home, url: href(locale, "home") },
          { name: d.nav.guides, url: href(locale, "guides") },
          { name: c.h1, url },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.h1,
          description: c.meta.description,
          image: { "@type": "ImageObject", url: ogImageUrl(locale, getRoute(`guide:${g.key}`)), width: 1200, height: 630 },
          datePublished: g.date,
          dateModified: g.updated ?? g.date,
          inLanguage: locale === "de" ? "de-CH" : "fr-CH",
          author: { "@type": "Person", name: "Ferhat Demir", url: `${site.url}${href(locale, "about")}`, worksFor: { "@id": orgId } },
          publisher: { "@id": orgId },
          mainEntityOfPage: `${site.url}${url}`,
        }}
      />
      {c.faq.length > 0 && <JsonLd data={faqLd(c.faq)} />}
      <PageHero
        eyebrow={`${fmtDate(locale, g.updated ?? g.date)} · ${g.readingMinutes} ${d.common.minutes}`}
        title={c.h1}
        lead={c.lead}
        crumbs={[
          { name: d.common.home, url: href(locale, "home") },
          { name: d.nav.guides, url: href(locale, "guides") },
        ]}
      />
      <div className="container-x grid gap-12 pb-12 pt-14 md:pt-20 lg:grid-cols-12">
        <nav aria-label={locale === "de" ? "Inhalt" : "Sommaire"} className="lg:order-2 lg:col-span-4">
          <div className="rounded-2xl border border-line bg-bg-2 p-6 lg:sticky lg:top-28">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{locale === "de" ? "Inhalt" : "Sommaire"}</p>
            <ol className="mt-4 space-y-1 text-[15px] leading-snug">
              {c.sections.map((s) => (
                <li key={s.h2}>
                  <a href={`#${anchorId(s.h2)}`} className="block py-1.5 text-ink-soft transition-colors hover:text-bright">
                    {s.h2}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <article className="max-w-[42rem] lg:order-1 lg:col-span-8">
          <Prose sections={c.sections} locale={locale} anchors />
          {guideCities.length > 0 && (
            <div className="mt-14 rounded-2xl border border-line bg-bg-2 p-7">
              <p className="text-[15px] font-semibold">{locale === "de" ? "Persönliche Beratung in Ihrer Region" : "Conseil personnel dans votre région"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {guideCities.map((city) => (
                  <Link
                    key={city.key}
                    href={href(locale, `city:${city.key}`)}
                    className="rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
                  >
                    {locale === "de" ? "Webdesign" : "Site internet"} {city.content[locale].name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
      <FaqList locale={locale} faq={c.faq} />
      {related.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="h-section mb-10">{d.common.related}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((s) => (
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
      )}
      <section className="container-x pb-20">
        <h2 className="h-section mb-10">{locale === "de" ? "Weitere Ratgeber" : "Autres conseils"}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {more.map((x) => (
            <CardLink
              key={x.key}
              href={href(locale, `guide:${x.key}`)}
              meta={`${x.readingMinutes} ${d.common.minutes}`}
              title={x.content[locale].h1}
              text={x.content[locale].lead}
            />
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}

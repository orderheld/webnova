import { CardLink, CtaBand, FaqList, PageHero, Prose } from "@/components/blocks";
import { guides } from "@/content/guides";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { JsonLd, breadcrumbLd, faqLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

const fmtDate = (locale: Locale, iso: string) =>
  new Date(iso).toLocaleDateString(locale === "de" ? "de-CH" : "fr-CH", { day: "numeric", month: "long", year: "numeric" });

export function GuidesPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <>
      <PageHero
        eyebrow={d.nav.guides}
        title={d.pages.guidesH1}
        lead={d.pages.guidesLead}
        crumbs={[{ name: d.common.home, url: href(locale, "home") }, { name: d.nav.guides }]}
      />
      <section className="container-x pb-24 pt-16 md:pt-24">
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
          datePublished: g.date,
          dateModified: g.date,
          inLanguage: locale === "de" ? "de-CH" : "fr-CH",
          author: { "@id": orgId },
          publisher: { "@id": orgId },
          mainEntityOfPage: `${site.url}${url}`,
        }}
      />
      {c.faq.length > 0 && <JsonLd data={faqLd(c.faq)} />}
      <PageHero
        eyebrow={`${fmtDate(locale, g.date)} · ${g.readingMinutes} ${d.common.minutes}`}
        title={c.h1}
        lead={c.lead}
        crumbs={[
          { name: d.common.home, url: href(locale, "home") },
          { name: d.nav.guides, url: href(locale, "guides") },
        ]}
      />
      <article className="container-x pb-12 pt-14 md:pt-20">
        <div className="max-w-3xl">
          <Prose sections={c.sections} />
        </div>
      </article>
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
      <CtaBand locale={locale} />
    </>
  );
}

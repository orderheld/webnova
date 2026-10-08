import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CardLink, ContactPerson, CtaBand, CtaCard, FaqList, PageHero, Prose, anchorId } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { getRoute, hasRoute, href } from "@/lib/routes";
import { JsonLd, breadcrumbLd, faqLd, ogImageUrl, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

const fmtDate = (locale: Locale, iso: string) =>
  new Date(iso).toLocaleDateString(locale === "de" ? "de-CH" : "fr-CH", { day: "numeric", month: "long", year: "numeric" });

const gt = {
  de: {
    published: "Veröffentlicht",
    updated: "Aktualisiert",
    takeaways: "Das Wichtigste in Kürze",
    sources: "Quellen",
    author: "Über den Autor",
    authorRole: "Ihr Ansprechpartner bei Webnova",
    authorText:
      "Ferhat Demir führt Webnova, eine Webdesign-Agentur für Schweizer KMU. Er begleitet Projekte persönlich von der ersten Idee bis nach dem Launch, auf Deutsch und Französisch, und verbindet Design, Technik und Suchmaschinenoptimierung.",
    authorLink: "Mehr über Webnova",
    midTitle: "Sie möchten das nicht allein umsetzen?",
    midText: "Wir sehen uns Ihre Situation an und sagen Ihnen ehrlich, was sich lohnt. Das Erstgespräch ist kostenlos.",
    midCheck: "Kostenloser Website-Check",
    endTitle: "Wie geht es bei Ihnen weiter?",
    endText: "Schildern Sie uns kurz Ihr Vorhaben. Ferhat Demir meldet sich innert eines Arbeitstages persönlich bei Ihnen.",
    toc: "Inhalt",
  },
  fr: {
    published: "Publié le",
    updated: "Mis à jour le",
    takeaways: "L'essentiel en bref",
    sources: "Sources",
    author: "À propos de l'auteur",
    authorRole: "Propriétaire de Webnova",
    authorText:
      "Ferhat Demir dirige Webnova, une agence web pour les PME suisses. Il accompagne personnellement les projets de la première idée jusqu'après la mise en ligne, en français et en allemand, en alliant design, technique et référencement.",
    authorLink: "En savoir plus sur Webnova",
    midTitle: "Vous préférez ne pas le faire seul ?",
    midText: "Nous examinons votre situation et vous disons franchement ce qui vaut la peine. Le premier entretien est gratuit.",
    midCheck: "Analyse de site gratuite",
    endTitle: "Et pour vous, quelle suite ?",
    endText: "Décrivez-nous brièvement votre projet. Ferhat Demir vous répond personnellement en un jour ouvrable.",
    toc: "Sommaire",
  },
};

/** Light call-to-action box inside the article text. */
function InlineCta({ locale, title, text, check = false }: { locale: Locale; title: string; text: string; check?: boolean }) {
  const d = getDict(locale);
  return (
    <aside className="my-12 rounded-2xl border border-accent/15 bg-bright-soft p-7 sm:p-8">
      <p className="font-display text-[21px] font-semibold leading-snug tracking-[-0.01em] text-ink">{title}</p>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{text}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href={href(locale, "request")}>{d.nav.cta}</ButtonLink>
        {check && hasRoute("page:website-check") ? (
          <ButtonLink href={href(locale, "page:website-check")} variant="ghost" arrow={false}>
            {gt[locale].midCheck}
          </ButtonLink>
        ) : (
          <ButtonLink href={site.phoneHref} variant="ghost" arrow={false} icon="phone">
            {site.phone}
          </ButtonLink>
        )}
      </div>
    </aside>
  );
}

/** Author box: real facts only (owner, what Webnova does, languages). */
function AuthorBox({ locale }: { locale: Locale }) {
  const t = gt[locale];
  return (
    <section aria-labelledby="author-heading" className="mt-14 rounded-2xl border border-line bg-surface p-7 shadow-card sm:p-8">
      <h2 id="author-heading" className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{t.author}</h2>
      <div className="mt-5 flex items-start gap-5">
        <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-bg-2">
          <Image src="/photos/ferhat-avatar.webp" alt={locale === "de" ? "Ferhat Demir, Ihr Ansprechpartner bei Webnova" : "Ferhat Demir, votre interlocuteur chez Webnova"} fill sizes="64px" className="object-cover" />
        </span>
        <div>
          <p className="font-display text-[19px] font-semibold tracking-[-0.01em] text-ink">Ferhat Demir</p>
          <p className="text-[14px] text-muted">{t.authorRole}</p>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{t.authorText}</p>
          <Link href={href(locale, "about")} className="link-arrow mt-4 text-[14px]">
            {t.authorLink} <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

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
  const t = gt[locale];
  const picked = (g.relatedGuides ?? []).map((k) => guides.find((x) => x.key === k)).filter((x): x is (typeof guides)[number] => x !== undefined && x.key !== g.key);
  const more = [
    ...picked,
    ...guides
      .filter((x) => x.key !== g.key && !picked.includes(x))
      .sort((a, b) => Number(b.related.some((k) => g.related.includes(k))) - Number(a.related.some((k) => g.related.includes(k)))),
  ].slice(0, 3);
  // Inline call to action after roughly half of the article.
  const half = Math.ceil(c.sections.length / 2);
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
          author: { "@type": "Person", name: "Ferhat Demir", jobTitle: t.authorRole, url: `${site.url}${href(locale, "about")}`, worksFor: { "@id": orgId } },
          publisher: { "@id": orgId },
          mainEntityOfPage: `${site.url}${url}`,
        }}
      />
      {c.faq.length > 0 && <JsonLd data={faqLd(c.faq)} />}
      <PageHero
        eyebrow={`${d.nav.guides} · ${g.readingMinutes} ${d.common.minutes}`}
        title={c.h1}
        lead={c.lead}
        crumbs={[
          { name: d.common.home, url: href(locale, "home") },
          { name: d.nav.guides, url: href(locale, "guides") },
        ]}
        aside={
          c.keyTakeaways && c.keyTakeaways.length > 0 ? (
            <section aria-labelledby="takeaways-heading" className="rounded-3xl bg-white p-7 text-ink shadow-lift sm:p-8">
              <h2 id="takeaways-heading" className="font-display text-[20px] font-semibold text-ink">
                {t.takeaways}
              </h2>
              <ul className="mt-5 space-y-3.5 text-[15.5px] leading-relaxed text-ink-soft">
                {c.keyTakeaways.map((k) => (
                  <li key={k} className="flex gap-3">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                      <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : undefined
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-white/60">
          <ContactPerson locale={locale} dark role={t.authorRole} />
          <span>
            {t.published} <time dateTime={g.date}>{fmtDate(locale, g.date)}</time>
          </span>
          {g.updated && g.updated !== g.date && (
            <span>
              {t.updated} <time dateTime={g.updated}>{fmtDate(locale, g.updated)}</time>
            </span>
          )}
        </div>
      </PageHero>
      <div className="container-x grid gap-12 pb-12 pt-14 md:pt-20 lg:grid-cols-12">
        <article className="max-w-[42rem] lg:col-span-8">
          <Prose sections={c.sections.slice(0, half)} locale={locale} anchors />
          {c.sections.length > 2 && <InlineCta locale={locale} title={t.midTitle} text={t.midText} check />}
          <Prose sections={c.sections.slice(half)} locale={locale} anchors />
          {c.sources && c.sources.length > 0 && (
            <section aria-labelledby="sources-heading" className="mt-14 border-t border-line pt-8">
              <h2 id="sources-heading" className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
                {t.sources}
              </h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft marker:text-muted">
                {c.sources.map((src) => (
                  <li key={src.url}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-bright underline decoration-bright/30 underline-offset-[3px] hover:decoration-bright">
                      {src.label}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <AuthorBox locale={locale} />
          <InlineCta locale={locale} title={t.endTitle} text={t.endText} />
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
        <aside className="lg:col-span-4">
          <nav aria-label={t.toc} className="mb-4 hidden lg:block">
            <div className="rounded-2xl border border-line bg-bg-2 p-6">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{t.toc}</p>
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
          <div className="sticky top-28">
            <CtaCard
              locale={locale}
              title={locale === "de" ? "Lieber direkt mit uns umsetzen?" : "Vous préférez le réaliser avec nous ?"}
              text={locale === "de" ? "Wir schauen uns Ihre Situation an und sagen Ihnen, was sich lohnt." : "Nous examinons votre situation et vous disons ce qui en vaut la peine."}
            />
          </div>
        </aside>
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

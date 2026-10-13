import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, CtaCard, FaqList, FeatureGrid, PageHero, Prose, TrustList, callLabel } from "@/components/blocks";
import { WebsiteCheckForm } from "@/components/website-check-form";
import { ImpressumGenerator } from "@/components/impressum-generator";
import { guides } from "@/content/guides";
import { standalonePages } from "@/content/pages";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href } from "@/lib/routes";
import { JsonLd, breadcrumbLd, faqLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

const ui = {
  de: {
    toForm: "Website-Check anfragen",
    toTool: "Zum Generator",
    formTitle: "Website-Check anfragen",
    formText: "Geben Sie im Formular Ihre Website-Adresse an und schreiben Sie in die Nachricht «Website-Check». Wählen Sie bei den Leistungen, was am ehesten passt.",
    orRequest: "Lieber das ausführliche Anfrageformular?",
    tool: "Generator",
    moreGuides: "Passende Ratgeber",
  },
  fr: {
    toForm: "Demander l'analyse",
    toTool: "Vers le générateur",
    formTitle: "Demander l'analyse gratuite",
    formText: "Indiquez l'adresse de votre site dans le formulaire et écrivez « Analyse de site » dans le message. Pour les prestations, choisissez ce qui correspond le mieux.",
    orRequest: "Vous préférez le formulaire de demande complet ?",
    tool: "Générateur",
    moreGuides: "Conseils utiles",
  },
};

const FORM_ID = "formular";
const TOOL_ID = "generator";

export function StandalonePageView({ locale, pageKey }: { locale: Locale; pageKey: string }) {
  const d = getDict(locale);
  const t = ui[locale];
  const p = standalonePages.find((x) => x.key === pageKey)!;
  const c = p.content[locale];
  const url = href(locale, `page:${p.key}`);
  const isTool = p.key === "impressum-generator";
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: c.navLabel, url },
  ];
  const relServices = p.services.map((k) => services.find((s) => s.key === k)).filter((x) => x !== undefined);
  const relGuides = p.guides.filter((k) => hasRoute(`guide:${k}`)).map((k) => guides.find((g) => g.key === k)!);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={
          isTool
            ? {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: c.h1,
                description: c.meta.description,
                url: `${site.url}${url}`,
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                isAccessibleForFree: true,
                inLanguage: locale === "de" ? "de-CH" : "fr-CH",
                provider: { "@id": orgId },
              }
            : {
                "@context": "https://schema.org",
                "@type": "Service",
                name: c.h1,
                description: c.meta.description,
                serviceType: c.navLabel,
                provider: { "@id": orgId },
                areaServed: { "@type": "Country", name: locale === "de" ? "Schweiz" : "Suisse" },
                availableLanguage: ["de", "fr"],
                url: `${site.url}${url}`,
              }
        }
      />
      <JsonLd data={faqLd(c.faq)} />

      <PageHero
        eyebrow={c.eyebrow}
        title={c.h1}
        lead={c.lead}
        crumbs={[crumbs[0], { name: c.navLabel }]}
        aside={
          isTool ? undefined : (
            <div id={FORM_ID} className="scroll-mt-24">
              <WebsiteCheckForm locale={locale} thanksHref={href(locale, "thanks")} privacyHref={href(locale, "legal:datenschutz")} />
            </div>
          )
        }
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href={`#${isTool ? TOOL_ID : FORM_ID}`} variant="accent" className={isTool ? "" : "lg:hidden"}>
            {isTool ? t.toTool : t.toForm}
          </ButtonLink>
          <ButtonLink href={site.phoneHref} variant="ghostLight" arrow={false} icon="phone">
            {callLabel(locale)}
          </ButtonLink>
        </div>
        {!isTool && <TrustList locale={locale} dark className="mt-8 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:space-y-0" />}
      </PageHero>

      {isTool && (
        <section id={TOOL_ID} className="container-x scroll-mt-24 pt-14 md:pt-20">
          <p className="eyebrow mb-6">{t.tool}</p>
          <ImpressumGenerator locale={locale} />
        </section>
      )}

      <section className="container-x section-y">
        <h2 className="h-section mb-10 max-w-3xl">{c.pointsTitle}</h2>
        <FeatureGrid items={c.points} />
      </section>

      <section className="container-x pb-20">
        <h2 className="h-section mb-10 max-w-3xl">{c.stepsTitle}</h2>
        <ol className={`grid gap-4 sm:grid-cols-2 ${c.steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {c.steps.map((s, i) => (
            <li key={s.title} className="card reveal p-7">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-display text-[15px] font-semibold text-white">{i + 1}</span>
              <h3 className="mt-6 text-[19px] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`container-x grid gap-12 pb-12 lg:grid-cols-12 ${isTool ? "" : "pt-16 md:pt-24"}`}>
        <div className="lg:col-span-8">
          <Prose sections={c.sections} locale={locale} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            {isTool ? (
              <CtaCard locale={locale} title={c.ctaTitle} text={c.ctaText} />
            ) : (
              <div className="stage-night rounded-3xl p-7 text-white sm:p-8">
                <p className="kicker-light mb-4">{t.formTitle}</p>
                <h2 className="font-display text-[24px] font-semibold leading-[1.25]">{c.ctaTitle}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/75">{c.ctaText}</p>
                <ButtonLink href={`#${FORM_ID}`} variant="accent" className="mt-7 w-full">
                  {t.toForm}
                </ButtonLink>
                <ButtonLink href={site.phoneHref} variant="ghostLight" arrow={false} icon="phone" className="mt-3 w-full">
                  {callLabel(locale)}
                </ButtonLink>
              </div>
            )}
          </div>
        </aside>
      </section>

      <FaqList locale={locale} faq={c.faq} />

      {relGuides.length > 0 && (
        <section className="container-x pb-16">
          <h2 className="h-section mb-10">{t.moreGuides}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relGuides.map((g) => (
              <CardLink key={g.key} href={href(locale, `guide:${g.key}`)} meta={`${g.readingMinutes} ${d.common.minutes}`} title={g.content[locale].h1} text={g.content[locale].lead} />
            ))}
          </div>
        </section>
      )}

      {relServices.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="h-section mb-10">{d.common.related}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relServices.map((s) => (
              <CardLink key={s.key} href={href(locale, `service:${s.key}`)} icon={s.icon} title={s.content[locale].navLabel} text={s.content[locale].lead} />
            ))}
          </div>
        </section>
      )}
      <CtaBand locale={locale} />
    </>
  );
}

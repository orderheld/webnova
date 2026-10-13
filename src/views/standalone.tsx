import { ButtonLink } from "@/components/button";
import { Breadcrumbs, CardLink, ContactPerson, CtaBand, CtaCard, FaqList, FeatureGrid, PageHero, Prose, callLabel } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { WordBand } from "@/components/word-band";
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
    question: "Wie gut ist Ihre Website wirklich",
    heroLead: "Senden Sie uns die Adresse. Ferhat Demir sieht sich Ihre Website persönlich an und sagt Ihnen, was gut ist und was sich zuerst lohnt.",
    checker: "Prüft Ihre Website persönlich",
    points: ["Antwort innert 1 Arbeitstag", "Kein automatischer Report"],
    tool: "Generator",
    moreGuides: "Passende Ratgeber",
  },
  fr: {
    toForm: "Demander l'analyse",
    toTool: "Vers le générateur",
    formTitle: "Demander l'analyse gratuite",
    formText: "Indiquez l'adresse de votre site dans le formulaire et écrivez « Analyse de site » dans le message. Pour les prestations, choisissez ce qui correspond le mieux.",
    orRequest: "Vous préférez le formulaire de demande complet ?",
    question: "Votre site est-il vraiment à la hauteur",
    heroLead: "Envoyez-nous son adresse. Ferhat Demir examine personnellement votre site et vous dit ce qui fonctionne et ce qui vaut la peine en premier.",
    checker: "Examine votre site personnellement",
    points: ["Réponse sous 1 jour ouvrable", "Pas de rapport automatique"],
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

      {isTool ? (
        <PageHero eyebrow={c.eyebrow} title={c.h1} lead={c.lead} crumbs={[crumbs[0], { name: c.navLabel }]}>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={`#${TOOL_ID}`} variant="accent">
              {t.toTool}
            </ButtonLink>
            <ButtonLink href={site.phoneHref} variant="ghostLight" arrow={false} icon="phone">
              {callLabel(locale)}
            </ButtonLink>
          </div>
        </PageHero>
      ) : (
        <CheckHero locale={locale} crumbs={[crumbs[0], { name: c.navLabel }]} label={c.navLabel} />
      )}

      {isTool && (
        <section id={TOOL_ID} className="container-x scroll-mt-24 pt-14 md:pt-20">
          <p className="eyebrow mb-6">{t.tool}</p>
          <ImpressumGenerator locale={locale} />
        </section>
      )}

      {!isTool && <WordBand locale={locale} className="pt-6 md:pt-10" />}

      <section className="container-x section-y">
        <h2 className="h-section mb-10 max-w-3xl">{c.pointsTitle}</h2>
        {/* The full introduction: the hero only carries a short version next to the address bar. */}
        {!isTool && <p className="lead -mt-4 mb-10 max-w-3xl">{c.lead}</p>}
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

/**
 * Website check hero (nordpixel look): dark and centred, the question as the big headline with the "?" in the
 * light brand blue, the address bar of the form, and the person who checks the site. The H1 keeps the page
 * keyword ("Kostenloser Website-Check") as its first line. Ends in a white curve into the word band.
 */
function CheckHero({ locale, crumbs, label }: { locale: Locale; crumbs: { name: string; url?: string }[]; label: string }) {
  const t = ui[locale];
  return (
    <section className="under-header curve-bottom relative isolate overflow-hidden bg-[#0f1a26] text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_0%,rgb(59_99_133/0.35),transparent_70%),radial-gradient(40%_40%_at_85%_80%,rgb(36_64_90/0.45),transparent_70%)]" />
      <div className="container-x pb-32 pt-8 text-center md:pb-44 md:pt-10">
        <div className="flex justify-center [&_nav]:mb-10 md:[&_nav]:mb-12">
          <Breadcrumbs items={crumbs} dark />
        </div>
        <h1>
          <span className="eyebrow-light text-[13px] tracking-[0.3em]">
            {label}
            <span className="sr-only">: </span>
          </span>
          <span className="mx-auto mt-6 block max-w-[14ch] text-balance font-display text-[clamp(2.6rem,7vw,5.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
            {t.question}
            {locale === "fr" ? "\u00a0" : ""}
            <span className="text-[#8fb0cf]">?</span>
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-white/75 md:text-[19px]">{t.heroLead}</p>
        <div id={FORM_ID} className="mx-auto mt-10 max-w-[680px] scroll-mt-28">
          <WebsiteCheckForm locale={locale} thanksHref={href(locale, "thanks")} privacyHref={href(locale, "legal:datenschutz")} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-x-8 gap-y-4 sm:flex-row">
          <div className="text-left">
            <ContactPerson locale={locale} dark role={t.checker} />
          </div>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[14px] text-white/75 sm:justify-start">
            {t.points.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <Icon name="check" className="h-3.5 w-3.5 text-accent-light" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

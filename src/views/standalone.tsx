import { ButtonLink } from "@/components/button";
import { CardLink, ContactPerson, CtaBand, CtaCard, FaqList, FeatureGrid, PageHero, Prose, TrustList } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { ImpressumGenerator } from "@/components/impressum-generator";
import { LeadForm } from "@/components/lead-form";
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

      <PageHero eyebrow={c.eyebrow} title={c.h1} lead={c.lead} crumbs={[crumbs[0], { name: c.navLabel }]}>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={`#${isTool ? TOOL_ID : FORM_ID}`} variant="primary">
            {isTool ? t.toTool : t.toForm}
          </ButtonLink>
          <ButtonLink href={site.phoneHref} variant="ghost" arrow={false} icon="phone">
            {site.phone}
          </ButtonLink>
        </div>
        {!isTool && <TrustList locale={locale} className="mt-8 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:space-y-0" />}
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

      {!isTool && (
        <section id={FORM_ID} className="scroll-mt-20 bg-night py-20 text-white md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 lg:pt-6">
              <p className="eyebrow mb-5 !text-accent-light">{d.common.free}</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">{t.formTitle}</h2>
              <p className="mt-6 text-[18px] leading-relaxed text-white/75">{t.formText}</p>
              <div className="mt-10 border-t border-white/10 pt-8">
                <ContactPerson locale={locale} dark />
                <div className="mt-6 space-y-3 text-[15px]">
                  <a href={site.phoneHref} className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                    <Icon name="phone" className="h-4 w-4 text-accent-light" /> {site.phone}
                  </a>
                  <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                    <Icon name="chat" className="h-4 w-4 text-accent-light" /> {d.common.whatsapp}
                  </a>
                </div>
                <p className="mt-8 text-[15px] text-white/70">
                  {t.orRequest}{" "}
                  <a href={`${href(locale, "request")}?service=website-check`} className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                    {d.nav.cta}
                  </a>
                </p>
              </div>
            </div>
            <div className="lg:col-span-7">
              <LeadForm
                locale={locale}
                t={d.form}
                thanksHref={href(locale, "thanks")}
                privacyHref={href(locale, "legal:datenschutz")}
                source="website-check"
                dark
              />
            </div>
          </div>
        </section>
      )}

      <section className={`container-x grid gap-12 pb-12 lg:grid-cols-12 ${isTool ? "" : "pt-16 md:pt-24"}`}>
        <div className="lg:col-span-8">
          <Prose sections={c.sections} locale={locale} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <CtaCard locale={locale} title={c.ctaTitle} text={c.ctaText} />
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

import type { Metadata } from "next";
import { site } from "@/lib/site";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { industries } from "@/content/industries";
import { industryUi } from "@/content/industries/ui";
import { problems } from "@/content/problems";
import { legal } from "@/content/legal";
import { localServices } from "@/content/local";
import { references } from "@/content/references";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import type { RouteEntry } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { AboutPage, ContactPage, LegalPage, ReferencePage, ReferencesPage, RequestPage, ThanksPage } from "./pages";
import { CityPage, RegionsPage } from "./city";
import { GuidePage, GuidesPage } from "./guide";
import { IndustriesPage, IndustryPage, ProblemPage } from "./industry";
import { LandingPage, lpMeta } from "./landing";
import { ServicePage, ServicesPage } from "./service";
import { StandalonePageView } from "./standalone";
import { standalonePages } from "@/content/pages";

export function pageMeta(locale: Locale, entry: RouteEntry): Metadata {
  const d = getDict(locale).pages;
  const m = (meta: { title: string; description: string }) => pageMetadata(locale, entry, meta);
  switch (entry.kind) {
    case "services":
      return m({ title: d.servicesMetaTitle, description: d.servicesMetaDesc });
    case "service":
      return m(services.find((s) => s.key === entry.key)!.content[locale].meta);
    case "regions":
      return m({ title: d.regionsMetaTitle, description: d.regionsMetaDesc });
    case "city":
      return m(cities.find((c) => c.key === entry.key)!.content[locale].meta);
    case "citySeo":
      return m(cities.find((c) => c.key === entry.key)!.seo![locale].meta);
    case "localService":
      return m(localServices.find((l) => `${l.service}:${l.city}` === entry.key)!.content[locale].meta);
    case "guides":
      return m({ title: d.guidesMetaTitle, description: d.guidesMetaDesc });
    case "guide":
      return m(guides.find((g) => g.key === entry.key)!.content[locale].meta);
    case "industries":
      return m({ title: industryUi[locale].hubMetaTitle, description: industryUi[locale].hubMetaDesc });
    case "problems":
      return m({ title: industryUi[locale].problemsMetaTitle, description: industryUi[locale].problemsMetaDesc });
    case "industry":
      return m(industries.find((i) => i.key === entry.key)!.content[locale].meta);
    case "problem":
      return m(problems.find((p) => p.key === entry.key)!.content[locale].meta);
    case "about":
      return m({ title: d.aboutMetaTitle, description: d.aboutMetaDesc });
    case "references":
      return m({ title: d.referencesMetaTitle, description: d.referencesMetaDesc });
    case "reference": {
      const r = references.find((x) => x.key === entry.key)!;
      const c = r.content[locale];
      const industry = locale === "fr" ? c.industry.charAt(0).toLowerCase() + c.industry.slice(1) : c.industry;
      const sep = locale === "fr" ? " : " : ": ";
      const full = `${locale === "de" ? "Referenz" : "Référence"} ${r.name}${sep}${industry}`;
      const title = full.length <= 52 ? full : `${r.name}${sep}${industry}`;
      return m({ title, description: clip(c.summary, 155) });
    }
    case "contact":
      return m({ title: d.contactMetaTitle, description: d.contactMetaDesc });
    case "request":
      return m({ title: d.requestMetaTitle, description: d.requestMetaDesc });
    case "thanks":
      return m({ title: d.thanksMetaTitle, description: d.requestMetaDesc });
    case "legal": {
      const l = legal[entry.key as keyof typeof legal][locale];
      return m({
        title: l.title.length < 20 ? `${l.title}${locale === "fr" ? " :" : ":"} ${site.legalName}` : l.title,
        description:
          locale === "de"
            ? `${l.title} von ${site.legalName}, Webdesign-Agentur: Anbieter, Kontakt und rechtliche Angaben zur Webseite.`
            : `${l.title} de ${site.legalName}, agence web : éditeur, contact et informations légales du site.`,
      });
    }
    case "page":
      return m(standalonePages.find((p) => p.key === entry.key)!.content[locale].meta);
    case "lp":
      return m(lpMeta(locale, entry.key));
    default:
      return {};
  }
}

export function renderPage(locale: Locale, entry: RouteEntry) {
  switch (entry.kind) {
    case "services":
      return <ServicesPage locale={locale} />;
    case "service":
      return <ServicePage locale={locale} serviceKey={entry.key} />;
    case "regions":
      return <RegionsPage locale={locale} />;
    case "city":
      return <CityPage locale={locale} cityKey={entry.key} variant="webdesign" />;
    case "citySeo":
      return <CityPage locale={locale} cityKey={entry.key} variant="seo" />;
    case "localService": {
      const [serviceKey, cityKey] = entry.key.split(":");
      return <CityPage locale={locale} cityKey={cityKey} variant="local" serviceKey={serviceKey} />;
    }
    case "guides":
      return <GuidesPage locale={locale} />;
    case "guide":
      return <GuidePage locale={locale} guideKey={entry.key} />;
    case "industries":
      return <IndustriesPage locale={locale} focus="industries" />;
    case "problems":
      return <IndustriesPage locale={locale} focus="problems" />;
    case "industry":
      return <IndustryPage locale={locale} industryKey={entry.key} />;
    case "problem":
      return <ProblemPage locale={locale} problemKey={entry.key} />;
    case "about":
      return <AboutPage locale={locale} />;
    case "references":
      return <ReferencesPage locale={locale} />;
    case "reference":
      return <ReferencePage locale={locale} refKey={entry.key} />;
    case "contact":
      return <ContactPage locale={locale} />;
    case "request":
      return <RequestPage locale={locale} />;
    case "thanks":
      return <ThanksPage locale={locale} />;
    case "legal":
      return <LegalPage locale={locale} legalKey={entry.key as keyof typeof legal} />;
    case "page":
      return <StandalonePageView locale={locale} pageKey={entry.key} />;
    case "lp":
      return <LandingPage locale={locale} lpKey={entry.key} />;
    default:
      return null;
  }
}

/** Shortens text to at most `max` characters at a word boundary, for meta descriptions. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max - 1)).replace(/[,:;]$/, "") + "…";
}

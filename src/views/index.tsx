import type { Metadata } from "next";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { legal } from "@/content/legal";
import { localServices } from "@/content/local";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import type { RouteEntry } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { AboutPage, ContactPage, LegalPage, ReferencesPage, RequestPage, ThanksPage } from "./pages";
import { CityPage, RegionsPage } from "./city";
import { GuidePage, GuidesPage } from "./guide";
import { LandingPage, lpMeta } from "./landing";
import { ServicePage, ServicesPage } from "./service";

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
    case "about":
      return m({ title: d.aboutMetaTitle, description: d.aboutMetaDesc });
    case "references":
      return m({ title: d.referencesMetaTitle, description: d.referencesMetaDesc });
    case "contact":
      return m({ title: d.contactMetaTitle, description: d.contactMetaDesc });
    case "request":
      return m({ title: d.requestMetaTitle, description: d.requestMetaDesc });
    case "thanks":
      return m({ title: d.thanksMetaTitle, description: d.requestMetaDesc });
    case "legal": {
      const l = legal[entry.key as keyof typeof legal][locale];
      return m({ title: l.title, description: `${l.title} – Webnova, Grenchen` });
    }
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
    case "about":
      return <AboutPage locale={locale} />;
    case "references":
      return <ReferencesPage locale={locale} />;
    case "contact":
      return <ContactPage locale={locale} />;
    case "request":
      return <RequestPage locale={locale} />;
    case "thanks":
      return <ThanksPage locale={locale} />;
    case "legal":
      return <LegalPage locale={locale} legalKey={entry.key as keyof typeof legal} />;
    case "lp":
      return <LandingPage locale={locale} lpKey={entry.key} />;
    default:
      return null;
  }
}

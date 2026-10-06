export const locales = ["de", "fr"] as const;
export type Locale = (typeof locales)[number];
export type Localized<T> = Record<Locale, T>;

export interface Faq {
  q: string;
  a: string;
}

/** A text section: H2 + paragraphs, optional bullet list. */
export interface Section {
  h2: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PageMeta {
  /** <title>, max ~60 chars, contains the main keyword. */
  title: string;
  /** meta description, max ~155 chars, with a call to action. */
  description: string;
}

export interface ServiceContent {
  slug: string; // localized URL slug, e.g. "webdesign" / "creation-site-internet"
  navLabel: string; // short label for menus, e.g. "Webdesign"
  meta: PageMeta;
  eyebrow: string; // small label above H1
  h1: string;
  lead: string; // 1–2 sentences under H1
  /** 3–6 short cards: what the client gets. */
  features: { title: string; text: string }[];
  sections: Section[]; // 2–4 long-form SEO sections
  faq: Faq[]; // 4–6 questions
  ctaTitle: string;
  ctaText: string;
}

export interface Service {
  key: string;
  /** "pos" services are grouped under the Kassensystem area. */
  group: "web" | "marketing" | "pos";
  icon: string; // key into the icon set in components/icons.tsx
  /** keys of related services for internal links */
  related: string[];
  content: Localized<ServiceContent>;
}

export interface CityContent {
  name: string; // localized city name, e.g. "Biel" / "Bienne"
  slug: string; // e.g. "webdesign-biel" / "creation-site-internet-bienne"
  meta: PageMeta;
  h1: string;
  lead: string;
  /** Unique local text. Must NOT be generic: mention local economy, sectors, distance from Grenchen etc. */
  sections: Section[]; // 3 sections
  faq: Faq[]; // 3–4 questions, local
}

export interface City {
  key: string;
  priority: "A" | "B" | "C";
  canton: string; // e.g. "BE"
  /** approx. driving minutes from Grenchen office */
  minutesFromOffice: number;
  nearby: string[]; // keys of nearby cities for internal links
  geo: { lat: number; lng: number };
  content: Localized<CityContent>;
  /** Only for priority A: additional local SEO page. */
  seo?: Localized<CityContent>;
}

export interface GuideContent {
  slug: string;
  meta: PageMeta;
  h1: string;
  lead: string;
  sections: Section[];
  faq: Faq[];
}

export interface Guide {
  key: string;
  date: string; // ISO date
  readingMinutes: number;
  related: string[]; // service keys
  content: Localized<GuideContent>;
}

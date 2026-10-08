/**
 * Price calculator built around fixed packages plus add-ons (websites from CHF 2'000 to about CHF 10'000)
 * and the recurring fees billed from year 2. Pure functions, safe in client components.
 * The defaults below are only the starting point: they are edited under Rechner > Preise and stored in settings.
 */
import type { BillingInterval } from "@/db/schema";

export interface CalcPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  /** internal effort estimate */
  hours: number;
}

export interface CalcAddon {
  id: string;
  name: string;
  description: string;
  /** price per unit (or flat when unit is "Pauschal") */
  price: number;
  hours: number;
  unit: string;
}

export interface CalcRecurring {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: BillingInterval;
  /** preselected in new calculations */
  defaultOn: boolean;
}

export interface CalculatorConfig {
  /** internal target hourly rate, only for the effective rate check */
  targetRate: number;
  /** usual price range of a website, shown as a guide */
  minTotal: number;
  maxTotal: number;
  packages: CalcPackage[];
  addons: CalcAddon[];
  recurring: CalcRecurring[];
}

export const defaultCalculatorConfig: CalculatorConfig = {
  targetRate: 110,
  minTotal: 2000,
  maxTotal: 10000,
  packages: [
    {
      id: "starter",
      name: "Webseite Starter",
      description: "Onepager oder Webseite bis 3 Seiten, responsives Design, Kontaktformular, Basis-SEO, Go-live",
      price: 2000,
      hours: 16,
    },
    {
      id: "kmu",
      name: "Webseite KMU",
      description: "Bis 6 Seiten, individuelles Design, CMS, Kontaktformular, Onpage-SEO, Google Unternehmensprofil, Schulung",
      price: 3900,
      hours: 30,
    },
    {
      id: "professional",
      name: "Webseite Professional",
      description: "Bis 12 Seiten, Designkonzept, CMS, Blog/News, erweiterte SEO-Grundlagen, Animationen, Schulung",
      price: 6200,
      hours: 48,
    },
    {
      id: "shop",
      name: "Onlineshop",
      description: "Shop mit bis zu 50 Produkten, TWINT und Karte, Versand, MWST, Rechtstexte, Kundenkonto, Schulung",
      price: 7900,
      hours: 62,
    },
  ],
  addons: [
    { id: "page", name: "Zusätzliche Seite", description: "Gestaltung und Umsetzung pro Seite", price: 250, hours: 2, unit: "Seiten" },
    { id: "language", name: "Zusätzliche Sprache", description: "Mehrsprachigkeit inkl. Sprachumschalter, ohne Übersetzung", price: 600, hours: 5, unit: "Sprachen" },
    { id: "shopModule", name: "Shop-Funktion", description: "Kleiner Shop in der Webseite, TWINT und Karte", price: 2500, hours: 20, unit: "Pauschal" },
    { id: "products", name: "Produkte erfassen", description: "Pro Produkt inkl. Bild und Varianten", price: 15, hours: 0.2, unit: "Produkte" },
    { id: "booking", name: "Online-Buchung / Termine", description: "Buchungs- oder Terminsystem einbinden", price: 600, hours: 5, unit: "Pauschal" },
    { id: "blog", name: "Blog / News", description: "Beitragsseite mit Kategorien", price: 400, hours: 3, unit: "Pauschal" },
    { id: "seo", name: "SEO-Setup", description: "Keyword-Recherche, lokale Optimierung, Search Console, Google Unternehmensprofil", price: 600, hours: 5, unit: "Pauschal" },
    { id: "copy", name: "Texte schreiben", description: "SEO-optimierte Texte pro Seite", price: 180, hours: 1.5, unit: "Seiten" },
    { id: "photos", name: "Bilder und Fotos", description: "Bildauswahl, Stockfotos, Bearbeitung", price: 300, hours: 2.5, unit: "Pauschal" },
    { id: "logo", name: "Logo und Branding", description: "Logo, Farben, Schriften, Kurz-Styleguide", price: 900, hours: 8, unit: "Pauschal" },
    { id: "pos", name: "Kassensystem-Anbindung", description: "Verbindung Webseite oder Shop mit dem Kassensystem", price: 800, hours: 6, unit: "Pauschal" },
    { id: "relaunch", name: "Relaunch-Übernahme", description: "Inhalte übernehmen, Weiterleitungen alter URLs", price: 350, hours: 3, unit: "Pauschal" },
    { id: "newsletter", name: "Newsletter-Anbindung", description: "Anmeldeformular und Anbindung an Mailchimp oder Brevo", price: 300, hours: 2.5, unit: "Pauschal" },
  ],
  recurring: [
    { id: "hosting", name: "Hosting & SSL", description: "Schweizer Hosting, SSL-Zertifikat, tägliche Backups", price: 240, interval: "jahr", defaultOn: true },
    { id: "maintenance", name: "Wartung & Updates", description: "Updates, Sicherheit, kleine Anpassungen", price: 480, interval: "jahr", defaultOn: true },
    { id: "domain", name: "Domain .ch", description: "Registrierung und Verwaltung", price: 25, interval: "jahr", defaultOn: true },
  ],
};

/** A calculation as stored in estimates.data (version 2). */
export interface CalcLine {
  /** catalogue id, "custom" for free lines */
  id: string;
  name: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
  hours: number;
}

export interface CalcRecurringLine {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: BillingInterval;
  /** first year included in the project price, billing from year 2 */
  fromYear2: boolean;
}

export interface CalcState {
  version: 2;
  package: CalcLine | null;
  addons: CalcLine[];
  recurring: CalcRecurringLine[];
  discountPercent: number;
  targetRate: number;
  marginNote?: string;
}

export const isPerUnit = (unit: string) => !!unit && unit !== "Pauschal";

export const packageLine = (p: CalcPackage): CalcLine => ({ id: p.id, name: p.name, description: p.description, qty: 1, unit: "Pauschal", price: p.price, hours: p.hours });
export const addonLine = (a: CalcAddon, qty = 1): CalcLine => ({ id: a.id, name: a.name, description: a.description, qty, unit: a.unit, price: a.price, hours: a.hours });
export const recurringLine = (r: CalcRecurring): CalcRecurringLine => ({ id: r.id, name: r.name, description: r.description, price: r.price, interval: r.interval, fromYear2: true });

export function newCalculation(cfg: CalculatorConfig, packageId?: string): CalcState {
  const p = cfg.packages.find((x) => x.id === packageId) ?? cfg.packages[1] ?? cfg.packages[0];
  return {
    version: 2,
    package: p ? packageLine(p) : null,
    addons: [],
    recurring: cfg.recurring.filter((r) => r.defaultOn).map(recurringLine),
    discountPercent: 0,
    targetRate: cfg.targetRate,
    marginNote: "",
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const yearFactor: Record<string, number> = { monat: 12, quartal: 4, halbjahr: 2, jahr: 1 };

export function calcTotals(c: CalcState) {
  const lines = [...(c.package ? [c.package] : []), ...c.addons];
  const subtotal = r2(lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0));
  const discount = r2((subtotal * (Number(c.discountPercent) || 0)) / 100);
  const total = r2(subtotal - discount);
  const hours = Math.round(lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.hours) || 0), 0) * 4) / 4;
  const effectiveRate = hours > 0 ? r2(total / hours) : 0;
  const yearly = r2(c.recurring.reduce((s, r) => s + (Number(r.price) || 0) * (yearFactor[r.interval] ?? 1), 0));
  const firstYear = r2(c.recurring.filter((r) => !r.fromYear2).reduce((s, r) => s + (Number(r.price) || 0) * (yearFactor[r.interval] ?? 1), 0));
  return { subtotal, discount, total, hours, effectiveRate, yearly, firstYear };
}

/**
 * Older calculations (hour checklist, version 1) are shown as one free line with their former total,
 * so nothing is lost when they are opened in the new calculator.
 */
export function normalizeCalc(data: unknown, cfg: CalculatorConfig, legacy?: { total: number; hours: number }): CalcState {
  const d = data as Partial<CalcState> & { hourlyRate?: number };
  if (d && d.version === 2) {
    return {
      version: 2,
      package: d.package ?? null,
      addons: d.addons ?? [],
      recurring: d.recurring ?? [],
      discountPercent: d.discountPercent ?? 0,
      targetRate: d.targetRate ?? cfg.targetRate,
      marginNote: d.marginNote ?? "",
    };
  }
  const c = newCalculation(cfg);
  c.package = null;
  c.recurring = [];
  if (legacy && legacy.total > 0)
    c.addons = [{ id: "custom", name: "Bisherige Stundenschätzung", description: "Aus dem alten Rechner übernommen", qty: 1, unit: "Pauschal", price: legacy.total, hours: legacy.hours }];
  c.marginNote = (data as { marginNote?: string })?.marginNote ?? "";
  if (d?.hourlyRate) c.targetRate = d.hourlyRate;
  return c;
}

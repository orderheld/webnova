/** German labels and colour tones for every status in the admin. Safe to import in client components. */

export const leadStageLabels: Record<string, string> = {
  neu: "Neu",
  kontaktiert: "Kontaktiert",
  gespraech: "Gespräch",
  offerte: "Offerte",
  gewonnen: "Gewonnen",
  verloren: "Verloren",
};

export const leadSourceLabels: Record<string, string> = {
  anfrage: "Webformular",
  akquise: "Eigene Akquise",
  empfehlung: "Empfehlung",
  telefon: "Telefon",
  netzwerk: "Netzwerk / Event",
  social: "Social Media",
  andere: "Andere",
};
/** Sources selectable for manually created leads */
export const manualLeadSources = ["akquise", "empfehlung", "telefon", "netzwerk", "social", "andere"] as const;

export const quoteStatusLabels: Record<string, string> = {
  entwurf: "Entwurf",
  gesendet: "Gesendet",
  angenommen: "Angenommen",
  abgelehnt: "Abgelehnt",
};

export const invoiceStatusLabels: Record<string, string> = {
  entwurf: "Entwurf",
  gesendet: "Offen",
  teilbezahlt: "Teilbezahlt",
  bezahlt: "Bezahlt",
  storniert: "Storniert",
  ueberfaellig: "Überfällig",
};

export const creditStatusLabels: Record<string, string> = {
  entwurf: "Entwurf",
  gesendet: "Ausgestellt",
  teilbezahlt: "Teilweise erstattet",
  bezahlt: "Erstattet",
  storniert: "Storniert",
};

export const projectStatusLabels: Record<string, string> = {
  planung: "Planung",
  design: "Design",
  entwicklung: "Entwicklung",
  review: "Review",
  live: "Live",
  abgeschlossen: "Abgeschlossen",
};

export const subscriptionStatusLabels: Record<string, string> = {
  aktiv: "Aktiv",
  pausiert: "Pausiert",
  gekuendigt: "Gekündigt",
};

export const subscriptionCategoryLabels: Record<string, string> = {
  hosting: "Hosting",
  wartung: "Wartung",
  domain: "Domain",
  seo: "SEO-Betreuung",
  lizenz: "Lizenz",
  andere: "Andere",
};

export const intervalLabels: Record<string, string> = {
  monat: "monatlich",
  quartal: "quartalsweise",
  halbjahr: "halbjährlich",
  jahr: "jährlich",
};
export const intervalUnit: Record<string, string> = { monat: "Monat", quartal: "Quartal", halbjahr: "Halbjahr", jahr: "Jahr" };
export const intervalMonths: Record<string, number> = { monat: 1, quartal: 3, halbjahr: 6, jahr: 12 };

export const activityTypeLabels: Record<string, string> = {
  anruf: "Anruf",
  email: "E-Mail",
  meeting: "Meeting",
  notiz: "Notiz",
  system: "System",
};

export const paymentMethodLabels: Record<string, string> = {
  bank: "Bank / QR",
  twint: "TWINT",
  bar: "Bar",
  karte: "Karte",
  verrechnung: "Verrechnung",
};

export const expenseCategoryLabels: Record<string, string> = {
  software: "Software & Lizenzen",
  hosting: "Hosting & Server",
  domains: "Domains",
  hardware: "Hardware",
  werbung: "Werbung & Marketing",
  fremdleistung: "Fremdleistungen",
  buero: "Büro & Miete",
  fahrzeug: "Fahrzeug & Reisen",
  weiterbildung: "Weiterbildung",
  versicherung: "Versicherungen & Gebühren",
  telefon: "Telefon & Internet",
  spesen: "Spesen & Verpflegung",
  diverses: "Diverses",
};

export const units = ["Pauschal", "Std.", "Stk.", "Seiten", "Tag", "Monat", "Quartal", "Jahr"];

const tones: Record<string, string> = {
  // leads
  neu: "bg-accent-soft text-accent",
  kontaktiert: "bg-amber-100 text-amber-800",
  gespraech: "bg-sky-100 text-sky-800",
  offerte: "bg-violet-100 text-violet-800",
  gewonnen: "bg-emerald-100 text-emerald-800",
  verloren: "bg-zinc-200 text-zinc-600",
  // documents
  entwurf: "bg-zinc-100 text-zinc-600",
  gesendet: "bg-accent-soft text-accent",
  angenommen: "bg-emerald-100 text-emerald-800",
  abgelehnt: "bg-zinc-200 text-zinc-600",
  teilbezahlt: "bg-amber-100 text-amber-800",
  bezahlt: "bg-emerald-100 text-emerald-800",
  storniert: "bg-zinc-200 text-zinc-500 line-through",
  ueberfaellig: "bg-red-100 text-red-700",
  // projects
  planung: "bg-zinc-100 text-zinc-700",
  design: "bg-violet-100 text-violet-800",
  entwicklung: "bg-sky-100 text-sky-800",
  review: "bg-amber-100 text-amber-800",
  live: "bg-emerald-100 text-emerald-800",
  abgeschlossen: "bg-zinc-200 text-zinc-600",
  // subscriptions
  aktiv: "bg-emerald-100 text-emerald-800",
  pausiert: "bg-amber-100 text-amber-800",
  gekuendigt: "bg-zinc-200 text-zinc-600",
};

const allLabels: Record<string, string> = {
  ...leadStageLabels,
  ...quoteStatusLabels,
  ...invoiceStatusLabels,
  ...projectStatusLabels,
  ...subscriptionStatusLabels,
};

export const statusTone = (s: string) => tones[s] ?? "bg-zinc-100 text-zinc-700";
export const statusLabel = (s: string) => allLabels[s] ?? s;

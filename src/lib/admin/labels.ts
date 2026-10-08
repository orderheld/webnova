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

/*
 * Status tones in the corporate palette: Schieferblau tints for open work, muted green / ochre /
 * red only for outcomes that need attention. No other hues, so badges never compete with the logo.
 */
const tone = {
  neutral: "bg-bg text-muted ring-line",
  info: "bg-bright-soft text-bright ring-bright/15",
  progress: "bg-accent-soft text-accent ring-accent/15",
  strong: "bg-accent text-white ring-accent",
  success: "bg-success-soft text-success ring-success/15",
  warn: "bg-warn-soft text-warn ring-warn/15",
  danger: "bg-danger-soft text-danger ring-danger/20",
};

const tones: Record<string, string> = {
  // leads
  neu: tone.info,
  kontaktiert: tone.progress,
  gespraech: tone.progress,
  offerte: tone.strong,
  gewonnen: tone.success,
  verloren: tone.neutral,
  // documents
  entwurf: tone.neutral,
  gesendet: tone.info,
  angenommen: tone.success,
  abgelehnt: tone.neutral,
  teilbezahlt: tone.warn,
  bezahlt: tone.success,
  storniert: `${tone.neutral} line-through`,
  ueberfaellig: tone.danger,
  // projects
  planung: tone.neutral,
  design: tone.info,
  entwicklung: tone.progress,
  review: tone.warn,
  live: tone.success,
  abgeschlossen: tone.neutral,
  // subscriptions
  aktiv: tone.success,
  pausiert: tone.warn,
  gekuendigt: tone.neutral,
};

/** Bar colour per pipeline stage: one Schieferblau ramp from light (early) to dark (late). */
export const leadStageBar: Record<string, string> = {
  neu: "bg-accent-light",
  kontaktiert: "bg-[#8fa6bb]",
  gespraech: "bg-bright",
  offerte: "bg-accent",
  gewonnen: "bg-success",
  verloren: "bg-line",
};

const allLabels: Record<string, string> = {
  ...leadStageLabels,
  ...quoteStatusLabels,
  ...invoiceStatusLabels,
  ...projectStatusLabels,
  ...subscriptionStatusLabels,
};

export const statusTone = (s: string) => tones[s] ?? tone.neutral;
export const statusLabel = (s: string) => allLabels[s] ?? s;

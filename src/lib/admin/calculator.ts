/** Internal cost calculator catalogue (hours per item). Adjust to your own experience values. */
export interface CalcItem {
  id: string;
  label: string;
  hours: number;
  /** if set, the item has a quantity (e.g. per page) */
  unit?: string;
  hint?: string;
}

export interface CalcGroup {
  id: string;
  label: string;
  items: CalcItem[];
}

export const calcCatalog: CalcGroup[] = [
  {
    id: "konzept",
    label: "Konzept & Planung",
    items: [
      { id: "kickoff", label: "Kick-off / Briefing-Workshop", hours: 2 },
      { id: "sitemap", label: "Seitenstruktur & Sitemap", hours: 2 },
      { id: "wireframes", label: "Wireframes / Seitenaufbau", hours: 4 },
      { id: "keyword", label: "Keyword-Recherche", hours: 3 },
      { id: "competitor", label: "Konkurrenzanalyse", hours: 2 },
    ],
  },
  {
    id: "design",
    label: "Design",
    items: [
      { id: "styleguide", label: "Designkonzept / Styleguide", hours: 6 },
      { id: "home-design", label: "Startseite gestalten", hours: 6 },
      { id: "subpage-design", label: "Unterseiten-Template gestalten", hours: 2, unit: "Templates" },
      { id: "mobile", label: "Mobile Optimierung Design", hours: 3 },
      { id: "logo", label: "Logo-Entwicklung", hours: 10 },
      { id: "visuals", label: "Bildbearbeitung / Grafiken", hours: 1, unit: "Std." },
    ],
  },
  {
    id: "entwicklung",
    label: "Entwicklung",
    items: [
      { id: "setup", label: "Projekt-Setup, Hosting, Domain", hours: 2 },
      { id: "home-dev", label: "Startseite umsetzen", hours: 6 },
      { id: "page-dev", label: "Unterseite umsetzen", hours: 1.5, unit: "Seiten" },
      { id: "cms", label: "CMS / Redaktionssystem", hours: 6 },
      { id: "i18n", label: "Mehrsprachigkeit (pro Sprache)", hours: 4, unit: "Sprachen" },
      { id: "form", label: "Kontakt- / Anfrageformular", hours: 2 },
      { id: "booking", label: "Buchungs- / Terminsystem", hours: 8 },
      { id: "blog", label: "Blog / News", hours: 5 },
      { id: "shop", label: "Onlineshop-Grundsetup", hours: 20 },
      { id: "products", label: "Produkte erfassen", hours: 0.25, unit: "Produkte" },
      { id: "payment", label: "Zahlungsanbieter (TWINT, Karte)", hours: 4 },
      { id: "integration", label: "Schnittstelle / Integration", hours: 6, unit: "Stk." },
      { id: "animations", label: "Animationen / Interaktionen", hours: 4 },
    ],
  },
  {
    id: "content",
    label: "Inhalte",
    items: [
      { id: "copy", label: "Texte schreiben (pro Seite)", hours: 1.5, unit: "Seiten" },
      { id: "translation", label: "Übersetzung (pro Seite)", hours: 0.75, unit: "Seiten" },
      { id: "content-entry", label: "Inhalte einpflegen", hours: 0.5, unit: "Seiten" },
      { id: "photo", label: "Fotoshooting-Organisation", hours: 3 },
    ],
  },
  {
    id: "seo",
    label: "SEO & Marketing",
    items: [
      { id: "onpage", label: "Onpage-SEO (Meta, Struktur, Schema)", hours: 4 },
      { id: "local", label: "Google Unternehmensprofil", hours: 2 },
      { id: "localpages", label: "Lokale Landingpages", hours: 2, unit: "Seiten" },
      { id: "redirects", label: "Weiterleitungen alte URLs (Relaunch)", hours: 2 },
      { id: "analytics", label: "Analytics / Search Console", hours: 1.5 },
      { id: "ads-setup", label: "Google-Ads-Kampagne Setup", hours: 6 },
      { id: "meta-ads", label: "Meta-Ads-Kampagne Setup", hours: 5 },
    ],
  },
  {
    id: "launch",
    label: "Launch & Projekt",
    items: [
      { id: "testing", label: "Testing (Browser, Geräte)", hours: 3 },
      { id: "golive", label: "Go-live & Abnahme", hours: 2 },
      { id: "training", label: "Schulung Kunde", hours: 1.5 },
      { id: "pm", label: "Projektleitung / Abstimmungen", hours: 4 },
      { id: "revisions", label: "Korrekturschlaufen", hours: 3 },
    ],
  },
];

export const calcItemById = new Map(calcCatalog.flatMap((g) => g.items.map((i) => [i.id, { ...i, group: g.label }])));

export interface EstimateInput {
  hourlyRate: number;
  items: { id: string; qty: number }[];
  custom: { title: string; hours: number }[];
  riskPercent: number;
}

export function estimateTotals(e: EstimateInput) {
  const lines: { group: string; label: string; hours: number }[] = [];
  for (const { id, qty } of e.items) {
    const it = calcItemById.get(id);
    if (!it) continue;
    const q = it.unit ? Math.max(0, qty || 0) : 1;
    if (q === 0) continue;
    lines.push({ group: it.group, label: it.unit ? `${it.label} (${q} ${it.unit})` : it.label, hours: it.hours * q });
  }
  for (const c of e.custom) {
    if (c.title.trim() && c.hours > 0) lines.push({ group: "Individuell", label: c.title.trim(), hours: c.hours });
  }
  const baseHours = lines.reduce((s, l) => s + l.hours, 0);
  const riskHours = (baseHours * (e.riskPercent || 0)) / 100;
  const totalHours = Math.round((baseHours + riskHours) * 4) / 4;
  const total = Math.round(totalHours * e.hourlyRate * 20) / 20;
  return { lines, baseHours, riskHours, totalHours, total };
}

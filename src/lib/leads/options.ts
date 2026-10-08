export const serviceOptions = ["webdesign", "redesign", "shop", "seo", "ads", "branding", "pos", "maintenance", "other"] as const;
export const companySizeOptions = ["solo", "small", "medium", "large"] as const;
export const budgetOptions = ["b1", "b2", "b3", "b4", "unknown"] as const;
export const timelineOptions = ["asap", "1-3", "3-6", "open"] as const;
export const contactOptions = ["phone", "email", "whatsapp"] as const;

/** German labels for the admin panel and notification mails. */
export const labelsDe = {
  services: { webdesign: "Neue Webseite", redesign: "Redesign", shop: "Onlineshop", seo: "SEO", ads: "Google/Social Ads", branding: "Branding", pos: "Kassensystem", maintenance: "Wartung & Hosting", other: "Anderes" },
  companySize: { solo: "Einzelunternehmen", small: "2–9 MA", medium: "10–49 MA", large: "50+ MA" },
  budget: { b1: "bis 3'000", b2: "3'000–7'500", b3: "7'500–15'000", b4: "über 15'000", unknown: "unklar" },
  timeline: { asap: "sofort", "1-3": "1–3 Monate", "3-6": "3–6 Monate", open: "offen" },
  preferredContact: { phone: "Telefon", email: "E-Mail", whatsapp: "WhatsApp" },
} as const;

export function label<K extends keyof typeof labelsDe>(group: K, v: string | null | undefined): string {
  if (!v) return "–";
  return (labelsDe[group] as Record<string, string>)[v] ?? v;
}

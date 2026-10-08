import { guides } from "@/content/guides";
import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { hasRoute, href } from "@/lib/routes";
import { site } from "@/lib/site";

/*
 * /llms.txt (https://llmstxt.org/): a short Markdown overview of the site for language models such as
 * ChatGPT or Perplexity. Not an official standard (see the GEO guide), but it costs nothing and is built
 * from the same content as the pages, so it never goes stale.
 */
export const dynamic = "force-static";

const text: Record<Locale, { summary: string; about: string; services: string; guides: string; company: string; pages: [string, string][] }> = {
  de: {
    summary:
      "Webdesign-Agentur für KMU in der ganzen Schweiz: Webseiten erstellen, erneuern und betreuen, dazu SEO, Onlineshops und Kassensysteme. Auf Deutsch und Französisch.",
    about: `${site.name} (${site.legalName}) erstellt Webseiten für Schweizer KMU. Ihr Ansprechpartner ist Ferhat Demir. Preise werden nicht veröffentlicht, jedes Projekt erhält eine persönliche Offerte.`,
    services: "Leistungen",
    guides: "Ratgeber",
    company: "Unternehmen",
    pages: [
      ["about", "Über uns"],
      ["contact", "Kontakt"],
      ["request", "Projekt anfragen"],
      ["page:website-check", "Kostenloser Website-Check"],
    ],
  },
  fr: {
    summary:
      "Agence web pour les PME de toute la Suisse : création, refonte et maintenance de sites internet, ainsi que SEO, boutiques en ligne et systèmes de caisse. En français et en allemand.",
    about: `${site.name} (${site.legalName}) crée des sites internet pour les PME suisses. Votre interlocuteur est Ferhat Demir. Les prix ne sont pas publiés, chaque projet reçoit une offre personnalisée.`,
    services: "Prestations",
    guides: "Conseils",
    company: "Entreprise",
    pages: [
      ["about", "À propos"],
      ["contact", "Contact"],
      ["request", "Demander un projet"],
      ["page:website-check", "Analyse de site gratuite"],
    ],
  },
};

const link = (label: string, path: string, note?: string) => `- [${label}](${site.url}${path})${note ? `: ${note}` : ""}`;

function section(locale: Locale) {
  const t = text[locale];
  const suffix = locale === "fr" ? " (français)" : "";
  return [
    `## ${t.services}${suffix}`,
    "",
    ...services.map((s) => link(s.content[locale].navLabel, href(locale, `service:${s.key}`), s.content[locale].lead)),
    "",
    `## ${t.guides}${suffix}`,
    "",
    ...guides.map((g) => link(g.content[locale].h1, href(locale, `guide:${g.key}`), g.content[locale].meta.description)),
    "",
    `## ${t.company}${suffix}`,
    "",
    ...t.pages.filter(([id]) => hasRoute(id)).map(([id, label]) => link(label, href(locale, id))),
  ];
}

export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${text.de.summary}`,
    "",
    text.de.about,
    "",
    `- E-Mail: ${site.email}`,
    `- Telefon: ${site.phone}`,
    `- Adresse: ${site.address.street}, ${site.address.zip} ${site.address.city}, Schweiz`,
    "",
    `${text.fr.summary} ${text.fr.about}`,
    "",
    ...section("de"),
    "",
    ...section("fr"),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

import { z } from "zod";
import { chf, domainYearly, carePrice, pricePackages, secondLanguagePagePrice, type PackageId } from "@/content/pricing";
import type { Locale } from "@/content/types";

/*
 * PDF proposal of a client preview (Admin > Vorschauen > PDF-Vorschlag): the texts Ferhat writes per client, the
 * screenshots taken from the preview and the price. Stored as JSON on the preview; proposal-pdf.ts turns it into the
 * A4 landscape PDF in the look of the first hand-made proposal. Shared by the form in the browser and the server.
 */

const line = (max = 300) => z.string().trim().max(max);

/** Longest caption under a screenshot: a computer screenshot is wider than a phone. */
export const captionMax = { desktop: 60, mobile: 40 } as const;

/** A heading shortened to a caption, cut at a word. */
export function fitCaption(text: string, max: number) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 2).replace(/\s+\S*$/, "")} …`;
}
const text = (max = 1500) => z.string().trim().max(max);
/** "" = chosen automatically, "none" = no picture, "shot:12" = a screenshot, "site:media/poster.jpg" = a picture of the preview */
const imageRef = z.string().regex(/^$|^none$|^shot:\d{1,9}$|^site:[^\0]{1,400}$/);

export const proposalSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  validDays: z.number().int().min(1).max(365),
  recipient: line(120),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  /** background of the cover, see imageRef */
  cover: z.object({ title: line(120), text: text(400), note: line(160), image: imageRef }),
  situation: z.object({ title: line(160), text: text(), boxes: z.array(z.object({ title: line(60), items: z.array(line(160)).max(6) })).max(4) }),
  concept: z.object({ title: line(160), text: text(600), steps: z.array(z.object({ title: line(60), text: text(300) })).max(8) }),
  desktop: z.array(z.object({ fileId: z.number().int().positive(), caption: line(captionMax.desktop) })).max(6),
  mobile: z.array(z.object({ fileId: z.number().int().positive(), caption: line(captionMax.mobile) })).max(5),
  /** pictures of the preview as a collage (mood of the photos and the film), page left out without pictures */
  gallery: z.object({ text: text(600), images: z.array(imageRef.refine((r) => r !== "")).max(5) }),
  structure: z.object({
    title: line(160),
    text: text(600),
    groups: z.array(z.object({ title: line(60), pages: z.array(line(80)).max(8) })).max(4),
    features: z.array(line(160)).max(8),
  }),
  plan: z.object({ title: line(160), note: line(80), steps: z.array(z.object({ when: line(30), title: line(60), text: text(300) })).max(4), need: text(400) }),
  after: z.object({ title: line(160), text: text(600), cards: z.array(z.object({ title: line(60), text: text(300) })).max(6) }),
  price: z.object({
    packageId: z.enum(["starter", "kmu", "professional", "individuell"]),
    fixLabel: line(60),
    fixPrice: z.number().int().min(0).max(1_000_000).nullable(),
    text: text(400),
    payment: text(300),
    rows: z.array(z.object({ label: line(200), amount: z.number().int().min(0).max(1_000_000) })).max(8),
    optional: z.array(z.object({ label: line(120), value: line(40) })).max(6),
  }),
  next: z.object({ title: line(160), steps: z.array(text(300)).max(3) }),
});

export type Proposal = z.infer<typeof proposalSchema>;
export type ProposalShot = Proposal["desktop"][number];

/** Fixed words of the PDF in the client's language. */
export const proposalLabels = {
  de: {
    kicker: "Webauftritt · Vorschlag",
    for: "Für",
    sections: {
      situation: ["Ausgangslage", "Was wir verstanden haben"],
      concept: ["Konzept", "Der rote Faden"],
      desktop: ["Startseite Computer", "Ausschnitte aus der Vorschau"],
      mobile: ["Startseite Handy", "Für das Handy gestaltet"],
      gallery: ["Bildwelt", "Die Stimmung der Bilder"],
      structure: ["Aufbau", "Alles mit einem Klick"],
      plan: ["Vorgehen", ""],
      after: ["Nach Ihrer Zusage", "Von der Vorschau zur fertigen Website"],
      price: ["Investition", "Fixpreis, keine Überraschungen"],
      next: ["Nächste Schritte", "Wir freuen uns auf Sie"],
    },
    structurePages: (n: number) => `${n} Seiten, alles mit einem Klick`,
    desktopNote: "Die ganze Startseite sehen Sie über den Link, den Sie von uns erhalten haben. Am besten zuerst am Computer öffnen und langsam scrollen.",
    mobileNote: "Auf dem Handy öffnen Sie einfach denselben Link. Jeder Abschnitt ist für das Hochformat angeordnet, nicht nur verkleinert.",
    features: "Funktionen",
    calculation: "Berechnung",
    optional: "Optional",
    total: "Total",
    totalList: "Total nach Preisliste",
    need: "Was wir von Ihnen brauchen:",
    footer: "Vorschlag Webauftritt",
    valid: (date: string) => `Angebot gültig bis ${date}`,
    allPrices: "Alle Preise in CHF",
    contact: "Ihr Ansprechpartner",
    phone: "Telefon",
    email: "E-Mail",
    web: "Web",
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  },
  fr: {
    kicker: "Site web · Proposition",
    for: "Pour",
    sections: {
      situation: ["Situation", "Ce que nous avons compris"],
      concept: ["Concept", "Le fil rouge"],
      desktop: ["Page d'accueil ordinateur", "Extraits de l'aperçu"],
      mobile: ["Page d'accueil mobile", "Conçue pour le téléphone"],
      gallery: ["Univers visuel", "L'ambiance des images"],
      structure: ["Structure", "Tout en un clic"],
      plan: ["Déroulement", ""],
      after: ["Après votre accord", "De l'aperçu au site terminé"],
      price: ["Investissement", "Prix fixe, sans surprises"],
      next: ["Prochaines étapes", "Au plaisir de travailler avec vous"],
    },
    structurePages: (n: number) => `${n} pages, tout en un clic`,
    desktopNote: "Vous voyez toute la page d'accueil grâce au lien que nous vous avons envoyé. Le mieux est de l'ouvrir d'abord sur un ordinateur et de faire défiler lentement.",
    mobileNote: "Sur votre téléphone, il suffit d'ouvrir le même lien. Chaque section est disposée pour le format portrait, pas seulement réduite.",
    features: "Fonctions",
    calculation: "Calcul",
    optional: "En option",
    total: "Total",
    totalList: "Total selon la liste de prix",
    need: "Ce dont nous avons besoin de votre part :",
    footer: "Proposition site web",
    valid: (date: string) => `Offre valable jusqu'au ${date}`,
    allPrices: "Tous les prix en CHF",
    contact: "Votre interlocuteur",
    phone: "Téléphone",
    email: "E-mail",
    web: "Web",
    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  },
} satisfies Record<Locale, unknown>;

/** "22. Oktober 2026" / "22 octobre 2026", "1er décembre 2026" */
export function proposalDate(locale: Locale, iso: string, addDays = 0) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + addDays);
  const month = proposalLabels[locale].months[d.getUTCMonth()];
  const day = d.getUTCDate();
  return locale === "de" ? `${day}. ${month} ${d.getUTCFullYear()}` : `${day === 1 ? "1er" : day} ${month} ${d.getUTCFullYear()}`;
}

/** Headline with accent words: "Eine Marke, die man *persönlich* kennenlernt." */
export function accentParts(s: string): { text: string; accent: boolean }[] {
  return s.split(/\*([^*]+)\*/).map((t, i) => ({ text: t, accent: i % 2 === 1 })).filter((p) => p.text);
}

/** Row of a package in the calculation; Individuell names no features, its scope is agreed per client. */
export function packageRow(locale: Locale, packageId: PackageId, pages: number): Proposal["price"]["rows"][number] {
  const p = pricePackages.find((x) => x.id === packageId)!;
  const de = locale === "de";
  if (packageId === "individuell") {
    return { label: de ? `Paket ${p.name.de}, Umfang gemäss Absprache` : `Formule ${p.name.fr}, périmètre selon entente`, amount: p.price };
  }
  const summary = p.features[locale].filter((f) => !/sprache|langue|seite|page|woche|semaine|zeitplan|calendrier|preis|prix/i.test(f)).slice(0, 4).join(", ");
  const size = de ? `${pages} ${pages === 1 ? "Seite" : "Seiten"}` : `${pages} page${pages === 1 ? "" : "s"}`;
  return { label: de ? `Paket ${p.name.de} (${size}): ${summary}` : `Formule ${p.name.fr} (${size}) : ${summary}`, amount: p.price };
}

/** Row of the further languages (pages × CHF 140 each), or null for one language. */
export function languageRow(locale: Locale, pages: number, languages: number): Proposal["price"]["rows"][number] | null {
  const extra = languages - 1;
  if (extra < 1) return null;
  const de = locale === "de";
  const size = de ? `${pages} ${pages === 1 ? "Seite" : "Seiten"}` : `${pages} page${pages === 1 ? "" : "s"}`;
  const times = `${size} × ${extra > 1 ? `${extra} × ` : ""}${chf(secondLanguagePagePrice)}`;
  return {
    label: de
      ? `${extra === 1 ? "Zweite Sprache" : `${extra} weitere Sprachen`} (${times})`
      : `${extra === 1 ? "Deuxième langue" : `${extra} langues supplémentaires`} (${times})`,
    amount: pages * extra * secondLanguagePagePrice,
  };
}

/** The language row is recognised by its wording, so the form can replace it without touching rows Ferhat added. */
export const isLanguageRow = (label: string) => /^(Zweite Sprache|\d+ weitere Sprachen|Deuxième langue|\d+ langues supplémentaires) \(/.test(label);
export const isPackageRow = (label: string) =>
  pricePackages.some((x) => label.startsWith(`Paket ${x.name.de} (`) || label.startsWith(`Paket ${x.name.de},`) || label.startsWith(`Formule ${x.name.fr} (`) || label.startsWith(`Formule ${x.name.fr},`));

/** Price rows for a package: the package itself and, for more languages, their pages. */
export function packageRows(locale: Locale, packageId: PackageId, pages: number, languages: number): Proposal["price"]["rows"] {
  const lang = languageRow(locale, pages, languages);
  return lang ? [packageRow(locale, packageId, pages), lang] : [packageRow(locale, packageId, pages)];
}

/** Pages a package is priced for, used for the second-language row. */
export const packagePages: Record<PackageId, number> = { demo: 1, starter: 1, kmu: 5, professional: 10, individuell: 10 };

type Plan = Proposal["plan"];

/** Steps and duration per package, in line with the times on the price page (Starter 1 to 2 weeks, KMU about 3). */
export function planFor(locale: Locale, packageId: PackageId): Plan {
  const de = locale === "de";
  const title = de ? "So kommen wir zum Ziel." : "Comment nous y arrivons.";
  const need = de
    ? "Logo, Texte und Bilder (oder Ihre Wünsche dazu) sowie zwei bis drei Termine für Feedback."
    : "Logo, textes et images (ou vos souhaits à ce sujet) ainsi que deux ou trois rendez-vous pour vos retours.";
  const step = (when: [string, string], t: [string, string], x: [string, string]) => ({ when: when[de ? 0 : 1], title: t[de ? 0 : 1], text: x[de ? 0 : 1] });
  if (packageId === "starter" || packageId === "demo") {
    return {
      title,
      need,
      note: de ? "In der Regel 1 bis 2 Wochen bis zum Start" : "En général 1 à 2 semaines jusqu'à la mise en ligne",
      steps: [
        step(["Tag 1–2", "Jours 1–2"], ["Feinkonzept", "Concept détaillé"], ["Inhalte festlegen, Logo und Farben einbinden.", "Définition des contenus, intégration du logo et des couleurs."]),
        step(["Woche 1", "Semaine 1"], ["Design", "Design"], ["Die Seite für Computer und Handy, angepasst nach Ihren Rückmeldungen.", "La page pour ordinateur et mobile, ajustée selon vos retours."]),
        step(["Woche 1–2", "Semaines 1–2"], ["Umsetzung", "Réalisation"], ["Programmierung, Formular, Texte und Bilder, Tests auf allen Geräten.", "Programmation, formulaire, textes et images, tests sur tous les appareils."]),
        step(["Woche 2", "Semaine 2"], ["Start", "Lancement"], ["Letzte Kontrolle, Aufschaltung und Einführung.", "Dernier contrôle, mise en ligne et introduction."]),
      ],
    };
  }
  if (packageId === "kmu") {
    return {
      title,
      need,
      note: de ? "Rund 3 Wochen bis zum Start" : "Environ 3 semaines jusqu'à la mise en ligne",
      steps: [
        step(["Woche 1", "Semaine 1"], ["Feinkonzept", "Concept détaillé"], ["Gespräch, Inhalte und Seiten festlegen, Logo und Farben einbinden.", "Entretien, définition des contenus et des pages, intégration du logo et des couleurs."]),
        step(["Woche 1–2", "Semaines 1–2"], ["Design", "Design"], ["Alle Seiten für Computer und Handy, angepasst nach Ihren Rückmeldungen.", "Toutes les pages pour ordinateur et mobile, ajustées selon vos retours."]),
        step(["Woche 2–3", "Semaines 2–3"], ["Umsetzung", "Réalisation"], ["Programmierung, Formular, Texte und Bilder, Tests auf allen Geräten.", "Programmation, formulaire, textes et images, tests sur tous les appareils."]),
        step(["Woche 3", "Semaine 3"], ["Start", "Lancement"], ["Letzte Kontrolle, Aufschaltung und Einführung.", "Dernier contrôle, mise en ligne et introduction."]),
      ],
    };
  }
  return {
    title,
    need,
    note: packageId === "individuell" ? (de ? "Zeitplan nach Umfang" : "Calendrier selon l'ampleur") : de ? "Rund 6 bis 8 Wochen bis zum Start" : "Environ 6 à 8 semaines jusqu'à la mise en ligne",
    steps: [
      step(["Woche 1", "Semaine 1"], ["Feinkonzept", "Concept détaillé"], ["Workshop, Logo und Marke einbinden, Inhalte und Seiten festlegen.", "Atelier, intégration du logo et de la marque, définition des contenus et des pages."]),
      step(["Woche 2–3", "Semaines 2–3"], ["Design", "Design"], ["Alle Seiten für Computer und Handy. Zwei Korrekturrunden.", "Toutes les pages pour ordinateur et mobile. Deux tours de corrections."]),
      step(["Woche 3–6", "Semaines 3–6"], ["Umsetzung", "Réalisation"], ["Programmierung, Animationen, Formular, Tests auf allen Geräten.", "Programmation, animations, formulaire, tests sur tous les appareils."]),
      step(["Woche 7–8", "Semaines 7–8"], ["Start", "Lancement"], ["Inhalte einsetzen, letzte Kontrolle, Aufschaltung und Einführung.", "Intégration des contenus, dernier contrôle, mise en ligne et introduction."]),
    ],
  };
}

/** A new proposal with the texts that are the same for every client; Ferhat adds the client's own. */
export function defaultProposal(locale: Locale, input: { recipient: string; today: string }): Proposal {
  const de = locale === "de";
  const packageId: PackageId = "kmu";
  return {
    date: input.today,
    validDays: 30,
    recipient: input.recipient,
    accent: "#3b6385",
    cover: {
      title: de ? "Ihr neuer *Webauftritt.*" : "Votre nouveau *site web.*",
      text: de
        ? "Gestaltungsidee, Aufbau und Angebot für Ihren neuen Webauftritt, mit einer ersten Vorschau Ihrer Startseite."
        : "Idée graphique, structure et offre pour votre nouveau site web, avec un premier aperçu de votre page d'accueil.",
      note: de ? "Logo, Bilder und Texte sind Platzhalter" : "Logo, images et textes provisoires",
      image: "",
    },
    situation: {
      title: de ? "Was Ihnen *wichtig* ist." : "Ce qui compte *pour vous.*",
      text: "",
      boxes: (de ? ["Ihr Betrieb", "Ihre Kunden", "Auftritt", "Webseite"] : ["Votre entreprise", "Vos clients", "Image", "Site web"]).map((title) => ({ title, items: [] })),
    },
    concept: {
      title: de ? "So ist die Startseite *aufgebaut.*" : "Comment la page d'accueil est *construite.*",
      text: de
        ? "Jeder Abschnitt beantwortet eine Frage, die sich ein Besucher stellt, in der Reihenfolge, in der er sie stellt."
        : "Chaque section répond à une question que se pose le visiteur, dans l'ordre où il se la pose.",
      steps: [],
    },
    desktop: [],
    mobile: [],
    gallery: {
      text: de
        ? "Die Bilder in der Vorschau zeigen die Stimmung, die wir mit Ihren eigenen Aufnahmen erreichen wollen."
        : "Les images de l'aperçu montrent l'ambiance que nous voulons atteindre avec vos propres photos.",
      images: [],
    },
    structure: {
      title: de ? "Einfach zu finden, schnell zu bedienen." : "Facile à trouver, simple à utiliser.",
      text: de
        ? "Eine klare Navigation ohne verschachtelte Menüs. Jede Seite ist direkt erreichbar, auf dem Handy genauso wie am Computer."
        : "Une navigation claire, sans menus imbriqués. Chaque page est accessible directement, sur mobile comme sur ordinateur.",
      groups: de
        ? [
            { title: "Hauptseiten", pages: ["Startseite", "Angebot", "Über uns"] },
            { title: "Kontakt", pages: ["Kontakt", "Impressum", "Datenschutz"] },
          ]
        : [
            { title: "Pages principales", pages: ["Accueil", "Offre", "À propos"] },
            { title: "Contact", pages: ["Contact", "Mentions légales", "Protection des données"] },
          ],
      features: de
        ? ["Für Handy, Tablet und Computer gestaltet", "Kontaktformular, jede Anfrage kommt per Mail", "Google-Grundlagen", "Datenschutz nach Schweizer Recht (revDSG)"]
        : ["Conçu pour mobile, tablette et ordinateur", "Formulaire de contact, chaque demande arrive par e-mail", "Bases Google", "Protection des données selon le droit suisse (nLPD)"],
    },
    plan: planFor(locale, packageId),
    after: {
      title: de ? "Die Vorschau ist erst der *Anfang.*" : "L'aperçu n'est que le *début.*",
      text: de
        ? "Die Startseite, die Sie gesehen haben, zeigt die Designrichtung. Mit Ihrem Auftrag entsteht daraus Ihre vollständige, fertige Website."
        : "La page d'accueil que vous avez vue montre la direction graphique. Avec votre commande, elle devient votre site complet et terminé.",
      cards: de
        ? [
            { title: "Alle Seiten", text: "Jede Seite aus dem Aufbau, im gleichen Design wie die Startseite, für Computer, Tablet und Handy." },
            { title: "Ihre Marke", text: "Ihr Logo, Ihre Farben und Schriften. Dazu ein Favicon und Vorschaubilder für WhatsApp und Social Media." },
            { title: "Echte Inhalte", text: "Ihre Texte und Bilder ersetzen die Platzhalter der Vorschau." },
            { title: "Funktionen", text: "Ein Kontaktformular, das Ihnen jede Anfrage per Mail schickt, und alles, was im Aufbau steht." },
            { title: "Qualität", text: "Tests auf Handy, Tablet und Computer, schnelle Ladezeiten, Google-Grundlagen und Datenschutz nach Schweizer Recht." },
            { title: "Start und Betreuung", text: "Aufschaltung, Einführung und ein persönlicher Ansprechpartner, auch nach dem Start." },
          ]
        : [
            { title: "Toutes les pages", text: "Chaque page de la structure, dans le même design que la page d'accueil, pour ordinateur, tablette et mobile." },
            { title: "Votre marque", text: "Votre logo, vos couleurs et vos polices. Avec un favicon et des images d'aperçu pour WhatsApp et les réseaux sociaux." },
            { title: "Vrais contenus", text: "Vos textes et vos images remplacent les éléments provisoires de l'aperçu." },
            { title: "Fonctions", text: "Un formulaire de contact qui vous envoie chaque demande par e-mail, et tout ce qui figure dans la structure." },
            { title: "Qualité", text: "Tests sur mobile, tablette et ordinateur, chargement rapide, bases Google et protection des données selon le droit suisse." },
            { title: "Lancement et suivi", text: "Mise en ligne, introduction et un interlocuteur personnel, aussi après le lancement." },
          ],
    },
    price: {
      packageId,
      fixLabel: de ? "Ihr Fixpreis" : "Votre prix fixe",
      fixPrice: null,
      text: de ? "Komplette Website als Fixpreis." : "Site complet à prix fixe.",
      payment: de
        ? "Zahlung: 40 % bei Start, 40 % nach Designfreigabe, 20 % beim Start der Website."
        : "Paiement : 40 % au démarrage, 40 % après validation du design, 20 % à la mise en ligne.",
      rows: packageRows(locale, packageId, packagePages[packageId], 1),
      optional: [
        { label: de ? "Hosting mit SSL, Backups, Updates und Support" : "Hébergement avec SSL, sauvegardes, mises à jour et support", value: `${chf(carePrice("hosting"))} / ${de ? "Monat" : "mois"}` },
        { label: "Domain", value: `${de ? "ca." : "env."} ${chf(domainYearly)} / ${de ? "Jahr" : "an"}` },
      ],
    },
    next: {
      title: de ? "Lassen Sie uns *starten.*" : "Lançons-nous *ensemble.*",
      steps: de
        ? [
            "Sie schauen sich die Vorschau in Ruhe an, am Computer und auf dem Handy.",
            "Wir besprechen Ihre Eindrücke und Wünsche in einem kurzen Gespräch.",
            "Mit Ihrer Zusage starten wir mit dem Feinkonzept.",
          ]
        : [
            "Vous regardez l'aperçu tranquillement, sur ordinateur et sur mobile.",
            "Nous discutons de vos impressions et de vos souhaits lors d'un court entretien.",
            "Avec votre accord, nous commençons le concept détaillé.",
          ],
    },
  };
}

/** Total of the price rows and what the client pays (the fixed price, when one is set). */
export function proposalTotals(price: Proposal["price"]) {
  const total = price.rows.reduce((n, r) => n + r.amount, 0);
  return { total, pay: price.fixPrice ?? total };
}

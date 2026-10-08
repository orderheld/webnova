import type { Faq, Locale, Localized, Point } from "./types";

/*
 * Shared copy for the beyondweb-style page structure (home, service, city and industry pages):
 * trust facts, "Kennen Sie diese Probleme?", benefits, process, "Passen wir zusammen?", next steps,
 * contact person, locations and the generic FAQ entries that top up page-specific FAQs.
 * Facts only: nothing here may invent clients, numbers, awards, ratings or prices.
 */

export interface TrustFact {
  icon: string;
  title: string;
  text: string;
}

export interface FaqTemplate {
  /** Skip this entry when one of the page's own questions already matches. */
  match: RegExp;
  q: string;
  a: string;
}

interface StructureCopy {
  trustLabel: string;
  trust: TrustFact[];
  problemsEyebrow: string;
  problemsTitle: string;
  problemsLead: string;
  problemsMore: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  processEyebrow: string;
  processTitle: string;
  processLead: string;
  fitEyebrow: string;
  fitTitle: string;
  fitLead: string;
  fitYesTitle: string;
  fitNoTitle: string;
  fit: { yes: string[]; no: string[] };
  stepsEyebrow: string;
  stepsTitle: string;
  stepsLead: string;
  steps: Point[];
  stepsCta: string;
  contactEyebrow: string;
  contactTitle: string;
  contactText: string;
  contactRole: string;
  hoursLabel: string;
  closedSunday: string;
  locationsEyebrow: string;
  locationsTitle: string;
  locationsLead: string;
  officeLabel: string;
  allRegions: string;
  industriesEyebrow: string;
  industriesTitle: string;
  industriesLead: string;
  referencesEyebrow: string;
  referencesTitle: string;
  referencesLead: string;
  servicesEyebrow: string;
  servicesTitle: string;
  /** POS pages get their own problems and benefits; web-specific copy does not fit a cash register. */
  posProblems: Point[];
  posBenefits: Point[];
  posFit: { yes: string[]; no: string[] };
}

export const structure: Localized<StructureCopy> = {
  de: {
    trustLabel: "Das ist Webnova",
    trust: [
      { icon: "shield", title: "Schweizer Firma", text: "Sitz in der Schweiz, Verträge nach Schweizer Recht, Datenschutz nach nDSG." },
      { icon: "users", title: "Persönlicher Ansprechpartner", text: "Ferhat Demir begleitet Ihr Projekt vom Erstgespräch bis nach dem Launch." },
      { icon: "globe", title: "Deutsch und Französisch", text: "Beratung, Texte und Webseiten in beiden Landessprachen." },
      { icon: "terminal", title: "Eigene Entwicklung", text: "Moderne Technik statt Baukasten-Vorlage, schnell und auf Ihr Ziel gebaut." },
      { icon: "chat", title: "Direkt erreichbar", text: "Telefon, E-Mail und WhatsApp. Antwort innert eines Arbeitstages." },
    ],
    problemsEyebrow: "Kennen Sie das?",
    problemsTitle: "Kennen Sie diese Probleme?",
    problemsLead: "Die meisten KMU kommen mit einem dieser Anliegen zu uns. Für jedes haben wir einen klaren Weg zur Lösung.",
    problemsMore: "Alle Lösungen",
    benefitsEyebrow: "Ihre Vorteile",
    benefitsTitle: "Was Sie von Webnova erwarten können.",
    processEyebrow: "Ablauf",
    processTitle: "In fünf klaren Phasen zum Ziel.",
    processLead: "Sie wissen jederzeit, woran wir arbeiten und was als Nächstes kommt. Entscheidungen treffen Sie, wir sorgen für den Weg dorthin.",
    fitEyebrow: "Ehrlich gesagt",
    fitTitle: "Passen wir zusammen?",
    fitLead: "Eine gute Zusammenarbeit beginnt mit den richtigen Erwartungen. Darum sagen wir offen, für wen wir die richtige Agentur sind und für wen (noch) nicht.",
    fitYesTitle: "Wir passen gut zu Ihnen, wenn ...",
    fitNoTitle: "Wir passen (noch) nicht, wenn ...",
    fit: {
      yes: [
        "Sie ein KMU, eine Praxis oder einen Betrieb in der Schweiz führen und online mehr Anfragen erhalten möchten.",
        "Sie eine feste Ansprechperson wünschen statt wechselnder Projektteams.",
        "Ihnen Qualität, Ladezeit und Sichtbarkeit bei Google wichtiger sind als der tiefste Preis.",
        "Sie Ihr Fachwissen einbringen und Entwürfe zeitnah freigeben.",
        "Sie auf Deutsch, auf Französisch oder in beiden Sprachen auftreten möchten.",
      ],
      no: [
        "Sie die günstigste Vorlage zum Selbermachen suchen.",
        "Die Webseite morgen online sein soll, aber noch niemand weiss, was darauf steht.",
        "Sie garantierte Google-Rankings oder gekaufte Backlinks erwarten.",
        "Ihr Projekt eine Ausschreibung mit grossem Projektteam und monatelangen Gremienrunden braucht.",
      ],
    },
    stepsEyebrow: "So geht es weiter",
    stepsTitle: "Ihre nächsten Schritte",
    stepsLead: "Vom ersten Kontakt bis zum Projektstart sind es drei einfache Schritte. Keiner davon verpflichtet Sie zu etwas.",
    steps: [
      { title: "Erstgespräch", text: "Sie erzählen uns von Ihrem Betrieb, Ihren Zielen und Ihrer heutigen Webseite. Per Telefon, Video oder vor Ort, kostenlos und unverbindlich." },
      { title: "Offerte", text: "Sie erhalten eine schriftliche Offerte mit Umfang, Ablauf und Zeitplan. Klar beschrieben, ohne versteckte Kosten." },
      { title: "Umsetzung", text: "Nach Ihrer Freigabe legen wir los. Sie sehen Entwürfe früh, entscheiden mit und haben jederzeit dieselbe Ansprechperson." },
    ],
    stepsCta: "Erstgespräch vereinbaren",
    contactEyebrow: "Ihr Ansprechpartner",
    contactTitle: "Sie sprechen direkt mit Ferhat Demir.",
    contactText: "Ferhat Demir führt Webnova und begleitet Ihr Projekt persönlich: im Erstgespräch, bei der Offerte, während der Umsetzung und nach dem Launch. Keine Weiterleitung, keine Warteschlange.",
    contactRole: "Ihr Ansprechpartner, Webnova",
    hoursLabel: "Bürozeiten",
    closedSunday: "Sonntag geschlossen",
    locationsEyebrow: "Standorte",
    locationsTitle: "Für KMU in der ganzen Schweiz.",
    locationsLead: "Wir arbeiten für Unternehmen in der Deutsch- und Westschweiz, per Videocall und bei Bedarf vor Ort. Für jede Region gibt es eine eigene Seite mit lokalen Besonderheiten.",
    officeLabel: "Büro",
    allRegions: "Alle Standorte",
    industriesEyebrow: "Branchen",
    industriesTitle: "Webseiten, die Ihre Branche verstehen.",
    industriesLead: "Ein Restaurant braucht Reservationen, ein Handwerksbetrieb gute Offertanfragen, eine Praxis Vertrauen. Sehen Sie, was eine Webseite in Ihrer Branche leisten muss.",
    referencesEyebrow: "Referenzen",
    referencesTitle: "Echte Projekte. Echte Unternehmen.",
    referencesLead: "Ein Auszug aus unserer Arbeit, jeweils mit einem klaren Ziel.",
    servicesEyebrow: "Leistungen",
    servicesTitle: "Alles aus einer Hand.",
    posProblems: [
      { title: "Warteschlangen zur Stosszeit", text: "Die Kasse ist langsam, Bons gehen verloren und Gäste oder Kundschaft warten länger als nötig." },
      { title: "Tagesabschluss von Hand", text: "Umsätze werden abends zusammengezählt, Zahlen für die Buchhaltung fehlen oder stimmen nicht." },
      { title: "Kasse und Onlineshop getrennt", text: "Artikel, Preise und Lager werden doppelt gepflegt. Fehler sind programmiert." },
      { title: "Niemand hilft, wenn es klemmt", text: "Bei Fragen landen Sie in einer Hotline statt bei einer Person, die Ihren Betrieb kennt." },
    ],
    posBenefits: [
      { title: "Eingerichtet vor Ort", text: "Wir richten Kasse, Artikel und Geräte bei Ihnen ein und schulen Ihr Team direkt im Betrieb." },
      { title: "Einfach im Alltag", text: "Klare Oberfläche, schnelle Abläufe und Zahlungen mit Karte und TWINT." },
      { title: "Übersicht in Zahlen", text: "Tagesabschluss und Berichte auf Knopfdruck statt Zettelwirtschaft." },
      { title: "Persönlicher Support", text: "Sie erreichen eine Person, die Ihre Installation kennt, auf Deutsch oder Französisch." },
    ],
    posFit: {
      yes: [
        "Sie ein Restaurant, Café, eine Bar oder einen Laden in der Schweiz führen.",
        "Sie eine Kasse wünschen, die vor Ort eingerichtet und erklärt wird.",
        "Ihnen ein persönlicher Ansprechpartner wichtiger ist als eine anonyme Hotline.",
        "Kasse und Onlineshop künftig zusammenspielen sollen.",
      ],
      no: [
        "Sie eine Kasse ohne Einrichtung und Schulung aus dem Karton suchen.",
        "Sie eine Speziallösung für Grossbetriebe mit eigener IT-Abteilung brauchen.",
        "Die Kasse ohne jede Vorbereitung bis morgen laufen soll.",
      ],
    },
  },
  fr: {
    trustLabel: "Webnova en bref",
    trust: [
      { icon: "shield", title: "Entreprise suisse", text: "Siège en Suisse, contrats selon le droit suisse, protection des données selon la nLPD." },
      { icon: "users", title: "Un interlocuteur personnel", text: "Ferhat Demir suit votre projet du premier entretien jusqu'après la mise en ligne." },
      { icon: "globe", title: "Français et allemand", text: "Conseil, textes et sites dans les deux langues nationales." },
      { icon: "terminal", title: "Développement maison", text: "Une technologie moderne plutôt qu'un modèle de constructeur, rapide et pensée pour votre objectif." },
      { icon: "chat", title: "Joignable directement", text: "Téléphone, e-mail et WhatsApp. Réponse dans un délai d'un jour ouvrable." },
    ],
    problemsEyebrow: "Cela vous parle ?",
    problemsTitle: "Vous reconnaissez ces problèmes ?",
    problemsLead: "La plupart des PME viennent nous voir avec l'une de ces préoccupations. Pour chacune, nous avons une démarche claire.",
    problemsMore: "Toutes les solutions",
    benefitsEyebrow: "Vos avantages",
    benefitsTitle: "Ce que vous pouvez attendre de Webnova.",
    processEyebrow: "Méthode",
    processTitle: "Cinq phases claires jusqu'au résultat.",
    processLead: "Vous savez à tout moment sur quoi nous travaillons et ce qui vient ensuite. Vous décidez, nous traçons le chemin.",
    fitEyebrow: "En toute franchise",
    fitTitle: "Sommes-nous faits pour travailler ensemble ?",
    fitLead: "Une bonne collaboration commence par des attentes claires. Nous disons donc ouvertement pour qui nous sommes la bonne agence, et pour qui pas (encore).",
    fitYesTitle: "Nous vous conviendrons si ...",
    fitNoTitle: "Nous ne vous conviendrons pas (encore) si ...",
    fit: {
      yes: [
        "Vous dirigez une PME, un cabinet ou une entreprise en Suisse et voulez plus de demandes en ligne.",
        "Vous souhaitez un interlocuteur fixe plutôt que des équipes qui changent.",
        "La qualité, la vitesse et la visibilité sur Google comptent plus pour vous que le prix le plus bas.",
        "Vous apportez votre savoir-faire et validez les maquettes rapidement.",
        "Vous voulez communiquer en français, en allemand ou dans les deux langues.",
      ],
      no: [
        "Vous cherchez le modèle le moins cher à faire vous-même.",
        "Le site doit être en ligne demain, mais personne ne sait encore ce qu'il doit contenir.",
        "Vous attendez des positions Google garanties ou des backlinks achetés.",
        "Votre projet exige un appel d'offres avec une grande équipe et des mois de comités.",
      ],
    },
    stepsEyebrow: "La suite",
    stepsTitle: "Vos prochaines étapes",
    stepsLead: "Du premier contact au lancement du projet, il y a trois étapes simples. Aucune ne vous engage.",
    steps: [
      { title: "Premier entretien", text: "Vous nous parlez de votre entreprise, de vos objectifs et de votre site actuel. Par téléphone, en visio ou sur place, gratuitement et sans engagement." },
      { title: "Devis", text: "Vous recevez un devis écrit avec l'étendue, le déroulement et le calendrier. Clair, sans coûts cachés." },
      { title: "Réalisation", text: "Après votre accord, nous démarrons. Vous voyez les maquettes tôt, décidez avec nous et gardez toujours le même interlocuteur." },
    ],
    stepsCta: "Fixer un premier entretien",
    contactEyebrow: "Votre interlocuteur",
    contactTitle: "Vous parlez directement avec Ferhat Demir.",
    contactText: "Ferhat Demir dirige Webnova et suit votre projet personnellement : au premier entretien, pour le devis, pendant la réalisation et après la mise en ligne. Pas de transfert, pas de file d'attente.",
    contactRole: "Votre interlocuteur, Webnova",
    hoursLabel: "Heures d'ouverture",
    closedSunday: "Fermé le dimanche",
    locationsEyebrow: "Régions",
    locationsTitle: "Pour les PME de toute la Suisse.",
    locationsLead: "Nous travaillons pour des entreprises de Suisse romande et alémanique, en visioconférence et sur place si nécessaire. Chaque région a sa propre page avec ses particularités locales.",
    officeLabel: "Bureau",
    allRegions: "Toutes les régions",
    industriesEyebrow: "Secteurs",
    industriesTitle: "Des sites qui comprennent votre secteur.",
    industriesLead: "Un restaurant a besoin de réservations, un artisan de bonnes demandes de devis, un cabinet de confiance. Découvrez ce qu'un site doit faire dans votre secteur.",
    referencesEyebrow: "Références",
    referencesTitle: "De vrais projets. De vraies entreprises.",
    referencesLead: "Un aperçu de notre travail, chaque projet avec un objectif clair.",
    servicesEyebrow: "Services",
    servicesTitle: "Tout d'un seul interlocuteur.",
    posProblems: [
      { title: "Files d'attente aux heures de pointe", text: "La caisse est lente, des bons se perdent et la clientèle attend plus que nécessaire." },
      { title: "Clôture journalière à la main", text: "Les recettes sont additionnées le soir, les chiffres pour la comptabilité manquent ou sont faux." },
      { title: "Caisse et boutique en ligne séparées", text: "Articles, prix et stock sont saisis deux fois. Les erreurs sont inévitables." },
      { title: "Personne pour aider en cas de souci", text: "En cas de question, vous tombez sur une hotline plutôt que sur une personne qui connaît votre entreprise." },
    ],
    posBenefits: [
      { title: "Installé sur place", text: "Nous installons caisse, articles et appareils chez vous et formons votre équipe directement dans l'établissement." },
      { title: "Simple au quotidien", text: "Interface claire, opérations rapides et paiements par carte et TWINT." },
      { title: "Des chiffres clairs", text: "Clôture et rapports en un clic plutôt que des bouts de papier." },
      { title: "Support personnel", text: "Vous joignez une personne qui connaît votre installation, en français ou en allemand." },
    ],
    posFit: {
      yes: [
        "Vous dirigez un restaurant, un café, un bar ou un magasin en Suisse.",
        "Vous voulez une caisse installée et expliquée sur place.",
        "Un interlocuteur personnel compte plus pour vous qu'une hotline anonyme.",
        "Caisse et boutique en ligne doivent fonctionner ensemble à l'avenir.",
      ],
      no: [
        "Vous cherchez une caisse prête à l'emploi sans installation ni formation.",
        "Vous avez besoin d'une solution spéciale pour une grande entreprise avec son propre service informatique.",
        "La caisse doit tourner dès demain sans aucune préparation.",
      ],
    },
  },
};

/** Benefit sublines under the keyword H1 of service pages (beyondweb: keyword H1, benefit H2). */
export const serviceSublines: Record<string, Localized<string>> = {
  webdesign: { de: "Webdesign, das Kunden überzeugt.", fr: "Un site qui convainc vos clients." },
  "website-redesign": { de: "Ihre Webseite, neu gedacht.", fr: "Un nouveau départ pour votre site." },
  onlineshop: { de: "Ein Shop, der verkauft.", fr: "Une boutique qui vend." },
  seo: { de: "Mehr Sichtbarkeit bei Google, mehr Anfragen.", fr: "Plus de visibilité sur Google, plus de demandes." },
  "online-marketing": { de: "Werbung, die messbar wirkt.", fr: "Une publicité aux résultats mesurables." },
  branding: { de: "Ein Auftritt mit Wiedererkennung.", fr: "Une image que l'on reconnaît." },
  wartung: { de: "Wir halten Ihnen den Rücken frei.", fr: "Votre site entre de bonnes mains." },
  kassensystem: { de: "Eingerichtet und geschult vor Ort, mit persönlichem Support.", fr: "Installé et expliqué sur place, avec un support personnel." },
  "kassensystem-gastro": { de: "Schnell im Service, klar im Abschluss.", fr: "Rapide au service, clair à la clôture." },
  "kassensystem-retail": { de: "Schnell an der Kasse, mit Überblick im Lager.", fr: "Rapide en caisse, avec une vue claire sur le stock." },
};

/* ---------- FAQ top-ups ---------- */

const KEYWORD = /unterschied|webagentur|website-agentur|webdesign-agentur|agentur wählen|worauf|différence|agence web ou|choisir une agence/i;
const COST = /kost|preis|budget|coût|combien coûte|prix|tarif/i;
const PROCESS = /ablauf|zusammenarbeit ab|wie läuft|déroule|étapes|comment se passe/i;
const MEET = /treffen|vor ort|persönlich|kommen sie|rencontr|sur place|venez|distance/i;
const LANG = /französisch|zweisprachig|deutsch und|beiden sprachen|bilingue|allemand|deux langues/i;
const OWN = /gehör|eigentum|appartien|propriét/i;
const REPLY = /antwort|erreich|réponse|joindre/i;
const AFTER = /nach dem launch|betreu|wartung|après la mise en ligne|maintenance|suivi/i;
const SWISS = /ganzen schweiz|schweizweit|toute la suisse|suisse romande/i;
const DURATION = /wie lange|dauer|combien de temps|délai/i;
const GOOGLE = /google|gefunden|seo|référencement|trouvé/i;
const WORK_WITH = /arbeiten sie (mit|für)|firmen in|warum eine webagentur|travaillez-vous (avec|pour)|pourquoi choisir/i;

/** Generic questions for a service page; `name` is the service's nav label. */
export function serviceFaqTemplates(locale: Locale, name: string, pos: boolean, costQuestion?: string): FaqTemplate[] {
  const list = serviceFaqAll(locale, name, pos);
  return costQuestion ? list.map((t) => (t.match === COST ? { ...t, q: costQuestion } : t)) : list;
}

function serviceFaqAll(locale: Locale, name: string, pos: boolean): FaqTemplate[] {
  if (locale === "de") {
    const t: FaqTemplate[] = [
      {
        match: COST,
        q: `Was kostet ${name} bei Webnova?`,
        a: "Wir nennen bewusst keine Pauschalpreise, weil Umfang, Funktionen und Inhalte bei jedem Projekt anders sind. Nach dem kostenlosen Erstgespräch erhalten Sie eine schriftliche Offerte, die genau beschreibt, was enthalten ist. Erst wenn Sie zustimmen, beginnen wir mit der Arbeit.",
      },
      {
        match: MEET,
        q: "Müssen wir uns persönlich treffen?",
        a: "Nein, aber gerne. Viele Projekte laufen per Videocall, Telefon und E-Mail. Wenn Sie ein Treffen wünschen, etwa für das Erstgespräch, einen Workshop oder Fotoaufnahmen, kommen wir zu Ihnen.",
      },
      {
        match: LANG,
        q: "Arbeiten Sie auf Deutsch und Französisch?",
        a: "Ja. Beratung, Texte und Umsetzung sind bei uns in beiden Sprachen möglich. Gerade für Betriebe an der Sprachgrenze oder mit Kundschaft aus der Romandie ist das ein klarer Vorteil.",
      },
      {
        match: REPLY,
        q: "Wie schnell erhalten wir eine Antwort?",
        a: "Innert eines Arbeitstages. Unsere Bürozeiten sind Montag bis Freitag von 8 bis 18 Uhr und Samstag von 10 bis 16 Uhr. Sie erreichen uns per Telefon, E-Mail oder WhatsApp.",
      },
      {
        match: SWISS,
        q: "Arbeiten Sie in der ganzen Schweiz?",
        a: "Ja. Wir betreuen KMU in der ganzen Deutsch- und Westschweiz. Die Zusammenarbeit funktioniert per Videocall genauso gut wie vor Ort.",
      },
    ];
    if (pos) return t;
    return [
      {
        match: KEYWORD,
        q: "Webagentur, Website-Agentur oder Webdesign-Agentur: Was ist der Unterschied?",
        a: "Im Alltag meinen alle drei Begriffe dasselbe: ein Team, das Webseiten plant, gestaltet und technisch umsetzt. Wichtiger als der Name ist, was enthalten ist. Webnova ist eine Webdesign-Agentur für Schweizer KMU und übernimmt Konzept, Design, Texte, Entwicklung, SEO und Betreuung aus einer Hand.",
      },
      ...t,
      {
        match: PROCESS,
        q: "Wie läuft die Zusammenarbeit ab?",
        a: "In fünf Phasen: Erstgespräch, Konzept und Offerte, Design, Entwicklung und Launch, danach Wachstum mit SEO und Betreuung. Sie sehen Entwürfe früh, entscheiden mit und haben vom ersten bis zum letzten Schritt dieselbe Ansprechperson.",
      },
      {
        match: OWN,
        q: "Gehören Webseite und Daten danach uns?",
        a: "Ja. Ihre Webseite, Ihre Inhalte und Ihre Daten gehören Ihnen. Wir vermeiden unnötige Abhängigkeiten und übergeben Ihnen alle Zugänge, die Sie brauchen.",
      },
      {
        match: AFTER,
        q: "Was passiert nach dem Launch?",
        a: "Auf Wunsch bleiben wir an Ihrer Seite: mit Wartung, Sicherheitsupdates, Hosting, Anpassungen und laufender Suchmaschinenoptimierung. Sie können Inhalte aber auch selbst pflegen, wir zeigen Ihnen bei der Übergabe, wie das geht.",
      },
    ];
  }
  const t: FaqTemplate[] = [
    {
      match: COST,
      q: `Combien coûte un projet « ${name} » chez Webnova ?`,
      a: "Nous ne donnons volontairement pas de prix forfaitaires, car l'étendue, les fonctions et les contenus varient d'un projet à l'autre. Après un premier entretien gratuit, vous recevez un devis écrit qui décrit précisément ce qui est inclus. Nous ne commençons qu'avec votre accord.",
    },
    {
      match: MEET,
      q: "Devons-nous nous rencontrer en personne ?",
      a: "Non, mais volontiers. Beaucoup de projets se déroulent en visioconférence, par téléphone et par e-mail. Si vous souhaitez une rencontre, par exemple pour le premier entretien, un atelier ou des photos, nous venons chez vous.",
    },
    {
      match: LANG,
      q: "Travaillez-vous en français et en allemand ?",
      a: "Oui. Conseil, textes et réalisation sont possibles dans les deux langues. Pour les entreprises proches de la frontière linguistique ou avec une clientèle alémanique, c'est un vrai avantage.",
    },
    {
      match: REPLY,
      q: "En combien de temps recevons-nous une réponse ?",
      a: "Dans un délai d'un jour ouvrable. Nos heures d'ouverture sont du lundi au vendredi de 8 h à 18 h et le samedi de 10 h à 16 h. Vous nous joignez par téléphone, e-mail ou WhatsApp.",
    },
    {
      match: SWISS,
      q: "Travaillez-vous dans toute la Suisse ?",
      a: "Oui. Nous accompagnons des PME dans toute la Suisse romande et alémanique. La collaboration fonctionne aussi bien en visioconférence que sur place.",
    },
  ];
  if (pos) return t;
  return [
    {
      match: KEYWORD,
      q: "Agence web, agence de création de sites ou agence de webdesign : quelle différence ?",
      a: "Au quotidien, ces termes désignent la même chose : une équipe qui planifie, conçoit et développe des sites internet. Ce qui compte, c'est ce qui est inclus. Webnova est une agence web pour les PME suisses et prend en charge concept, design, textes, développement, SEO et suivi.",
    },
    ...t,
    {
      match: PROCESS,
      q: "Comment se déroule la collaboration ?",
      a: "En cinq phases : premier entretien, concept et devis, design, développement et mise en ligne, puis croissance avec SEO et suivi. Vous voyez les maquettes tôt, décidez avec nous et gardez le même interlocuteur du début à la fin.",
    },
    {
      match: OWN,
      q: "Le site et les données nous appartiennent-ils ?",
      a: "Oui. Votre site, vos contenus et vos données vous appartiennent. Nous évitons les dépendances inutiles et vous remettons tous les accès dont vous avez besoin.",
    },
    {
      match: AFTER,
      q: "Que se passe-t-il après la mise en ligne ?",
      a: "Si vous le souhaitez, nous restons à vos côtés : maintenance, mises à jour de sécurité, hébergement, adaptations et référencement continu. Vous pouvez aussi gérer les contenus vous-même, nous vous montrons comment lors de la remise.",
    },
  ];
}

/** Local questions for a city page; `topic` is what the page is about, e.g. "eine Webseite" or "einen Onlineshop". */
export function cityFaqTemplates(locale: Locale, city: string, topic: string, pos = false): FaqTemplate[] {
  const all = cityFaqAll(locale, city, topic);
  // A cash register page does not need the website-only questions.
  if (!pos) return all;
  const posOnly: FaqTemplate[] =
    locale === "de"
      ? [
          {
            match: /einricht|schul/i,
            q: `Richten Sie das Kassensystem bei uns in ${city} ein?`,
            a: "Ja. Wir richten Kasse, Artikel und Geräte in Ihrem Betrieb ein und schulen Ihr Team vor Ort. Danach erreichen Sie uns persönlich, wenn Fragen auftauchen.",
          },
          {
            match: /twint|karte/i,
            q: "Können unsere Gäste mit Karte und TWINT bezahlen?",
            a: "Ja. Kartenzahlungen und TWINT gehören zum Kassensystem. Welche Geräte Sie dafür brauchen, klären wir im Erstgespräch.",
          },
        ]
      : [
          {
            match: /install|form/i,
            q: `Installez-vous le système de caisse chez nous à ${city} ?`,
            a: "Oui. Nous installons caisse, articles et appareils dans votre établissement et formons votre équipe sur place. Ensuite, vous nous joignez personnellement en cas de question.",
          },
          {
            match: /twint|carte/i,
            q: "Nos clients peuvent-ils payer par carte et TWINT ?",
            a: "Oui. Les paiements par carte et TWINT font partie du système de caisse. Nous clarifions lors du premier entretien les appareils dont vous avez besoin.",
          },
        ];
  return [...all.filter((t) => t.match !== KEYWORD && t.match !== AFTER && t.match !== GOOGLE), ...posOnly];
}

function cityFaqAll(locale: Locale, city: string, topic: string): FaqTemplate[] {
  if (locale === "de") {
    return [
      {
        match: WORK_WITH,
        q: `Arbeiten Sie mit Firmen in ${city}?`,
        a: `Ja. Wir arbeiten für KMU, Praxen und Betriebe in ${city} und in der ganzen Schweiz. Sie haben eine feste Ansprechperson, die Ihr Projekt vom Erstgespräch bis nach dem Launch selbst begleitet.`,
      },
      {
        match: MEET,
        q: "Müssen wir uns persönlich treffen?",
        a: `Nein, aber gerne. Viele Abstimmungen laufen per Videocall und Telefon. Für das Erstgespräch, einen Workshop oder Fotoaufnahmen kommen wir auf Wunsch zu Ihnen nach ${city}.`,
      },
      {
        match: GOOGLE,
        q: `Wie werden wir in der Region ${city} bei Google gefunden?`,
        a: `Mit drei Bausteinen: einem gepflegten Google-Unternehmensprofil, einer schnellen Webseite mit klaren Seiten zu Ihren Leistungen und Ihrem Ort sowie Inhalten, die Fragen Ihrer Kundschaft in ${city} beantworten. Wir richten das ein und zeigen Ihnen, worauf es im Alltag ankommt.`,
      },
      {
        match: COST,
        q: `Was kostet ${topic} in ${city}?`,
        a: "Das hängt von Umfang, Funktionen und Inhalten ab, darum nennen wir keine Pauschalpreise. Nach dem kostenlosen Erstgespräch erhalten Sie eine schriftliche Offerte mit allen Leistungen. Erst mit Ihrer Zustimmung beginnen wir.",
      },
      {
        match: KEYWORD,
        q: `Webagentur oder Webdesign-Agentur in ${city}: Worauf sollten wir achten?`,
        a: "Die Begriffe Webagentur, Website-Agentur und Webdesign-Agentur meinen im Alltag dasselbe. Achten Sie lieber auf eine feste Ansprechperson, eine klare Offerte, echte Referenzen, schnelle Technik und darauf, dass Webseite und Daten danach Ihnen gehören.",
      },
      {
        match: LANG,
        q: "Bieten Sie Webseiten auf Deutsch und Französisch an?",
        a: "Ja. Wir beraten, schreiben und setzen in beiden Sprachen um. Eine zweite Sprachversion lohnt sich überall dort, wo Kundschaft oder Partner aus der anderen Sprachregion kommen.",
      },
      {
        match: DURATION,
        q: "Wie lange dauert ein Projekt?",
        a: "Das hängt vom Umfang und davon ab, wie schnell Texte und Bilder bereitstehen. Einen realistischen Zeitplan legen wir im Erstgespräch gemeinsam fest, damit Sie wissen, wann Ihre Seite online geht.",
      },
      {
        match: REPLY,
        q: "Wie schnell erhalten wir eine Antwort?",
        a: "Innert eines Arbeitstages. Sie erreichen uns Montag bis Freitag von 8 bis 18 Uhr und Samstag von 10 bis 16 Uhr per Telefon, E-Mail oder WhatsApp.",
      },
      {
        match: AFTER,
        q: "Betreuen Sie die Webseite auch nach dem Launch?",
        a: "Ja, wenn Sie das wünschen: Wartung, Sicherheitsupdates, Hosting, Anpassungen und laufende Suchmaschinenoptimierung. Sie können Inhalte aber auch selbst pflegen.",
      },
    ];
  }
  return [
    {
      match: WORK_WITH,
      q: `Travaillez-vous avec des entreprises à ${city} ?`,
      a: `Oui. Nous travaillons pour des PME, cabinets et commerces à ${city} et dans toute la Suisse. Vous avez un interlocuteur fixe qui suit votre projet du premier entretien jusqu'après la mise en ligne.`,
    },
    {
      match: MEET,
      q: "Devons-nous nous rencontrer en personne ?",
      a: `Non, mais volontiers. Beaucoup d'échanges se font en visioconférence et par téléphone. Pour le premier entretien, un atelier ou des photos, nous venons volontiers à ${city}.`,
    },
    {
      match: GOOGLE,
      q: `Comment être trouvé sur Google dans la région de ${city} ?`,
      a: `Avec trois éléments : une fiche d'établissement Google soignée, un site rapide avec des pages claires sur vos prestations et votre lieu, et des contenus qui répondent aux questions de votre clientèle à ${city}. Nous mettons cela en place et vous montrons l'essentiel pour la suite.`,
    },
    {
      match: COST,
      q: `Combien coûte ${topic} à ${city} ?`,
      a: "Cela dépend de l'étendue, des fonctions et des contenus, c'est pourquoi nous ne donnons pas de prix forfaitaires. Après un premier entretien gratuit, vous recevez un devis écrit détaillé. Nous ne commençons qu'avec votre accord.",
    },
    {
      match: KEYWORD,
      q: `Choisir une agence web à ${city} : à quoi faut-il faire attention ?`,
      a: "Agence web, agence de création de sites ou agence de webdesign désignent la même chose. Regardez plutôt s'il y a un interlocuteur fixe, un devis clair, de vraies références, une technique rapide et si le site et les données vous appartiennent ensuite.",
    },
    {
      match: LANG,
      q: "Proposez-vous des sites en français et en allemand ?",
      a: "Oui. Nous conseillons, rédigeons et réalisons dans les deux langues. Une deuxième version linguistique vaut la peine dès que des clients ou partenaires viennent de l'autre région linguistique.",
    },
    {
      match: DURATION,
      q: "Combien de temps dure un projet ?",
      a: "Cela dépend de l'étendue et de la disponibilité des textes et images. Nous fixons ensemble un calendrier réaliste lors du premier entretien, pour que vous sachiez quand votre site sera en ligne.",
    },
    {
      match: REPLY,
      q: "En combien de temps recevons-nous une réponse ?",
      a: "Dans un délai d'un jour ouvrable. Vous nous joignez du lundi au vendredi de 8 h à 18 h et le samedi de 10 h à 16 h par téléphone, e-mail ou WhatsApp.",
    },
    {
      match: AFTER,
      q: "Assurez-vous le suivi après la mise en ligne ?",
      a: "Oui, si vous le souhaitez : maintenance, mises à jour de sécurité, hébergement, adaptations et référencement continu. Vous pouvez aussi gérer les contenus vous-même.",
    },
  ];
}

/** Page FAQ first, then templates whose topic is not yet covered, until `max` entries. */
export function topUpFaq(own: Faq[], templates: FaqTemplate[], max = 10): Faq[] {
  const out = [...own];
  for (const t of templates) {
    if (out.length >= max) break;
    if (out.some((f) => t.match.test(f.q))) continue;
    out.push({ q: t.q, a: t.a });
  }
  return out;
}

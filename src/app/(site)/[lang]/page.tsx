import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand } from "@/components/blocks";
import { ContactList, PhotoSlot, SwissPanorama } from "@/components/editorial";
import { HeroBuild } from "@/components/hero-build";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { skylines } from "@/components/skylines";
import { guides } from "@/content/guides";
import { problems } from "@/content/problems";
import { services } from "@/content/services";
import { structure } from "@/content/structure";
import { getDict } from "@/i18n/dict";
import { photo } from "@/lib/photos";
import { getRoute, hasRoute, href, isLocale } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  FaqSection,
  FitSection,
  IndustryIndex,
  Kicker,
  LocationsSection,
  ProcessSection,
  ReferencesSection,
  SectionHead,
  hasProjects,
} from "@/components/sections";
const homeMeta = {
  de: {
    title: "Webdesign Agentur Schweiz für KMU | Webnova",
    description:
      "Webdesign Agentur für Schweizer KMU: Webseiten, Onlineshops und SEO, persönlich betreut, auf Deutsch und Französisch. Kostenlose Erstberatung.",
  },
  fr: {
    title: "Agence web en Suisse pour PME | Webnova",
    description:
      "Agence web pour les PME suisses : sites internet, boutiques en ligne et SEO, suivi personnel, en français et en allemand. Premier conseil gratuit.",
  },
};

const homeFaq = {
  de: [
    { q: "Webagentur, Website-Agentur oder Webdesign-Agentur: Was ist der Unterschied?", a: "Im Alltag meinen alle drei Begriffe dasselbe: ein Team, das Webseiten plant, gestaltet und technisch umsetzt. Entscheidend ist, was enthalten ist. Webnova ist eine Webdesign Agentur für Schweizer KMU und übernimmt Konzept, Design, Texte, Entwicklung, SEO und Betreuung aus einer Hand." },
    { q: "Was kostet eine neue Webseite bei Webnova?", a: "Jedes Projekt ist anders, deshalb arbeiten wir nicht mit Pauschalpreisen. Der Aufwand hängt vor allem von der Anzahl Seiten, den Funktionen, den Sprachen und davon ab, wer die Texte schreibt. Nach einem kostenlosen Erstgespräch erhalten Sie eine transparente Offerte, abgestimmt auf Umfang, Funktionen und Ihr Budget." },
    { q: "Wie lange dauert es, bis meine Webseite online ist?", a: "Eine typische KMU-Webseite ist in wenigen Wochen online. Der genaue Zeitplan hängt vom Umfang und davon ab, wie schnell Inhalte wie Texte und Bilder bereitstehen. Den Fahrplan legen wir im Konzept gemeinsam fest." },
    { q: "Wer ist mein Ansprechpartner?", a: "Ferhat Demir, der Inhaber von Webnova. Er begleitet Ihr Projekt vom Erstgespräch über die Offerte und die Umsetzung bis nach dem Launch. Sie sprechen immer mit derselben Person." },
    { q: "Arbeiten Sie in der ganzen Schweiz?", a: "Ja. Wir betreuen Unternehmen in der ganzen Deutsch- und Westschweiz, persönlich per Videocall und bei Bedarf vor Ort. Sie haben vom ersten Gespräch bis nach dem Launch eine feste Ansprechperson." },
    { q: "Bieten Sie Webseiten auch zweisprachig an?", a: "Ja, Deutsch und Französisch sind bei uns Alltag. Für Unternehmen an der Sprachgrenze und mit Kundschaft aus der Romandie ist eine zweisprachige Webseite oft der Schlüssel zu mehr Anfragen." },
    { q: "Wird meine Webseite bei Google gefunden?", a: "Technisches SEO, eine saubere Struktur, schnelle Ladezeiten und lokale Optimierung sind bei uns Standard. Auf Wunsch richten wir Ihr Google-Unternehmensprofil ein und betreuen die Suchmaschinenoptimierung laufend. Bestimmte Positionen kann seriöserweise niemand garantieren." },
    { q: "Lohnt sich eine Website-Agentur gegenüber einem Baukasten?", a: "Ein Baukasten ist günstig im Einstieg, aber Sie bauen, schreiben und optimieren selbst. Eine Website-Agentur übernimmt Struktur, Texte, Technik und SEO, damit die Seite Anfragen bringt. Wenn Sie nur eine einfache Visitenkarte brauchen und Zeit haben, kann ein Baukasten reichen. Das sagen wir Ihnen im Erstgespräch ehrlich." },
    { q: "Kann ich meine Webseite später selbst bearbeiten?", a: "Ja. Auf Wunsch erhalten Sie ein einfaches Redaktionssystem und eine kurze Einführung. Alternativ übernehmen wir Anpassungen im Rahmen eines Wartungsvertrags für Sie." },
    { q: "Gehören Webseite und Daten mir?", a: "Ja. Ihre Webseite, Ihre Inhalte und Ihre Daten gehören Ihnen. Wir vermeiden unnötige Abhängigkeiten und übergeben Ihnen alle Zugänge, die Sie brauchen." },
  ],
  fr: [
    { q: "Agence web, agence de création de sites ou agence de webdesign : quelle différence ?", a: "Au quotidien, ces termes désignent la même chose : une équipe qui planifie, conçoit et développe des sites internet. Ce qui compte, c'est ce qui est inclus. Webnova est une agence web pour les PME suisses et prend en charge concept, design, textes, développement, SEO et suivi." },
    { q: "Combien coûte un nouveau site chez Webnova ?", a: "Chaque projet est différent, c'est pourquoi nous ne travaillons pas avec des forfaits. L'effort dépend surtout du nombre de pages, des fonctions, des langues et de qui rédige les textes. Après un premier entretien gratuit, vous recevez un devis clair et transparent, adapté à l'envergure, aux fonctions et à votre budget." },
    { q: "En combien de temps mon site est-il en ligne ?", a: "Un site typique de PME est en ligne en quelques semaines. Le calendrier dépend de l'envergure et de la disponibilité des contenus comme les textes et les images. Nous le fixons ensemble lors du concept." },
    { q: "Qui est mon interlocuteur ?", a: "Ferhat Demir, le propriétaire de Webnova. Il suit votre projet du premier entretien au devis, à la réalisation et jusqu'après la mise en ligne. Vous parlez toujours à la même personne." },
    { q: "Travaillez-vous dans toute la Suisse ?", a: "Oui. Nous accompagnons des entreprises dans toute la Suisse romande et alémanique, personnellement par visioconférence et sur place si nécessaire. Vous avez un interlocuteur fixe du premier entretien jusqu'après la mise en ligne." },
    { q: "Proposez-vous des sites bilingues ?", a: "Oui, le français et l'allemand font partie de notre quotidien. Pour les entreprises proches de la frontière linguistique ou avec une clientèle alémanique, un site bilingue est souvent la clé de plus de demandes." },
    { q: "Mon site sera-t-il trouvé sur Google ?", a: "SEO technique, structure propre, chargement rapide et optimisation locale sont inclus chez nous. Sur demande, nous configurons votre fiche Google et assurons le référencement dans la durée. Personne ne peut sérieusement garantir une position précise." },
    { q: "Une agence web vaut-elle mieux qu'un constructeur de sites ?", a: "Un constructeur est bon marché au départ, mais vous construisez, rédigez et optimisez vous-même. Une agence web prend en charge structure, textes, technique et SEO pour que le site génère des demandes. Si vous avez seulement besoin d'une carte de visite simple et du temps, un constructeur peut suffire. Nous vous le disons franchement lors du premier entretien." },
    { q: "Pourrai-je modifier mon site moi-même ?", a: "Oui. Sur demande, vous recevez un système de gestion de contenu simple et une courte formation. Nous pouvons aussi effectuer les modifications pour vous dans le cadre d'un contrat de maintenance." },
    { q: "Le site et les données m'appartiennent-ils ?", a: "Oui. Votre site, vos contenus et vos données vous appartiennent. Nous évitons les dépendances inutiles et vous remettons tous les accès dont vous avez besoin." },
  ],
};

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, getRoute("home"), homeMeta[lang], { absoluteTitle: true });
}

/** Anchor ids of the home sections, per language. */
const ids = {
  de: { projects: "projekte", services: "leistungen", focus: "branchen", process: "ablauf", about: "ueber-uns", contact: "kontakt", faq: "fragen" },
  fr: { projects: "projets", services: "services", focus: "secteurs", process: "methode", about: "a-propos", contact: "contact", faq: "questions" },
};

const copy = {
  de: {
    coverLine: "Webnova · Webagentur Schweiz",
    coverLang: "Deutsch & Français",
    h1a: "Webdesign Agentur",
    h1b: "Schweiz",
    tagA: "Webseiten, die",
    tagEm: "Anfragen",
    tagB: "bringen.",
    indexLabel: "Inhalt",
    meta: ["Schweizweit für KMU", "Deutsch & Français", "Persönlich betreut"],
    scroll: "Scrollen",
    fig: "Abb.",
    coverCaption: "Für KMU in der ganzen Schweiz · Basel, Zürich, Bern, Luzern, Neuchâtel",
    introEyebrow: "Webdesign · Webentwicklung · SEO",
    introTitle: "Webseiten für Schweizer KMU, die gefunden werden und Anfragen bringen.",
    facts: [
      { k: "Einsatzgebiet", v: "Ganze Deutsch- und Westschweiz" },
      { k: "Fokus", v: "Webseiten, Shops und Sichtbarkeit für KMU" },
      { k: "Sprachen", v: "Deutsch und Französisch" },
      { k: "Kontakt", v: "Eine feste Ansprechperson" },
    ],
    heroNote: "Kostenlos & unverbindlich · Antwort innert 1 Arbeitstag",
    buildCaption: "So entsteht eine Webseite: Raster, Inhalte, die erste Anfrage",
    servicesIndex: "Leistungen",
    angebotLabel: "Leistungen",
    angebotTitle: "Wofür soll Ihre Webseite arbeiten?",
    angebotLead: "Am Anfang steht Ihr Ziel, nicht die Technik. Wählen Sie, was für Ihren Betrieb zählt, wir zeigen Ihnen den passenden Weg.",
    goals: [
      { id: "service:seo", t: "Gefunden werden", x: "Bei Google und in KI-Suchen dort stehen, wo Ihre Kundschaft sucht." },
      { id: "service:webdesign", t: "Mehr Anfragen erhalten", x: "Eine klare Webseite, die Vertrauen schafft und zur Kontaktaufnahme führt." },
      { id: "service:onlineshop", t: "Online verkaufen", x: "Ein Onlineshop, der zu Ihrem Sortiment passt und sich einfach pflegen lässt." },
    ],
    seeService: "Zur Leistung",
    formulaTitle: "Eine Webseite, die zu Ihrem Betrieb passt.",
    formula: ["Ihr Angebot", "Ihre Kundschaft", "Ihre Region", "Ihre Sprachen"],
    formulaResult: "Ihre Webseite",
    blocksTitle: "Fünf Schwerpunkte, eine Ansprechperson.",
    focusLabel: "Schwerpunkte",
    moreLabel: "Dazu gehört auch",
    problemTitle: "Lieber beim Problem starten?",
    notFoundTitle: "Ihr Anliegen ist nicht dabei?",
    notFoundText: "Erzählen Sie uns kurz von Ihrem Betrieb. Wir sagen Ihnen ehrlich, was sich lohnt, kostenlos und unverbindlich.",
    blocks: [
      { title: "Webdesign & Entwicklung", main: "webdesign", more: ["website-kmu", "firmenwebsite"] },
      { title: "Relaunch & Betreuung", main: "website-redesign", more: ["wartung"] },
      { title: "Onlineshop & Kasse", main: "onlineshop", more: ["kassensystem", "kassensystem-gastro", "kassensystem-retail"] },
      { title: "SEO & Sichtbarkeit", main: "seo", more: ["local-seo", "ki-sichtbarkeit"] },
      { title: "Marketing & Branding", main: "online-marketing", more: ["branding"] },
    ],
    focusSectionLabel: "Branchen",
    focusTitle: "Webseiten, die Ihre Branche verstehen.",
    focusLead: "Ein Restaurant braucht Reservationen, ein Handwerksbetrieb gute Offertanfragen, eine Praxis Vertrauen. Für jede Branche gibt es eine eigene Seite mit dem, was dort zählt.",
    focusCaption: "Deutschschweiz und Romandie: Webseiten in beiden Sprachen",
    posTitle: "Kassensystem für Gastronomie und Detailhandel",
    aboutLabel: "Über uns",
    aboutTitle: "Persönlich, direkt und ohne Umwege über Projektteams.",
    aboutCaption: "Ferhat Demir · Inhaber und Ihr Ansprechpartner",
    figures: [
      { n: "1", t: "feste Ansprechperson vom Erstgespräch bis nach dem Launch" },
      { n: "2", t: "Landessprachen: Beratung und Webseiten auf Deutsch und Französisch" },
    ],
    aboutMore: "Mehr über Webnova",
    contactLabel: "Kontakt",
    contactTitle: "Schreiben Sie uns. Sie hören innert eines Arbeitstages von uns.",
    contactLead: "Rufen Sie an, schreiben Sie per WhatsApp oder E-Mail, oder beschreiben Sie Ihr Vorhaben direkt im Formular. Ferhat Demir meldet sich persönlich.",
    formLabel: "Projektanfrage",
    formTitle: "Ihr Vorhaben in zwei Minuten beschrieben.",
    guidesAll: "Alle Ratgeber",
  },
  fr: {
    coverLine: "Webnova · Agence web Suisse",
    coverLang: "Français & Deutsch",
    h1a: "Agence web",
    h1b: "en Suisse",
    tagA: "Des sites qui génèrent des",
    tagEm: "demandes",
    tagB: ".",
    indexLabel: "Sommaire",
    meta: ["Pour les PME de toute la Suisse", "Français & Deutsch", "Suivi personnel"],
    scroll: "Défiler",
    fig: "Fig.",
    coverCaption: "Pour les PME de toute la Suisse · Bâle, Zurich, Berne, Lucerne, Neuchâtel",
    introEyebrow: "Webdesign · Développement · SEO",
    introTitle: "Des sites pour les PME suisses, trouvés sur Google et porteurs de demandes.",
    facts: [
      { k: "Région", v: "Toute la Suisse romande et alémanique" },
      { k: "Focus", v: "Sites, boutiques et visibilité pour PME" },
      { k: "Langues", v: "Français et allemand" },
      { k: "Contact", v: "Un seul interlocuteur" },
    ],
    heroNote: "Gratuit et sans engagement · Réponse en 1 jour ouvrable",
    buildCaption: "Comment naît un site : grille, contenus, première demande",
    servicesIndex: "Services",
    angebotLabel: "Services",
    angebotTitle: "À quoi votre site doit-il servir ?",
    angebotLead: "Tout commence par votre objectif, pas par la technique. Choisissez ce qui compte pour votre entreprise, nous vous montrons le bon chemin.",
    goals: [
      { id: "service:seo", t: "Être trouvé", x: "Apparaître sur Google et dans les recherches IA, là où votre clientèle cherche." },
      { id: "service:webdesign", t: "Recevoir plus de demandes", x: "Un site clair qui inspire confiance et mène à la prise de contact." },
      { id: "service:onlineshop", t: "Vendre en ligne", x: "Une boutique adaptée à votre assortiment et simple à gérer." },
    ],
    seeService: "Voir le service",
    formulaTitle: "Un site qui correspond à votre entreprise.",
    formula: ["Votre offre", "Votre clientèle", "Votre région", "Vos langues"],
    formulaResult: "Votre site",
    blocksTitle: "Cinq domaines, un seul interlocuteur.",
    focusLabel: "Points forts",
    moreLabel: "Également",
    problemTitle: "Plutôt partir du problème ?",
    notFoundTitle: "Votre besoin n'y figure pas ?",
    notFoundText: "Parlez-nous brièvement de votre entreprise. Nous vous disons franchement ce qui en vaut la peine, gratuitement et sans engagement.",
    blocks: [
      { title: "Webdesign & développement", main: "webdesign", more: ["website-kmu", "firmenwebsite"] },
      { title: "Refonte & maintenance", main: "website-redesign", more: ["wartung"] },
      { title: "Boutique & caisse", main: "onlineshop", more: ["kassensystem", "kassensystem-gastro", "kassensystem-retail"] },
      { title: "SEO & visibilité", main: "seo", more: ["local-seo", "ki-sichtbarkeit"] },
      { title: "Marketing & branding", main: "online-marketing", more: ["branding"] },
    ],
    focusSectionLabel: "Secteurs",
    focusTitle: "Des sites qui comprennent votre secteur.",
    focusLead: "Un restaurant a besoin de réservations, un artisan de bonnes demandes de devis, un cabinet de confiance. Chaque secteur a sa propre page avec ce qui compte.",
    focusCaption: "Suisse alémanique et romande : des sites dans les deux langues",
    posTitle: "Caisse pour la restauration et le commerce",
    aboutLabel: "À propos",
    aboutTitle: "Personnel, direct et sans détour par des équipes de projet.",
    aboutCaption: "Ferhat Demir · propriétaire et votre interlocuteur",
    figures: [
      { n: "1", t: "interlocuteur fixe du premier entretien jusqu'après la mise en ligne" },
      { n: "2", t: "langues nationales : conseil et sites en français et en allemand" },
    ],
    aboutMore: "En savoir plus sur Webnova",
    contactLabel: "Contact",
    contactTitle: "Écrivez-nous. Vous recevez une réponse en un jour ouvrable.",
    contactLead: "Appelez, écrivez sur WhatsApp ou par e-mail, ou décrivez votre projet directement dans le formulaire. Ferhat Demir vous répond personnellement.",
    formLabel: "Demande de projet",
    formTitle: "Votre projet décrit en deux minutes.",
    guidesAll: "Tous les conseils",
  },
};

const two = (n: number) => String(n).padStart(2, "0");

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const c = copy[lang];
  const st = structure[lang];
  const id = ids[lang];
  const svc = (key: string) => services.find((s) => s.key === key);
  const projects = hasProjects();

  // The numbered index on the cover. Numbers match the section counter: sections appear in this order.
  const index = [
    ...(projects ? [{ id: id.projects, label: d.nav.references }] : []),
    { id: id.services, label: c.angebotLabel },
    { id: id.focus, label: c.focusSectionLabel },
    { id: id.process, label: st.processEyebrow },
    { id: id.about, label: c.aboutLabel },
    { id: id.contact, label: c.contactLabel },
  ];
  const mainServices = services.filter((s) => s.key !== "kassensystem-gastro" && s.key !== "kassensystem-retail");
  const problemList = problems.filter((p) => hasRoute(`problem:${p.key}`));

  return (
    <>
      {/* COVER: keyword H1 (LCP, visible on load), numbered index, contact lines, meta line and the panorama. */}
      <section aria-labelledby="home-h1" className="bg-bg">
        <div className="container-x pt-8 md:pt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="label">{c.coverLine}</p>
            <p className="label hidden sm:block">{c.coverLang}</p>
          </div>
          <div className="grid gap-12 pb-8 pt-8 md:pt-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <h1 id="home-h1" className="display text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.045em]">
                {c.h1a} <span className="text-accent">{c.h1b}</span>
              </h1>
              <p className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink-soft">
                {c.tagA} <strong className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-[6px]">{c.tagEm}</strong>
                {c.tagB === "." ? "." : ` ${c.tagB}`}
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                <li>
                  <a href={`mailto:${site.email}`} className="font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
                    {site.email}
                  </a>
                </li>
                <li>
                  <a href={site.phoneHref} className="text-ink-soft hover:text-accent">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-soft hover:text-accent">
                    Instagram <Icon name="arrow" className="h-3.5 w-3.5 -rotate-45" />
                  </a>
                </li>
              </ul>
            </div>
            <nav aria-label={c.indexLabel} className="lg:col-span-4 lg:pt-3">
              <p className="label mb-3">{c.indexLabel}</p>
              <ol className="border-t border-ink">
                {index.map((it, i) => (
                  <li key={it.id}>
                    <a href={`#${it.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline border-b border-line py-3.5 transition-colors hover:text-accent">
                      <span className="text-[12.5px] font-semibold tabular-nums text-accent">{two(i + 1)}</span>
                      <span className="font-display text-[20px] font-semibold tracking-[-0.015em]">{it.label}</span>
                      <Icon name="arrow" className="h-4 w-4 rotate-90 self-center text-muted transition-transform group-hover:translate-y-0.5 group-hover:text-accent" />
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={href(lang, "request")}>{d.nav.cta}</ButtonLink>
              </div>
            </nav>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line py-4">
            <p className="meta">{c.meta.join(" · ")}</p>
            <a href={`#${id.services}`} className="meta hidden items-center gap-1.5 hover:text-accent sm:inline-flex">
              {c.scroll}
              <Icon name="arrow" className="h-3.5 w-3.5 rotate-90" />
            </a>
          </div>
        </div>
        <figure className="mt-2">
          {photo("cover", lang) ? (
            <PhotoSlot photo={photo("cover", lang)} fallback={null} ratio="aspect-[21/8]" sizes="100vw" priority />
          ) : (
            <SwissPanorama animate className="h-[150px] text-accent/55 sm:h-[200px] lg:h-[250px]" />
          )}
          <figcaption className="container-x">
            <span className="caption mt-0">
              <span className="font-semibold text-accent">{c.fig} 01</span>
              {c.coverCaption}
            </span>
          </figcaption>
        </figure>
      </section>

      {/* INTRO: sticky service index on the left, the benefit statement, facts, lead and the build animation. */}
      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <aside className="order-last lg:order-first lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="label mb-3">{c.servicesIndex}</p>
              <ul className="border-t border-ink">
                {mainServices.map((sv, i) => (
                  <li key={sv.key}>
                    <Link href={href(lang, `service:${sv.key}`)} className="group grid grid-cols-[2rem_1fr] items-baseline border-b border-line py-2.5 text-[15px] transition-colors hover:text-accent">
                      <span className="text-[12px] tabular-nums text-muted group-hover:text-accent">{two(i + 1)}</span>
                      <span className="font-medium">{sv.content[lang].navLabel}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="lg:col-span-8 lg:col-start-5">
            <p className="eyebrow mb-6">{c.introEyebrow}</p>
            <h2 className="h-section">{c.introTitle}</h2>
            <dl className="mt-10 grid border-t border-ink sm:grid-cols-2">
              {c.facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[7rem_1fr] items-baseline gap-3 border-b border-line py-3.5 sm:pr-6">
                  <dt className="label">{f.k}</dt>
                  <dd className="text-[15.5px] text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
            <p className="lead mt-10 max-w-2xl">{d.hero.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={href(lang, "request")}>{d.hero.primary}</ButtonLink>
              <ButtonLink href={href(lang, "services")} variant="ghost" arrow={false}>
                {d.hero.secondary}
              </ButtonLink>
            </div>
            <p className="meta mt-4">{c.heroNote}</p>
            <figure className="mt-14 max-w-3xl">
              <HeroBuild locale={lang} />
              <figcaption className="caption">
                <span className="font-semibold text-accent">{c.fig} 02</span>
                {c.buildCaption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* PROJECTS: horizontal row, only while references are switched on (showReferences). */}
      {projects && (
        <div className="rule-t">
          <ReferencesSection locale={lang} id={id.projects} />
        </div>
      )}

      {/* ANGEBOT: goal question, three goals, the formula, five numbered service blocks and the problem entry points. */}
      <section id={id.services} className="section-y scroll-mt-20 border-t border-line">
        <div className="container-x">
          <SectionHead eyebrow={c.angebotLabel} title={c.angebotTitle} lead={c.angebotLead} />
          <ol className="grid gap-x-8 md:grid-cols-3">
            {c.goals.map((g, i) => (
              <li key={g.id} className="border-t border-ink">
                <Link href={href(lang, g.id)} className="group flex h-full flex-col pb-10 pt-6">
                  <span className="text-[12.5px] font-semibold tabular-nums text-accent">{String.fromCharCode(65 + i)}</span>
                  <h3 className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.025em] transition-colors group-hover:text-accent">{g.t}</h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{g.x}</p>
                  <span className="link-arrow mt-auto pt-6">
                    {c.seeService}
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {/* The formula: what a fitting website is made of. */}
          <div className="mt-16 bg-bg-2 px-6 py-10 sm:px-10 md:mt-20">
            <p className="label mb-6">{c.formulaTitle}</p>
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-3 font-display text-[clamp(1.25rem,2.6vw,2.1rem)] font-semibold tracking-[-0.02em]">
              {c.formula.map((f, i) => (
                <span key={f} className="inline-flex items-baseline gap-x-4">
                  {i > 0 && <span aria-hidden="true" className="text-accent/50">+</span>}
                  <span>{f}</span>
                </span>
              ))}
              <span aria-hidden="true" className="text-accent/50">=</span>
              <span className="text-accent underline decoration-2 underline-offset-[8px]">{c.formulaResult}</span>
            </p>
          </div>

          <h3 className="h-block mt-20 md:mt-28">{c.blocksTitle}</h3>
          <ol className="mt-8 border-t border-ink">
            {c.blocks.map((b, i) => {
              const main = svc(b.main);
              if (!main) return null;
              const mc = main.content[lang];
              const more = b.more.map(svc).filter((x) => x !== undefined).filter((x) => hasRoute(`service:${x.key}`));
              return (
                <li key={b.main} className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-12">
                  <span className="font-display text-[clamp(2.5rem,4.5vw,3.75rem)] font-semibold leading-none tracking-[-0.04em] text-accent tabular-nums md:col-span-2">{two(i + 1)}</span>
                  <div className="md:col-span-5">
                    <h4 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.025em]">
                      <Link href={href(lang, `service:${main.key}`)} className="transition-colors hover:text-accent">
                        {b.title}
                      </Link>
                    </h4>
                    <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{mc.lead}</p>
                    <Link href={href(lang, `service:${main.key}`)} className="link-arrow mt-5">
                      {mc.navLabel}
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="md:col-span-4 md:col-start-9">
                    <p className="label mb-3">{c.focusLabel}</p>
                    <ul className="space-y-2 text-[15px] text-ink">
                      {mc.features.slice(0, 4).map((f) => (
                        <li key={f.title} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" />
                          {f.title}
                        </li>
                      ))}
                    </ul>
                    {more.length > 0 && (
                      <>
                        <p className="label mb-2 mt-6">{c.moreLabel}</p>
                        <p className="flex flex-wrap gap-x-4 gap-y-1 text-[14.5px]">
                          {more.map((m) => (
                            <Link key={m.key} href={href(lang, `service:${m.key}`)} className="font-medium text-bright underline decoration-bright/30 underline-offset-4 hover:decoration-bright">
                              {m.content[lang].navLabel}
                            </Link>
                          ))}
                        </p>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-16 grid gap-12 md:grid-cols-12">
            {problemList.length > 0 && (
              <div className="md:col-span-7">
                <h3 className="h-block">{c.problemTitle}</h3>
                <ul className="mt-6 border-t border-ink">
                  {problemList.map((p) => (
                    <li key={p.key}>
                      <Link href={href(lang, `problem:${p.key}`)} className="group flex items-center justify-between gap-4 border-b border-line py-3.5 text-[16px] transition-colors hover:text-accent">
                        {p.content[lang].navLabel}
                        <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col justify-between gap-8 self-start bg-night p-8 text-white md:col-span-5">
              <div>
                <p className="font-display text-[24px] font-semibold leading-tight tracking-[-0.02em]">{c.notFoundTitle}</p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/75">{c.notFoundText}</p>
              </div>
              <div>
                <ButtonLink href={href(lang, "request")} variant="accent">
                  {st.stepsCta}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANCHEN: industry index, POS entry and two overlapping drawings for the two language regions. */}
      <section id={id.focus} className="section-y scroll-mt-20 border-t border-line">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Kicker className="mb-8">{c.focusSectionLabel}</Kicker>
            <h2 className="h-section">{c.focusTitle}</h2>
            <p className="lead mt-6 max-w-2xl">{c.focusLead}</p>
            <div className="mt-10">
              <IndustryIndex locale={lang} cols={2} />
            </div>
            <div className="mt-10 grid gap-4 border-t border-line pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-display text-[19px] font-semibold tracking-[-0.01em]">{c.posTitle}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{d.home.posLead}</p>
              </div>
              <p className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
                {(["kassensystem-gastro", "kassensystem-retail"] as const).map((k, n) => (
                  <Link key={k} href={href(lang, `service:${k}`)} className="link-arrow">
                    {n === 0 ? d.home.posGastro : d.home.posRetail}
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                ))}
              </p>
            </div>
          </div>
          <figure className="lg:col-span-5 lg:pt-24">
            <div className="relative pb-[18%] pr-[12%]">
              <Drawing city="bern" className="relative aspect-[4/3]" />
              <Drawing city="neuchatel" className="absolute bottom-0 right-0 aspect-[4/3] w-[62%] shadow-lift ring-8 ring-bg" />
            </div>
            <figcaption className="caption">
              <span className="font-semibold text-accent">{c.fig} 03</span>
              {c.focusCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ABLAUF */}
      <ProcessSection locale={lang} id={id.process} title={d.home.processTitle} />

      {/* ÜBER UNS: owner portrait slot, two text columns and two true figures. */}
      <section id={id.about} className="section-y scroll-mt-20">
        <div className="container-x">
          <SectionHead eyebrow={c.aboutLabel} title={c.aboutTitle} />
          <div className="grid gap-12 lg:grid-cols-12">
            <PhotoSlot
              className="lg:col-span-5"
              photo={photo("founder", lang)}
              fallback="monogram"
              ratio="aspect-[4/3]"
              sizes="(min-width: 1024px) 40vw, 100vw"
              caption={
                <>
                  <span className="font-semibold text-accent">{c.fig} 04</span>
                  {c.aboutCaption}
                </>
              }
            />
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="grid gap-8 text-[16px] leading-relaxed text-ink-soft md:grid-cols-2">
                {d.pages.aboutSections.slice(0, 2).map((sec) => (
                  <div key={sec.h2}>
                    <h3 className="mb-3 font-display text-[19px] font-semibold tracking-[-0.01em] text-ink">{sec.h2}</h3>
                    {sec.paragraphs.map((p) => (
                      <p key={p} className="mb-4">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
              <dl className="mt-8 grid gap-x-8 border-t border-ink sm:grid-cols-2">
                {c.figures.map((f) => (
                  <div key={f.n} className="border-b border-line py-6">
                    <dt className="font-display text-[clamp(3rem,5vw,4.25rem)] font-semibold leading-none tracking-[-0.04em] text-accent">{f.n}</dt>
                    <dd className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.t}</dd>
                  </div>
                ))}
              </dl>
              <Link href={href(lang, "about")} className="link-arrow mt-8">
                {c.aboutMore}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAKT: contact list, the three next steps and the lead form. */}
      <section id={id.contact} className="section-y scroll-mt-20 bg-bg-2">
        <div className="container-x">
          <SectionHead eyebrow={c.contactLabel} title={c.contactTitle} />
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="lead">{c.contactLead}</p>
              <ContactList locale={lang} hours className="mt-8" />
              <p className="label mb-3 mt-12">{st.stepsTitle}</p>
              <ol className="border-t border-ink">
                {st.steps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-4">
                    <span className="text-[12.5px] font-semibold tabular-nums text-accent">{two(i + 1)}</span>
                    <span>
                      <span className="block font-display text-[17px] font-semibold tracking-[-0.01em]">{s.title}</span>
                      <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-soft">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-7">
              <p className="label mb-2">{c.formLabel}</p>
              <h3 className="h-block mb-6">{c.formTitle}</h3>
              <LeadForm locale={lang} t={d.form} thanksHref={href(lang, "thanks")} privacyHref={href(lang, "legal:datenschutz")} source="home" />
            </div>
          </div>
        </div>
      </section>

      {/* SEO appendix: fit, locations, guides and the FAQ, numbered on from the main sections. */}
      <FitSection locale={lang} />

      <LocationsSection locale={lang} />

      <section className="container-x section-y">
        <SectionHead
          eyebrow={d.home.guidesEyebrow}
          title={d.home.guidesTitle}
          action={
            <Link href={href(lang, "guides")} className="link-arrow">
              {c.guidesAll}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-x-8 md:grid-cols-3">
          {guides.slice(0, 3).map((g) => (
            <CardLink
              key={g.key}
              href={href(lang, `guide:${g.key}`)}
              meta={`${g.readingMinutes} ${d.common.minutes}`}
              title={g.content[lang].h1}
              text={g.content[lang].lead}
            />
          ))}
        </div>
      </section>

      <div className="border-t border-line">
        <FaqSection locale={lang} faq={homeFaq[lang]} id={id.faq} />
      </div>
      <CtaBand locale={lang} />
    </>
  );
}

/** Framed city line drawing used as a picture until real photos exist. */
function Drawing({ city, className = "" }: { city: string; className?: string }) {
  const Skyline = skylines[city];
  return (
    <div aria-hidden="true" className={`overflow-hidden bg-bg-2 text-accent/70 ${className}`}>
      {Skyline && <Skyline preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[85%] w-full" />}
    </div>
  );
}


import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand } from "@/components/blocks";
import { ContactList, PortraitCard } from "@/components/editorial";
import { HomeHero } from "@/components/home-hero";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { ServiceArt } from "@/components/service-art";
import { BrowserFrame } from "@/components/visuals";
import { guides } from "@/content/guides";
import { problems } from "@/content/problems";
import { services } from "@/content/services";
import { structure } from "@/content/structure";
import { getDict } from "@/i18n/dict";
import { getRoute, hasRoute, href, isLocale } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import {
  FaqSection,
  FitSection,
  Kicker,
  LocationsSection,
  ProcessSection,
  ReferencesSection,
  SectionHead,
  hasProjects,
} from "@/components/sections";
const homeMeta = {
  de: {
    title: "Webdesign Agentur Schweiz: Webseiten für Unternehmen | Webnova",
    description:
      "Webdesign Agentur für Schweizer Unternehmen: individuelle Webseiten, gestaltet, entwickelt und betreut aus einer Hand. Schnell, mobil und bei Google sichtbar. Kostenlose Erstberatung.",
  },
  fr: {
    title: "Agence web en Suisse : sites internet pour entreprises | Webnova",
    description:
      "Agence web pour les entreprises suisses : des sites internet sur mesure, conçus, développés et suivis par un seul interlocuteur. Rapides, mobiles et visibles sur Google. Premier conseil gratuit.",
  },
};

const homeFaq = {
  de: [
    { q: "Webagentur, Website-Agentur oder Webdesign-Agentur: Was ist der Unterschied?", a: "Im Alltag meinen alle drei Begriffe dasselbe: ein Team, das Webseiten plant, gestaltet und technisch umsetzt. Entscheidend ist, was enthalten ist. Webnova ist eine Webdesign Agentur für Schweizer KMU und übernimmt Konzept, Design, Texte, Entwicklung, SEO und Betreuung aus einer Hand." },
    { q: "Was kostet eine neue Webseite bei Webnova?", a: "Jedes Projekt ist anders, deshalb arbeiten wir nicht mit Pauschalpreisen. Der Aufwand hängt vor allem von der Anzahl Seiten, den Funktionen, den Sprachen und davon ab, wer die Texte schreibt. Nach einem kostenlosen Erstgespräch erhalten Sie eine transparente Offerte, abgestimmt auf Umfang, Funktionen und Ihr Budget." },
    { q: "Wie lange dauert es, bis meine Webseite online ist?", a: "Eine typische KMU-Webseite ist in wenigen Wochen online. Der genaue Zeitplan hängt vom Umfang und davon ab, wie schnell Inhalte wie Texte und Bilder bereitstehen. Den Fahrplan legen wir im Konzept gemeinsam fest." },
    { q: "Wer ist mein Ansprechpartner?", a: "Ferhat Demir. Er begleitet Ihr Projekt vom Erstgespräch über die Offerte und die Umsetzung bis nach dem Launch. Sie sprechen immer mit derselben Person." },
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
    { q: "Qui est mon interlocuteur ?", a: "Ferhat Demir. Il suit votre projet du premier entretien au devis, à la réalisation et jusqu'après la mise en ligne. Vous parlez toujours à la même personne." },
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
    angebotTitle: "Wo steht Ihre Webseite heute?",
    angebotLead: "Ob neu, erneuert oder betreut: Webnova macht Webseiten für Unternehmen. Wählen Sie, wo Sie stehen, wir zeigen Ihnen den Weg.",
    goals: [
      { id: "service:webdesign", t: "Neue Webseite", x: "Sie haben noch keine oder eine veraltete Webseite: wir gestalten und bauen sie neu, passend zu Ihrem Unternehmen." },
      { id: "service:website-redesign", t: "Webseite erneuern", x: "Ihre Webseite ist da, bringt aber kaum Anfragen: wir machen sie modern, schnell und klar." },
      { id: "service:wartung", t: "Webseite betreuen", x: "Hosting, Updates, Sicherheit und Anpassungen: Ihre Webseite bleibt aktuell, ohne dass Sie sich darum kümmern." },
    ],
    seeService: "Zur Leistung",
    formulaTitle: "Eine Webseite, die zu Ihrem Betrieb passt.",
    formula: [
      { icon: "briefcase", t: "Ihr Angebot", x: "Was Sie leisten, klar und verständlich erklärt." },
      { icon: "users", t: "Ihre Kundschaft", x: "Wer Sie sucht und was diese Menschen überzeugt." },
      { icon: "activity", t: "Ihre Ziele", x: "Mehr Anfragen, Buchungen oder Bewerbungen." },
    ],
    formulaResult: { t: "Ihre Webseite", x: "Gestaltet und gebaut, damit aus Besuchern Kunden werden." },
    blocksTitle: "Webseiten für Unternehmen. Von der Idee bis zum Betrieb.",
    focusLabel: "Schwerpunkte",
    moreLabel: "Dazu gehört auch",
    extraTitle: "Ergänzend zu Ihrer Webseite",
    extraLead: "Wenn es zum Projekt passt, kümmern wir uns auch darum.",
    extras: ["seo", "local-seo", "onlineshop", "online-marketing", "kassensystem"],
    problemTitle: "Lieber beim Problem starten?",
    notFoundTitle: "Ihr Anliegen ist nicht dabei?",
    notFoundText: "Erzählen Sie uns kurz von Ihrem Betrieb. Wir sagen Ihnen ehrlich, was sich lohnt, kostenlos und unverbindlich.",
    blocks: [
      { title: "Webdesign & Entwicklung", main: "webdesign", more: ["website-kmu", "firmenwebsite", "branding"] },
      { title: "Relaunch bestehender Webseiten", main: "website-redesign", more: [] },
      { title: "Hosting, Wartung & Betreuung", main: "wartung", more: [] },
    ],
    aboutLabel: "Über uns",
    aboutTitle: "Persönlich, direkt und ohne Umwege über Projektteams.",
    aboutCaption: "Ferhat Demir · Ihr Ansprechpartner",
    figures: [
      { n: "1", t: "feste Ansprechperson vom Erstgespräch bis nach dem Launch" },
      { n: "0", t: "Baukasten-Vorlagen: jede Webseite wird individuell gestaltet und entwickelt" },
    ],
    aboutMore: "Mehr über Webnova",
    contactLabel: "Kontakt",
    contactTitle: "Schreiben Sie uns. Sie hören innert eines Arbeitstages von uns.",
    contactLead: "Rufen Sie an, schreiben Sie per WhatsApp oder E-Mail, oder beschreiben Sie Ihr Vorhaben direkt im Formular. Ferhat Demir meldet sich persönlich.",
    formLabel: "Projektanfrage",
    formTitle: "Ihr Vorhaben in zwei Minuten beschrieben.",
    guidesAll: "Alle Ratgeber",
    showLabel: "Beispiel-Designs",
    showTitle: "So kann Ihre Webseite aussehen.",
    showLead: "Jede Webseite bekommt ihren eigenen Look, abgestimmt auf Ihr Unternehmen, Ihre Kundschaft und Ihr Ziel.",
    industriesLink: "Webseiten nach Branche",
    blocksLead: "Konzept, Design, Texte, Entwicklung und Betreuung aus einer Hand. Ferhat Demir begleitet Ihr Projekt persönlich, ohne Weiterreichen.",
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
    angebotTitle: "Où en est votre site aujourd'hui ?",
    angebotLead: "Nouveau, refait ou suivi : Webnova crée des sites pour les entreprises. Choisissez où vous en êtes, nous vous montrons le chemin.",
    goals: [
      { id: "service:webdesign", t: "Nouveau site", x: "Vous n'avez pas encore de site ou il est dépassé : nous le concevons et le construisons sur mesure pour votre entreprise." },
      { id: "service:website-redesign", t: "Refaire son site", x: "Votre site existe, mais n'apporte guère de demandes : nous le rendons moderne, rapide et clair." },
      { id: "service:wartung", t: "Faire suivre son site", x: "Hébergement, mises à jour, sécurité et modifications : votre site reste à jour, sans que vous ayez à vous en occuper." },
    ],
    seeService: "Voir le service",
    formulaTitle: "Un site qui correspond à votre entreprise.",
    formula: [
      { icon: "briefcase", t: "Votre offre", x: "Ce que vous faites, expliqué clairement." },
      { icon: "users", t: "Votre clientèle", x: "Qui vous cherche et ce qui la convainc." },
      { icon: "activity", t: "Vos objectifs", x: "Plus de demandes, de réservations ou de candidatures." },
    ],
    formulaResult: { t: "Votre site", x: "Conçu et construit pour transformer les visiteurs en clients." },
    blocksTitle: "Des sites pour entreprises. De l'idée à l'exploitation.",
    focusLabel: "Points forts",
    moreLabel: "Également",
    extraTitle: "En complément de votre site",
    extraLead: "Quand cela sert le projet, nous nous en chargeons aussi.",
    extras: ["seo", "local-seo", "onlineshop", "online-marketing", "kassensystem"],
    problemTitle: "Plutôt partir du problème ?",
    notFoundTitle: "Votre besoin n'y figure pas ?",
    notFoundText: "Parlez-nous brièvement de votre entreprise. Nous vous disons franchement ce qui en vaut la peine, gratuitement et sans engagement.",
    blocks: [
      { title: "Webdesign & développement", main: "webdesign", more: ["website-kmu", "firmenwebsite", "branding"] },
      { title: "Refonte de sites existants", main: "website-redesign", more: [] },
      { title: "Hébergement, maintenance & suivi", main: "wartung", more: [] },
    ],
    aboutLabel: "À propos",
    aboutTitle: "Personnel, direct et sans détour par des équipes de projet.",
    aboutCaption: "Ferhat Demir · votre interlocuteur",
    figures: [
      { n: "1", t: "interlocuteur fixe du premier entretien jusqu'après la mise en ligne" },
      { n: "0", t: "modèle de constructeur : chaque site est conçu et développé sur mesure" },
    ],
    aboutMore: "En savoir plus sur Webnova",
    contactLabel: "Contact",
    contactTitle: "Écrivez-nous. Vous recevez une réponse en un jour ouvrable.",
    contactLead: "Appelez, écrivez sur WhatsApp ou par e-mail, ou décrivez votre projet directement dans le formulaire. Ferhat Demir vous répond personnellement.",
    formLabel: "Demande de projet",
    formTitle: "Votre projet décrit en deux minutes.",
    guidesAll: "Tous les conseils",
    showLabel: "Exemples de design",
    showTitle: "Voici à quoi votre site peut ressembler.",
    showLead: "Chaque site a son propre style, adapté à votre entreprise, à votre clientèle et à votre objectif.",
    industriesLink: "Sites par secteur",
    blocksLead: "Concept, design, textes, développement et suivi par un seul interlocuteur. Ferhat Demir suit votre projet personnellement, sans intermédiaires.",
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

  const problemList = problems.filter((p) => hasRoute(`problem:${p.key}`));

  return (
    <>
      <HomeHero locale={lang} />

      {/* PROJECTS: horizontal row, only while references are switched on (showReferences). */}
      {projects && <ReferencesSection locale={lang} id={id.projects} />}

      {/* ANGEBOT: the goal question with three goals, each with its own scene. */}
      <section id={id.services} className="section-y scroll-mt-20">
        <div className="container-x">
          <SectionHead eyebrow={c.angebotLabel} title={c.angebotTitle} lead={c.angebotLead} />
          <ol className="grid gap-5 md:grid-cols-3">
            {c.goals.map((g) => (
              <li key={g.id}>
                <Link href={href(lang, g.id)} className="card-soft card-hover group flex h-full flex-col overflow-hidden p-3">
                  <ServiceArt service={g.id.replace("service:", "")} locale={lang} className="aspect-[5/4]" />
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                    <h3 className="font-display text-[clamp(1.35rem,2vw,1.6rem)] font-semibold leading-[1.25] transition-colors group-hover:text-accent">{g.t}</h3>
                    <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">{g.x}</p>
                    <span className="link-arrow mt-auto pt-5">
                      {c.seeService}
                      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          {/* The formula: what a fitting website is made of. */}
          <div className="stage-accent mt-14 rounded-3xl p-5 text-white sm:p-8 md:mt-16 lg:p-10">
            <p className="kicker-light mb-6 lg:mb-8">{c.formulaTitle}</p>
            <ol className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1.15fr] lg:gap-4">
              {c.formula.map((f, i) => (
                <Fragment key={f.t}>
                  {i > 0 && <Operator sign="+" />}
                  <li className="rounded-2xl bg-white/[0.08] p-5 ring-1 ring-inset ring-white/15">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-accent-light">
                      <Icon name={f.icon} className="h-5 w-5" />
                    </span>
                    <p className="mt-4 font-display text-[19px] font-semibold">{f.t}</p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/70">{f.x}</p>
                  </li>
                </Fragment>
              ))}
              <Operator sign="=" />
              <li className="rounded-2xl bg-white p-5 text-ink shadow-[0_24px_48px_-24px_rgb(10_22_34/0.6)]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white">
                  <Icon name="layout" className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-[19px] font-semibold text-accent">{c.formulaResult.t}</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{c.formulaResult.x}</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* SCHWERPUNKTE: five service blocks on the dark stage, each with its scene. */}
      <section className="section-y bg-bg-2">
        <div className="container-x">
          <SectionHead eyebrow={c.focusLabel} title={c.blocksTitle} lead={c.blocksLead} />
          <ol className="space-y-5">
            {c.blocks.map((b, i) => {
              const main = svc(b.main);
              if (!main) return null;
              const mc = main.content[lang];
              const more = b.more.map(svc).filter((x) => x !== undefined).filter((x) => hasRoute(`service:${x.key}`));
              return (
                <li key={b.main} className="card-soft reveal grid items-center gap-8 p-4 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8">
                  <ServiceArt service={main.key} locale={lang} className={`aspect-[5/4] lg:col-span-5 ${i % 2 ? "lg:order-last" : ""}`} />
                  <div className="lg:col-span-7">
                    <span className="font-display text-[14px] font-semibold tabular-nums text-bright">{two(i + 1)}</span>
                    <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.2]">
                      <Link href={href(lang, `service:${main.key}`)} className="transition-colors hover:text-accent">
                        {b.title}
                      </Link>
                    </h3>
                    <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{mc.lead}</p>
                    <ul className="mt-6 grid gap-2.5 text-[15px] sm:grid-cols-2">
                      {mc.features.slice(0, 4).map((f) => (
                        <li key={f.title} className="flex gap-2.5">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-bright-soft text-bright">
                            <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                          </span>
                          {f.title}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <ButtonLink href={href(lang, `service:${main.key}`)} variant="primary">
                        {mc.navLabel}
                      </ButtonLink>
                      {more.length > 0 && (
                        <p className="flex flex-wrap gap-2 text-[14px]">
                          <span className="sr-only">{c.moreLabel}</span>
                          {more.map((m) => (
                            <Link key={m.key} href={href(lang, `service:${m.key}`)} className="rounded-full px-3.5 py-1.5 bg-white text-ink-soft ring-1 ring-inset ring-line transition-colors hover:text-accent hover:ring-accent/30">
                              {m.content[lang].navLabel}
                            </Link>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Everything beyond websites stays a compact side note. */}
          <div className="mt-10 rounded-3xl px-1 sm:px-2">
            <p className="font-display text-[19px] font-semibold">{c.extraTitle}</p>
            <p className="mt-1.5 text-[15px] text-ink-soft">{c.extraLead}</p>
            <p className="mt-5 flex flex-wrap gap-2 text-[14px]">
              {c.extras
                .map(svc)
                .filter((x) => x !== undefined)
                .filter((x) => hasRoute(`service:${x.key}`))
                .map((m) => (
                  <Link key={m.key} href={href(lang, `service:${m.key}`)} className="rounded-full px-3.5 py-1.5 bg-white text-ink-soft ring-1 ring-inset ring-line transition-colors hover:text-accent hover:ring-accent/30">
                    {m.content[lang].navLabel}
                  </Link>
                ))}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-12">
            {problemList.length > 0 && (
              <div className="md:col-span-7">
                <h3 className="h-block">{c.problemTitle}</h3>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {problemList.map((p) => (
                    <li key={p.key}>
                      <Link href={href(lang, `problem:${p.key}`)} className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-[15.5px] ring-1 ring-inset ring-line transition-colors hover:text-accent hover:ring-accent/30">
                        <Icon name={p.icon} className="h-5 w-5 shrink-0 text-bright group-hover:text-accent" />
                        <span className="flex-1">{p.content[lang].navLabel}</span>
                        <Icon name="arrow" className="h-4 w-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col justify-between gap-8 self-start rounded-3xl stage-accent p-8 text-white md:col-span-5">
              <div>
                <p className="font-display text-[24px] font-semibold leading-[1.25]">{c.notFoundTitle}</p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/75">{c.notFoundText}</p>
              </div>
              <div>
                <ButtonLink href={href(lang, "request")} variant="light">{d.nav.cta}</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEISPIEL-DESIGNS: sample sites without captions (alt texts say they are fictional). */}
      <section className="section-y overflow-hidden">
        <div className="container-x">
          <SectionHead
            eyebrow={c.showLabel}
            title={c.showTitle}
            lead={c.showLead}
            action={
              <Link href={href(lang, "industries")} className="link-arrow">
                {c.industriesLink}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-5 md:grid-cols-2">
            {(["coiffeur", "restaurant", "schreinerei", "treuhand"] as const).map((k, i) => (
              <div key={k} className={`reveal rounded-3xl p-4 sm:p-6 ${i === 0 || i === 3 ? "stage-accent" : "bg-bg-2 ring-1 ring-line"}`}>
                <BrowserFrame sample={k} locale={lang} sizes="(min-width: 768px) 560px, 92vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABLAUF */}
      <ProcessSection locale={lang} id={id.process} title={d.home.processTitle} />

      {/* ÜBER UNS: the owner's portrait, two text columns and two true figures. */}
      <section id={id.about} className="section-y scroll-mt-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <PortraitCard locale={lang} className="mx-auto w-full max-w-[420px] lg:col-span-5" />
          <div className="lg:col-span-7">
            <Kicker className="mb-5">{c.aboutLabel}</Kicker>
            <h2 className="h-section">{c.aboutTitle}</h2>
            <div className="mt-8 grid gap-8 text-[16px] leading-relaxed text-ink-soft md:grid-cols-2">
              {d.pages.aboutSections.slice(0, 2).map((sec) => (
                <div key={sec.h2}>
                  <h3 className="mb-3 font-display text-[19px] font-semibold text-ink">{sec.h2}</h3>
                  {sec.paragraphs.map((p) => (
                    <p key={p} className="mb-4">
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {c.figures.map((f) => (
                <div key={f.n} className="rounded-2xl bg-bright-soft p-5">
                  <dt className="font-display text-[clamp(2.5rem,4vw,3.25rem)] font-semibold leading-none text-accent">{f.n}</dt>
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
              <ol className="space-y-3">
                {st.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                    <span className="num-tile">{i + 1}</span>
                    <span>
                      <span className="block font-display text-[17px] font-semibold">{s.title}</span>
                      <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-soft">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-line sm:p-8">
                <p className="label mb-2">{c.formLabel}</p>
                <h3 className="h-block mb-6">{c.formTitle}</h3>
                <LeadForm locale={lang} t={d.form} thanksHref={href(lang, "thanks")} privacyHref={href(lang, "legal:datenschutz")} source="home" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO appendix: fit, locations, guides and the FAQ. */}
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
        <div className="grid gap-4 md:grid-cols-3">
          {guides.slice(0, 3).map((g) => (
            <CardLink
              key={g.key}
              href={href(lang, `guide:${g.key}`)}
              icon="file"
              meta={`${g.readingMinutes} ${d.common.minutes}`}
              title={g.content[lang].h1}
              text={g.content[lang].lead}
            />
          ))}
        </div>
      </section>

      <FaqSection locale={lang} faq={homeFaq[lang]} id={id.faq} />
      <div className="pt-20 md:pt-28">
        <CtaBand locale={lang} />
      </div>
    </>
  );
}

function Operator({ sign }: { sign: "+" | "=" }) {
  return (
    <li aria-hidden="true" className="grid place-items-center">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 font-display text-[20px] font-semibold text-accent-light ring-1 ring-inset ring-white/20">{sign}</span>
    </li>
  );
}

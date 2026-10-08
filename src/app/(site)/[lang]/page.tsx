import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList } from "@/components/blocks";
import { references } from "@/content/references";
import { HeroBuild } from "@/components/hero-build";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { services } from "@/content/services";
import { getDict } from "@/i18n/dict";
import { getRoute, href, isLocale } from "@/lib/routes";
import { JsonLd, faqLd, pageMetadata } from "@/lib/seo";
import { showReferences } from "@/lib/site";

const homeMeta = {
  de: {
    title: "Webdesign-Agentur für Schweizer KMU | Webnova",
    description:
      "Webnova erstellt moderne Webseiten und Onlineshops mit SEO für KMU in der ganzen Schweiz. Persönlich, schnell, auf Anfragen optimiert.",
  },
  fr: {
    title: "Agence web pour PME suisses | Webnova",
    description:
      "Webnova crée des sites internet et boutiques en ligne optimisés pour Google, pour les PME de toute la Suisse. Personnel et rapide.",
  },
};

const homeFaq = {
  de: [
    { q: "Was kostet eine neue Webseite bei Webnova?", a: "Jedes Projekt ist anders, deshalb arbeiten wir nicht mit Pauschalpreisen. Nach einem kostenlosen Erstgespräch erhalten Sie eine transparente Offerte, abgestimmt auf Umfang, Funktionen und Ihr Budget." },
    { q: "Wie lange dauert es, bis meine Webseite online ist?", a: "Eine typische KMU-Webseite ist in wenigen Wochen online. Der genaue Zeitplan hängt vom Umfang und davon ab, wie schnell Inhalte wie Texte und Bilder bereitstehen. Den Fahrplan legen wir im Konzept gemeinsam fest." },
    { q: "Arbeiten Sie in der ganzen Schweiz?", a: "Ja. Wir betreuen Unternehmen in der ganzen Deutsch- und Westschweiz, persönlich per Videocall und bei Bedarf vor Ort. Sie haben vom ersten Gespräch bis nach dem Launch eine feste Ansprechperson." },
    { q: "Kann ich meine Webseite später selbst bearbeiten?", a: "Ja. Auf Wunsch erhalten Sie ein einfaches Redaktionssystem und eine kurze Einführung. Alternativ übernehmen wir Anpassungen im Rahmen eines Wartungsvertrags für Sie." },
    { q: "Bieten Sie Webseiten auch zweisprachig an?", a: "Ja, Deutsch und Französisch sind bei uns Alltag. Gerade in Biel/Bienne und der Westschweiz ist eine zweisprachige Webseite oft der Schlüssel zu mehr Kundschaft." },
  ],
  fr: [
    { q: "Combien coûte un nouveau site chez Webnova ?", a: "Chaque projet est différent, c'est pourquoi nous ne travaillons pas avec des forfaits. Après un premier entretien gratuit, vous recevez un devis clair et transparent, adapté à l'envergure, aux fonctions et à votre budget." },
    { q: "En combien de temps mon site est-il en ligne ?", a: "Un site typique de PME est en ligne en quelques semaines. Le calendrier dépend de l'envergure et de la disponibilité des contenus comme les textes et les images. Nous le fixons ensemble lors du concept." },
    { q: "Travaillez-vous dans toute la Suisse ?", a: "Oui. Nous accompagnons des entreprises dans toute la Suisse romande et alémanique, personnellement par visioconférence et sur place si nécessaire. Vous avez un interlocuteur fixe du premier entretien jusqu'après la mise en ligne." },
    { q: "Pourrai-je modifier mon site moi-même ?", a: "Oui. Sur demande, vous recevez un système de gestion de contenu simple et une courte formation. Nous pouvons aussi effectuer les modifications pour vous dans le cadre d'un contrat de maintenance." },
    { q: "Proposez-vous des sites bilingues ?", a: "Oui, le français et l'allemand font partie de notre quotidien. À Bienne et en Suisse romande, un site bilingue est souvent la clé pour toucher plus de clients." },
  ],
};

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, getRoute("home"), homeMeta[lang], { absoluteTitle: true });
}

const intro = {
  de: {
    projectsEyebrow: "Ausgewählte Projekte",
    projectsTitle: "Ein Einblick in unsere Arbeit.",
    heroServices: "Unsere Leistungen",
    toProject: "Zum Projekt",
    servicesEyebrow: "Wie können wir helfen?",
    servicesTitle: "Sagen Sie uns, wo der Schuh drückt. Wir kümmern uns um den Rest.",
    quote: "Wir nehmen uns Zeit, Ihren Betrieb zu verstehen, bevor wir eine Zeile Code schreiben.",
    quoteBy: "Webnova",
    unsure: "Nicht sicher, was Sie brauchen?",
    unsureText: "Erzählen Sie uns kurz von Ihrem Betrieb. Wir sagen Ihnen ehrlich, was sich lohnt, kostenlos und unverbindlich.",
    processCta: "Mit dem Erstgespräch starten",
    heroNote: "Kostenlos & unverbindlich · Antwort innert 1 Arbeitstag",
    approachLead:
      "Bei uns haben Sie vom ersten Gespräch bis zum Launch und darüber hinaus eine feste Ansprechperson. Wir planen klar, gestalten ruhig und bauen Webseiten, die schnell laden, gefunden werden und Anfragen bringen.",
  },
  fr: {
    projectsEyebrow: "Projets choisis",
    projectsTitle: "Un aperçu de notre travail.",
    heroServices: "Nos services",
    toProject: "Voir le projet",
    servicesEyebrow: "Comment pouvons-nous aider ?",
    servicesTitle: "Dites-nous ce qui coince. Nous nous occupons du reste.",
    quote: "Nous prenons le temps de comprendre votre entreprise avant d'écrire la moindre ligne de code.",
    quoteBy: "Webnova",
    unsure: "Vous ne savez pas encore ce qu'il vous faut ?",
    unsureText: "Parlez-nous brièvement de votre entreprise. Nous vous disons franchement ce qui en vaut la peine, gratuitement et sans engagement.",
    processCta: "Commencer par un premier entretien",
    heroNote: "Gratuit et sans engagement · Réponse en 1 jour ouvrable",
    approachLead:
      "Du premier entretien à la mise en ligne et au-delà, vous avez un seul interlocuteur. Nous planifions clairement, concevons avec sobriété et créons des sites rapides, bien référencés et qui génèrent des demandes.",
  },
};

/** Each service introduced by the question a client would actually ask. */
const questions: Record<string, { de: string; fr: string }> = {
  webdesign: { de: "Sie brauchen eine neue Webseite?", fr: "Besoin d'un nouveau site ?" },
  "website-redesign": { de: "Ihre Webseite ist in die Jahre gekommen?", fr: "Votre site a pris de l'âge ?" },
  onlineshop: { de: "Sie möchten online verkaufen?", fr: "Vous voulez vendre en ligne ?" },
  seo: { de: "Bei Google steht die Konkurrenz vorne?", fr: "Vos concurrents passent devant sur Google ?" },
  "online-marketing": { de: "Sie wollen mehr Anfragen, und zwar jetzt?", fr: "Plus de demandes, et rapidement ?" },
  branding: { de: "Ihr Auftritt wirkt nicht wie aus einem Guss?", fr: "Votre image manque de cohérence ?" },
  wartung: { de: "Niemand kümmert sich um Ihre Webseite?", fr: "Personne ne s'occupe de votre site ?" },
  kassensystem: { de: "Sie suchen ein Kassensystem, das einfach läuft?", fr: "Une caisse qui fonctionne, tout simplement ?" },
};

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const i = intro[lang];
  const mainServices = services.filter((s) => s.key !== "kassensystem-gastro" && s.key !== "kassensystem-retail");
  const core = cities.filter((c) => c.priority === "A");
  const shown = showReferences ? references : [];

  return (
    <>
      <JsonLd data={faqLd(homeFaq[lang])} />

      {/* HERO: statement on white with faint layout columns; a website building itself plus the services panel on the right */}
      <section className="relative isolate overflow-hidden border-b border-line bg-bg">
        <div aria-hidden="true" className="hero-guides pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_92%_8%,rgb(44_109_179/0.09),transparent_70%)]" />
        <div className="container-x grid items-center gap-12 pb-20 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">{d.hero.eyebrow}</p>
            <h1 className="display text-[clamp(2.6rem,5.4vw,4.75rem)]">
              {d.hero.title1} <span className="text-bright">{d.hero.title2}</span>
            </h1>
            <p className="mt-7 max-w-xl text-[18px] leading-relaxed text-ink-soft md:text-[19px]">{d.hero.lead}</p>
            <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:120ms]">
              <ButtonLink href={href(lang, "request")}>{d.hero.primary}</ButtonLink>
              <ButtonLink href={href(lang, "services")} variant="ghost" arrow={false}>
                {d.hero.secondary}
              </ButtonLink>
            </div>
            <p className="mt-4 text-[14px] text-muted">{i.heroNote}</p>
            <ul className="mt-10 flex animate-rise flex-wrap gap-x-7 gap-y-3 border-t border-line pt-6 text-[15px] text-ink-soft [animation-delay:200ms]">
              {d.hero.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-bright-soft text-bright">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative lg:col-span-5">
            <HeroBuild locale={lang} />
            <div className="surface-night relative z-10 -mt-8 ml-3 rounded-2xl p-2.5 text-white shadow-lift sm:-mt-12 sm:ml-12 lg:-ml-10 lg:mr-0">
              <p className="px-3.5 pb-2.5 pt-3 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent-light">{i.heroServices}</p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {mainServices.map((sv) => (
                  <li key={sv.key}>
                    <Link
                      href={href(lang, `service:${sv.key}`)}
                      className="group flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.07]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.08] text-accent-light ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-accent-light group-hover:text-night">
                        <Icon name={sv.icon} className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-[14.5px] font-medium leading-tight">{sv.content[lang].navLabel}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES as the questions clients ask, on the dark night surface */}
      <section className="surface-night section-y text-white">
        <div className="container-x">
          <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow-light mb-4">{i.servicesEyebrow}</p>
              <h2 className="h-section">{i.servicesTitle}</h2>
            </div>
            <p className="text-[17px] leading-relaxed text-white/75 md:col-span-5 md:text-[18px]">{d.home.servicesLead}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mainServices.map((sv) => (
              <Link
                key={sv.key}
                href={href(lang, `service:${sv.key}`)}
                className="reveal group flex min-h-[250px] flex-col rounded-2xl border border-white/10 bg-night-2/70 p-7 transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent-light/40 hover:bg-night-2"
              >
                <span className="icon-tile-dark mb-6 transition-colors duration-300 group-hover:bg-accent-light group-hover:text-night">
                  <Icon name={sv.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display text-[19px] font-semibold leading-snug tracking-[-0.01em]">{questions[sv.key]?.[lang] ?? sv.content[lang].navLabel}</h3>
                <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-white/70">{sv.content[lang].lead}</p>
                <span className="mt-auto flex items-center gap-2 pt-6 text-[14.5px] font-medium text-accent-light transition-colors group-hover:text-white">
                  {sv.content[lang].navLabel}
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <div className="reveal mt-10 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-[20px] font-semibold tracking-[-0.01em]">{i.unsure}</p>
              <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-white/75">{i.unsureText}</p>
            </div>
            <ButtonLink href={href(lang, "request")} variant="accent" className="shrink-0">
              {d.hero.primary}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* APPROACH: why Webnova, as a calm list next to the owner's quote */}
      <section className="container-x section-y">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow mb-4">{d.home.whyEyebrow}</p>
            <h2 className="h-section">{d.home.whyTitle}</h2>
            <p className="lead mt-6">{i.approachLead}</p>
            <figure className="mt-10 border-l-2 border-bright pl-6">
              <blockquote className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.01em] text-ink">«{i.quote}»</blockquote>
              <figcaption className="mt-4 text-[14px] text-muted">{i.quoteBy}</figcaption>
            </figure>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {d.home.why.map((w, n) => (
              <li key={n} className="reveal grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-7 last:border-b">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-bright-soft font-display text-[14px] font-semibold text-bright">{n + 1}</span>
                <div>
                  <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em]">{w.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{w.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROCESS on the cool grey band */}
      <section className="section-y bg-bg-2">
        <div className="container-x">
          <div className="reveal max-w-3xl">
            <p className="eyebrow mb-4">{d.home.processEyebrow}</p>
            <h2 className="h-section">{d.home.processTitle}</h2>
          </div>
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {d.home.process.map((p, n) => (
              <li key={n} className="card reveal relative p-7">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-[14px] font-semibold text-white">{n + 1}</span>
                <h3 className="mt-8 font-display text-[18px] font-semibold tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
              </li>
            ))}
          </ol>
          <div className="reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={href(lang, "request")}>{i.processCta}</ButtonLink>
            <span className="text-[14px] text-muted">{d.common.free}</span>
          </div>
        </div>
      </section>

      {/* PROJECTS: a quiet look at selected work, after the services */}
      {shown.length > 0 && (
        <section className="container-x section-y">
          <div className="reveal mb-14 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">{i.projectsEyebrow}</p>
              <h2 className="h-section">{i.projectsTitle}</h2>
            </div>
            <Link href={href(lang, "references")} className="link-arrow">
              {d.home.referencesAll}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className={`grid gap-x-8 gap-y-12 md:grid-cols-2 ${shown.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
            {shown.map((r) => (
              <Link key={r.key} href={href(lang, `reference:${r.key}`)} className="reveal group flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line shadow-xs transition-shadow duration-500 group-hover:shadow-lift" style={{ background: r.colors.bg }}>
                  {r.image && (
                    <Image
                      src={r.image}
                      alt={`${r.name}, ${r.content[lang].industry}`}
                      fill
                      sizes="(min-width: 768px) 580px, 100vw"
                      className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <p className="mt-6 text-[13.5px] text-muted">
                  {r.content[lang].industry}
                  {r.content[lang].place && <> · {r.content[lang].place}</>}
                </p>
                <h3 className="mt-1.5 font-display text-[24px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent">{r.name}</h3>
                <p className="mt-3 line-clamp-3 text-[15.5px] leading-relaxed text-ink-soft">{r.content[lang].summary}</p>
                <span className="link-arrow mt-5">
                  {i.toProject}
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* POS */}
      <section className="border-t border-line">
      <div className="container-x section-y">
        <div className="reveal grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4">{d.home.posEyebrow}</p>
            <h2 className="h-section">{d.home.posTitle}</h2>
            <p className="lead mt-6 max-w-lg">{d.home.posLead}</p>
            <div className="mt-10">
              <ButtonLink href={href(lang, "service:kassensystem")}>{d.common.learnMore}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-3 lg:col-span-5 lg:col-start-8">
            {(["kassensystem-gastro", "kassensystem-retail"] as const).map((k, n) => (
              <Link
                key={k}
                href={href(lang, `service:${k}`)}
                className="card card-hover group flex items-center justify-between gap-4 p-6"
              >
                <span className="flex items-center gap-4">
                  <span className="icon-tile h-12 w-12 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <Icon name={n === 0 ? "utensils" : "bag"} className="h-[22px] w-[22px]" />
                  </span>
                  <span className="font-display text-[20px] font-semibold tracking-[-0.01em]">{n === 0 ? d.home.posGastro : d.home.posRetail}</span>
                </span>
                <Icon name="arrow" className="h-5 w-5 text-bright transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      </section>

      {/* REGIONS */}
      <section className="section-y border-t border-line bg-bg-2">
        <div className="container-x">
          <div className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow mb-4">{d.home.regionsEyebrow}</p>
              <h2 className="h-section">{d.home.regionsTitle}</h2>
            </div>
            <p className="lead md:col-span-5">{d.home.regionsLead}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {core.map((c) => (
              <CardLink key={c.key} href={href(lang, `city:${c.key}`)} title={c.content[lang].h1} />
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href={href(lang, "regions")} variant="ghost">
              {d.nav.regions}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="section-y">
        <div className="container-x">
          <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">{d.home.guidesEyebrow}</p>
              <h2 className="h-section">{d.home.guidesTitle}</h2>
            </div>
            <ButtonLink href={href(lang, "guides")} variant="ghost">
              {d.nav.guides}
            </ButtonLink>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {guides.map((g) => (
              <CardLink
                key={g.key}
                href={href(lang, `guide:${g.key}`)}
                meta={`${g.readingMinutes} ${d.common.minutes}`}
                title={g.content[lang].h1}
                text={g.content[lang].lead}
              />
            ))}
          </div>
        </div>
      </section>

      <FaqList locale={lang} faq={homeFaq[lang]} />
      <CtaBand locale={lang} />
    </>
  );
}

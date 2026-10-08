import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList } from "@/components/blocks";
import { references } from "@/content/references";
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

      {/* HERO: calm statement on Kalk, real project work on the right */}
      <section className="relative overflow-hidden border-b border-line bg-bg">
        <div className="container-x grid items-center gap-14 pb-20 pt-14 md:pt-20 lg:grid-cols-12 lg:pb-28">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-7 animate-rise">{d.hero.eyebrow}</p>
            <h1 className="display animate-rise text-[clamp(2.7rem,5.6vw,4.9rem)] [animation-delay:80ms]">
              {d.hero.title1} <span className="text-accent">{d.hero.title2}</span>
            </h1>
            <p className="mt-8 max-w-xl animate-rise text-[18px] leading-relaxed text-ink-soft [animation-delay:160ms] md:text-[19px]">{d.hero.lead}</p>
            <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
              <ButtonLink href={href(lang, "request")}>{d.hero.primary}</ButtonLink>
              <ButtonLink href={href(lang, "services")} variant="ghost" arrow={false}>
                {d.hero.secondary}
              </ButtonLink>
            </div>
            <ul className="mt-12 flex animate-rise flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-[14.5px] text-ink-soft [animation-delay:320ms]">
              {d.hero.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <Icon name="check" className="h-4 w-4 text-accent" strokeWidth={2.5} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-rise [animation-delay:200ms] lg:col-span-5 lg:col-start-8">
            <div className="rounded-3xl bg-night p-3 text-white shadow-soft">
              <p className="px-5 pb-3 pt-4 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-accent-light">{i.heroServices}</p>
              <ul className="divide-y divide-white/10 rounded-2xl bg-night-2">
                {mainServices.map((sv) => (
                  <li key={sv.key}>
                    <Link href={href(lang, `service:${sv.key}`)} className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.04]">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-accent-light">
                        <Icon name={sv.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="flex-1 text-[16px] font-medium">{sv.content[lang].navLabel}</span>
                      <Icon name="arrow" className="h-4 w-4 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES as the questions clients ask, on deep Schieferblau */}
      <section className="bg-night py-24 text-white md:py-32">
        <div className="container-x">
          <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow mb-4 !text-accent-light">{i.servicesEyebrow}</p>
              <h2 className="h-section">{i.servicesTitle}</h2>
            </div>
            <p className="text-[18px] leading-relaxed text-white/70 md:col-span-5">{d.home.servicesLead}</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {mainServices.map((sv) => (
              <Link key={sv.key} href={href(lang, `service:${sv.key}`)} className="group flex min-h-[230px] flex-col bg-night p-7 transition-colors hover:bg-night-2">
                <h3 className="font-display text-[20px] font-medium leading-snug tracking-[-0.01em]">{questions[sv.key]?.[lang] ?? sv.content[lang].navLabel}</h3>
                <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-white/60">{sv.content[lang].lead}</p>
                <span className="mt-auto flex items-center gap-2 pt-6 text-[14.5px] font-medium text-accent-light transition-colors group-hover:text-white">
                  {sv.content[lang].navLabel}
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH: why Webnova, as a calm list next to the owner's quote */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow mb-4">{d.home.whyEyebrow}</p>
            <h2 className="h-section">{d.home.whyTitle}</h2>
            <p className="mt-6 text-[17.5px] leading-relaxed text-ink-soft">{i.approachLead}</p>
            <figure className="mt-10 border-l-2 border-accent pl-6">
              <blockquote className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.01em] text-ink">«{i.quote}»</blockquote>
              <figcaption className="mt-4 text-[14px] text-muted">{i.quoteBy}</figcaption>
            </figure>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {d.home.why.map((w, n) => (
              <li key={n} className="reveal grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-8 last:border-b">
                <span className="font-display text-[15px] font-semibold text-accent">{String(n + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[20px] font-semibold tracking-tight">{w.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{w.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROCESS on a warm band */}
      <section className="bg-bg-2 py-24 md:py-32">
        <div className="container-x">
          <div className="reveal max-w-3xl">
            <p className="eyebrow mb-4">{d.home.processEyebrow}</p>
            <h2 className="h-section">{d.home.processTitle}</h2>
          </div>
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {d.home.process.map((p, n) => (
              <li key={n} className="reveal rounded-2xl bg-surface p-7">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-[14px] font-semibold text-white">{n + 1}</span>
                <h3 className="mt-8 text-[18px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROJECTS: a quiet look at selected work, after the services */}
      {shown.length > 0 && (
        <section className="container-x py-24 md:py-28">
          <div className="reveal mb-14 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">{i.projectsEyebrow}</p>
              <h2 className="h-section">{i.projectsTitle}</h2>
            </div>
            <Link href={href(lang, "references")} className="inline-flex items-center gap-2 text-[15px] font-medium text-accent">
              {d.home.referencesAll}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {shown.map((r) => (
              <Link key={r.key} href={href(lang, `reference:${r.key}`)} className="reveal group flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line" style={{ background: r.colors.bg }}>
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
                <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-accent">
                  {i.toProject}
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* POS */}
      <section className="container-x py-24 md:py-32">
        <div className="reveal grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4">{d.home.posEyebrow}</p>
            <h2 className="h-section">{d.home.posTitle}</h2>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-ink-soft">{d.home.posLead}</p>
            <div className="mt-10">
              <ButtonLink href={href(lang, "service:kassensystem")}>{d.common.learnMore}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-3 lg:col-span-5 lg:col-start-8">
            {(["kassensystem-gastro", "kassensystem-retail"] as const).map((k, n) => (
              <Link
                key={k}
                href={href(lang, `service:${k}`)}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/50"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={n === 0 ? "utensils" : "bag"} className="h-[22px] w-[22px]" />
                  </span>
                  <span className="font-display text-[20px] font-medium tracking-tight">{n === 0 ? d.home.posGastro : d.home.posRetail}</span>
                </span>
                <Icon name="arrow" className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="border-t border-line py-24 md:py-28">
        <div className="container-x">
          <div className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow mb-4">{d.home.regionsEyebrow}</p>
              <h2 className="h-section">{d.home.regionsTitle}</h2>
            </div>
            <p className="text-[18px] leading-relaxed text-ink-soft md:col-span-5">{d.home.regionsLead}</p>
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
      <section className="border-t border-line py-24 md:py-32">
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

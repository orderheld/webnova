import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList } from "@/components/blocks";
import { HeroVisual } from "@/components/hero-visual";
import { references } from "@/content/references";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { services } from "@/content/services";
import { getDict } from "@/i18n/dict";
import { getRoute, href, isLocale } from "@/lib/routes";
import { photo } from "@/lib/photos";
import { JsonLd, faqLd, organizationLd, pageMetadata } from "@/lib/seo";

const homeMeta = {
  de: {
    title: "Webdesign-Agentur Grenchen, Biel, Solothurn & Bern | Webnova",
    description:
      "Webnova erstellt moderne Webseiten und Onlineshops mit SEO für KMU in Grenchen, Biel, Solothurn und Bern. Persönlich, schnell, auf Anfragen optimiert.",
  },
  fr: {
    title: "Agence web Bienne, Granges, Soleure & Berne | Webnova",
    description:
      "Webnova crée des sites internet et boutiques en ligne optimisés pour Google, pour les PME de Bienne, Granges, Soleure et Berne. Personnel et rapide.",
  },
};

const homeFaq = {
  de: [
    { q: "Was kostet eine neue Webseite bei Webnova?", a: "Jedes Projekt ist anders, deshalb arbeiten wir nicht mit Pauschalpreisen. Nach einem kostenlosen Erstgespräch erhalten Sie eine transparente Offerte, abgestimmt auf Umfang, Funktionen und Ihr Budget." },
    { q: "Wie lange dauert es, bis meine Webseite online ist?", a: "Eine typische KMU-Webseite ist in wenigen Wochen online. Der genaue Zeitplan hängt vom Umfang und davon ab, wie schnell Inhalte wie Texte und Bilder bereitstehen. Den Fahrplan legen wir im Konzept gemeinsam fest." },
    { q: "Arbeiten Sie nur in der Region Grenchen, Biel, Solothurn und Bern?", a: "Unser Schwerpunkt ist die Region rund um Grenchen, Biel, Solothurn und Bern, wo wir Sie gerne vor Ort besuchen. Projekte in der ganzen Schweiz betreuen wir genauso persönlich, per Videocall und bei Bedarf vor Ort." },
    { q: "Kann ich meine Webseite später selbst bearbeiten?", a: "Ja. Auf Wunsch erhalten Sie ein einfaches Redaktionssystem und eine kurze Einführung. Alternativ übernehmen wir Anpassungen im Rahmen eines Wartungsvertrags für Sie." },
    { q: "Bieten Sie Webseiten auch zweisprachig an?", a: "Ja, Deutsch und Französisch sind bei uns Alltag. Gerade in Biel/Bienne und der Westschweiz ist eine zweisprachige Webseite oft der Schlüssel zu mehr Kundschaft." },
  ],
  fr: [
    { q: "Combien coûte un nouveau site chez Webnova ?", a: "Chaque projet est différent, c'est pourquoi nous ne travaillons pas avec des forfaits. Après un premier entretien gratuit, vous recevez un devis clair et transparent, adapté à l'envergure, aux fonctions et à votre budget." },
    { q: "En combien de temps mon site est-il en ligne ?", a: "Un site typique de PME est en ligne en quelques semaines. Le calendrier dépend de l'envergure et de la disponibilité des contenus comme les textes et les images. Nous le fixons ensemble lors du concept." },
    { q: "Travaillez-vous uniquement dans la région de Bienne, Granges, Soleure et Berne ?", a: "Notre région principale est autour de Granges, Bienne, Soleure et Berne, où nous vous rendons volontiers visite. Nous accompagnons tout aussi personnellement des projets dans toute la Suisse, par visioconférence et sur place si nécessaire." },
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
    eyebrow: "Kennen Sie das?",
    title: "Sie sind richtig gut in dem, was Sie tun. Online merkt das nur kaum jemand.",
    items: [
      { title: "Die Website ist in die Jahre gekommen.", text: "Ihr Betrieb hat sich weiterentwickelt, Ihr Auftritt aber nicht. Er zeigt nicht mehr, wer Sie heute sind." },
      { title: "Das Telefon bleibt still.", text: "Die Website ist zwar da, aber es kommen kaum Anfragen. Neue Kunden finden Sie nur über Empfehlungen." },
      { title: "Bei Google steht die Konkurrenz vorne.", text: "Wer in Ihrer Region sucht, landet beim Mitbewerber, obwohl Sie das bessere Angebot haben." },
    ],
    resolve: "Das muss nicht so bleiben. Wir bauen Ihnen einen Auftritt, auf den Sie stolz sind und der für Sie arbeitet, auch nach Feierabend.",
    cta: "Erstgespräch vereinbaren",
    quote: "Wir nehmen uns Zeit, Ihren Betrieb zu verstehen, bevor wir eine Zeile Code schreiben.",
    quoteBy: "Webnova, Grenchen",
  },
  fr: {
    eyebrow: "Ça vous parle ?",
    title: "Vous excellez dans votre métier. Mais en ligne, presque personne ne le remarque.",
    items: [
      { title: "Votre site a pris de l'âge.", text: "Votre entreprise a évolué, votre site pas encore. Il ne montre plus qui vous êtes aujourd'hui." },
      { title: "Le téléphone reste muet.", text: "Le site existe, mais les demandes n'arrivent pas. Les nouveaux clients viennent seulement du bouche-à-oreille." },
      { title: "Sur Google, la concurrence passe devant.", text: "Ceux qui cherchent dans votre région tombent sur un concurrent, alors que votre offre est meilleure." },
    ],
    resolve: "Ça peut changer. Nous créons une présence dont vous êtes fier et qui travaille pour vous, même après la fermeture.",
    cta: "Fixer un premier entretien",
    quote: "Nous prenons le temps de comprendre votre entreprise avant d'écrire la moindre ligne de code.",
    quoteBy: "Webnova, Granges",
  },
};

/** A photo slot, or a calm night panel with a statement when no photo is set yet. */
function MoodImage({ img, quote, by, className = "" }: { img?: { src: string; alt: string }; quote: string; by: string; className?: string }) {
  if (img) {
    return (
      <div className={`reveal relative overflow-hidden rounded-[28px] ${className}`}>
        <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`reveal relative isolate flex flex-col justify-end overflow-hidden rounded-[28px] bg-night p-8 text-white sm:p-10 ${className}`}>
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-[90px]" />
      <span aria-hidden="true" className="mb-auto h-2 w-2 rounded-full bg-accent ring-4 ring-accent/20" />
      <p className="mt-16 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.2] tracking-[-0.025em]">«{quote}»</p>
      <p className="mt-6 text-[14px] text-white/55">{by}</p>
    </div>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const i = intro[lang];
  const mainServices = services.filter((s) => s.key !== "kassensystem-gastro" && s.key !== "kassensystem-retail");
  const core = cities.filter((c) => c.priority === "A");
  // The last word of the headline gets the hand-drawn lime underline.
  const titleWords = d.hero.title2.split(" ");
  const titleLast = titleWords.pop()!;
  const titleRest = titleWords.join(" ");

  return (
    <>
      <JsonLd data={organizationLd(lang, cities.map((c) => c.content[lang].name))} />
      <JsonLd data={faqLd(homeFaq[lang])} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-surface">
        <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10" />
        <div className="container-x grid items-center gap-14 pb-20 pt-10 md:pt-16 lg:grid-cols-12 lg:pb-28">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-7 animate-rise">{d.hero.eyebrow}</p>
            <h1 className="display animate-rise text-[clamp(2.6rem,5.4vw,4.7rem)] [animation-delay:100ms]">
              {d.hero.title1} {titleRest}{" "}
              <span className="relative inline-block whitespace-nowrap">
                {titleLast}
                <svg aria-hidden="true" viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-[0.22em] w-full">
                  <path d="M2 9 C 80 3, 200 3, 298 8" fill="none" stroke="#d2ff28" strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="animate-draw [animation-delay:700ms]" />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-xl animate-rise text-[18px] leading-relaxed text-ink-soft [animation-delay:250ms] md:text-[20px]">{d.hero.lead}</p>
            <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:350ms]">
              <ButtonLink href={href(lang, "request")}>{d.hero.primary}</ButtonLink>
              <ButtonLink href={href(lang, "services")} variant="ghost" arrow={false}>
                {d.hero.secondary}
              </ButtonLink>
            </div>
            <ul className="mt-10 flex animate-rise flex-wrap gap-x-6 gap-y-3 text-[14px] text-muted [animation-delay:450ms]">
              {d.hero.points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-ink" strokeWidth={2.5} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <HeroVisual locale={lang} photo={photo("hero", lang)} />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-y border-line bg-bg py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-stretch">
          <MoodImage img={photo("intro", lang)} quote={i.quote} by={i.quoteBy} className="min-h-[380px] lg:col-span-5" />
          <div className="lg:col-span-7 lg:pl-6">
            <p className="eyebrow mb-4 reveal">{i.eyebrow}</p>
            <h2 className="h-section reveal">{i.title}</h2>
            <ol className="mt-10 divide-y divide-line border-y border-line">
              {i.items.map((it, n) => (
                <li key={n} className="reveal grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                  <span className="font-display text-[15px] font-semibold text-muted">0{n + 1}</span>
                  <div>
                    <h3 className="text-[19px] font-semibold tracking-tight">{it.title}</h3>
                    <p className="mt-1.5 text-[16px] leading-relaxed text-muted">{it.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="reveal mt-8 max-w-xl text-[17px] leading-relaxed text-ink-soft">{i.resolve}</p>
            <div className="reveal mt-8">
              <ButtonLink href={href(lang, "request")}>{i.cta}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-24 md:py-32">
        <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">{d.home.servicesEyebrow}</p>
            <h2 className="h-section">{d.home.servicesTitle}</h2>
          </div>
          <p className="text-[18px] leading-relaxed text-ink-soft md:col-span-5">{d.home.servicesLead}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mainServices.map((s) => (
            <CardLink key={s.key} href={href(lang, `service:${s.key}`)} icon={s.icon} title={s.content[lang].navLabel} text={s.content[lang].lead} />
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-line bg-bg py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4">{d.home.whyEyebrow}</p>
              <h2 className="h-section">{d.home.whyTitle}</h2>
              {photo("approach", lang) && <MoodImage img={photo("approach", lang)} quote="" by="" className="mt-10 aspect-[4/3]" />}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {d.home.why.map((w, n) => (
              <div key={n} className="reveal rounded-[20px] border border-line bg-surface p-7">
                <p className="mb-8 font-display text-[15px] font-semibold text-muted">0{n + 1}</p>
                <h3 className="text-[20px] font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section className="container-x py-24 md:py-32">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">{d.home.referencesEyebrow}</p>
            <h2 className="h-section">{d.home.referencesTitle}</h2>
            <p className="mt-5 text-[18px] leading-relaxed text-ink-soft">{d.home.referencesLead}</p>
          </div>
          <ButtonLink href={href(lang, "references")} variant="ghost">
            {d.home.referencesAll}
          </ButtonLink>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {references
            .filter((r) => r.key !== "ava-catering")
            .map((r) => (
              <CardLink key={r.key} href={href(lang, `reference:${r.key}`)} meta={r.content[lang].industry} title={r.name} text={r.content[lang].summary} />
            ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-line bg-surface py-24 md:py-32">
        <div className="container-x">
          <div className="reveal">
            <p className="eyebrow mb-4">{d.home.processEyebrow}</p>
            <h2 className="h-section max-w-3xl">{d.home.processTitle}</h2>
          </div>
          <ol className="relative mt-16 grid gap-8 md:grid-cols-5 md:gap-6">
            <span aria-hidden="true" className="absolute left-0 right-0 top-[15px] hidden h-px bg-line md:block" />
            {d.home.process.map((p, n) => (
              <li key={n} className="reveal relative">
                <span className="relative grid h-[30px] w-[30px] place-items-center rounded-full border border-ink/15 bg-surface font-display text-[13px] font-semibold">{n + 1}</span>
                <h3 className="mt-6 text-[18px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* POS */}
      <section className="container-x py-24 md:py-32">
        <div className="reveal grid gap-10 rounded-[28px] border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-4">{d.home.posEyebrow}</p>
            <h2 className="h-section">{d.home.posTitle}</h2>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-ink-soft">{d.home.posLead}</p>
            <div className="mt-10">
              <ButtonLink href={href(lang, "service:kassensystem")}>{d.common.learnMore}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-3">
            {(["kassensystem-gastro", "kassensystem-retail"] as const).map((k, n) => (
              <Link
                key={k}
                href={href(lang, `service:${k}`)}
                className="group flex items-center justify-between gap-4 rounded-[20px] border border-line bg-bg p-6 transition-colors hover:border-ink/25"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-ink">
                    <Icon name={n === 0 ? "utensils" : "bag"} className="h-[22px] w-[22px]" />
                  </span>
                  <span className="font-display text-[20px] font-semibold tracking-tight">{n === 0 ? d.home.posGastro : d.home.posRetail}</span>
                </span>
                <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="border-t border-line bg-bg py-24 md:py-28">
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
      <section className="py-24 md:py-32">
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

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList } from "@/components/blocks";
import { HeroVisual } from "@/components/hero-visual";
import { ServiceArt } from "@/components/service-art";
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

const painText = {
  de: { inbox: "Posteingang", empty: "Keine neuen Anfragen", query: "elektriker grenchen", rival: "Mitbewerber", you: "Ihre Firma", page: "Seite 2" },
  fr: { inbox: "Boîte de réception", empty: "Aucune nouvelle demande", query: "électricien granges", rival: "Concurrent", you: "Votre entreprise", page: "Page 2" },
};

/** Small illustrations for the three pain points: dated site, empty inbox, competitor ahead on Google. */
function PainArt({ n, locale }: { n: number; locale: "de" | "fr" }) {
  const s = painText[locale];
  if (n === 0)
    return (
      <div aria-hidden="true" className="h-full overflow-hidden rounded-xl border border-white/10 bg-[#2a2b27] p-3 grayscale">
        <div className="flex h-4 items-center gap-1 rounded bg-[#3b3c37] px-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          <span className="col-span-4 h-2 rounded-sm bg-white/25" />
          <span className="col-span-1 h-12 rounded-sm bg-white/10" />
          <span className="col-span-3 space-y-1.5">
            <span className="block h-1.5 rounded-sm bg-white/15" />
            <span className="block h-1.5 w-4/5 rounded-sm bg-white/15" />
            <span className="block h-1.5 w-3/5 rounded-sm bg-white/15" />
          </span>
        </div>
      </div>
    );
  if (n === 1)
    return (
      <div aria-hidden="true" className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between text-[10px] text-white/45">
          <span className="flex items-center gap-1.5">
            <Icon name="inbox" className="h-3.5 w-3.5" /> {s.inbox}
          </span>
          <span className="rounded-full bg-white/10 px-1.5 font-mono">0</span>
        </div>
        <div className="grid flex-1 place-items-center text-center">
          <div>
            <Icon name="mail" className="mx-auto h-7 w-7 text-white/20" />
            <p className="mt-2 text-[11px] text-white/40">{s.empty}</p>
          </div>
        </div>
      </div>
    );
  return (
    <div aria-hidden="true" className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[9.5px] text-white/60">
        <Icon name="search" className="h-3 w-3" /> {s.query}
      </div>
      <div className="mt-2.5 space-y-2">
        {[1, 2].map((k) => (
          <div key={k} className="flex items-center gap-2">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-white/80 text-[8px] font-bold text-night">{k}</span>
            <span className="text-[10.5px] font-semibold text-white/80">{s.rival}</span>
            <span className="h-1 flex-1 rounded-full bg-white/10" />
          </div>
        ))}
        <div className="flex items-center gap-2 opacity-40">
          <span className="grid h-4 w-4 place-items-center rounded-full bg-white/20 text-[8px] font-bold">9</span>
          <span className="text-[10.5px]">{s.you}</span>
          <span className="ml-auto font-mono text-[9px]">{s.page}</span>
        </div>
      </div>
    </div>
  );
}

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
  const showcase = references.filter((r) => r.key !== "ava-catering");
  // The last word of the headline gets the hand-drawn lime underline.
  const titleWords = d.hero.title2.split(" ");
  const titleLast = titleWords.pop()!;
  const titleRest = titleWords.join(" ");

  return (
    <>
      <JsonLd data={organizationLd(lang, cities.map((c) => c.content[lang].name))} />
      <JsonLd data={faqLd(homeFaq[lang])} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="hero-dark-glow absolute inset-0 -z-10" />
        <div aria-hidden="true" className="bg-noise absolute inset-0 -z-10 opacity-50" />
        <div aria-hidden="true" className="absolute -right-40 top-10 -z-10 h-[520px] w-[520px] animate-drift rounded-full bg-accent/10 blur-[140px]" />
        <div className="container-x grid items-center gap-16 pb-24 pt-16 md:pt-28 lg:grid-cols-12 lg:pb-32">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8 animate-rise !text-white/55">{d.hero.eyebrow}</p>
            <h1 className="display animate-rise text-[clamp(3rem,7.2vw,6.4rem)] [animation-delay:100ms]">
              {d.hero.title1} {titleRest}{" "}
              <span className="relative inline-block whitespace-nowrap text-accent">
                {titleLast}
                <svg aria-hidden="true" viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-[0.16em] w-full">
                  <path d="M2 9 C 80 3, 200 3, 298 8" fill="none" stroke="#d2ff28" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="animate-draw [animation-delay:700ms]" />
                </svg>
              </span>
            </h1>
            <p className="mt-9 max-w-xl animate-rise text-[18px] leading-relaxed text-white/70 [animation-delay:250ms] md:text-[20px]">{d.hero.lead}</p>
            <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:350ms]">
              <ButtonLink href={href(lang, "request")} variant="accent">
                {d.hero.primary}
              </ButtonLink>
              <ButtonLink href={href(lang, "services")} variant="ghostLight" arrow={false}>
                {d.hero.secondary}
              </ButtonLink>
            </div>
            <ul className="mt-10 flex animate-rise flex-wrap gap-x-6 gap-y-3 text-[14px] text-white/60 [animation-delay:450ms]">
              {d.hero.points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-accent" strokeWidth={2.5} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <HeroVisual locale={lang} photo={photo("hero", lang)} />
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x flex flex-wrap items-center gap-x-10 gap-y-3 py-7">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/40">{lang === "de" ? "Projekte für" : "Projets pour"}</span>
            {showcase.map((r) => (
              <Link key={r.key} href={href(lang, `reference:${r.key}`)} className="font-display text-[20px] font-bold tracking-[-0.03em] text-white/55 transition-colors hover:text-white">
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE MARQUEE: large outline type, the motion between hero and content */}
      <div className="overflow-hidden bg-accent py-7" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-none tracking-[-0.04em]">
          {[...mainServices, ...mainServices].map((sv, n) => (
            <span key={n} className="flex items-center gap-12">
              <span className={n % 2 ? "text-night" : "text-outline-dark"}>{sv.content[lang].navLabel}</span>
              <Icon name="spark" className="h-7 w-7 text-night" />
            </span>
          ))}
        </div>
      </div>

      {/* INTRO: big statement that reveals word by word on scroll, on dark */}
      <section className="relative isolate overflow-hidden bg-night py-24 text-white md:py-36">
        <div aria-hidden="true" className="bg-noise absolute inset-0 -z-10 opacity-[0.5]" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-accent/[0.07] blur-[120px]" />
        <div className="container-x">
          <p className="eyebrow mb-8 !text-white/55">{i.eyebrow}</p>
          <h2 className="max-w-5xl font-display text-[clamp(2.2rem,5.4vw,4.6rem)] font-bold leading-[1.05] tracking-[-0.04em]">
            {i.title.split(" ").map((w, n) => (
              <span key={n} className="word-reveal">
                {w}{" "}
              </span>
            ))}
          </h2>
          <ol className="mt-16 grid gap-4 md:grid-cols-3">
            {i.items.map((it, n) => (
              <li key={n} className="reveal overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]">
                <div className="h-40 border-b border-white/10 bg-white/[0.03] p-6">
                  <PainArt n={n} locale={lang} />
                </div>
                <div className="p-7">
                  <h3 className="text-[20px] font-semibold tracking-tight">{it.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-white/60">{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="reveal mt-6 flex flex-col gap-6 rounded-[24px] bg-accent p-8 text-night sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <p className="max-w-2xl font-display text-[clamp(1.3rem,2.2vw,1.8rem)] font-bold leading-snug tracking-[-0.02em]">{i.resolve}</p>
            <ButtonLink href={href(lang, "request")} variant="dark" className="shrink-0">
              {i.cta}
            </ButtonLink>
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
          {mainServices.map((sv, n) => {
            const big = n === 0;
            // The last tile stretches so the bento grid closes without a gap.
            const wide = n === mainServices.length - 1 && mainServices.length % 4 === 0;
            return (
              <Link
                key={sv.key}
                href={href(lang, `service:${sv.key}`)}
                className={`reveal group relative flex flex-col overflow-hidden rounded-[24px] border transition-all duration-300 hover:-translate-y-1 ${
                  big
                    ? "border-night bg-night text-white sm:col-span-2 lg:row-span-2"
                    : `${wide ? "lg:col-span-2" : ""} border-line bg-surface hover:border-night hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]`
                }`}
              >
                {big && <div aria-hidden="true" className="hero-dark-glow absolute inset-0" />}
                <div className={`relative ${big ? "h-64 p-8 sm:h-80 sm:p-10" : "h-44 bg-bg p-6"}`}>
                  <div className="h-full transition-transform duration-500 group-hover:scale-[1.03]">
                    <ServiceArt k={sv.key} locale={lang} />
                  </div>
                </div>
                <div className={`relative flex flex-1 flex-col ${big ? "p-8 pt-4 sm:p-10 sm:pt-4" : "p-6"}`}>
                  <h3 className={`font-display font-bold tracking-[-0.03em] ${big ? "text-[clamp(1.8rem,3vw,2.4rem)]" : "text-[20px]"}`}>{sv.content[lang].navLabel}</h3>
                  <p className={`mt-2 leading-relaxed ${big ? "max-w-md text-[16.5px] text-white/65" : "line-clamp-3 text-[14.5px] text-muted"}`}>{sv.content[lang].lead}</p>
                  <span
                    className={`mt-auto inline-flex h-10 w-10 items-center justify-center self-end rounded-full pt-0 transition-colors ${
                      big ? "mt-6 bg-accent text-night" : "mt-5 bg-bg text-ink group-hover:bg-accent"
                    }`}
                  >
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* REFERENCES: dark showcase with real project visuals */}
      <section className="relative isolate overflow-hidden bg-night py-24 text-white md:py-32">
        <div aria-hidden="true" className="hero-dark-glow absolute inset-0 -z-10" />
        <div className="container-x">
          <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4 !text-white/55">{d.home.referencesEyebrow}</p>
              <h2 className="h-section">{d.home.referencesTitle}</h2>
              <p className="mt-5 text-[18px] leading-relaxed text-white/65">{d.home.referencesLead}</p>
            </div>
            <ButtonLink href={href(lang, "references")} variant="ghostLight">
              {d.home.referencesAll}
            </ButtonLink>
          </div>
          <div className="grid gap-4 lg:grid-cols-12">
            {showcase.map((r, n) => (
              <Link
                key={r.key}
                href={href(lang, `reference:${r.key}`)}
                className={`reveal group relative flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] transition-colors hover:border-accent/60 ${
                  n === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"
                }`}
              >
                <div className={`relative overflow-hidden ${n === 0 ? "aspect-[16/11]" : "aspect-[16/8]"}`} style={{ background: r.colors.bg }}>
                  {r.image ? (
                    <Image
                      src={r.image}
                      alt={`${r.name}, ${r.content[lang].industry}`}
                      fill
                      sizes="(min-width: 1024px) 680px, 100vw"
                      className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center transition-transform duration-[1.2s] group-hover:scale-[1.04]" style={{ color: r.colors.fg }}>
                      <span className="h-1 w-10 rounded-full" style={{ background: r.colors.accent }} />
                      <span className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-none tracking-[-0.04em]">{r.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 items-end justify-between gap-6 p-7">
                  <div>
                    <p className="flex items-center gap-2 text-[13px] text-white/50">
                      <span className="h-2 w-2 rounded-full" style={{ background: r.colors.accent }} />
                      {r.content[lang].industry}
                    </p>
                    <h3 className="mt-2 font-display text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold tracking-[-0.03em]">{r.name}</h3>
                    {n === 0 && <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-white/60">{r.content[lang].summary}</p>}
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-accent group-hover:text-night">
                    <Icon name="arrowUpRight" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4">{d.home.whyEyebrow}</p>
              <h2 className="h-section">{d.home.whyTitle}</h2>
              {photo("approach", lang) ? (
                <MoodImage img={photo("approach", lang)} quote="" by="" className="mt-10 aspect-[4/3]" />
              ) : (
                <MoodImage quote={i.quote} by={i.quoteBy} className="mt-10 min-h-[280px]" />
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {d.home.why.map((w, n) => (
              <div key={n} className="reveal group rounded-[24px] border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-night">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-night text-accent transition-transform duration-300 group-hover:rotate-[-6deg]">
                  <Icon name={(["inbox", "bolt", "search", "users"] as const)[n % 4]} className="h-5 w-5" />
                </span>
                <h3 className="mt-10 text-[20px] font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative isolate overflow-hidden bg-night py-24 text-white md:py-32">
        <div aria-hidden="true" className="hero-dark-glow absolute inset-0 -z-10" />
        <div className="container-x">
          <div className="reveal">
            <p className="eyebrow mb-4 !text-white/55">{d.home.processEyebrow}</p>
            <h2 className="h-section max-w-3xl">{d.home.processTitle}</h2>
          </div>
          <ol className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
            <span aria-hidden="true" className="absolute left-0 right-0 top-[19px] hidden h-px bg-gradient-to-r from-accent via-accent/40 to-white/10 md:block" />
            {d.home.process.map((p, n) => (
              <li key={n} className="reveal relative">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-accent font-display text-[15px] font-bold text-night ring-8 ring-night">{n + 1}</span>
                <h3 className="mt-7 text-[19px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{p.text}</p>
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
            <div className="h-48 sm:h-56">
              <ServiceArt k="kassensystem" locale={lang} />
            </div>
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList } from "@/components/blocks";
import { HeroShowcase, IndustryGallery, PainPoints, WorkWall } from "@/components/home-story";
import { ReferenceCard } from "@/components/reference-card";
import { RegionMap } from "@/components/region-map";
import { references } from "@/content/references";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { guides } from "@/content/guides";
import { services } from "@/content/services";
import { getDict } from "@/i18n/dict";
import { getRoute, href, isLocale } from "@/lib/routes";
import { JsonLd, faqLd, organizationLd, pageMetadata } from "@/lib/seo";

const homeMeta = {
  de: {
    title: "Webdesign Agentur Grenchen, Biel, Solothurn & Bern | Webnova",
    description:
      "Webnova gestaltet moderne Webseiten, Onlineshops und SEO für KMU in Grenchen, Biel, Solothurn und Bern. Persönlich, schnell, auf Anfragen optimiert. Jetzt Erstberatung sichern.",
  },
  fr: {
    title: "Agence web Bienne, Granges, Soleure & Berne | Webnova",
    description:
      "Webnova crée des sites internet modernes, boutiques en ligne et SEO pour PME à Bienne, Granges, Soleure et Berne. Personnel, rapide, orienté résultats. Premier conseil gratuit.",
  },
};

const homeFaq = {
  de: [
    { q: "Was kostet eine neue Webseite bei Webnova?", a: "Jedes Projekt ist anders, deshalb arbeiten wir nicht mit Pauschalpreisen. Nach einem kostenlosen Erstgespräch erhalten Sie eine transparente, verbindliche Offerte, abgestimmt auf Umfang, Funktionen und Ihr Budget." },
    { q: "Wie lange dauert es, bis meine Webseite online ist?", a: "Eine typische KMU-Webseite ist in wenigen Wochen online. Der genaue Zeitplan hängt vom Umfang und davon ab, wie schnell Inhalte wie Texte und Bilder bereitstehen. Den Fahrplan legen wir im Konzept gemeinsam fest." },
    { q: "Arbeiten Sie nur in der Region Grenchen, Biel, Solothurn und Bern?", a: "Unser Schwerpunkt ist die Region rund um Grenchen, Biel, Solothurn und Bern, wo wir Sie gerne vor Ort besuchen. Projekte in der ganzen Schweiz betreuen wir genauso persönlich, per Videocall und bei Bedarf vor Ort." },
    { q: "Kann ich meine Webseite später selbst bearbeiten?", a: "Ja. Auf Wunsch erhalten Sie ein einfaches Redaktionssystem und eine kurze Einführung. Alternativ übernehmen wir Anpassungen im Rahmen eines Wartungsvertrags für Sie." },
    { q: "Bieten Sie Webseiten auch zweisprachig an?", a: "Ja, Deutsch und Französisch sind bei uns Alltag. Gerade in Biel/Bienne und der Westschweiz ist eine zweisprachige Webseite oft der Schlüssel zu mehr Kundschaft." },
  ],
  fr: [
    { q: "Combien coûte un nouveau site chez Webnova ?", a: "Chaque projet est différent, c'est pourquoi nous ne travaillons pas avec des forfaits. Après un premier entretien gratuit, vous recevez un devis transparent et ferme, adapté à l'envergure, aux fonctions et à votre budget." },
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

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const mainServices = services.filter((s) => s.key !== "kassensystem-gastro" && s.key !== "kassensystem-retail");
  const core = cities.filter((c) => c.priority === "A");
  const rest = cities.filter((c) => c.priority !== "A");
  const rotating = core.map((c) => c.content[lang].name);
  const ticker = mainServices.map((s) => s.content[lang].navLabel);

  return (
    <>
      <JsonLd data={organizationLd(lang, cities.map((c) => c.content[lang].name))} />
      <JsonLd data={faqLd(homeFaq[lang])} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -left-40 top-10 -z-10 h-[520px] w-[520px] animate-drift rounded-full bg-accent/20 blur-[140px]" />
        <div aria-hidden="true" className="absolute -right-20 bottom-0 -z-10 h-[420px] w-[420px] animate-drift rounded-full bg-[#5b7cff]/15 blur-[140px] [animation-delay:-6s]" />
        <div className="container-x grid items-center gap-16 pb-28 pt-10 md:pt-16 lg:grid-cols-12 lg:pb-36">
          <div className="lg:col-span-7">
            <p className="mb-8 inline-flex animate-rise items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 text-[13px] text-white/75 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              {d.hero.eyebrow}
            </p>
            <h1 className="display animate-rise text-[clamp(3rem,7.8vw,6.8rem)] [animation-delay:100ms]">
              {d.hero.title1} <span className="text-accent">{d.hero.title2}</span>
            </h1>
            <p className="mt-6 flex animate-rise items-baseline gap-3 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-semibold tracking-tight text-white/55 [animation-delay:200ms]">
              {lang === "de" ? "Für KMU in" : "Pour les PME à"}
              <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom text-white" aria-hidden="true">
                <span className="block animate-words">
                  {[...rotating, rotating[0]].map((n, i) => (
                    <span key={i} className="block h-[1.15em] leading-[1.15em]">
                      {n}
                      <span className="text-accent">.</span>
                    </span>
                  ))}
                </span>
              </span>
              <span className="sr-only">{rotating.join(", ")}</span>
            </p>
            <p className="mt-8 max-w-xl animate-rise text-[18px] leading-relaxed text-white/70 [animation-delay:300ms] md:text-[20px]">{d.hero.lead}</p>
            <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:400ms]">
              <ButtonLink href={href(lang, "request")}>{d.hero.primary}</ButtonLink>
              <ButtonLink href={href(lang, "services")} variant="ghostLight" arrow={false}>
                {d.hero.secondary}
              </ButtonLink>
            </div>
            <ul className="mt-10 flex animate-rise flex-wrap gap-x-6 gap-y-3 text-[14px] text-white/70 [animation-delay:500ms]">
              {d.hero.points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/15 text-accent">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <HeroShowcase locale={lang} />
          </div>
        </div>
      </section>

      {/* CROSSING TICKERS */}
      <div className="relative overflow-hidden" aria-hidden="true">
        <div className="relative z-10 bg-accent py-4">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-[clamp(1.3rem,2.4vw,2rem)] font-bold tracking-tight text-night">
            {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
              <span key={i} className="flex items-center gap-8">
                {t}
                <Icon name="spark" className="h-6 w-6" strokeWidth={2.4} />
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 bg-night py-4">
          <div className="flex w-max animate-marquee-rev gap-8 whitespace-nowrap font-display text-[clamp(1.1rem,2vw,1.6rem)] font-semibold tracking-tight text-white/80">
            {[...cities, ...cities].map((c, i) => (
              <span key={i} className="flex items-center gap-8">
                {lang === "de" ? "Webdesign" : "Site internet"} {c.content[lang].name}
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <PainPoints locale={lang} />

      {/* SERVICES (bento) */}
      <section className="container-x py-24 md:py-32">
        <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">{d.home.servicesEyebrow}</p>
            <h2 className="h-section">{d.home.servicesTitle}</h2>
          </div>
          <p className="text-[18px] leading-relaxed text-ink-soft md:col-span-5">{d.home.servicesLead}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-4">
          {mainServices.map((s, i) => {
            const c = s.content[lang];
            if (i === 0) {
              return (
                <Link
                  key={s.key}
                  href={href(lang, `service:${s.key}`)}
                  className="reveal group relative isolate flex flex-col justify-between overflow-hidden rounded-[28px] bg-night p-8 text-white sm:col-span-2 lg:row-span-2"
                >
                  <div aria-hidden="true" className="absolute -bottom-24 -right-24 -z-10 h-80 w-80 rounded-full bg-accent/30 blur-[90px] transition-transform duration-700 group-hover:scale-125" />
                  <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-night">
                    <Icon name={s.icon} className="h-7 w-7" />
                  </span>
                  <div className="mt-16">
                    <h3 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.04em]">{c.navLabel}</h3>
                    <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/65">{c.lead}</p>
                    <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-semibold text-night transition-colors group-hover:bg-accent">
                      {d.common.learnMore} <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            }
            return (
              <Link
                key={s.key}
                href={href(lang, `service:${s.key}`)}
                className="reveal group relative isolate flex flex-col justify-between gap-8 overflow-hidden rounded-[28px] border border-line bg-surface p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent"
              >
                <span aria-hidden="true" className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100" />
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-night text-accent">
                    <Icon name={s.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <Icon name="arrowUpRight" className="h-5 w-5 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-night" />
                </div>
                <div>
                  <h3 className="font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">{c.navLabel}</h3>
                  <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-muted transition-colors group-hover:text-night/75">{c.lead}</p>
                </div>
              </Link>
            );
          })}
          <Link
            href={href(lang, "request")}
            className="reveal group relative isolate flex flex-col justify-between gap-8 overflow-hidden rounded-[28px] bg-accent p-7 text-night transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-night text-accent">
              <Icon name="chat" className="h-[22px] w-[22px]" />
            </span>
            <div>
              <h3 className="font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">{d.hero.primary}</h3>
              <p className="mt-2 flex items-center gap-2 text-[14.5px] font-medium text-night/70">
                {lang === "de" ? "Unverbindlich, persönlich, in Ihrer Sprache." : "Sans engagement, personnel, dans votre langue."}
                <Icon name="arrow" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        </div>
      </section>

      <IndustryGallery locale={lang} />

      {/* REFERENCES */}
      <section className="container-x pb-24 md:pb-32">
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
        <div className="grid gap-5 md:grid-cols-2">
          {references
            .filter((r) => r.image)
            .slice(0, 2)
            .map((r) => (
              <ReferenceCard key={r.key} r={r} locale={lang} large />
            ))}
        </div>
      </section>

      {/* WHY */}
      <section className="relative overflow-hidden bg-surface py-24 md:py-32">
        <div aria-hidden="true" className="bg-dots absolute inset-y-0 right-0 w-1/2 [mask-image:linear-gradient(to_left,#000,transparent)]" />
        <div className="container-x relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4">{d.home.whyEyebrow}</p>
              <h2 className="h-section">{d.home.whyTitle}</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {d.home.why.map((w, i) => (
              <div key={i} className="reveal group rounded-[24px] border border-line bg-bg/60 p-7 transition-colors duration-300 hover:border-night hover:bg-night hover:text-white">
                <p className="mb-10 font-display text-[44px] font-extrabold leading-none tracking-tighter text-night/15 transition-colors group-hover:text-accent">
                  0{i + 1}
                </p>
                <h3 className="text-[22px] font-bold tracking-tight">{w.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted transition-colors group-hover:text-white/65">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative isolate overflow-hidden bg-night py-24 text-white md:py-32">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="container-x">
          <div className="reveal">
            <p className="eyebrow mb-4 !text-white/50">{d.home.processEyebrow}</p>
            <h2 className="h-section max-w-3xl">{d.home.processTitle}</h2>
          </div>
          <ol className="relative mt-16 grid gap-4 md:grid-cols-5">
            <span aria-hidden="true" className="absolute left-0 right-0 top-[38px] hidden h-px bg-gradient-to-r from-accent via-accent/40 to-transparent md:block" />
            {d.home.process.map((p, i) => (
              <li key={i} className="reveal group relative rounded-[24px] border border-white/10 bg-night-2/80 p-6 backdrop-blur transition-colors hover:border-accent/60">
                <span className="relative mb-8 grid h-[30px] w-[30px] place-items-center rounded-full bg-accent font-display text-[14px] font-bold text-night shadow-[0_0_0_6px_rgba(210,255,40,0.15)]">
                  {i + 1}
                </span>
                <h3 className="text-[19px] font-bold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* POS */}
      <section className="container-x py-24 md:py-32">
        <div className="reveal relative isolate overflow-hidden rounded-[36px] bg-accent p-8 text-night sm:p-12 md:p-16">
          <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-60" />
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-4 !text-night/60">{d.home.posEyebrow}</p>
              <h2 className="h-section">{d.home.posTitle}</h2>
              <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-night/75">{d.home.posLead}</p>
              <div className="mt-10">
                <ButtonLink href={href(lang, "service:kassensystem")} variant="dark">
                  {d.common.learnMore}
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["kassensystem-gastro", "kassensystem-retail"] as const).map((k, i) => (
                <Link
                  key={k}
                  href={href(lang, `service:${k}`)}
                  className={`group flex min-h-[240px] flex-col justify-between rounded-[26px] bg-night p-7 text-white transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-[-1deg] ${i === 1 ? "sm:translate-y-8 sm:hover:translate-y-6" : ""}`}
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-night">
                    <Icon name={i === 0 ? "utensils" : "bag"} className="h-7 w-7" />
                  </span>
                  <div className="flex items-end justify-between gap-4">
                    <span className="font-display text-[24px] font-bold leading-tight tracking-tight">{i === 0 ? d.home.posGastro : d.home.posRetail}</span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-night">
                      <Icon name="arrowUpRight" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WorkWall locale={lang} />

      {/* REGIONS */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow mb-4">{d.home.regionsEyebrow}</p>
              <h2 className="h-section">{d.home.regionsTitle}</h2>
            </div>
            <p className="text-[18px] leading-relaxed text-ink-soft md:col-span-5">{d.home.regionsLead}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="reveal relative isolate overflow-hidden rounded-[32px] bg-night p-4 sm:p-8 lg:col-span-7">
              <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
              <RegionMap locale={lang} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {core.map((c) => (
                <Link
                  key={c.key}
                  href={href(lang, `city:${c.key}`)}
                  className="reveal group flex items-center justify-between gap-4 rounded-[22px] border border-line bg-surface px-6 py-5 transition-all duration-300 hover:border-night hover:bg-night hover:text-white"
                >
                  <div>
                    <p className="text-[13px] text-muted transition-colors group-hover:text-accent">
                      {c.minutesFromOffice === 0 ? (lang === "de" ? "Unser Standort" : "Notre siège") : `~${c.minutesFromOffice} ${d.common.minutesFromOffice}`}
                    </p>
                    <h3 className="mt-1 font-display text-[19px] font-bold leading-tight tracking-tight">{c.content[lang].h1}</h3>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg text-night transition-colors group-hover:bg-accent">
                    <Icon name="arrowUpRight" className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {rest.map((c) => (
              <Link
                key={c.key}
                href={href(lang, `city:${c.key}`)}
                className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-night hover:bg-night hover:text-white"
              >
                {lang === "de" ? "Webdesign" : "Site internet"} {c.content[lang].name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="bg-surface py-24 md:py-32">
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

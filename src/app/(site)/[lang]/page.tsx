import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { CardLink, CtaBand, FaqList } from "@/components/blocks";
import { HeroVisual } from "@/components/hero-visual";
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
  const mainServices = services.filter((s) => s.group !== "pos");
  const core = cities.filter((c) => c.priority === "A");
  const rest = cities.filter((c) => c.priority !== "A");

  return (
    <>
      <JsonLd data={organizationLd(lang, cities.map((c) => c.content[lang].name))} />
      <JsonLd data={faqLd(homeFaq[lang])} />

      {/* HERO */}
      <section className="container-x grid items-center gap-14 pb-20 pt-8 md:pt-14 lg:grid-cols-12 lg:pb-28">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-7">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            {d.hero.eyebrow}
          </p>
          <h1 className="display text-[clamp(2.9rem,7.6vw,6.6rem)]">
            {d.hero.title1} <span className="text-accent">{d.hero.title2}</span>
          </h1>
          <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ink-soft md:text-[21px]">{d.hero.lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={href(lang, "request")}>{d.hero.primary}</ButtonLink>
            <ButtonLink href={href(lang, "services")} variant="ghost" arrow={false}>
              {d.hero.secondary}
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-ink-soft">
            {d.hero.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-accent" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <HeroVisual locale={lang} />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-line bg-surface py-5" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium tracking-tight text-ink/80">
          {[...cities, ...cities].map((c, i) => (
            <span key={i} className="flex items-center gap-10">
              {lang === "de" ? "Webdesign" : "Site internet"} {c.content[lang].name}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="container-x py-24 md:py-32">
        <div className="mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">{d.home.servicesEyebrow}</p>
            <h2 className="h-section">{d.home.servicesTitle}</h2>
          </div>
          <p className="text-[18px] leading-relaxed text-ink-soft md:col-span-5">{d.home.servicesLead}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainServices.map((s) => (
            <CardLink
              key={s.key}
              href={href(lang, `service:${s.key}`)}
              icon={s.icon}
              title={s.content[lang].navLabel}
              text={s.content[lang].lead}
            />
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="bg-surface py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">{d.home.whyEyebrow}</p>
            <h2 className="h-section lg:sticky lg:top-28">{d.home.whyTitle}</h2>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
            {d.home.why.map((w, i) => (
              <div key={i} className="border-t border-ink pt-6">
                <p className="mb-6 font-mono text-[13px] text-muted">0{i + 1}</p>
                <h3 className="text-[24px] font-medium tracking-tight">{w.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-muted">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-x py-24 md:py-32">
        <p className="eyebrow mb-4">{d.home.processEyebrow}</p>
        <h2 className="h-section max-w-3xl">{d.home.processTitle}</h2>
        <ol className="mt-14 grid gap-4 md:grid-cols-5">
          {d.home.process.map((p, i) => (
            <li key={i} className="relative rounded-[24px] border border-line bg-surface p-6">
              <span className="mb-10 block text-[44px] font-medium leading-none tracking-tighter text-accent">{i + 1}</span>
              <h3 className="text-[18px] font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* POS */}
      <section className="container-x pb-24 md:pb-32">
        <div className="relative overflow-hidden rounded-[32px] bg-night p-8 text-white sm:p-12 md:p-16">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-accent/30 blur-[120px]" />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-4 !text-white/50">{d.home.posEyebrow}</p>
              <h2 className="h-section">{d.home.posTitle}</h2>
              <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-white/70">{d.home.posLead}</p>
              <div className="mt-10">
                <ButtonLink href={href(lang, "service:kassensystem")} variant="light">
                  {d.common.learnMore}
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["kassensystem-gastro", "kassensystem-retail"] as const).map((k, i) => (
                <Link
                  key={k}
                  href={href(lang, `service:${k}`)}
                  className="group flex min-h-[220px] flex-col justify-between rounded-[24px] border border-white/10 bg-white/5 p-7 transition-colors hover:bg-white hover:text-ink"
                >
                  <Icon name={i === 0 ? "utensils" : "bag"} className="h-8 w-8" />
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-[22px] font-medium tracking-tight">{i === 0 ? d.home.posGastro : d.home.posRetail}</span>
                    <Icon name="arrowUpRight" className="h-5 w-5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="bg-surface py-24 md:py-32">
        <div className="container-x">
          <div className="mb-14 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow mb-4">{d.home.regionsEyebrow}</p>
              <h2 className="h-section">{d.home.regionsTitle}</h2>
            </div>
            <p className="text-[18px] leading-relaxed text-ink-soft md:col-span-5">{d.home.regionsLead}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {core.map((c) => (
              <CardLink
                key={c.key}
                href={href(lang, `city:${c.key}`)}
                meta={`${c.minutesFromOffice === 0 ? "" : `~${c.minutesFromOffice} `}${c.minutesFromOffice === 0 ? (lang === "de" ? "Unser Standort" : "Notre siège") : d.common.minutesFromOffice}`}
                title={c.content[lang].h1}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {rest.map((c) => (
              <Link
                key={c.key}
                href={href(lang, `city:${c.key}`)}
                className="rounded-full border border-line px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                {lang === "de" ? "Webdesign" : "Site internet"} {c.content[lang].name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="container-x py-24 md:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
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
      </section>

      <FaqList locale={lang} faq={homeFaq[lang]} />
      <CtaBand locale={lang} />
    </>
  );
}

import Image from "next/image";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { HeroCtas } from "./blocks";
import { Icon } from "./icons";
import { BrowserFrame, EnquiryToast, PhoneFrame, RankCard } from "./visuals";

const t = {
  de: {
    eyebrow: "Webnova · Webagentur für Schweizer KMU",
    h1a: "Webdesign Agentur",
    h1b: "Schweiz",
    tag: "Webseiten, die gefunden werden und Anfragen bringen.",
    points: ["Schweizweit für KMU", "Deutsch & Français", "Eine feste Ansprechperson"],
    sample: "Beispiel-Designs, fiktive Marken",
  },
  fr: {
    eyebrow: "Webnova · Agence web pour les PME suisses",
    h1a: "Agence web",
    h1b: "en Suisse",
    tag: "Des sites trouvés sur Google, qui génèrent des demandes.",
    points: ["Pour les PME de toute la Suisse", "Français & Deutsch", "Un seul interlocuteur"],
    sample: "Exemples de design, marques fictives",
  },
};

/**
 * Home hero. The H1 is the LCP text and renders visible immediately; the visual is decorative
 * (fictional sample designs in device frames plus the rendered 3D Webnova mark).
 * variant "mark": dark Schieferblau stage with the 3D mark. variant "showcase": light, layered device collage.
 */
export function HomeHero({ locale, variant = "mark" }: { locale: Locale; variant?: "mark" | "showcase" }) {
  const d = getDict(locale);
  const c = t[locale];
  const dark = variant === "mark";
  return (
    <section aria-labelledby="home-h1" className={`relative isolate overflow-hidden ${dark ? "stage-night text-white" : "stage-light text-ink"}`}>
      <div className="container-x grid items-center gap-12 pb-16 pt-10 md:pb-24 md:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-14">
        <div className="lg:col-span-6">
          <p className={`${dark ? "eyebrow-light" : "eyebrow"} mb-6`}>{c.eyebrow}</p>
          <h1 id="home-h1" className="display text-[clamp(2.6rem,6vw,4.9rem)]">
            {c.h1a} <span className={dark ? "text-gradient-light" : "text-gradient"}>{c.h1b}</span>
          </h1>
          <p className={`mt-7 max-w-xl font-display text-[clamp(1.3rem,2.1vw,1.7rem)] font-medium leading-[1.3] ${dark ? "text-white/90" : "text-ink"}`}>{c.tag}</p>
          <p className={`mt-5 max-w-xl text-[16.5px] leading-relaxed md:text-[17.5px] ${dark ? "text-white/70" : "text-ink-soft"}`}>{d.hero.lead}</p>
          <HeroCtas locale={locale} dark={dark} className="mt-9" />
          <ul className={`mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px] ${dark ? "text-white/75" : "text-ink-soft"}`}>
            {c.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className={`grid h-5 w-5 place-items-center rounded-full ${dark ? "bg-white/10 text-accent-light" : "bg-bright-soft text-bright"}`}>
                  <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6" aria-hidden={false}>
          {dark ? <MarkStage locale={locale} /> : <ShowcaseStage locale={locale} />}
          <p className={`mt-4 text-right text-[12px] ${dark ? "text-white/45" : "text-muted"}`}>{c.sample}</p>
        </div>
      </div>
    </section>
  );
}

function MarkStage({ locale }: { locale: Locale }) {
  return (
    <div className="relative mx-auto aspect-[1/0.92] w-full max-w-[640px]">
      <Image
        src="/visuals/webnova-mark-3d.webp"
        alt=""
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1024px) 560px, 80vw"
        className="mask-soft absolute -right-[4%] -top-[16%] w-[92%] max-w-none select-none"
      />
      <div className="float-slow absolute bottom-[3%] left-0 w-[60%]">
        <BrowserFrame sample="treuhand" locale={locale} priority sizes="(min-width: 1024px) 500px, 78vw" />
      </div>
      <div className="float absolute bottom-0 right-[6%] w-[22%] [animation-delay:-2s]">
        <PhoneFrame sample="coiffeur" locale={locale} sizes="160px" />
      </div>
      <EnquiryToast locale={locale} className="float absolute left-[2%] top-[24%] hidden sm:flex [animation-delay:-4s]" />
    </div>
  );
}

function ShowcaseStage({ locale }: { locale: Locale }) {
  return (
    <div className="relative mx-auto aspect-[1/0.86] w-full max-w-[660px]">
      <div className="stage-accent absolute inset-[8%_2%_6%_12%] rounded-[2.5rem]" />
      <div className="absolute right-0 top-0 w-[70%] rotate-[2deg] opacity-95">
        <BrowserFrame sample="schreinerei" locale={locale} sizes="(min-width: 1024px) 460px, 70vw" />
      </div>
      <div className="float-slow absolute bottom-[14%] left-[2%] w-[74%]">
        <BrowserFrame sample="restaurant" locale={locale} priority sizes="(min-width: 1024px) 500px, 76vw" />
      </div>
      <div className="float absolute bottom-0 right-[3%] w-[23%] [animation-delay:-3s]">
        <PhoneFrame sample="coiffeur" locale={locale} sizes="160px" />
      </div>
      <RankCard locale={locale} className="float absolute -left-[4%] bottom-[0%] hidden w-[250px] sm:block [animation-delay:-5s]" />
    </div>
  );
}

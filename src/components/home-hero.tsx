import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { Icon } from "./icons";
import { BrowserFrame, EnquiryToast, PhoneFrame } from "./visuals";

const t = {
  de: {
    eyebrow: "Webdesign Agentur Schweiz",
    h1a: "Ihr Partner für professionelle",
    h1b: "Webseiten",
    points: ["Individuelles Webdesign", "Für Handy und Google gebaut", "Persönlich betreut"],
    call: "Anrufen",
  },
  fr: {
    eyebrow: "Agence web en Suisse",
    h1a: "Votre partenaire pour des",
    h1b: "sites internet professionnels",
    points: ["Webdesign sur mesure", "Pensé pour mobile et Google", "Suivi personnel"],
    call: "Appeler",
  },
};

/**
 * Home hero: light and centred. Big headline, one clear CTA, then a wide
 * Schieferblau stage with fictional sample designs and the 3D Webnova mark (decorative).
 * The H1 is the LCP text and renders visible immediately.
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const c = t[locale];
  return (
    <section aria-labelledby="home-h1" className="stage-light relative isolate overflow-hidden text-ink">
      <div className="container-x pb-16 pt-12 text-center md:pb-24 md:pt-20">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13.5px] font-medium text-accent shadow-xs ring-1 ring-line">
          <span className="h-1.5 w-1.5 rounded-full bg-bright" />
          {c.eyebrow}
        </p>
        <h1 id="home-h1" className="display mx-auto mt-7 max-w-[15ch] text-[clamp(2.5rem,6.4vw,5.4rem)]">
          {c.h1a} <span className="text-gradient">{c.h1b}</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-soft md:text-[19px]">{d.hero.lead}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={href(locale, "request")}
            className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-[15px] text-[16px] font-semibold text-white shadow-[0_16px_32px_-14px_rgb(36_64_90/0.7)] transition-colors hover:bg-night"
          >
            {d.nav.cta}
            <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-[15px] text-[16px] font-semibold text-ink shadow-xs ring-1 ring-line transition-colors hover:text-accent"
          >
            <Icon name="phone" className="h-4 w-4" />
            {c.call}
          </a>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14.5px] text-ink-soft">
          {c.points.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-bright-soft text-bright">
                <Icon name="check" className="h-3 w-3" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>

        <HeroStage locale={locale} />
      </div>
    </section>
  );
}

function HeroStage({ locale }: { locale: Locale }) {
  return (
    <div className="relative mx-auto mt-14 max-w-[1120px] md:mt-20">
      {/* Schieferblau panel that the devices stand on. */}
      <div aria-hidden="true" className="stage-accent absolute inset-x-0 bottom-0 top-[22%] rounded-[2rem] md:rounded-[2.5rem]" />
      <div className="relative px-[4%] pb-[5%] md:px-[11%]">
        <BrowserFrame sample="hero" locale={locale} priority sizes="(min-width: 1024px) 860px, 92vw" />
      </div>
      <Image
        src="/visuals/webnova-mark-3d.webp"
        alt=""
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1024px) 360px, 30vw"
        className="float-slow pointer-events-none absolute -right-[9%] -top-[24%] hidden w-[36%] max-w-none select-none drop-shadow-[0_30px_40px_rgb(27_45_62/0.25)] md:block"
      />
      <div className="float-slow absolute bottom-[-6%] right-[3%] w-[25%] md:w-[16%]">
        <PhoneFrame sample="hero" locale={locale} sizes="190px" />
      </div>
      <EnquiryToast locale={locale} className="float absolute left-[1%] top-[16%] hidden text-left lg:flex [animation-delay:-4s]" />
    </div>
  );
}

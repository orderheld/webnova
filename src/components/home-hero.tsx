import { getImageProps } from "next/image";
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
 * Home hero (nordpixel look): a misty Alpine backdrop rendered by us (public/visuals/hero-berge*.webp,
 * no stock photo), the giant letter-spaced WEBNOVA wordmark, then the H1, one clear CTA and the phone.
 * The section runs up under the floating header bar and ends in a white curve; the sample devices
 * below rise over that curve. The H1 renders visible immediately (no fade-in).
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const c = t[locale];
  return (
    <>
      <section aria-labelledby="home-h1" className="under-header curve-bottom relative isolate overflow-hidden bg-night text-white">
        <HeroBackdrop />
        {/* Darker at the top for the bar, in the middle behind the text and towards the curve. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_58%,rgb(15_26_38/0.55),transparent_75%),linear-gradient(180deg,rgb(15_26_38/0.55)_0%,rgb(15_26_38/0)_28%,rgb(15_26_38/0)_62%,rgb(27_45_62/0.75)_100%)]"
        />
        <div className="container-x flex min-h-[min(100svh,1000px)] flex-col items-center justify-center pb-40 pt-10 text-center sm:pb-48 md:pb-[clamp(13rem,20vw,17rem)]">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13.5px] font-medium text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light" />
            {c.eyebrow}
          </p>
          <p aria-hidden="true" className="wordmark mt-7 select-none whitespace-nowrap pl-[0.13em] text-[clamp(2.9rem,12.4vw,10.5rem)] drop-shadow-[0_18px_40px_rgb(10_18_28/0.45)] md:mt-9">
            Webnova<span className="ml-[0.06em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-[#8fb0cf] align-baseline shadow-[0_0_0.35em_rgb(143_176_207/0.8)]" />
          </p>
          <h1 id="home-h1" className="display mx-auto mt-6 max-w-[24ch] text-balance text-[clamp(1.55rem,3.3vw,2.75rem)] md:mt-8">
            {c.h1a} <span className="text-gradient-light">{c.h1b}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[16.5px] leading-relaxed text-white/80 md:text-[18px]">{d.hero.lead}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={href(locale, "request")}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-[15px] text-[16px] font-semibold text-accent shadow-[0_16px_32px_-14px_rgb(0_0_0/0.5)] transition-colors hover:bg-bright-soft"
            >
              {d.nav.cta}
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-[15px] text-[16px] font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <Icon name="phone" className="h-4 w-4" />
              {c.call}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14.5px] text-white/80">
            {c.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-white">
                  <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <HeroStage locale={locale} />
    </>
  );
}

/** Art-directed backdrop: the wide render on tablets and computers, the tall one on phones. */
function HeroBackdrop() {
  const common = { alt: "", sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/visuals/hero-berge.webp", width: 2560, height: 1440 });
  const {
    props: { srcSet: tall, ...rest },
  } = getImageProps({ ...common, src: "/visuals/hero-berge-hoch.webp", width: 1080, height: 1920 });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={wide} />
      <source srcSet={tall} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- art direction needs a plain img in <picture>; alt="" comes in rest */}
      <img {...rest} loading="eager" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_40%]" />
    </picture>
  );
}

/** The sample site in browser and phone, rising over the hero's curve. */
function HeroStage({ locale }: { locale: Locale }) {
  return (
    <div className="container-x relative z-10 -mt-[clamp(7.5rem,17vw,15rem)] pb-4 md:pb-8">
      <div className="relative mx-auto max-w-[1120px]">
        <div className="relative px-[4%] pb-[5%] md:px-[11%]">
          <BrowserFrame sample="hero" locale={locale} sizes="(min-width: 1024px) 860px, 92vw" />
        </div>
        <div className="float-slow absolute bottom-[-6%] right-[3%] w-[25%] md:w-[16%]">
          <PhoneFrame sample="hero" locale={locale} sizes="190px" />
        </div>
        <EnquiryToast locale={locale} className="float absolute left-[1%] top-[16%] hidden text-left lg:flex [animation-delay:-4s]" />
      </div>
    </div>
  );
}

import { DesignTrack } from "./design-track";
import { sampleAlt, sampleSrc } from "./visuals";
import { industries } from "@/content/industries";
import { industryChip, industrySample } from "@/content/industries/samples";
import type { Locale } from "@/content/types";
import { hasRoute, href } from "@/lib/routes";

const tx = {
  de: {
    eyebrow: "Design-Beispiele",
    title: "Design, das zu Ihrem Betrieb passt.",
    lead: "Für jede Branche ein eigenes Beispiel, so wie es auf dem Handy aussieht. Gestaltet von Webnova für fiktive Marken.",
    prev: "Vorherige Beispiele",
    next: "Weitere Beispiele",
  },
  fr: {
    eyebrow: "Exemples de design",
    title: "Un design qui correspond à votre entreprise.",
    lead: "Un exemple propre à chaque secteur, tel qu'il apparaît sur mobile. Conçus par Webnova pour des marques fictives.",
    prev: "Exemples précédents",
    next: "Autres exemples",
  },
};

/**
 * Section with the sample design of every industry as tall phone-screen cards (nordpixel "Projekte" look),
 * each linking to its industry page. Our own fictional brands only, never client work.
 */
export function DesignCards({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = tx[locale];
  const cards = industries
    .filter((i) => industrySample[i.key] && hasRoute(`industry:${i.key}`))
    .map((i) => {
      const key = industrySample[i.key];
      return {
        href: href(locale, `industry:${i.key}`),
        label: industryChip[i.key]?.[locale] ?? i.content[locale].navLabel,
        src: sampleSrc(key, locale, true),
        alt: sampleAlt(key, locale),
      };
    });
  return (
    <section aria-labelledby="design-cards-title" className={`relative isolate overflow-hidden ${className}`}>
      <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      <div className="container-x text-center">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.32em] text-bright">{t.eyebrow}</p>
        <h2 id="design-cards-title" className="mx-auto mt-5 max-w-[18ch] text-balance font-display text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.025em]">
          {t.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft md:text-[18px]">{t.lead}</p>
      </div>
      <div className="mt-12 md:mt-16">
        <DesignTrack cards={cards} prevLabel={t.prev} nextLabel={t.next} />
      </div>
    </section>
  );
}

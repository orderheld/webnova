import Link from "next/link";
import { ButtonLink } from "./button";
import { Icon } from "./icons";
import { SectorTabs } from "./sector-tabs";
import { Art } from "./service-art";
import { samples } from "./visuals";
import { industries } from "@/content/industries";
import { industryChip, industrySample } from "@/content/industries/samples";
import type { Industry, Locale } from "@/content/types";
import { href } from "@/lib/routes";

const tx = {
  de: {
    tabs: "Branche wählen",
    example: "Beispiel",
    request: "Ähnliche Webseite anfragen",
    more: "Zur Branchenseite",
    note: "Fiktive Marke, gestaltet von Webnova. Das Video zeigt die ganze Seite auf dem Computer und auf dem Handy.",
  },
  fr: {
    tabs: "Choisir un secteur",
    example: "Exemple",
    request: "Demander un site similaire",
    more: "Voir la page du secteur",
    note: "Marque fictive, conçue par Webnova. La vidéo montre toute la page sur ordinateur et sur mobile.",
  },
};

/**
 * Sector preview: one chip per industry, and for the chosen one its sample design as scroll videos
 * (desktop and phone) next to what such a website does. `keys` limits and orders the industries,
 * e.g. so the home page leaves out the samples it already shows elsewhere.
 */
export function SectorShowcase({ locale, keys }: { locale: Locale; keys?: string[] }) {
  const t = tx[locale];
  const list = (keys ? keys.map((k) => industries.find((i) => i.key === k)) : industries).filter((i): i is Industry => !!i && !!industrySample[i.key]);

  const panels = list.map((ind) => {
    const c = ind.content[locale];
    const sample = industrySample[ind.key];
    const n = samples[sample].name;
    return (
      <div key={ind.key} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <Art kind="website" sample={sample} locale={locale} video className="aspect-[5/4] lg:col-span-7" />
        <div className="lg:col-span-5">
          <p className="eyebrow">
            {t.example}
            {locale === "fr" ? " : " : ": "}
            {typeof n === "string" ? n : n[locale]}
          </p>
          <h3 className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.015em]">{c.h1}</h3>
          <ul className="mt-6 space-y-3">
            {c.promises.map((p) => (
              <li key={p} className="flex gap-3 text-[15.5px] leading-snug text-ink-soft">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href={href(locale, "request")}>{t.request}</ButtonLink>
            <Link href={href(locale, `industry:${ind.key}`)} className="link-arrow">
              {t.more}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-muted">{t.note}</p>
        </div>
      </div>
    );
  });

  return <SectorTabs label={t.tabs} tabs={list.map((i) => industryChip[i.key][locale])} panels={panels} />;
}

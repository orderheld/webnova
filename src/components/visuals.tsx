import Image from "next/image";
import type { Locale } from "@/content/types";

/**
 * Webnova's own visuals: device frames with the fictional sample designs from /public/visuals
 * (rendered from our own HTML, never client work), and small UI cards. Server components, CSS only.
 */

export type SampleKey =
  | "hero"
  | "coiffeur"
  | "restaurant"
  | "schreinerei"
  | "treuhand"
  | "fitness"
  | "cafe"
  | "praxis"
  | "immobilien"
  | "garage"
  | "laden"
  | "alt-restaurant"
  | "alt-schreinerei";

/**
 * One sample per industry, so no page shows a design from another branch. The "alt-" keys are the
 * same fictional brands with a deliberately outdated website (the "Vorher" of a redesign); they have
 * no mobile rendering.
 */
export const samples: Record<SampleKey, { name: string | Record<Locale, string>; url: string | Record<Locale, string>; industry: Record<Locale, string> }> = {
  hero: { name: "Ihre Firma", url: { de: "ihre-webseite.ch", fr: "votre-site.ch" }, industry: { de: "Unternehmen", fr: "Entreprise" } },
  coiffeur: { name: "Salon Mirelle", url: "salon-mirelle.ch", industry: { de: "Coiffeur", fr: "Coiffeur" } },
  restaurant: { name: "Trattoria Velluto", url: "trattoria-velluto.ch", industry: { de: "Restaurant", fr: "Restaurant" } },
  schreinerei: { name: "Kernholz", url: "kernholz-schreinerei.ch", industry: { de: "Schreinerei", fr: "Menuiserie" } },
  treuhand: { name: "Aurel Treuhand", url: "aurel-treuhand.ch", industry: { de: "Treuhand", fr: "Fiduciaire" } },
  fitness: { name: "Studio Robur", url: "studio-robur.ch", industry: { de: "Fitnessstudio", fr: "Studio de fitness" } },
  cafe: { name: "Mahlgut", url: "mahlgut.ch", industry: { de: "Bäckerei & Café", fr: "Boulangerie & café" } },
  praxis: { name: "Physio Salvia", url: "physio-salvia.ch", industry: { de: "Physiotherapie", fr: "Physiothérapie" } },
  immobilien: { name: { de: "Jolimont Immobilien", fr: "Jolimont Immobilier" }, url: "jolimont-immo.ch", industry: { de: "Immobilien", fr: "Immobilier" } },
  garage: { name: { de: "Garage Felsenegg", fr: "Garage de la Dôle" }, url: { de: "garage-felsenegg.ch", fr: "garage-de-la-dole.ch" }, industry: { de: "Autogarage", fr: "Garage automobile" } },
  laden: { name: "Atelier Halm", url: "atelier-halm.ch", industry: { de: "Laden & Onlineshop", fr: "Boutique & e-shop" } },
  // Same brand and address bar as the new design, so the pair reads as one company before and after.
  "alt-restaurant": { name: "Trattoria Velluto", url: "trattoria-velluto.ch", industry: { de: "Restaurant, alte Webseite", fr: "Restaurant, ancien site" } },
  "alt-schreinerei": { name: "Kernholz", url: "kernholz-schreinerei.ch", industry: { de: "Schreinerei, alte Webseite", fr: "Menuiserie, ancien site" } },
};

const exampleLabel: Record<Locale, string> = { de: "Beispiel-Design", fr: "Exemple de design" };

/** Address shown in the browser bar, per language. */
export function sampleUrl(key: SampleKey, locale: Locale) {
  const u = samples[key].url;
  return typeof u === "string" ? u : u[locale];
}

/** Image path of a sample design; French pages get the French rendering. */
export function sampleSrc(key: SampleKey, locale: Locale, mobile = false) {
  return `/visuals/site-${key}${mobile ? "-mobile" : ""}${locale === "fr" ? "-fr" : ""}.webp`;
}

export function sampleAlt(key: SampleKey, locale: Locale) {
  const n = samples[key].name;
  return `${exampleLabel[locale]}: ${samples[key].industry[locale]} (${typeof n === "string" ? n : n[locale]}, ${locale === "de" ? "fiktive Marke" : "marque fictive"})`;
}

/** Desktop browser window with a sample design inside. */
export function BrowserFrame({
  sample,
  locale,
  className = "",
  sizes = "(min-width: 1024px) 640px, 92vw",
  priority = false,
  dark = false,
}: {
  sample: SampleKey;
  locale: Locale;
  className?: string;
  sizes?: string;
  priority?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-[0_40px_80px_-30px_rgb(10_22_34/0.55),0_0_0_1px_rgb(27_45_62/0.08)] ${dark ? "bg-night-2" : "bg-white"} ${className}`}>
      <div className={`flex h-7 items-center gap-1.5 px-3 sm:h-8 ${dark ? "bg-night-2" : "bg-[#eef2f6]"}`}>
        <span className="h-2 w-2 rounded-full bg-[#c9d3dd]" />
        <span className="h-2 w-2 rounded-full bg-[#c9d3dd]" />
        <span className="h-2 w-2 rounded-full bg-[#c9d3dd]" />
        <span className={`mx-auto truncate rounded-md px-3 py-0.5 text-[10px] sm:text-[11px] ${dark ? "bg-white/10 text-white/60" : "bg-white text-muted"}`}>{sampleUrl(sample, locale)}</span>
        <span className="w-6" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={sampleSrc(sample, locale)} alt={sampleAlt(sample, locale)} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}

/** Phone with the mobile version of a sample design: a modern smartphone with thin bezels, side keys and an island. */
export function PhoneFrame({ sample, locale, className = "", sizes = "220px", priority = false }: { sample: SampleKey; locale: Locale; className?: string; sizes?: string; priority?: boolean }) {
  return (
    <div className={`relative ${className}`}>
      {/* side keys */}
      <span aria-hidden="true" className="absolute -left-[1.6%] top-[17%] h-[5%] w-[1.8%] rounded-l-sm bg-[#2a3540]" />
      <span aria-hidden="true" className="absolute -left-[1.6%] top-[25%] h-[9%] w-[1.8%] rounded-l-sm bg-[#2a3540]" />
      <span aria-hidden="true" className="absolute -left-[1.6%] top-[36%] h-[9%] w-[1.8%] rounded-l-sm bg-[#2a3540]" />
      <span aria-hidden="true" className="absolute -right-[1.6%] top-[28%] h-[13%] w-[1.8%] rounded-r-sm bg-[#2a3540]" />
      <div className="relative rounded-[17%/8%] bg-[linear-gradient(145deg,#3a4652,#11181f_45%,#2a3540)] p-[3.2%] shadow-[0_40px_70px_-25px_rgb(10_22_34/0.6),inset_0_0_0_1px_rgb(255_255_255/0.12)]">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[14%/6.6%] bg-black">
          <Image src={sampleSrc(sample, locale, true)} alt={sampleAlt(sample, locale)} fill sizes={sizes} priority={priority} className="object-cover object-top" />
          <span aria-hidden="true" className="absolute left-1/2 top-[1.6%] h-[3.4%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

const toast = {
  de: { title: "Neue Anfrage", sub: "über Ihre Webseite · gerade eben" },
  fr: { title: "Nouvelle demande", sub: "via votre site · à l'instant" },
};

/** Small notification card: the moment a website brings an enquiry. */
export function EnquiryToast({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = toast[locale];
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 rounded-2xl bg-white/95 py-3 pl-3 pr-5 text-ink shadow-[0_24px_48px_-20px_rgb(10_22_34/0.55)] ring-1 ring-black/5 ${className}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-[14px] font-semibold">{t.title}</span>
        <span className="block text-[12px] text-muted">{t.sub}</span>
      </span>
    </div>
  );
}

const rank = {
  de: { q: "coiffeur in meiner nähe", pos: "ihre-firma.ch", sub: "gefunden, wenn Kunden suchen" },
  fr: { q: "coiffeur près de moi", pos: "votre-entreprise.ch", sub: "trouvé quand on vous cherche" },
};

/** Small search ranking card. */
export function RankCard({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = rank[locale];
  return (
    <div aria-hidden="true" className={`rounded-2xl bg-white/95 p-3.5 text-ink shadow-[0_24px_48px_-20px_rgb(10_22_34/0.55)] ring-1 ring-black/5 ${className}`}>
      <div className="flex items-center gap-2 rounded-full bg-bg-2 px-3 py-1.5 text-[11.5px] text-muted">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.5-4.5" />
        </svg>
        {t.q}
      </div>
      <div className="mt-2.5 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg></span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold">{t.pos}</span>
          <span className="block text-[11.5px] text-muted">{t.sub}</span>
        </span>
      </div>
    </div>
  );
}

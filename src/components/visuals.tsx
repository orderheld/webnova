import Image from "next/image";
import type { Locale } from "@/content/types";

/**
 * Webnova's own visuals: device frames with the fictional sample designs from /public/visuals
 * (rendered from our own HTML, never client work), and small UI cards. Server components, CSS only.
 */

export type SampleKey = "coiffeur" | "restaurant" | "schreinerei" | "treuhand";

export const samples: Record<SampleKey, { name: string; url: string; industry: Record<Locale, string> }> = {
  coiffeur: { name: "Salon Mirelle", url: "salon-mirelle.ch", industry: { de: "Coiffeur", fr: "Coiffeur" } },
  restaurant: { name: "Trattoria Velluto", url: "trattoria-velluto.ch", industry: { de: "Restaurant", fr: "Restaurant" } },
  schreinerei: { name: "Kernholz", url: "kernholz-schreinerei.ch", industry: { de: "Schreinerei", fr: "Menuiserie" } },
  treuhand: { name: "Aurel Treuhand", url: "aurel-treuhand.ch", industry: { de: "Treuhand", fr: "Fiduciaire" } },
};

const exampleLabel: Record<Locale, string> = { de: "Beispiel-Design", fr: "Exemple de design" };

export function sampleAlt(key: SampleKey, locale: Locale) {
  return `${exampleLabel[locale]}: ${samples[key].industry[locale]} (${samples[key].name}, ${locale === "de" ? "fiktive Marke" : "marque fictive"})`;
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
        <span className={`mx-auto truncate rounded-md px-3 py-0.5 text-[10px] sm:text-[11px] ${dark ? "bg-white/10 text-white/60" : "bg-white text-muted"}`}>{samples[sample].url}</span>
        <span className="w-6" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={`/visuals/site-${sample}.webp`} alt={sampleAlt(sample, locale)} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}

/** Phone with the mobile version of a sample design. */
export function PhoneFrame({ sample, locale, className = "", sizes = "220px", priority = false }: { sample: SampleKey; locale: Locale; className?: string; sizes?: string; priority?: boolean }) {
  return (
    <div className={`rounded-[2rem] bg-[#0f1b27] p-[5px] shadow-[0_40px_70px_-25px_rgb(10_22_34/0.6),inset_0_0_0_1px_rgb(255_255_255/0.08)] ${className}`}>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.7rem] bg-white">
        <Image src={`/visuals/site-${sample}-mobile.webp`} alt={sampleAlt(sample, locale)} fill sizes={sizes} priority={priority} className="object-cover object-top" />
        <span className="absolute left-1/2 top-1.5 h-[14px] w-[34%] -translate-x-1/2 rounded-full bg-[#0f1b27]" />
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
    <div aria-hidden="true" className={`flex items-center gap-3 rounded-2xl bg-white/95 py-3 pl-3 pr-5 text-ink shadow-[0_24px_48px_-20px_rgb(10_22_34/0.55)] ring-1 ring-black/5 backdrop-blur ${className}`}>
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

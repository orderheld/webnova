import type { Locale } from "@/content/types";

const words: Record<Locale, string[]> = {
  de: ["Webdesign", "SEO", "Hosting", "Onlineshop", "Google-Profil", "Wartung", "Branding", "Redesign"],
  fr: ["Webdesign", "SEO", "Hébergement", "E-shop", "Fiche Google", "Maintenance", "Branding", "Refonte"],
};

/**
 * Big band of service words drifting sideways (nordpixel look): outlined in Schieferblau, every third one solid.
 * Decorative only (aria-hidden); it moves by itself and is never swiped. Reduced motion stops it (global rule).
 */
export function WordBand({ locale, className = "" }: { locale: Locale; className?: string }) {
  const list = words[locale];
  const row = (copy: number) => (
    <span className="flex shrink-0 items-center gap-[0.45em] pr-[0.45em]" aria-hidden={copy > 0 ? true : undefined}>
      {list.map((w, i) => (
        <span key={`${copy}-${w}`} className={i % 3 === 1 ? "text-accent" : "text-outline"}>
          {w}
        </span>
      ))}
    </span>
  );
  return (
    <div aria-hidden="true" className={`select-none overflow-hidden ${className}`}>
      <div className="flex w-max animate-[marquee_60s_linear_infinite] whitespace-nowrap font-display text-[clamp(3.2rem,8.5vw,7.5rem)] font-bold uppercase leading-none tracking-[-0.01em]">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}

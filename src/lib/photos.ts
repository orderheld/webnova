import type { Locale } from "@/content/types";

export interface Photo {
  src: string;
  alt: Record<Locale, string>;
}

/**
 * Real photos for the site, one per slot. A slot without a photo renders its calm fallback
 * (a line drawing or a monogram, never a stock or made-up image), so photos can be added here
 * (files in /public/photos) without touching the layouts.
 *
 * Slots:
 * - cover:    wide image on the home cover (default: composed Swiss skyline drawing)
 * - founder:  portrait of Ferhat Demir (home "Über uns", contact sections; default: FD monogram)
 * - office:   the office or a work situation (home "Über uns"; default: Grenchen skyline)
 * - hero, intro, approach, pos: older slots, kept for compatibility
 */
export const photos: Partial<Record<"cover" | "founder" | "office" | "hero" | "intro" | "approach" | "pos", Photo>> = {
  founder: {
    src: "/photos/ferhat-demir.webp",
    alt: { de: "Ferhat Demir, Ihr Ansprechpartner bei Webnova", fr: "Ferhat Demir, votre interlocuteur chez Webnova" },
  },
};

export function photo(slot: keyof typeof photos, locale: Locale) {
  const p = photos[slot];
  return p ? { src: p.src, alt: p.alt[locale] } : undefined;
}

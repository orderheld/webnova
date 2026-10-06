import type { Locale } from "@/content/types";

export interface Photo {
  src: string;
  alt: Record<Locale, string>;
}

/**
 * Mood photos for the site, one per slot. A slot without a photo renders its calm fallback,
 * so new photos can be added here (files in /public/photos) without touching the layouts.
 */
export const photos: Partial<Record<"hero" | "intro" | "approach" | "pos", Photo>> = {};

export function photo(slot: keyof typeof photos, locale: Locale) {
  const p = photos[slot];
  return p ? { src: p.src, alt: p.alt[locale] } : undefined;
}

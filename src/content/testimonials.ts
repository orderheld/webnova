import type { Locale } from "./types";

// Real client quotes only, copied word for word from Google reviews with the client's permission.
// Shown on the matching city pages (e.g. webdesign-biel) in the matching language.
export type Testimonial = {
  city: string; // city key from src/content/cities
  locale: Locale;
  quote: string;
  name: string;
  company?: string;
};

export const testimonials: Testimonial[] = [];

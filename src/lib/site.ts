/**
 * Canonical origin for canonicals, hreflang, sitemap and JSON-LD. The production deployment on
 * Vercel always uses https://webnova.ch, so a stray NEXT_PUBLIC_SITE_URL (for example a localhost
 * value copied from .env.local) can never leak into what Google sees. Previews and local builds
 * may override it with NEXT_PUBLIC_SITE_URL.
 */
const PRODUCTION_URL = "https://webnova.ch";
const siteUrl = (
  process.env.VERCEL_ENV === "production" ? PRODUCTION_URL : (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL)
).replace(/\/+$/, "");

export const site = {
  name: "Webnova",
  legalName: "webnova solutions F. Demir",
  url: siteUrl,
  email: "kontakt@webnova.ch",
  phone: "+41 32 543 80 96",
  phoneHref: "tel:+41325438096",
  whatsappHref: "https://wa.me/41325438096",
  address: {
    street: "Bettlachstrasse 45",
    zip: "2540",
    city: "Grenchen",
    canton: "SO",
    country: "CH",
  },
  geo: { lat: 47.1925, lng: 7.3878 },
  social: {
    instagram: "https://www.instagram.com/webnova.ch/",
    facebook: "https://www.facebook.com/webnova.ch",
    linkedin: "https://www.linkedin.com/company/webnova-ch",
  },
  // Google Business Profile and directory links. Empty until Ferhat sends them;
  // anything empty is simply not rendered (no placeholder text on the site).
  google: {
    maps: "", // "In Google Maps öffnen" link of the business profile (maps.app.goo.gl/... or ?cid=...)
    review: "", // review short link from the profile (g.page/r/.../review)
  },
  directories: [] as string[], // local.ch entry, Apple Maps link, ...
  // Office hours as in the Google Business Profile (Ferhat, 2026-10-08). Sunday closed.
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
    { days: ["Saturday"], opens: "10:00", closes: "16:00" },
  ] as { days: Weekday[]; opens: string; closes: string }[],
};

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

// References are shown again (Ferhat, 2026-10-08): GYAN, Dersut, AVA Catering and orderheld.
// Set to false to hide the pages, links and home showcase in one go.
export const showReferences: boolean = true;

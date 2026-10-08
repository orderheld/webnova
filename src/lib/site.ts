export const site = {
  name: "Webnova",
  legalName: "webnova solutions F. Demir",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://webnova.ch",
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
  // Same office hours as in the Google profile, e.g.
  // { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }
  openingHours: [] as { days: Weekday[]; opens: string; closes: string }[],
};

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

// References are hidden for now (Ferhat, 2026-10-06). Set to true to bring back the pages, links and home showcase.
export const showReferences: boolean = true;

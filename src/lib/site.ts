export const site = {
  name: "Webnova",
  legalName: "Webnova",
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
} as const;

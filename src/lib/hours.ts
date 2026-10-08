import type { Locale } from "@/content/types";
import { site, type Weekday } from "./site";

const dayShort: Record<Locale, Record<Weekday, string>> = {
  de: { Monday: "Mo", Tuesday: "Di", Wednesday: "Mi", Thursday: "Do", Friday: "Fr", Saturday: "Sa", Sunday: "So" },
  fr: { Monday: "lu", Tuesday: "ma", Wednesday: "me", Thursday: "je", Friday: "ve", Saturday: "sa", Sunday: "di" },
};

/** Opening hours from site.ts as short lines, e.g. "Mo bis Fr 08:00 bis 18:00". */
export function hoursLines(locale: Locale): string[] {
  const t = dayShort[locale];
  const to = locale === "de" ? "bis" : "au";
  return site.openingHours.map((h) => {
    const days = h.days.length > 2 ? `${t[h.days[0]]} ${to} ${t[h.days[h.days.length - 1]]}` : h.days.map((x) => t[x]).join(", ");
    return locale === "de" ? `${days} ${h.opens} bis ${h.closes}` : `${days}, ${h.opens} à ${h.closes}`;
  });
}

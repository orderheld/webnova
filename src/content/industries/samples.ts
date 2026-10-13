import type { SampleKey } from "@/components/visuals";
import type { Localized } from "../types";

/** Every industry has its own fictional sample design (Ferhat, 2026-10-08: never e.g. a coiffeur on Fitness). */
export const industrySample: Record<string, SampleKey> = {
  "coiffeur-beauty": "coiffeur",
  fitness: "fitness",
  gastronomie: "restaurant",
  "cafe-baeckerei": "cafe",
  handwerk: "schreinerei",
  autogewerbe: "garage",
  immobilien: "immobilien",
  treuhand: "treuhand",
  praxis: "praxis",
  detailhandel: "laden",
};

/** Short industry names for the chips of the sector preview (the nav labels are too long for a row of chips on a phone). */
export const industryChip: Record<string, Localized<string>> = {
  gastronomie: { de: "Restaurant", fr: "Restaurant" },
  "cafe-baeckerei": { de: "Café & Bäckerei", fr: "Café & boulangerie" },
  "coiffeur-beauty": { de: "Coiffeur & Beauty", fr: "Coiffure & beauté" },
  handwerk: { de: "Handwerk", fr: "Artisanat" },
  praxis: { de: "Praxis", fr: "Cabinet" },
  treuhand: { de: "Treuhand", fr: "Fiduciaire" },
  detailhandel: { de: "Laden & Shop", fr: "Boutique" },
  fitness: { de: "Fitness", fr: "Fitness" },
  immobilien: { de: "Immobilien", fr: "Immobilier" },
  autogewerbe: { de: "Garage", fr: "Garage" },
};

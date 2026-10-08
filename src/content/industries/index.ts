import type { Industry } from "../types";
import { gastronomie } from "./gastronomie";
import { cafeBaeckerei } from "./cafe-baeckerei";
import { coiffeurBeauty } from "./coiffeur-beauty";
import { handwerk } from "./handwerk";
import { praxis } from "./praxis";
import { treuhand } from "./treuhand";
import { detailhandel } from "./detailhandel";
import { fitness } from "./fitness";
import { immobilien } from "./immobilien";
import { autogewerbe } from "./autogewerbe";

export const industries: Industry[] = [
  gastronomie,
  cafeBaeckerei,
  coiffeurBeauty,
  handwerk,
  praxis,
  treuhand,
  detailhandel,
  fitness,
  immobilien,
  autogewerbe,
];

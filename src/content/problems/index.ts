import type { Problem } from "../types";
import { keineAnfragen } from "./keine-anfragen";
import { nichtGefunden } from "./nicht-gefunden";
import { veraltet } from "./veraltet";
import { zuLangsam } from "./zu-langsam";
import { keineZeit } from "./keine-zeit";
import { onlineVerkaufen } from "./online-verkaufen";

export const problems: Problem[] = [keineAnfragen, nichtGefunden, veraltet, zuLangsam, keineZeit, onlineVerkaufen];

import type { Guide } from "../types";
import { webseiteKosten } from "./webseite-kosten";
import { websiteRelaunchCheckliste } from "./website-relaunch-checkliste";
import { lokalesSeoKmu } from "./lokales-seo-kmu";
import { webagenturWaehlen } from "./webagentur-waehlen";
import { googleUnternehmensprofil } from "./google-unternehmensprofil";
import { zweisprachigeWebseite } from "./zweisprachige-webseite";
import { kmuWebseiteCheckliste } from "./kmu-webseite-checkliste";
import { onlineshopSchweiz } from "./onlineshop-schweiz";
import { coreWebVitals } from "./core-web-vitals";
import { webagenturUnterschied } from "./webagentur-unterschied";
import { geoKiSuche } from "./geo-ki-suche";
import { barrierefreieWebsite } from "./barrierefreie-website";

/** Sorted newest first (by first publication). */
export const guides: Guide[] = [
  geoKiSuche,
  barrierefreieWebsite,
  webagenturUnterschied,
  webagenturWaehlen,
  googleUnternehmensprofil,
  zweisprachigeWebseite,
  kmuWebseiteCheckliste,
  onlineshopSchweiz,
  coreWebVitals,
  webseiteKosten,
  websiteRelaunchCheckliste,
  lokalesSeoKmu,
];

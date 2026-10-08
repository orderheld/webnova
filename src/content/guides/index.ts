import type { Guide } from "../types";
import { webseiteErstellenAblauf } from "./webseite-erstellen-ablauf";
import { webseiteErneuern } from "./webseite-erneuern";
import { websiteWartungCheckliste } from "./website-wartung-checkliste";
import { baukastenOderAgentur } from "./baukasten-oder-agentur";
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
  // 2026-10-09: the three website topics of the home page (new, renew, maintain), then builder vs agency.
  webseiteErstellenAblauf,
  webseiteErneuern,
  websiteWartungCheckliste,
  baukastenOderAgentur,
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

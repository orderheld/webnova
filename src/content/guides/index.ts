import type { Guide } from "../types";
import { webseiteKosten } from "./webseite-kosten";
import { websiteRelaunchCheckliste } from "./website-relaunch-checkliste";
import { lokalesSeoKmu } from "./lokales-seo-kmu";

/** Sorted newest first. */
export const guides: Guide[] = [webseiteKosten, websiteRelaunchCheckliste, lokalesSeoKmu];

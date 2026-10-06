import type { Service } from "../types";
import { webdesign } from "./webdesign";
import { websiteRedesign } from "./website-redesign";
import { onlineshop } from "./onlineshop";
import { seo } from "./seo";
import { onlineMarketing } from "./online-marketing";
import { branding } from "./branding";
import { wartung } from "./wartung";
import { kassensystem } from "./kassensystem";
import { kassensystemGastro } from "./kassensystem-gastro";
import { kassensystemRetail } from "./kassensystem-retail";

export const services: Service[] = [
  webdesign,
  websiteRedesign,
  onlineshop,
  seo,
  onlineMarketing,
  branding,
  wartung,
  kassensystem,
  kassensystemGastro,
  kassensystemRetail,
];

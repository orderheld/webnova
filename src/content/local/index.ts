import type { LocalService } from "../types";
import { onlineshopLocal } from "./onlineshop";
import { redesignLocal } from "./website-redesign";
import { kassensystemLocal } from "./kassensystem";
import { marketingLocal } from "./online-marketing";
import { brandingLocal } from "./branding";
import { wartungLocal } from "./wartung";

/** Service × city pages for the core region. Webdesign and SEO per city live in cities/*.ts. */
export const localServices: LocalService[] = [
  ...onlineshopLocal,
  ...redesignLocal,
  ...kassensystemLocal,
  ...marketingLocal,
  ...brandingLocal,
  ...wartungLocal,
];

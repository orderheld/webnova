import type { StandalonePage } from "../types";
import { websiteCheck } from "./website-check";
import { impressumGenerator } from "./impressum-generator";

/** Pages with route ids "page:<key>", e.g. "page:website-check". */
export const standalonePages: StandalonePage[] = [websiteCheck, impressumGenerator];

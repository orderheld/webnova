import type { ComponentType } from "react";
import type { SkylineProps } from "./frame";
import { AarauSkyline } from "./aarau";
import { BaselSkyline } from "./basel";
import { BernSkyline } from "./bern";
import { BielSkyline } from "./biel";
import { BurgdorfSkyline } from "./burgdorf";
import { FribourgSkyline } from "./fribourg";
import { GrenchenSkyline } from "./grenchen";
import { LuzernSkyline } from "./luzern";
import { LyssSkyline } from "./lyss";
import { NeuchatelSkyline } from "./neuchatel";
import { OltenSkyline } from "./olten";
import { SolothurnSkyline } from "./solothurn";
import { ThunSkyline } from "./thun";
import { ZuerichSkyline } from "./zuerich";

export type { SkylineProps } from "./frame";

/** City key (src/content/cities) -> skyline line drawing. */
export const skylines: Record<string, ComponentType<SkylineProps>> = {
  aarau: AarauSkyline,
  basel: BaselSkyline,
  bern: BernSkyline,
  biel: BielSkyline,
  burgdorf: BurgdorfSkyline,
  fribourg: FribourgSkyline,
  grenchen: GrenchenSkyline,
  luzern: LuzernSkyline,
  lyss: LyssSkyline,
  neuchatel: NeuchatelSkyline,
  olten: OltenSkyline,
  solothurn: SolothurnSkyline,
  thun: ThunSkyline,
  zuerich: ZuerichSkyline,
};

import type { SVGProps } from "react";

export type SkylineProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Draw the lines in once on load (skipped under prefers-reduced-motion). */
  animate?: boolean;
};

const drawCss =
  "@keyframes skyline-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}" +
  ".skyline-draw path{stroke-dasharray:1;animation:skyline-draw 2.6s .3s cubic-bezier(.5,0,.2,1) both}" +
  "@media (prefers-reduced-motion:reduce){.skyline-draw path{animation:none}}";

/**
 * Shared frame for the city skylines: a 1600x320 panoramic line drawing in currentColor.
 * The path data is generated (hand-modelled landmarks, hidden-line removal) and kept static,
 * so it renders on the server with no runtime cost. Purely decorative.
 */
export function SkylineFrame({
  back,
  main,
  animate = false,
  className,
  ...rest
}: SkylineProps & { back: string; main: string }) {
  return (
    <>
      {animate && (
        <style href="skyline-draw" precedence="default">
          {drawCss}
        </style>
      )}
      <svg
        viewBox="0 0 1600 320"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={[animate ? "skyline-draw" : "", className ?? ""].join(" ").trim() || undefined}
        {...rest}
      >
        <path d={back} opacity={0.5} pathLength={1} />
        <path d={main} pathLength={1} />
      </svg>
    </>
  );
}

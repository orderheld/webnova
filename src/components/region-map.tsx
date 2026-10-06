import Link from "next/link";
import { cities } from "@/content/cities";
import type { Locale } from "@/content/types";
import { href } from "@/lib/routes";

const W = 600;
const LNG0 = 6.82;
const LAT1 = 47.64;
const KX = W / 1.86; // px per degree longitude
const KY = KX / Math.cos((47.15 * Math.PI) / 180); // keep the map's aspect ratio true
const H = Math.round((LAT1 - 46.68) * KY);

const project = (lat: number, lng: number) => ({ x: (lng - LNG0) * KX, y: (LAT1 - lat) * KY });

/** Label position relative to the dot, chosen by hand so close cities don't overlap. */
const labelPos: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  grenchen: { dx: -2, dy: -22, anchor: "middle" },
  solothurn: { dx: 12, dy: -6, anchor: "start" },
  biel: { dx: -12, dy: 4, anchor: "end" },
  lyss: { dx: -12, dy: 10, anchor: "end" },
  bern: { dx: -12, dy: 6, anchor: "end" },
  burgdorf: { dx: 12, dy: 5, anchor: "start" },
  neuchatel: { dx: 12, dy: 18, anchor: "start" },
  fribourg: { dx: 12, dy: 5, anchor: "start" },
  thun: { dx: 12, dy: 5, anchor: "start" },
  olten: { dx: 12, dy: 5, anchor: "start" },
  aarau: { dx: 12, dy: 5, anchor: "start" },
  basel: { dx: 12, dy: 5, anchor: "start" },
  zuerich: { dx: -12, dy: -10, anchor: "end" },
  luzern: { dx: -12, dy: 6, anchor: "end" },
};

/** Stylised map of our service area: every dot links to its city page, Grenchen is home base. */
export function RegionMap({ locale }: { locale: Locale }) {
  const home = cities.find((c) => c.key === "grenchen")!;
  const h = project(home.geo.lat, home.geo.lng);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={locale === "de" ? "Karte unserer Regionen" : "Carte de nos régions"}>
      <defs>
        <radialGradient id="rm-glow">
          <stop offset="0" stopColor="#d2ff28" stopOpacity="0.35" />
          <stop offset="1" stopColor="#d2ff28" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={h.x} cy={h.y} r="190" fill="url(#rm-glow)" />
      {[60, 120, 180].map((r) => (
        <circle key={r} cx={h.x} cy={h.y} r={r} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="2 6" />
      ))}
      {cities
        .filter((c) => c.key !== "grenchen")
        .map((c) => {
          const p = project(c.geo.lat, c.geo.lng);
          return <line key={c.key} x1={h.x} y1={h.y} x2={p.x} y2={p.y} stroke="#d2ff28" strokeOpacity={c.priority === "A" ? 0.5 : 0.18} strokeWidth="1" strokeDasharray="3 4" />;
        })}
      {cities.map((c) => {
        const p = project(c.geo.lat, c.geo.lng);
        const l = labelPos[c.key] ?? { dx: 12, dy: 5, anchor: "start" as const };
        const isHome = c.key === "grenchen";
        const strong = c.priority === "A";
        return (
          <Link key={c.key} href={href(locale, `city:${c.key}`)} className="group/dot outline-none">
            {isHome && (
              <circle cx={p.x} cy={p.y} r="8" fill="#d2ff28" className="origin-center animate-ping [transform-box:fill-box]" opacity="0.6" />
            )}
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={isHome ? 8 : strong ? 5.5 : 4}
              fill={isHome || strong ? "#d2ff28" : "#0b0c0a"}
              stroke="#d2ff28"
              strokeWidth="2"
              className="origin-center transition-transform duration-300 [transform-box:fill-box] group-hover/dot:scale-150 group-focus-visible/dot:scale-150"
            />
            <text
              x={p.x + l.dx}
              y={p.y + l.dy}
              textAnchor={l.anchor}
              className={`fill-white transition-colors group-hover/dot:fill-[#d2ff28] ${isHome ? "text-[17px] font-bold" : strong ? "text-[14px] font-semibold" : "text-[12px] fill-white/60"}`}
            >
              {c.content[locale].name}
            </text>
          </Link>
        );
      })}
    </svg>
  );
}

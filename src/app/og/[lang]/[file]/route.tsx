import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { locales } from "@/content/types";
import { ogData, ogFiles } from "@/lib/og/data";
import { isLocale } from "@/lib/routes";

// Social preview images (WhatsApp, Facebook, LinkedIn, X), 1200 x 630, rendered at build time.
// The mark comes from public/logo-mark.svg, the same single source as the app icons.

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => ogFiles().map((f) => ({ lang, file: `${f}.png` })));
}

const fontsP = Promise.all([
  readFile(join(process.cwd(), "src/lib/og/inter-tight-600.ttf")),
  readFile(join(process.cwd(), "src/lib/og/inter-500.ttf")),
]);
const markP = readFile(join(process.cwd(), "public/logo-mark.svg"), "utf8").then(
  (svg) => `data:image/svg+xml;base64,${Buffer.from(svg.replace(/fill="(?!none)[^"]*"/g, 'fill="#FFFFFF"')).toString("base64")}`,
);

export async function GET(_req: Request, ctx: RouteContext<"/og/[lang]/[file]">) {
  const { lang, file } = await ctx.params;
  if (!isLocale(lang) || !file.endsWith(".png")) return new Response("Not found", { status: 404 });
  const data = ogData(lang, file.slice(0, -4));
  if (!data) return new Response("Not found", { status: 404 });
  const [[display, text], mark] = await Promise.all([fontsP, markP]);
  const len = data.title.length;
  const size = len > 80 ? 52 : len > 56 ? 60 : len > 36 ? 70 : 84;
  const tagline =
    lang === "de" ? "Webseiten · Onlineshops · SEO für Schweizer KMU" : "Sites internet · Boutiques en ligne · SEO pour PME suisses";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px 60px",
          background: "#24405a",
          backgroundImage: "linear-gradient(135deg, #24405a 0%, #1b2d3e 100%)",
          color: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={mark} width={54} height={56} />
          <span style={{ fontFamily: "Inter Tight", fontSize: 40, letterSpacing: "-0.02em" }}>Webnova</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <span style={{ fontSize: 26, color: "#9fc3ec", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 22 }}>
            {data.eyebrow}
          </span>
          <span style={{ fontFamily: "Inter Tight", fontSize: size, lineHeight: 1.08, letterSpacing: "-0.025em" }}>{data.title}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(255,255,255,0.16)",
            paddingTop: 26,
            fontSize: 25,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          <span>{tagline}</span>
          <span style={{ fontFamily: "Inter Tight", color: "#ffffff" }}>webnova.ch</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter Tight", data: display, weight: 600, style: "normal" },
        { name: "Inter", data: text, weight: 500, style: "normal" },
      ],
    },
  );
}

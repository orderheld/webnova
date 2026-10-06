import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Webnova – Webdesign-Agentur";

export function generateStaticParams() {
  return [{ lang: "de" }, { lang: "fr" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const fr = lang === "fr";
  const logo = await readFile(path.join(process.cwd(), "public/logo-light.svg"), "base64");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0b0c0a", backgroundImage: "radial-gradient(circle at 85% 15%, rgba(210,255,40,0.28), transparent 45%)", color: "#fff" }}>
        <img src={`data:image/svg+xml;base64,${logo}`} width={323} height={60} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -3, fontWeight: 800 }}>{fr ? "Des sites web" : "Webseiten, die"}</div>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -3, fontWeight: 800, color: "#d2ff28" }}>
            {fr ? "qui génèrent des demandes." : "Anfragen bringen."}
          </div>
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)" }}>
          {fr ? "Agence web · Bienne · Granges · Soleure · Berne" : "Webdesign-Agentur · Grenchen · Biel · Solothurn · Bern"}
        </div>
      </div>
    ),
    size,
  );
}

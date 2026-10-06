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
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0e0e10", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          webnova<span style={{ color: "#3b4cf5" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -3, fontWeight: 600 }}>{fr ? "Des sites web" : "Webseiten, die"}</div>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -3, fontWeight: 600, color: "#7d89ff" }}>
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

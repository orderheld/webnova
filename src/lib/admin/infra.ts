import "server-only";

// Where the site's services run, shown to the owner in the admin settings. Region names only.

export type InfraRow = { service: string; region: string; europe: boolean | null };

const europe = (r: string) => /^(fra1|arn1|cdg1|dub1|lhr1|zrh1|eu-|europe-|germanywest|switzerland)/i.test(r);

function neonRegion(): string | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    // e.g. ep-cool-name-123456-pooler.eu-central-1.aws.neon.tech
    const parts = new URL(url).hostname.split(".");
    const i = parts.findIndex((p) => p === "aws" || p === "azure");
    return i > 0 ? parts[i - 1] : "unbekannt";
  } catch {
    return "unbekannt";
  }
}

async function resendRegion(): Promise<string | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
    if (!res.ok) return `nicht lesbar (API-Schlüssel ohne Domain-Recht, Status ${res.status})`;
    const body = (await res.json()) as { data?: { name: string; region: string }[] };
    const list = body.data ?? [];
    return list.length ? list.map((d) => `${d.region} (${d.name})`).join(", ") : "keine Domain";
  } catch {
    return "nicht erreichbar";
  }
}

export async function infraRegions(): Promise<InfraRow[]> {
  const vercel = process.env.VERCEL_REGION ?? "lokal (nicht auf Vercel)";
  const neon = neonRegion() ?? "nicht konfiguriert";
  const resend = (await resendRegion()) ?? "nicht konfiguriert";
  const flag = (r: string) => (/^(lokal|nicht|keine|unbekannt)/.test(r) ? null : europe(r));
  return [
    { service: "Server (Vercel Functions)", region: vercel, europe: flag(vercel) },
    { service: "Datenbank (Neon)", region: neon, europe: flag(neon) },
    { service: "E-Mail-Versand (Resend)", region: resend, europe: flag(resend) },
  ];
}

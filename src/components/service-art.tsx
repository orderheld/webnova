import type { Locale } from "@/content/types";
import { BrowserFrame, PhoneFrame, type SampleKey } from "./visuals";

/**
 * Service illustrations: calm product UI scenes in the Schieferblau palette (CSS and inline SVG,
 * no images except the fictional sample designs). Decorative: every scene is aria-hidden and the
 * page text says the same thing.
 */

export type ArtKind = "website" | "redesign" | "shop" | "seo" | "local" | "ai" | "ads" | "brand" | "care" | "pos";

export const serviceArt: Record<string, { kind: ArtKind; sample?: SampleKey; before?: SampleKey; variant?: "gastro" | "retail" }> = {
  webdesign: { kind: "website", sample: "hero" },
  "website-kmu": { kind: "website", sample: "hero" },
  firmenwebsite: { kind: "website", sample: "coiffeur" },
  // Before and after of the same fictional restaurant: a 2008-style site and its new design.
  "website-redesign": { kind: "redesign", sample: "restaurant", before: "alt-restaurant" },
  onlineshop: { kind: "shop" },
  seo: { kind: "seo" },
  "local-seo": { kind: "local" },
  "ki-sichtbarkeit": { kind: "ai" },
  "online-marketing": { kind: "ads" },
  branding: { kind: "brand" },
  wartung: { kind: "care" },
  kassensystem: { kind: "pos", variant: "gastro" },
  "kassensystem-gastro": { kind: "pos", variant: "gastro" },
  "kassensystem-retail": { kind: "pos", variant: "retail" },
};

const card = "rounded-2xl bg-white text-ink shadow-[0_24px_50px_-24px_rgb(10_22_34/0.55)] ring-1 ring-black/5";
const line = (w: string, tone = "bg-[#e3e8ee]") => <span className={`block h-2 rounded-full ${tone}`} style={{ width: w }} />;

const tx = {
  de: {
    before: "Vorher",
    after: "Nachher",
    cart: "Warenkorb",
    order: "Neue Bestellung",
    orderSub: "Zahlung erhalten",
    add: "In den Warenkorb",
    shopName: "Ihr Shop",
    query: "webdesign agentur schweiz",
    result: "Ihre Leistung in Ihrer Region | Ihre Firma",
    visitors: "Besuche über Google",
    open: "Geöffnet",
    route: "Route",
    call: "Anrufen",
    site: "Website",
    biz: "Ihre Firma",
    bizType: "Fachbetrieb",
    askAi: "Wer macht gute Webseiten für KMU in meiner Region?",
    aiAnswer: "Empfehlenswert sind Anbieter mit klaren Leistungsseiten und lokalen Referenzen, zum Beispiel:",
    sponsored: "Anzeige",
    adTitle: "Ihr Angebot, genau dort, wo gesucht wird",
    leads: "Anfragen pro Monat",
    brandName: "Ihre Marke",
    colors: "Farben",
    type: "Schrift",
    careTitle: "Wartung · diese Woche",
    care: ["Sicherheits-Updates installiert", "Backup erstellt", "SSL-Zertifikat gültig", "Formulare getestet"],
    online: "Online",
    pay: "Bezahlen",
    table: "Tisch 4",
    basket: "Bon",
    gastro: ["Espresso", "Cappuccino", "Pizza", "Salat", "Pasta", "Tiramisù"],
    retail: ["Schal", "Mütze", "Tasche", "Kerze", "Karte", "Gutschein"],
  },
  fr: {
    before: "Avant",
    after: "Après",
    cart: "Panier",
    order: "Nouvelle commande",
    orderSub: "Paiement reçu",
    add: "Ajouter au panier",
    shopName: "Votre boutique",
    query: "agence web suisse",
    result: "Votre service dans votre région | Votre entreprise",
    visitors: "Visites via Google",
    open: "Ouvert",
    route: "Itinéraire",
    call: "Appeler",
    site: "Site web",
    biz: "Votre entreprise",
    bizType: "Entreprise spécialisée",
    askAi: "Qui réalise de bons sites pour les PME dans ma région ?",
    aiAnswer: "Les prestataires avec des pages de services claires et des références locales, par exemple :",
    sponsored: "Annonce",
    adTitle: "Votre offre, là où l'on cherche",
    leads: "Demandes par mois",
    brandName: "Votre marque",
    colors: "Couleurs",
    type: "Police",
    careTitle: "Maintenance · cette semaine",
    care: ["Mises à jour de sécurité installées", "Sauvegarde créée", "Certificat SSL valide", "Formulaires testés"],
    online: "En ligne",
    pay: "Encaisser",
    table: "Table 4",
    basket: "Ticket",
    gastro: ["Espresso", "Cappuccino", "Pizza", "Salade", "Pâtes", "Tiramisù"],
    retail: ["Écharpe", "Bonnet", "Sac", "Bougie", "Carte", "Bon cadeau"],
  },
};

/** The stage a scene sits on: Schieferblau panel on light sections, a faint glass panel on dark ones. */
export function ArtStage({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative isolate overflow-hidden rounded-3xl ${dark ? "bg-white/[0.05] ring-1 ring-inset ring-white/10" : "stage-accent"} ${className}`}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      {children}
    </div>
  );
}

/** Scene of a service; `sample` swaps the design shown, e.g. so the home page never repeats its hero. */
export function ServiceArt({
  service,
  locale,
  sample,
  dark = false,
  className = "aspect-[5/4]",
  city,
}: {
  service: string;
  locale: Locale;
  sample?: SampleKey;
  dark?: boolean;
  className?: string;
  city?: string;
}) {
  const a = serviceArt[service] ?? { kind: "website", sample: "treuhand" };
  return <Art kind={a.kind} sample={sample ?? a.sample} before={a.before} variant={a.variant} locale={locale} dark={dark} className={className} city={city} />;
}

export function Art({
  kind,
  locale,
  sample = "treuhand",
  before,
  variant = "gastro",
  dark = false,
  className = "aspect-[5/4]",
  city,
}: {
  kind: ArtKind;
  locale: Locale;
  sample?: SampleKey;
  /** Redesign scene: the outdated site shown as "Vorher"; without it a neutral wireframe. */
  before?: SampleKey;
  variant?: "gastro" | "retail";
  dark?: boolean;
  className?: string;
  city?: string;
}) {
  const t = tx[locale];
  return (
    <ArtStage dark={dark} className={className}>
      {kind === "website" && (
        <>
          <div className="absolute left-[7%] top-[10%] w-[78%]">
            <BrowserFrame sample={sample} locale={locale} sizes="(min-width: 1024px) 420px, 75vw" />
          </div>
          <div className="absolute bottom-[7%] right-[6%] w-[24%]">
            <PhoneFrame sample={sample} locale={locale} sizes="140px" />
          </div>
        </>
      )}

      {kind === "redesign" && before && (
        <>
          {/* Less overlap than the wireframe version, so the outdated site stays recognisable. */}
          <div className="absolute left-[4%] top-[7%] w-[60%] -rotate-3">
            <BrowserFrame sample={before} locale={locale} sizes="(min-width: 1024px) 340px, 60vw" />
            <span className="absolute -top-3 left-4 rounded-full bg-night px-3 py-1 text-[11px] font-semibold text-white">{t.before}</span>
          </div>
          <div className="absolute bottom-[6%] right-[4%] w-[60%]">
            <BrowserFrame sample={sample} locale={locale} sizes="(min-width: 1024px) 340px, 60vw" />
            <span className="absolute -top-3 right-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-accent shadow">{t.after}</span>
          </div>
        </>
      )}

      {kind === "redesign" && !before && (
        <>
          <div className="absolute left-[6%] top-[8%] w-[62%] -rotate-3 rounded-xl bg-[#e9eef3] p-3 opacity-80 shadow-lg">
            <div className="mb-3 flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#c9d3dd]" />
              <span className="h-2 w-2 rounded-full bg-[#c9d3dd]" />
              <span className="h-2 w-2 rounded-full bg-[#c9d3dd]" />
            </div>
            <div className="space-y-2">
              {line("40%", "bg-[#c9d3dd]")}
              <div className="h-16 rounded bg-[#d5dde6]" />
              {line("90%", "bg-[#d5dde6]")}
              {line("70%", "bg-[#d5dde6]")}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="h-8 rounded bg-[#d5dde6]" />
                <div className="h-8 rounded bg-[#d5dde6]" />
                <div className="h-8 rounded bg-[#d5dde6]" />
              </div>
            </div>
            <span className="absolute -top-3 left-4 rounded-full bg-night px-3 py-1 text-[11px] font-semibold text-white">{t.before}</span>
          </div>
          <div className="absolute bottom-[8%] right-[5%] w-[70%]">
            <BrowserFrame sample={sample} locale={locale} sizes="(min-width: 1024px) 380px, 70vw" />
            <span className="absolute -top-3 right-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-accent shadow">{t.after}</span>
          </div>
        </>
      )}

      {kind === "shop" && (
        <>
          <div className="absolute left-[10%] top-[8%] w-[40%] rounded-[1.8rem] bg-[#0f1b27] p-[5px] shadow-2xl">
            <div className="overflow-hidden rounded-[1.5rem] bg-white p-3 text-ink">
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <span>{t.shopName}</span>
                <span className="rounded-full bg-accent px-2 py-0.5 text-white">2</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["from-[#24405a] to-[#3b6385]", "from-[#b4c6d6] to-[#e4e9ee]", "from-[#3b6385] to-[#b4c6d6]", "from-[#1b2d3e] to-[#24405a]"].map((g, i) => (
                  <div key={i}>
                    <div className={`aspect-square rounded-lg bg-linear-to-br ${g} grid place-items-center`}>
                      <span className="h-1/2 w-1/2 rounded-full bg-white/25" />
                    </div>
                    <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-[#e3e8ee]" />
                    <span className="mt-1 block h-1.5 w-2/5 rounded-full bg-accent/40" />
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-accent py-1.5 text-center text-[9px] font-semibold text-white">{t.add}</div>
            </div>
          </div>
          <div className={`absolute right-[7%] top-[22%] w-[44%] p-4 ${card}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{t.cart}</p>
            {[0, 1].map((i) => (
              <div key={i} className="mt-3 flex items-center gap-3">
                <span className={`h-9 w-9 shrink-0 rounded-lg ${i ? "bg-accent-light" : "bg-accent"}`} />
                <span className="flex-1 space-y-1.5">
                  {line("80%")}
                  {line("45%")}
                </span>
              </div>
            ))}
            <div className="mt-4 rounded-lg bg-night py-2 text-center text-[11px] font-semibold text-white">{t.pay}</div>
          </div>
          <div className={`absolute bottom-[9%] right-[12%] flex items-center gap-3 py-2.5 pl-2.5 pr-4 ${card}`}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white">
              <Check />
            </span>
            <span className="leading-tight">
              <span className="block text-[12.5px] font-semibold">{t.order}</span>
              <span className="block text-[11px] text-muted">{t.orderSub}</span>
            </span>
          </div>
        </>
      )}

      {kind === "seo" && (
        <>
          <div className={`absolute left-[7%] right-[7%] top-[9%] p-4 ${card}`}>
            <div className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-[11.5px] text-muted">
              <SearchIcon /> {t.query}
            </div>
            <div className="mt-4 rounded-xl bg-bright-soft p-3 ring-1 ring-accent/15">
              <p className="text-[10.5px] text-muted">ihre-firma.ch › leistungen</p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug text-accent">{t.result}</p>
              <div className="mt-2 space-y-1.5">
                {line("95%")}
                {line("70%")}
              </div>
            </div>
            <div className="mt-3 space-y-1.5 px-3 opacity-60">
              {line("35%", "bg-[#d5dde6]")}
              {line("85%")}
              {line("60%")}
            </div>
          </div>
          <div className={`absolute bottom-[8%] right-[7%] w-[52%] p-4 ${card}`}>
            <p className="text-[11px] font-semibold text-muted">{t.visitors}</p>
            <svg viewBox="0 0 200 70" className="mt-2 w-full">
              <defs>
                <linearGradient id="seo-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3b6385" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#3b6385" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 62 C 30 58, 45 55, 70 48 S 120 38, 140 26 S 180 10, 200 6 L200 70 L0 70Z" fill="url(#seo-g)" />
              <path d="M0 62 C 30 58, 45 55, 70 48 S 120 38, 140 26 S 180 10, 200 6" fill="none" stroke="#24405a" strokeWidth="3" strokeLinecap="round" />
              <circle cx="200" cy="6" r="4" fill="#24405a" />
            </svg>
          </div>
        </>
      )}

      {kind === "local" && <LocalScene locale={locale} city={city} />}

      {kind === "ai" && (
        <div className="absolute inset-[9%_7%] flex flex-col gap-3">
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-white/90 px-4 py-3 text-[12.5px] leading-snug text-ink shadow-lg">{t.askAi}</div>
          <div className={`max-w-[88%] rounded-bl-md p-4 ${card}`}>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-white">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                  <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
                </svg>
              </span>
              <span className="h-2 w-16 rounded-full bg-[#e3e8ee]" />
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">{t.aiAnswer}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white">ihre-firma.ch</span>
              <span className="rounded-full bg-bg-2 px-3 py-1 text-[11px] text-muted">…</span>
            </div>
          </div>
        </div>
      )}

      {kind === "ads" && (
        <>
          <div className={`absolute left-[7%] right-[14%] top-[9%] p-4 ${card}`}>
            <p className="text-[10.5px] text-muted">
              <span className="font-semibold text-ink">{t.sponsored}</span> · ihre-firma.ch
            </p>
            <p className="mt-1 text-[14px] font-semibold leading-snug text-accent">{t.adTitle}</p>
            <div className="mt-2 space-y-1.5">
              {line("92%")}
              {line("64%")}
            </div>
          </div>
          <div className={`absolute bottom-[8%] left-[18%] right-[7%] p-4 ${card}`}>
            <p className="text-[11px] font-semibold text-muted">{t.leads}</p>
            <div className="mt-3 flex h-24 items-end gap-2">
              {[30, 38, 34, 52, 60, 72, 88].map((h, i) => (
                <span key={i} className={`flex-1 rounded-t-md ${i === 6 ? "bg-accent" : "bg-accent-light"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </>
      )}

      {kind === "brand" && (
        <div className="absolute inset-[9%_7%] grid grid-cols-5 grid-rows-2 gap-3">
          <div className={`col-span-3 row-span-2 flex flex-col justify-between p-5 ${card}`}>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent font-display text-[26px] font-semibold text-white">M</span>
            <div>
              <p className="font-display text-[22px] font-semibold">{t.brandName}</p>
              <div className="mt-2 space-y-1.5">
                {line("80%")}
                {line("55%")}
              </div>
            </div>
          </div>
          <div className={`col-span-2 p-3 ${card}`}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">{t.colors}</p>
            <div className="mt-2 flex gap-1.5">
              {["#1b2d3e", "#24405a", "#3b6385", "#b4c6d6", "#e4e9ee"].map((c) => (
                <span key={c} className="h-7 flex-1 rounded-md ring-1 ring-black/5" style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className={`col-span-2 p-3 ${card}`}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">{t.type}</p>
            <p className="mt-1 font-display text-[34px] font-semibold leading-none text-accent">Aa</p>
          </div>
        </div>
      )}

      {kind === "care" && (
        // Small cards (e.g. the three home goals) show three checks and no uptime bars, so nothing is cut off.
        <div className={`@container absolute inset-[9%_8%] flex flex-col overflow-hidden p-4 @sm:p-5 ${card}`}>
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-semibold">{t.careTitle}</p>
            <span className="flex items-center gap-1.5 rounded-full bg-bright-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t.online}
            </span>
          </div>
          <ul className="mt-3 space-y-2 @sm:mt-4 @sm:space-y-2.5">
            {t.care.map((c, i) => (
              <li key={c} className={`flex items-center gap-3 rounded-xl bg-bg-2 px-3 py-2 text-[12.5px] @sm:py-2.5 ${i > 2 ? "@max-sm:hidden" : ""}`}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <Check small />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-[3px] pt-4 @max-sm:hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="h-5 flex-1 rounded-sm bg-accent/80" style={{ opacity: 0.45 + (i % 5) * 0.12 }} />
            ))}
          </div>
        </div>
      )}

      {kind === "pos" && (
        <div className="absolute inset-[11%_6%] rounded-[1.4rem] bg-[#0f1b27] p-[6px] shadow-2xl">
          <div className="grid h-full grid-cols-[1.5fr_1fr] gap-2 overflow-hidden rounded-[1.1rem] bg-[#f3f6f9] p-2.5 text-ink">
            <div className="grid grid-cols-2 grid-rows-3 gap-2">
              {(variant === "retail" ? t.retail : t.gastro).map((it, i) => (
                <div key={it} className={`flex min-w-0 flex-col justify-end overflow-hidden rounded-lg p-2 text-[10.5px] font-semibold leading-tight ${i === 0 ? "bg-accent text-white" : i % 3 === 1 ? "bg-white" : "bg-accent-light/60"}`}>
                  <span className="truncate">{it}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col rounded-lg bg-white p-2.5">
              <p className="text-[10.5px] font-semibold">{variant === "retail" ? t.basket : t.table}</p>
              <div className="mt-2 flex-1 space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted">{i + 1}×</span>
                    <span className="h-1.5 flex-1 rounded-full bg-[#e3e8ee]" />
                  </div>
                ))}
              </div>
              <div className="rounded-md bg-accent py-1.5 text-center text-[10.5px] font-semibold text-white">{t.pay}</div>
            </div>
          </div>
        </div>
      )}
    </ArtStage>
  );
}

/** Local search scene: a calm map with pins and the business card a customer sees. */
export function LocalScene({ locale, city }: { locale: Locale; city?: string }) {
  const t = tx[locale];
  return (
    <>
      <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <rect width="400" height="320" fill="#dfe7ee" />
        <path d="M-10 230 C 60 200, 120 250, 190 230 S 330 170, 420 200 L420 330 L-10 330Z" fill="#b4c6d6" />
        <path d="M250 -10 C 240 60, 290 90, 280 150" fill="none" stroke="#c9d6e1" strokeWidth="26" />
        <g stroke="#ffffff" strokeWidth="7" fill="none" strokeLinecap="round">
          <path d="M-10 120 L 420 90" />
          <path d="M120 -10 L 160 330" />
          <path d="M-10 40 C 80 60, 200 30, 420 40" />
          <path d="M320 -10 L 300 330" />
        </g>
        <g stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.8">
          <path d="M40 -10 L 70 330M230 -10 L 220 220M-10 170 L 420 150" />
        </g>
        <rect x="175" y="135" width="60" height="40" rx="6" fill="#cbdccf" opacity="0.6" />
      </svg>
      <span className="absolute left-[22%] top-[22%] h-3 w-3 rounded-full bg-accent-light ring-4 ring-white/60" />
      <span className="absolute right-[18%] top-[38%] h-3 w-3 rounded-full bg-accent-light ring-4 ring-white/60" />
      <span className="absolute left-[46%] top-[20%] -translate-x-1/2">
        <svg viewBox="0 0 24 32" className="h-12 w-9 drop-shadow-[0_8px_10px_rgb(27_45_62/0.35)]">
          <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0Z" fill="#24405a" />
          <circle cx="12" cy="11.5" r="4.5" fill="#fff" />
        </svg>
      </span>
      <div className={`absolute bottom-[8%] left-[7%] right-[7%] p-4 ${card}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold">{t.biz}</p>
            <p className="mt-0.5 text-[11.5px] text-muted">
              {t.bizType}
              {city ? ` · ${city}` : ""}
            </p>
            <p className="mt-1 text-[11.5px] font-semibold text-accent">{t.open}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 11 9-8 9 8" />
              <path d="M5 10v10h14V10" />
            </svg>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
          <span className="rounded-full bg-accent py-1.5 text-white">{t.route}</span>
          <span className="rounded-full bg-bright-soft py-1.5 text-accent">{t.call}</span>
          <span className="rounded-full bg-bright-soft py-1.5 text-accent">{t.site}</span>
        </div>
      </div>
    </>
  );
}

function Check({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "h-3.5 w-3.5" : "h-5 w-5"} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </svg>
  );
}

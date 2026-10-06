import type { Locale } from "@/content/types";
import { Icon } from "./icons";

const t = {
  de: {
    before: "Vorher",
    after: "Nachher",
    cart: "In den Warenkorb",
    added: "Bestellung eingegangen",
    query: "webdesign biel",
    you: "Ihre Firma",
    rival: "Mitbewerber",
    clicks: "Klicks",
    ad: "Anzeige",
    uptime: "Online",
    backup: "Backup erstellt",
    update: "Updates installiert",
    ssl: "SSL aktiv",
    total: "Total",
    pay: "Bezahlen",
  },
  fr: {
    before: "Avant",
    after: "Après",
    cart: "Ajouter au panier",
    added: "Commande reçue",
    query: "création site bienne",
    you: "Votre entreprise",
    rival: "Concurrent",
    clicks: "Clics",
    ad: "Annonce",
    uptime: "En ligne",
    backup: "Sauvegarde créée",
    update: "Mises à jour faites",
    ssl: "SSL actif",
    total: "Total",
    pay: "Payer",
  },
};

const bar = "block rounded-full";

/** Small illustrated UI scene per service, used on service tiles and service heroes. Decorative only. */
export function ServiceArt({ k, locale, className = "" }: { k: string; locale: Locale; className?: string }) {
  const s = t[locale];
  const frame = `relative h-full w-full select-none ${className}`;

  switch (k) {
    case "webdesign":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute inset-x-0 top-0 overflow-hidden rounded-[14px] border border-line bg-white shadow-soft">
            <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="ml-2 h-3 flex-1 rounded-full bg-bg" />
            </div>
            <div className="grid grid-cols-5 gap-3 p-4">
              <div className="col-span-3 space-y-2">
                <span className={`${bar} h-2.5 w-11/12 bg-ink`} />
                <span className={`${bar} h-2.5 w-2/3 bg-ink`} />
                <span className={`${bar} mt-3 h-1.5 w-full bg-line`} />
                <span className={`${bar} h-1.5 w-4/5 bg-line`} />
                <span className="mt-3 inline-block h-5 w-20 rounded-full bg-accent" />
              </div>
              <div className="col-span-2 rounded-lg bg-[linear-gradient(135deg,#1b1e17,#3a4a12)]" />
            </div>
          </div>
          <div className="absolute -bottom-2 right-3 w-[30%] min-w-[70px] overflow-hidden rounded-[14px] border-[3px] border-night bg-white shadow-soft">
            <div className="space-y-1.5 p-2">
              <span className={`${bar} h-1.5 w-2/3 bg-ink`} />
              <span className="block aspect-[4/3] rounded bg-[linear-gradient(135deg,#1b1e17,#3a4a12)]" />
              <span className={`${bar} h-1 w-full bg-line`} />
              <span className="block h-3 w-3/4 rounded-full bg-accent" />
            </div>
          </div>
        </div>
      );

    case "website-redesign":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute inset-0 grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-white shadow-soft">
            <div className="space-y-2 bg-[#ecebe4] p-4 grayscale">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">{s.before}</p>
              <span className={`${bar} h-2 w-full bg-[#b9b6a8]`} />
              <span className="block h-10 rounded bg-[#d6d3c7]" />
              <span className={`${bar} h-1.5 w-5/6 bg-[#cfccbf]`} />
              <span className={`${bar} h-1.5 w-2/3 bg-[#cfccbf]`} />
            </div>
            <div className="space-y-2 p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-accent-ink">{s.after}</p>
              <span className={`${bar} h-2.5 w-11/12 bg-ink`} />
              <span className="block h-10 rounded bg-[linear-gradient(135deg,#1b1e17,#3a4a12)]" />
              <span className={`${bar} h-1.5 w-5/6 bg-line`} />
              <span className="inline-block h-4 w-16 rounded-full bg-accent" />
            </div>
            <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-night" />
            <span className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-night text-[10px] font-bold text-accent">
              ⇆
            </span>
          </div>
        </div>
      );

    case "onlineshop":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute left-0 top-0 grid w-[78%] grid-cols-2 gap-2.5 rounded-[14px] border border-line bg-white p-3 shadow-soft">
            {["#e9e4d8", "#1b1e17"].map((c, n) => (
              <div key={n} className="space-y-1.5">
                <span className="block aspect-square rounded-lg" style={{ background: c }} />
                <span className={`${bar} h-1.5 w-3/4 bg-ink`} />
                <span className={`${bar} h-1.5 w-1/3 bg-line`} />
              </div>
            ))}
            <span className="col-span-2 flex h-6 items-center justify-center gap-1.5 rounded-full bg-night text-[9.5px] font-semibold text-white">
              <Icon name="bag" className="h-3 w-3" /> {s.cart}
            </span>
          </div>
          <div className="absolute bottom-0 right-0 flex items-center gap-2.5 rounded-[12px] bg-night px-3 py-2.5 text-white shadow-soft">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-night">
              <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="text-[10.5px] font-semibold">{s.added}</span>
          </div>
        </div>
      );

    case "seo":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute inset-x-0 top-0 rounded-[14px] border border-line bg-white p-3.5 shadow-soft">
            <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
              <Icon name="search" className="h-3 w-3 text-muted" />
              <span className="font-mono text-[10px] text-ink-soft">{s.query}</span>
            </div>
            <div className="mt-3 space-y-2.5">
              <div className="rounded-lg bg-accent-soft p-2 ring-1 ring-accent">
                <div className="flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-night text-[8px] font-bold text-accent">1</span>
                  <span className="text-[10.5px] font-semibold text-[#1a0dab]">{s.you}</span>
                </div>
                <span className={`${bar} mt-1.5 h-1 w-5/6 bg-[#c6d79a]`} />
              </div>
              <div className="px-2 opacity-50">
                <div className="flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-line text-[8px] font-bold text-muted">2</span>
                  <span className="text-[10.5px] text-[#1a0dab]">{s.rival}</span>
                </div>
                <span className={`${bar} mt-1.5 h-1 w-2/3 bg-line`} />
              </div>
            </div>
          </div>
        </div>
      );

    case "online-marketing":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute inset-x-0 top-0 rounded-[14px] border border-line bg-white p-3.5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted">{s.clicks}</span>
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-night">↗</span>
            </div>
            <div className="mt-3 flex h-16 items-end gap-1.5">
              {[30, 42, 38, 55, 50, 68, 74, 92].map((h, n) => (
                <span key={n} className={`flex-1 rounded-t ${n > 5 ? "bg-night" : "bg-line"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="absolute -bottom-1 left-3 flex items-center gap-2 rounded-[12px] border border-line bg-white px-3 py-2 shadow-soft">
            <span className="rounded border border-ink/30 px-1 text-[8.5px] font-bold">{s.ad}</span>
            <span className={`${bar} h-1.5 w-16 bg-ink`} />
          </div>
        </div>
      );

    case "branding":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute inset-0 grid grid-cols-5 gap-2.5">
            <div className="col-span-3 grid place-items-center rounded-[14px] bg-night shadow-soft">
              <span className="font-display text-[26px] font-extrabold tracking-[-0.06em] text-white">
                Aa<span className="text-accent">.</span>
              </span>
            </div>
            <div className="col-span-2 grid grid-rows-3 gap-2.5">
              <span className="rounded-[10px] bg-accent" />
              <span className="rounded-[10px] border border-line bg-white" />
              <span className="rounded-[10px] bg-[#3a4a12]" />
            </div>
          </div>
        </div>
      );

    case "wartung":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute inset-x-0 top-0 space-y-1.5 rounded-[14px] border border-line bg-white p-3 shadow-soft">
            <div className="flex items-center justify-between rounded-lg bg-night px-2.5 py-2 text-white">
              <span className="flex items-center gap-2 text-[10.5px] font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-accent" />
                </span>
                {s.uptime}
              </span>
              <span className="font-mono text-[10px] text-accent">99.9%</span>
            </div>
            {[s.backup, s.update, s.ssl].map((l) => (
              <div key={l} className="flex items-center gap-2 px-1 py-1 text-[10.5px] text-ink-soft">
                <Icon name="check" className="h-3 w-3 text-accent-ink" strokeWidth={3} /> {l}
              </div>
            ))}
          </div>
        </div>
      );

    case "kassensystem":
    case "kassensystem-gastro":
    case "kassensystem-retail":
      return (
        <div aria-hidden="true" className={frame}>
          <div className="absolute inset-0 grid grid-cols-5 gap-2 rounded-[16px] bg-night p-2.5 shadow-soft">
            <div className="col-span-3 grid grid-cols-3 gap-1.5">
              {["#d2ff28", "#2a2e25", "#2a2e25", "#2a2e25", "#d2ff28", "#2a2e25", "#2a2e25", "#2a2e25", "#2a2e25"].map((c, n) => (
                <span key={n} className="rounded-md" style={{ background: c, opacity: c === "#d2ff28" ? 0.9 : 1 }} />
              ))}
            </div>
            <div className="col-span-2 flex flex-col rounded-md bg-white p-2">
              <span className={`${bar} h-1 w-full bg-line`} />
              <span className={`${bar} mt-1.5 h-1 w-3/4 bg-line`} />
              <span className={`${bar} mt-1.5 h-1 w-5/6 bg-line`} />
              <span className="mt-auto flex items-center justify-between text-[8.5px] font-bold">
                {s.total} <span>CHF</span>
              </span>
              <span className="mt-1 rounded bg-accent py-1 text-center text-[8.5px] font-bold text-night">{s.pay}</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

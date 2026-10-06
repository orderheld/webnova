import type { Locale } from "@/content/types";
import { Icon } from "./icons";

const t = {
  de: {
    notif: "Neue Anfrage",
    notifSub: "Webseite · Bäckerei in Grenchen",
    now: "gerade eben",
    cta: "Offerte anfragen",
    chart: "Anfragen über die Webseite",
    query: "webdesign grenchen",
    result: "Webnova · Webdesign Agentur Grenchen",
    pills: ["Mobil optimiert", "Google-ready", "Blitzschnell"],
  },
  fr: {
    notif: "Nouvelle demande",
    notifSub: "Site web · Boulangerie à Bienne",
    now: "à l'instant",
    cta: "Demander un devis",
    chart: "Demandes via le site",
    query: "création site internet bienne",
    result: "Webnova · Agence web Bienne",
    pills: ["Optimisé mobile", "Prêt pour Google", "Ultra rapide"],
  },
};

/** Decorative hero composition: a website mock-up that "produces" enquiries, rankings and growth. */
export function HeroVisual({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-10 pt-6" aria-hidden="true">
      {/* Browser */}
      <div className="animate-rise overflow-hidden rounded-[26px] border border-white/10 bg-night-2 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] [animation-delay:150ms]">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-full bg-white/5 px-3 font-mono text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> ihre-firma.ch
          </span>
        </div>
        <div className="relative space-y-5 p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-16 rounded-full bg-white" />
            <div className="flex gap-2">
              <span className="h-2 w-8 rounded-full bg-white/20" />
              <span className="h-2 w-8 rounded-full bg-white/20" />
              <span className="h-2 w-8 rounded-full bg-white/20" />
              <span className="h-2 w-10 rounded-full bg-accent" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5 pt-3">
            <div className="col-span-3 space-y-3">
              <span className="block h-5 w-full rounded-lg bg-white" />
              <span className="block h-5 w-4/5 rounded-lg bg-white" />
              <span className="block h-5 w-3/5 rounded-lg bg-accent" />
              <span className="block h-2 w-11/12 rounded-full bg-white/15" />
              <span className="block h-2 w-3/4 rounded-full bg-white/15" />
              <span className="mt-2 inline-flex rounded-full bg-accent px-4 py-2 text-[11px] font-semibold text-night">{s.cta} →</span>
            </div>
            <div className="col-span-2 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,#d2ff28_0%,#7a9a10_35%,#1e2412_75%)] opacity-90" />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-1">
            <span className="h-14 rounded-xl bg-white/5" />
            <span className="h-14 rounded-xl bg-white/5" />
            <span className="h-14 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>

      {/* Enquiry notification */}
      <div className="absolute -left-3 top-0 animate-float rounded-2xl border border-white/10 bg-white p-3.5 pr-5 text-night shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] sm:-left-10">
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-accent">
            <Icon name="inbox" className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-success" />
            </span>
          </span>
          <div>
            <p className="text-[14px] font-semibold">{s.notif}</p>
            <p className="text-[12px] text-muted">
              {s.notifSub} · {s.now}
            </p>
          </div>
        </div>
      </div>

      {/* Growth chart */}
      <div className="absolute -right-2 top-[38%] w-[210px] animate-float-slow rounded-2xl border border-white/10 bg-night/90 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur sm:-right-12">
        <p className="flex items-center justify-between text-[12px] text-white/60">
          {s.chart}
          <Icon name="arrowUpRight" className="h-4 w-4 text-accent" />
        </p>
        <svg viewBox="0 0 180 64" className="mt-3 h-16 w-full">
          <defs>
            <linearGradient id="hv-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d2ff28" stopOpacity="0.35" />
              <stop offset="1" stopColor="#d2ff28" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 56 C20 54 30 50 45 46 S70 44 85 34 S115 30 130 20 S160 12 180 4 V64 H0Z" fill="url(#hv-fill)" />
          <path
            d="M0 56 C20 54 30 50 45 46 S70 44 85 34 S115 30 130 20 S160 12 180 4"
            fill="none"
            stroke="#d2ff28"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            className="animate-draw"
          />
        </svg>
      </div>

      {/* Google result */}
      <div className="absolute -bottom-8 -left-2 w-[260px] animate-pop rounded-2xl bg-white p-3.5 text-night shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] [animation-delay:900ms] sm:-left-12">
        <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted">
          <Icon name="search" className="h-3.5 w-3.5" /> {s.query}
        </div>
        <div className="mt-3 rounded-xl bg-accent-soft p-3">
          <p className="text-[11px] text-muted">webnova.ch</p>
          <p className="text-[13px] font-semibold text-[#1a3fbf]">{s.result}</p>
          <span className="mt-1.5 block h-1.5 w-11/12 rounded-full bg-night/10" />
        </div>
      </div>

      {/* Pills */}
      <div className="absolute -bottom-6 right-0 hidden flex-col gap-2 sm:flex">
        {s.pills.map((l, i) => (
          <span
            key={l}
            style={{ animationDelay: `${1.2 + i * 0.15}s` }}
            className="animate-pop inline-flex items-center gap-2 self-end rounded-full border border-white/10 bg-night-2 px-4 py-2 text-[13px] text-white shadow-lg"
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-accent text-night">
              <Icon name="check" className="h-3 w-3" strokeWidth={3} />
            </span>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

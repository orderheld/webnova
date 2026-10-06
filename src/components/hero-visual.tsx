import type { Locale } from "@/content/types";
import { Icon } from "./icons";

const t = {
  de: { notif: "Neue Anfrage", notifSub: "Redesign · Onlineshop", contact: "Offerte anfragen", mobile: "Mobil optimiert", seo: "Google-ready", fast: "Schnell geladen" },
  fr: { notif: "Nouvelle demande", notifSub: "Refonte · Boutique", contact: "Demander un devis", mobile: "Optimisé mobile", seo: "Prêt pour Google", fast: "Chargement rapide" },
};

/** Decorative illustration: a browser window that "produces" an inbound request. */
export function HeroVisual({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <div className="relative mx-auto max-w-[520px]" aria-hidden="true">
      <div className="absolute -inset-10 -z-10 rounded-full bg-accent/15 blur-3xl" />
      <div className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_50px_100px_-40px_rgba(14,14,16,0.35)]">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-4 h-6 flex-1 rounded-full bg-bg" />
        </div>
        <div className="space-y-5 p-7">
          <div className="flex items-center justify-between">
            <span className="h-3 w-20 rounded-full bg-ink" />
            <div className="flex gap-2">
              <span className="h-2.5 w-10 rounded-full bg-line" />
              <span className="h-2.5 w-10 rounded-full bg-line" />
              <span className="h-2.5 w-10 rounded-full bg-line" />
            </div>
          </div>
          <div className="space-y-3 pt-6">
            <span className="block h-7 w-4/5 rounded-xl bg-ink" />
            <span className="block h-7 w-3/5 rounded-xl bg-accent" />
            <span className="block h-2.5 w-11/12 rounded-full bg-line" />
            <span className="block h-2.5 w-3/4 rounded-full bg-line" />
          </div>
          <span className="inline-flex rounded-full bg-accent px-5 py-2.5 text-[13px] font-medium text-white">{s.contact} →</span>
          <div className="grid grid-cols-3 gap-3 pt-3">
            <span className="h-20 rounded-2xl bg-bg" />
            <span className="h-20 rounded-2xl bg-accent-soft" />
            <span className="h-20 rounded-2xl bg-bg" />
          </div>
        </div>
      </div>

      <div className="absolute -left-4 top-1/3 animate-float rounded-2xl border border-line bg-surface p-4 pr-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)] sm:-left-12">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/10 text-success">
            <Icon name="inbox" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[14px] font-medium">{s.notif}</p>
            <p className="text-[12px] text-muted">{s.notifSub}</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-2 flex flex-col gap-2 sm:-right-8">
        {[s.mobile, s.seo, s.fast].map((l, i) => (
          <span
            key={l}
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            className="animate-pop inline-flex items-center gap-2 self-end rounded-full bg-ink px-4 py-2 text-[13px] text-white shadow-lg"
          >
            <Icon name="check" className="h-3.5 w-3.5 text-accent-soft" /> {l}
          </span>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";
import type { Locale } from "@/content/types";
import { Icon } from "./icons";

const t = {
  de: {
    notif: "Neue Anfrage",
    notifSub: "Offertanfrage über die Webseite",
    now: "gerade eben",
    cta: "Offerte anfragen",
    chart: "Anfragen über die Webseite",
    query: "elektriker in der nähe",
    result: "Ihre Firma · Elektroinstallationen",
  },
  fr: {
    notif: "Nouvelle demande",
    notifSub: "Demande de devis via le site",
    now: "à l'instant",
    cta: "Demander un devis",
    chart: "Demandes via le site",
    query: "électricien près de moi",
    result: "Votre entreprise · Installations électriques",
  },
};

/**
 * Animated hero composition: a clean website mock-up builds itself, then an enquiry arrives,
 * the growth line draws and the Google result pops in. With a photo, the photo is the base
 * and the UI cards float over it.
 */
export function HeroVisual({ locale, photo }: { locale: Locale; photo?: { src: string; alt: string } }) {
  const s = t[locale];
  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-12 pt-8" aria-hidden={photo ? undefined : true}>
      {photo ? (
        <div className="relative aspect-[4/5] animate-rise overflow-hidden rounded-[28px] shadow-soft [animation-delay:150ms] sm:aspect-[5/5]">
          <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
        </div>
      ) : (
        <div className="animate-rise overflow-hidden rounded-[24px] border border-line bg-white shadow-soft [animation-delay:150ms]">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-full bg-bg px-3 font-mono text-[11px] text-muted">
              <Icon name="lock" className="h-3 w-3" /> ihre-firma.ch
            </span>
          </div>
          <div className="space-y-5 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="build h-2.5 w-16 rounded-full bg-ink [--d:300ms]" />
              <div className="flex gap-2">
                <span className="build h-2 w-8 rounded-full bg-line [--d:350ms]" />
                <span className="build h-2 w-8 rounded-full bg-line [--d:400ms]" />
                <span className="build h-2 w-8 rounded-full bg-line [--d:450ms]" />
                <span className="build h-2 w-10 rounded-full bg-ink [--d:500ms]" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-5 pt-3">
              <div className="col-span-3 space-y-3">
                <span className="build block h-5 w-full rounded-lg bg-ink [--d:550ms]" />
                <span className="build block h-5 w-4/5 rounded-lg bg-ink [--d:620ms]" />
                <span className="build block h-2 w-11/12 rounded-full bg-line [--d:700ms]" />
                <span className="build block h-2 w-3/4 rounded-full bg-line [--d:740ms]" />
                <span className="build mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold text-white [--d:820ms]">
                  {s.cta} <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
              </div>
              <div className="build col-span-2 rounded-2xl bg-[linear-gradient(150deg,#f0fcc8_0%,#eef0ea_55%,#e6e6e0_100%)] [--d:650ms]" />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <span className="build h-14 rounded-xl bg-bg [--d:900ms]" />
              <span className="build h-14 rounded-xl bg-bg [--d:950ms]" />
              <span className="build h-14 rounded-xl bg-bg [--d:1000ms]" />
            </div>
          </div>
        </div>
      )}

      {/* Enquiry notification */}
      <div className="absolute -left-3 top-0 animate-pop sm:-left-10 [animation-delay:1.3s]">
        <div className="animate-float rounded-2xl border border-line bg-white p-3.5 pr-5 text-ink shadow-soft">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-night text-white">
              <Icon name="inbox" className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />
            </span>
            <div>
              <p className="text-[14px] font-semibold">{s.notif}</p>
              <p className="text-[12px] text-muted">
                {s.notifSub} · {s.now}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth chart */}
      <div className="absolute -right-2 top-[40%] w-[210px] animate-pop sm:-right-12 [animation-delay:1.7s]">
        <div className="animate-float-slow rounded-2xl border border-line bg-white p-4 shadow-soft">
          <p className="flex items-center justify-between text-[12px] text-muted">
            {s.chart}
            <Icon name="arrowUpRight" className="h-4 w-4 text-ink" />
          </p>
          <svg viewBox="0 0 180 64" className="mt-3 h-16 w-full">
            <defs>
              <linearGradient id="hv-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0b0c0a" stopOpacity="0.08" />
                <stop offset="1" stopColor="#0b0c0a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 56 C20 54 30 50 45 46 S70 44 85 34 S115 30 130 20 S160 12 180 4 V64 H0Z" fill="url(#hv-fill)" />
            <path
              d="M0 56 C20 54 30 50 45 46 S70 44 85 34 S115 30 130 20 S160 12 180 4"
              fill="none"
              stroke="#0b0c0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              className="animate-draw [animation-delay:1.9s]"
            />
            <circle cx="180" cy="4" r="4" fill="#d2ff28" stroke="#0b0c0a" strokeWidth="1.5" className="animate-pop [animation-delay:3.2s]" />
          </svg>
        </div>
      </div>

      {/* Google result */}
      <div className="absolute -bottom-6 -left-2 w-[260px] animate-pop rounded-2xl border border-line bg-white p-3.5 text-ink shadow-soft [animation-delay:2.3s] sm:-left-12">
        <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted">
          <Icon name="search" className="h-3.5 w-3.5" /> {s.query}
        </div>
        <div className="mt-3 rounded-xl bg-bg p-3">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-accent/30" /> ihre-firma.ch
          </p>
          <p className="text-[13px] font-semibold text-ink">{s.result}</p>
          <span className="mt-1.5 block h-1.5 w-11/12 rounded-full bg-ink/10" />
        </div>
      </div>
    </div>
  );
}

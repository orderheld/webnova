import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/content/types";
import { href } from "@/lib/routes";
import { Icon } from "./icons";

const t = {
  de: {
    showcase: {
      caption: "Echte Projekte von Webnova",
      notif: "Neue Anfrage",
      notifSub: "Buffet für 80 Personen",
      order: "Bestellung eingegangen",
      orderSub: "CHF 48.50 · Lieferung",
      now: "gerade eben",
    },
    pain: {
      eyebrow: "Kennen Sie das?",
      title: "Sie sind richtig gut in dem, was Sie tun. Online merkt das nur kaum jemand.",
      items: [
        { title: "Die Website ist Ihnen ein bisschen peinlich.", text: "Sie geben die Adresse ungern weiter, weil sie nicht mehr zeigt, wer Sie heute sind." },
        { title: "Das Telefon bleibt still.", text: "Die Website ist zwar da, aber es kommen kaum Anfragen. Neue Kunden finden Sie nur über Empfehlungen." },
        { title: "Bei Google steht die Konkurrenz vorne.", text: "Wer in Ihrer Region sucht, landet beim Mitbewerber, obwohl Sie das bessere Angebot haben." },
      ],
      old: { welcome: "Willkommen auf unserer Homepage!", updated: "Zuletzt aktualisiert: 2014", visitors: "Besucher" },
      phone: { none: "Keine neuen Mitteilungen" },
      google: { query: "coiffeur in der nähe", page2: "Seite 2", you: "Ihre Firma" },
      resolve: "Das muss nicht so bleiben.",
      resolveText: "Wir bauen Ihnen einen Auftritt, auf den Sie stolz sind und der für Sie arbeitet, auch wenn Sie längst Feierabend haben.",
      cta: "Erstgespräch vereinbaren",
    },
    industries: {
      eyebrow: "Für Betriebe wie Ihren",
      title: "Wir kennen Ihren Alltag.",
      lead: "Ob Restaurant, Salon oder Werkstatt: Jede Branche hat andere Kunden und andere Fragen. Ihre Website beantwortet sie, bevor das Telefon klingelt.",
      items: {
        gastro: { label: "Gastronomie", line: "Bestellungen und Reservationen, auch wenn das Telefon besetzt ist." },
        catering: { label: "Catering & Events", line: "Anfragen für das nächste Fest, schon mit allen Details." },
        beauty: { label: "Coiffeur & Beauty", line: "Ein Auftritt, so gepflegt wie Ihr Salon." },
        craft: { label: "Handwerk & Bau", line: "Aufträge aus der Region, statt Preiskampf auf Plattformen." },
        retail: { label: "Detailhandel", line: "Laden, Onlineshop und Kasse aus einem Guss." },
        service: { label: "Praxis & Dienstleister", line: "Vertrauen auf den ersten Blick, Termine mit einem Klick." },
      },
      booking: { title: "Termin buchen", slots: ["Di 09:00", "Di 14:30", "Mi 10:00"] },
      pos: { total: "Total", pay: "Bezahlen" },
    },
    wall: {
      title1: "Sie haben Ihr Geschäft mit Herzblut aufgebaut.",
      title2: "Ihre Website sollte genau das zeigen.",
      text: "Wir lernen Ihren Betrieb kennen, bevor wir eine Zeile Code schreiben. Damit Ihre Kundschaft online spürt, was sie bei Ihnen vor Ort erlebt.",
    },
  },
  fr: {
    showcase: {
      caption: "Vrais projets de Webnova",
      notif: "Nouvelle demande",
      notifSub: "Buffet pour 80 personnes",
      order: "Commande reçue",
      orderSub: "CHF 48.50 · Livraison",
      now: "à l'instant",
    },
    pain: {
      eyebrow: "Ça vous parle ?",
      title: "Vous excellez dans votre métier. Mais en ligne, presque personne ne le remarque.",
      items: [
        { title: "Votre site vous gêne un peu.", text: "Vous hésitez à donner l'adresse, parce qu'il ne montre plus qui vous êtes aujourd'hui." },
        { title: "Le téléphone reste muet.", text: "Le site existe, mais les demandes n'arrivent pas. Les nouveaux clients viennent seulement du bouche-à-oreille." },
        { title: "Sur Google, la concurrence passe devant.", text: "Ceux qui cherchent dans votre région tombent sur un concurrent, alors que votre offre est meilleure." },
      ],
      old: { welcome: "Bienvenue sur notre page d'accueil !", updated: "Dernière mise à jour : 2014", visitors: "Visiteurs" },
      phone: { none: "Aucune nouvelle notification" },
      google: { query: "coiffeur près de moi", page2: "Page 2", you: "Votre entreprise" },
      resolve: "Ça peut changer.",
      resolveText: "Nous créons une présence dont vous êtes fier et qui travaille pour vous, même après la fermeture.",
      cta: "Fixer un premier entretien",
    },
    industries: {
      eyebrow: "Pour des entreprises comme la vôtre",
      title: "Nous connaissons votre quotidien.",
      lead: "Restaurant, salon ou atelier : chaque branche a ses clients et ses questions. Votre site y répond avant même que le téléphone sonne.",
      items: {
        gastro: { label: "Restauration", line: "Commandes et réservations, même quand la ligne est occupée." },
        catering: { label: "Traiteur & événements", line: "Des demandes pour la prochaine fête, avec tous les détails." },
        beauty: { label: "Coiffure & beauté", line: "Une présence aussi soignée que votre salon." },
        craft: { label: "Artisanat & construction", line: "Des mandats de la région, plutôt que la guerre des prix sur les plateformes." },
        retail: { label: "Commerce de détail", line: "Magasin, boutique en ligne et caisse d'un seul tenant." },
        service: { label: "Cabinets & prestataires", line: "La confiance au premier regard, les rendez-vous en un clic." },
      },
      booking: { title: "Prendre rendez-vous", slots: ["Ma 09:00", "Ma 14:30", "Me 10:00"] },
      pos: { total: "Total", pay: "Payer" },
    },
    wall: {
      title1: "Vous avez bâti votre entreprise avec passion.",
      title2: "Votre site doit le montrer.",
      text: "Nous apprenons à connaître votre entreprise avant d'écrire une seule ligne de code. Pour que vos clients ressentent en ligne ce qu'ils vivent chez vous.",
    },
  },
};

function BrowserBar({ domain }: { domain: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/10 bg-night-2 px-3.5 py-2.5">
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="ml-2 flex items-center gap-1.5 truncate rounded-full bg-white/5 px-3 py-0.5 font-mono text-[11px] text-white/45">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {domain}
      </span>
    </div>
  );
}

/** Hero composition built from real client work: a desktop site, a phone app and live-looking notifications. */
export function HeroShowcase({ locale }: { locale: Locale }) {
  const s = t[locale].showcase;
  return (
    <div className="relative mx-auto w-full max-w-[580px] pb-16 pt-10" aria-hidden="true">
      <div className="animate-rise ml-auto w-[92%] overflow-hidden rounded-[22px] border border-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] [animation-delay:150ms]">
        <BrowserBar domain="avacatering.ch" />
        <div className="relative aspect-[1200/630]">
          <Image src="/referenzen/ava-catering.jpg" alt="" fill priority sizes="(min-width: 1024px) 540px, 92vw" className="object-cover" />
        </div>
      </div>

      <div className="animate-rise absolute bottom-0 left-0 w-[34%] min-w-[130px] [animation-delay:350ms]">
        <div className="animate-float-slow rounded-[30px] border border-white/15 bg-night-2 p-1.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
          <div className="relative aspect-[390/780] overflow-hidden rounded-[24px] bg-white">
            <Image src="/visuals/orderheld-mobile.jpg" alt="" fill sizes="200px" className="object-cover object-top" />
            <span className="absolute left-1/2 top-1.5 h-3 w-14 -translate-x-1/2 rounded-full bg-night" />
          </div>
        </div>
      </div>

      <div className="animate-pop absolute -left-2 top-0 rounded-2xl bg-white p-3 pr-5 text-night shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] [animation-delay:700ms] sm:-left-8">
        <div className="animate-float flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-accent">
            <Icon name="inbox" className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-success" />
            </span>
          </span>
          <span>
            <span className="block text-[13px] font-bold">{s.notif}</span>
            <span className="block text-[12px] text-muted">
              {s.notifSub} · {s.now}
            </span>
          </span>
        </div>
      </div>

      <div className="animate-pop absolute bottom-8 right-0 rounded-2xl border border-white/10 bg-night-2/95 p-3 pr-5 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur [animation-delay:1000ms] sm:-right-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/20 text-[#4ade80]">
            <Icon name="check" className="h-5 w-5" strokeWidth={2.6} />
          </span>
          <span>
            <span className="block text-[13px] font-bold">{s.order}</span>
            <span className="block text-[12px] text-white/55">{s.orderSub}</span>
          </span>
        </div>
      </div>

      <p className="absolute bottom-[-6px] right-0 flex items-center gap-2 text-[12px] text-white/45 sm:right-2">
        <span className="h-px w-6 bg-white/30" />
        {s.caption}
      </p>
    </div>
  );
}

/** "Kennen Sie das?": three everyday frustrations of small businesses, each with a small illustration. */
export function PainPoints({ locale }: { locale: Locale }) {
  const p = t[locale].pain;
  const visuals = [
    // An outdated website
    <div key="old" className="relative h-full -rotate-2 overflow-hidden rounded-xl border-2 border-[#b9b4a6] bg-[#efece2] p-3 font-serif text-[#2b2b2b] shadow-sm">
      <div className="mb-2 flex gap-1">
        <span className="h-2 w-2 bg-[#b9b4a6]" />
        <span className="h-2 w-2 bg-[#b9b4a6]" />
      </div>
      <p className="text-[15px] font-bold italic text-[#1a3fbf] underline">{p.old.welcome}</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <span className="h-9 bg-[#cfcabb]" />
        <span className="h-9 bg-[#cfcabb]" />
        <span className="h-9 bg-[#cfcabb]" />
      </div>
      <div className="mt-2 h-3 bg-[repeating-linear-gradient(45deg,#f5c400_0_8px,#1a1a1a_8px_16px)]" />
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-[#7a7466]">{p.old.updated}</span>
        <span className="bg-black px-1.5 font-mono text-[10px] text-[#39ff14]">
          {p.old.visitors}: 000412
        </span>
      </div>
    </div>,
    // A silent phone
    <div key="phone" className="relative mx-auto h-full w-[150px] rounded-[26px] border-[5px] border-night bg-gradient-to-b from-[#2a2d33] to-[#14161a] p-3 text-center text-white shadow-lg">
      <span className="mx-auto block h-2.5 w-12 rounded-full bg-night" />
      <p className="mt-4 font-display text-[34px] font-light leading-none">18:42</p>
      <p className="mt-1 text-[10px] text-white/50">{locale === "de" ? "Freitag, 6. März" : "Vendredi 6 mars"}</p>
      <div className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-2 py-2 text-[10px] text-white/55">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0M3 3l18 18" />
        </svg>
        {p.phone.none}
      </div>
    </div>,
    // Competitors ahead on Google
    <div key="google" className="h-full rounded-xl border border-line bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-ink-soft">
        <Icon name="search" className="h-3.5 w-3.5 text-muted" />
        {p.google.query}
      </div>
      <div className="mt-3 space-y-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e8f0fe] text-[10px] font-bold text-[#1a56db]">{n}</span>
            <span className="h-2 flex-1 rounded-full bg-[#1a56db]/25" style={{ maxWidth: `${90 - n * 12}%` }} />
          </div>
        ))}
        <div className="flex items-center gap-2 border-t border-dashed border-line pt-2 opacity-50">
          <span className="rounded bg-bg px-1.5 text-[10px] text-muted">{p.google.page2}</span>
          <span className="text-[12px] font-medium text-muted line-through decoration-danger/60">{p.google.you}</span>
        </div>
      </div>
    </div>,
  ];

  return (
    <section className="container-x pb-8 pt-24 md:pt-32">
      <div className="reveal max-w-3xl">
        <p className="eyebrow mb-4">{p.eyebrow}</p>
        <h2 className="h-section">{p.title}</h2>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {p.items.map((it, i) => (
          <div key={i} className="reveal flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
            <div className="h-[240px] bg-bg/70 p-6 grayscale-[30%]">{visuals[i]}</div>
            <div className="p-7">
              <h3 className="font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">{it.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="reveal relative isolate mt-4 flex flex-col gap-6 overflow-hidden rounded-[28px] bg-night p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
        <div aria-hidden="true" className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/25 blur-[90px]" />
        <div className="max-w-2xl">
          <p className="font-display text-[clamp(1.7rem,3vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-accent">{p.resolve}</p>
          <p className="mt-2 text-[17px] leading-relaxed text-white/70">{p.resolveText}</p>
        </div>
        <Link
          href={href(locale, "request")}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-night transition-transform hover:scale-[1.03] md:self-auto"
        >
          {p.cta}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function IndustryText({ label, line, dark = true }: { label: string; line: string; dark?: boolean }) {
  return (
    <div className="relative">
      <p className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${dark ? "text-accent" : "text-night/60"}`}>{label}</p>
      <p className="mt-2 flex items-end justify-between gap-4 font-display text-[clamp(1.2rem,1.5vw,1.4rem)] font-bold leading-[1.18] tracking-[-0.025em]">
        <span>{line}</span>
        <Icon name="arrowUpRight" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
      </p>
    </div>
  );
}

const tile = "reveal group relative isolate flex flex-col justify-end overflow-hidden rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1";

/** Industry bento: real photos where we have real projects, illustrated cards elsewhere. */
export function IndustryGallery({ locale }: { locale: Locale }) {
  const s = t[locale].industries;
  const i = s.items;
  return (
    <section className="container-x pb-24 md:pb-32">
      <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow mb-4">{s.eyebrow}</p>
          <h2 className="h-section">{s.title}</h2>
        </div>
        <p className="text-[18px] leading-relaxed text-ink-soft md:col-span-5">{s.lead}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[300px_300px]">
        {/* Gastronomy: food photo with the ordering app on top */}
        <Link href={href(locale, "service:kassensystem-gastro")} className={`${tile} min-h-[440px] text-white lg:row-span-2`}>
          <Image src="/visuals/food-pizza.jpg" alt="" fill sizes="(min-width: 1024px) 300px, 100vw" className="-z-20 scale-110 object-cover blur-[2px] transition-transform duration-[1.4s] group-hover:scale-[1.15]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-night/10" />
          <div className="absolute right-6 top-6 w-[42%] max-w-[170px] rotate-[4deg] rounded-[24px] border border-white/20 bg-night-2 p-1 shadow-2xl transition-transform duration-700 group-hover:rotate-0">
            <div className="relative aspect-[390/700] overflow-hidden rounded-[19px] bg-white">
              <Image src="/visuals/orderheld-mobile.jpg" alt="" fill sizes="170px" className="object-cover object-top" />
            </div>
          </div>
          <IndustryText {...i.gastro} />
        </Link>

        {/* Catering: real AVA buffet */}
        <Link href={href(locale, "service:webdesign")} className={`${tile} min-h-[300px] text-white lg:col-span-2`}>
          <Image src="/visuals/ava-buffet.jpg" alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="-z-20 object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/50 to-transparent" />
          <IndustryText {...i.catering} />
        </Link>

        {/* Beauty: elegant typographic panel */}
        <Link href={href(locale, "service:webdesign")} className={`${tile} min-h-[300px] bg-[#151515] text-[#f3eee6]`}>
          <div aria-hidden="true" className="absolute -right-10 -top-10 -z-10 h-56 w-56 rounded-full bg-[#c9a46a]/30 blur-[70px]" />
          <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute right-7 top-7 h-12 w-12 text-[#c9a46a]" fill="none" stroke="currentColor" strokeWidth={1.3}>
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
          </svg>
          <p aria-hidden="true" className="absolute left-7 top-7 font-serif text-[15px] italic text-[#c9a46a]">
            Salon
          </p>
          <IndustryText {...i.beauty} />
        </Link>

        {/* Craft: blueprint grid */}
        <Link href={href(locale, "service:seo")} className={`${tile} min-h-[300px] bg-[#13233d] text-white`}>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <svg aria-hidden="true" viewBox="0 0 120 70" className="absolute right-6 top-6 w-32 text-accent" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <path d="M10 60V30l30-20 30 20v30Z" />
            <path d="M30 60V42h20v18M70 60h40M90 60V25M80 25h20" strokeDasharray="3 3" />
          </svg>
          <IndustryText {...i.craft} />
        </Link>

        {/* Retail: lime card with a mini POS */}
        <Link href={href(locale, "service:kassensystem-retail")} className={`${tile} min-h-[300px] bg-accent text-night`}>
          <div className="absolute right-5 top-5 w-36 origin-top-right rotate-[-3deg] scale-90 rounded-2xl bg-night p-3 text-white shadow-xl transition-transform duration-500 group-hover:rotate-0">
            {[
              ["Espresso-Bohnen", "18.90"],
              ["Tasse Keramik", "24.00"],
            ].map(([n, pr]) => (
              <div key={n} className="flex justify-between border-b border-white/10 py-1.5 text-[10px] text-white/70">
                <span>{n}</span>
                <span>{pr}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between text-[11px] font-bold">
              <span>{s.pos.total}</span>
              <span>CHF 42.90</span>
            </div>
            <span className="mt-2 block rounded-lg bg-accent py-1 text-center text-[10px] font-bold text-night">{s.pos.pay}</span>
          </div>
          <IndustryText {...i.retail} dark={false} />
        </Link>

        {/* Services & practices: booking widget */}
        <Link href={href(locale, "service:webdesign")} className={`${tile} min-h-[300px] border border-line bg-surface text-night`}>
          <div className="absolute right-5 top-5 w-40 origin-top-right scale-90 rounded-2xl border border-line bg-bg p-3 shadow-lg">
            <p className="flex items-center gap-1.5 text-[11px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {s.booking.title}
            </p>
            <div className="mt-2 grid gap-1.5">
              {s.booking.slots.map((slot, n) => (
                <span key={slot} className={`rounded-lg px-2 py-1 text-[10px] font-medium ${n === 1 ? "bg-night text-accent" : "bg-white text-ink-soft"}`}>
                  {slot}
                </span>
              ))}
            </div>
          </div>
          <IndustryText {...i.service} dark={false} />
        </Link>
      </div>
    </section>
  );
}

const wallA = ["/visuals/ava-tafel.jpg", "/referenzen/orderheld.jpg", "/visuals/ava-baklava.jpg", "/visuals/food-pide.jpg", "/visuals/ava-mezze.jpg"];
const wallB = ["/visuals/orderheld-desktop.jpg", "/visuals/ava-lunch.jpg", "/referenzen/ava-catering.jpg", "/visuals/food-pizza.jpg", "/visuals/orderheld-mobile.jpg"];

/** Emotional statement over a slowly moving wall of real project images. */
export function WorkWall({ locale }: { locale: Locale }) {
  const w = t[locale].wall;
  const row = (imgs: string[], cls: string) => (
    <div className={`flex w-max gap-4 ${cls}`}>
      {[...imgs, ...imgs].map((src, n) => (
        <div key={n} className="relative h-[180px] w-[260px] shrink-0 overflow-hidden rounded-2xl md:h-[230px] md:w-[340px]">
          <Image src={src} alt="" fill sizes="340px" className="object-cover object-top" />
        </div>
      ))}
    </div>
  );
  return (
    <section className="relative isolate overflow-hidden bg-night py-28 text-white md:py-40">
      <div aria-hidden="true" className="absolute inset-0 -z-20 flex -rotate-[4deg] scale-110 flex-col justify-center gap-4 opacity-45">
        {row(wallA, "animate-marquee")}
        {row(wallB, "animate-marquee-rev")}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(11,12,10,0.94)_30%,rgba(11,12,10,0.55)_100%)]" />
      <div className="container-x reveal text-center">
        <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.2rem,5.4vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">
          {w.title1} <span className="text-accent">{w.title2}</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-relaxed text-white/70 md:text-[20px]">{w.text}</p>
      </div>
    </section>
  );
}

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
      mock: {
        booking: "Termin buchen",
        slots: ["Di 09:00", "Di 14:30", "Mi 10:00"],
        request: "Offertanfrage",
        requestJob: "Badezimmer sanieren",
        requestPlace: "2540 Grenchen",
        send: "Anfrage senden",
        items: [["Espresso-Bohnen", "18.90"], ["Tasse Keramik", "24.00"]] as [string, string][],
        total: "Total",
        pay: "Bezahlen",
        practice: "Praxis am Markt",
        open: "Heute geöffnet",
        call: "Anrufen",
        route: "Route",
        web: "Website",
      },
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
      mock: {
        booking: "Prendre rendez-vous",
        slots: ["Ma 09:00", "Ma 14:30", "Me 10:00"],
        request: "Demande de devis",
        requestJob: "Rénover la salle de bain",
        requestPlace: "2502 Bienne",
        send: "Envoyer la demande",
        items: [["Grains d'espresso", "18.90"], ["Tasse en céramique", "24.00"]] as [string, string][],
        total: "Total",
        pay: "Payer",
        practice: "Cabinet du Marché",
        open: "Ouvert aujourd'hui",
        call: "Appeler",
        route: "Itinéraire",
        web: "Site web",
      },
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

/** Shared frame for the small illustrations: same size, background and grid everywhere. */
function VisualFrame({ children, dark = false, photo }: { children?: React.ReactNode; dark?: boolean; photo?: string }) {
  if (photo) {
    return (
      <div className="relative h-[220px] overflow-hidden" aria-hidden="true">
        <Image src={photo} alt="" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-2/70 to-transparent" />
      </div>
    );
  }
  return (
    <div
      className={`relative grid h-[220px] place-items-center overflow-hidden px-6 ${dark ? "bg-night-2" : "bg-bg"}`}
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 [background-size:24px_24px] ${
          dark
            ? "[background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)]"
            : "[background-image:radial-gradient(rgb(11_12_10/0.08)_1px,transparent_1px)]"
        }`}
      />
      <div className="relative w-full max-w-[260px]">{children}</div>
    </div>
  );
}

/** White mini-UI card used in every illustration. */
function MiniCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-4 text-night shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)] ${className}`}>{children}</div>;
}

const bar = (w: string, cls = "bg-line") => <span className={`block h-2 rounded-full ${cls}`} style={{ width: w }} />;

/** "Kennen Sie das?": three everyday frustrations of small businesses, each with a small illustration. */
export function PainPoints({ locale }: { locale: Locale }) {
  const p = t[locale].pain;
  const visuals = [
    // An outdated website: grey, dense, nothing to click
    <MiniCard key="old" className="-rotate-2">
      <p className="font-serif text-[14px] italic text-muted underline">{p.old.welcome}</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <span className="h-8 rounded bg-line" />
        <span className="h-8 rounded bg-line" />
        <span className="h-8 rounded bg-line" />
      </div>
      <div className="mt-3 space-y-1.5">
        {bar("100%")}
        {bar("85%")}
        {bar("92%")}
      </div>
      <p className="mt-3 text-[11px] text-muted">{p.old.updated}</p>
    </MiniCard>,
    // A silent phone
    <MiniCard key="phone" className="mx-auto w-[170px] text-center">
      <p className="font-display text-[30px] font-light leading-none text-night/80">18:42</p>
      <p className="mt-1 text-[11px] text-muted">{locale === "de" ? "Freitag" : "Vendredi"}</p>
      <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-bg px-2 py-2 text-[11px] text-muted">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0M3 3l18 18" />
        </svg>
        {p.phone.none}
      </div>
    </MiniCard>,
    // Competitors ahead on Google
    <MiniCard key="google">
      <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-ink-soft">
        <Icon name="search" className="h-3.5 w-3.5 text-muted" />
        {p.google.query}
      </div>
      <div className="mt-3 space-y-2.5">
        {["78%", "64%", "70%"].map((w, n) => (
          <div key={n} className="flex items-center gap-2">
            <span className="w-3 text-[10px] font-semibold text-muted">{n + 1}</span>
            {bar(w)}
          </div>
        ))}
        <div className="flex items-center gap-2 border-t border-dashed border-line pt-2">
          <span className="text-[10px] text-muted">{p.google.page2}</span>
          <span className="text-[12px] font-medium text-muted">{p.google.you}</span>
        </div>
      </div>
    </MiniCard>,
  ];

  return (
    <section className="container-x pb-8 pt-24 md:pt-32">
      <SectionHead eyebrow={p.eyebrow} title={p.title} />
      <div className="grid gap-4 md:grid-cols-3">
        {p.items.map((it, i) => (
          <div key={i} className="reveal flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
            <VisualFrame>{visuals[i]}</VisualFrame>
            <div className="p-7">
              <h3 className="font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">{it.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="reveal relative isolate mt-4 flex flex-col gap-6 overflow-hidden rounded-[28px] bg-night p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
        <div aria-hidden="true" className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-[90px]" />
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

/** Section header used by the home sections: eyebrow + title left, optional lead right. */
export function SectionHead({ eyebrow, title, lead, dark = false }: { eyebrow: string; title: string; lead?: string; dark?: boolean }) {
  return (
    <div className="reveal mb-14 grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <p className={`eyebrow mb-4 ${dark ? "!text-white/50" : ""}`}>{eyebrow}</p>
        <h2 className="h-section">{title}</h2>
      </div>
      {lead && <p className={`text-[18px] leading-relaxed md:col-span-5 ${dark ? "text-white/65" : "text-ink-soft"}`}>{lead}</p>}
    </div>
  );
}

/** Industry grid: six equal dark tiles, each with a photo or a mini-UI in the same style. */
export function IndustryGallery({ locale }: { locale: Locale }) {
  const s = t[locale].industries;
  const i = s.items;
  const m = s.mock;
  const tiles: { key: keyof typeof i; href: string; photo?: string; visual?: React.ReactNode }[] = [
    {
      key: "gastro",
      href: href(locale, "service:kassensystem-gastro"),
      photo: "/visuals/food-pide.jpg",
    },
    {
      key: "catering",
      href: href(locale, "service:webdesign"),
      photo: "/visuals/ava-buffet.jpg",
    },
    {
      key: "beauty",
      href: href(locale, "service:webdesign"),
      visual: (
        <MiniCard>
          <p className="flex items-center gap-1.5 text-[12px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {m.booking}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {m.slots.map((slot, n) => (
              <span key={slot} className={`rounded-lg py-1.5 text-center text-[11px] font-medium ${n === 1 ? "bg-night text-accent" : "bg-bg text-ink-soft"}`}>
                {slot}
              </span>
            ))}
          </div>
        </MiniCard>
      ),
    },
    {
      key: "craft",
      href: href(locale, "service:seo"),
      visual: (
        <MiniCard>
          <p className="text-[12px] font-bold">{m.request}</p>
          <div className="mt-3 space-y-2">
            <span className="block rounded-lg bg-bg px-3 py-1.5 text-[11px] text-ink-soft">{m.requestJob}</span>
            <span className="block rounded-lg bg-bg px-3 py-1.5 text-[11px] text-ink-soft">{m.requestPlace}</span>
          </div>
          <span className="mt-3 block rounded-lg bg-night py-1.5 text-center text-[11px] font-bold text-accent">{m.send}</span>
        </MiniCard>
      ),
    },
    {
      key: "retail",
      href: href(locale, "service:kassensystem-retail"),
      visual: (
        <MiniCard>
          {m.items.map(([n, pr]) => (
            <div key={n} className="flex justify-between border-b border-line py-1.5 text-[11px] text-ink-soft">
              <span>{n}</span>
              <span>{pr}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between text-[12px] font-bold">
            <span>{m.total}</span>
            <span>CHF 42.90</span>
          </div>
          <span className="mt-2 block rounded-lg bg-night py-1.5 text-center text-[11px] font-bold text-accent">{m.pay}</span>
        </MiniCard>
      ),
    },
    {
      key: "service",
      href: href(locale, "service:webdesign"),
      visual: (
        <MiniCard>
          <p className="text-[13px] font-bold">{m.practice}</p>
          <p className="mt-0.5 text-[11px] text-success">{m.open}</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[
              ["phone", m.call],
              ["pin", m.route],
              ["globe", m.web],
            ].map(([icon, label]) => (
              <span key={label} className="flex flex-col items-center gap-1 rounded-lg bg-bg py-2 text-[10px] text-ink-soft">
                <Icon name={icon} className="h-3.5 w-3.5 text-night" />
                {label}
              </span>
            ))}
          </div>
        </MiniCard>
      ),
    },
  ];

  return (
    <section className="relative isolate bg-night py-24 text-white md:py-32">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div className="container-x">
        <SectionHead eyebrow={s.eyebrow} title={s.title} lead={s.lead} dark />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <Link
              key={tile.key}
              href={tile.href}
              className="reveal group flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-night-2 transition-colors duration-300 hover:border-accent/50"
            >
              <VisualFrame dark photo={tile.photo}>
                {tile.visual}
              </VisualFrame>
              <div className="flex flex-1 items-end justify-between gap-4 p-7">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">{i[tile.key].label}</p>
                  <p className="mt-2 font-display text-[20px] font-bold leading-snug tracking-[-0.02em]">{i[tile.key].line}</p>
                </div>
                <Icon name="arrowUpRight" className="h-5 w-5 shrink-0 text-white/40 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>
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

import { FaqList } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import type { Faq, Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";

interface Lp {
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  lead: string;
  bullets: string[];
  benefitsTitle: string;
  benefits: { icon: string; title: string; text: string }[];
  faq: Faq[];
  preset: ("webdesign" | "redesign" | "pos")[];
}

const content: Record<string, Record<Locale, Lp>> = {
  webseite: {
    de: {
      meta: {
        title: "Neue Webseite, die Anfragen bringt",
        description: "Moderne Webseite für Ihr KMU: schnell, mobil, bei Google sichtbar. Kostenlose Erstberatung und unverbindliche Offerte von Webnova.",
      },
      eyebrow: "Webdesign für KMU in der Schweiz",
      h1: "Ihre neue Webseite. Modern, schnell und gemacht für Anfragen.",
      lead: "Schluss mit veralteten Webseiten, die niemand findet. Wir bauen Ihnen einen Auftritt, der überzeugt und Kunden bringt.",
      bullets: ["Individuelles Design, kein Baukasten", "Optimiert für Handy und Google", "Persönliche Betreuung aus Grenchen"],
      benefitsTitle: "Was Sie bekommen",
      benefits: [
        { icon: "layout", title: "Design mit Wirkung", text: "Ein klarer, moderner Auftritt, der Vertrauen schafft und Ihre Stärken auf den Punkt bringt." },
        { icon: "bolt", title: "Blitzschnell", text: "Moderne Technik für kurze Ladezeiten. Das mögen Besucher und Google gleichermassen." },
        { icon: "search", title: "SEO inklusive", text: "Saubere Struktur, Meta-Daten und lokale Optimierung, damit Sie gefunden werden." },
        { icon: "users", title: "Ein Ansprechpartner", text: "Vom Erstgespräch bis nach dem Launch: persönlich, direkt und auf Deutsch oder Französisch." },
      ],
      faq: [
        { q: "Was kostet eine neue Webseite?", a: "Das hängt von Umfang und Funktionen ab. Nach einem kurzen Gespräch erhalten Sie eine transparente Offerte, ohne versteckte Kosten." },
        { q: "Wie schnell geht es?", a: "Eine typische KMU-Webseite ist in wenigen Wochen online. Den genauen Zeitplan legen wir gemeinsam fest." },
        { q: "Ich habe bereits eine Webseite. Lohnt sich ein Redesign?", a: "Oft ja. Wir prüfen Ihre bestehende Seite und zeigen Ihnen, wo das grösste Potenzial liegt, inklusive Weiterleitungen, damit Ihre Google-Rankings erhalten bleiben." },
      ],
      preset: ["webdesign"],
    },
    fr: {
      meta: {
        title: "Un nouveau site qui génère des demandes",
        description: "Site internet moderne pour votre PME : rapide, mobile, visible sur Google. Premier conseil gratuit et devis sans engagement de Webnova.",
      },
      eyebrow: "Création de sites pour PME en Suisse",
      h1: "Votre nouveau site. Moderne, rapide et pensé pour les demandes.",
      lead: "Fini les sites dépassés que personne ne trouve. Nous créons une présence en ligne qui convainc et vous apporte des clients.",
      bullets: ["Design sur mesure, pas de modèle", "Optimisé pour mobile et Google", "Accompagnement personnel depuis Granges"],
      benefitsTitle: "Ce que vous obtenez",
      benefits: [
        { icon: "layout", title: "Un design qui marque", text: "Une présence claire et moderne qui inspire confiance et met vos forces en valeur." },
        { icon: "bolt", title: "Ultra rapide", text: "Une technologie moderne pour des temps de chargement courts, appréciés des visiteurs comme de Google." },
        { icon: "search", title: "SEO compris", text: "Structure propre, métadonnées et optimisation locale pour être trouvé." },
        { icon: "users", title: "Un seul interlocuteur", text: "Du premier entretien à la mise en ligne et au-delà : personnel, direct, en français ou en allemand." },
      ],
      faq: [
        { q: "Combien coûte un nouveau site ?", a: "Cela dépend de l'envergure et des fonctions. Après un court échange, vous recevez un devis transparent, sans coûts cachés." },
        { q: "Combien de temps faut-il ?", a: "Un site typique de PME est en ligne en quelques semaines. Nous fixons ensemble le calendrier précis." },
        { q: "J'ai déjà un site. Une refonte vaut-elle la peine ?", a: "Souvent oui. Nous analysons votre site actuel et vous montrons où se trouve le plus grand potentiel, redirections comprises pour conserver votre référencement." },
      ],
      preset: ["webdesign"],
    },
  },
  kassensystem: {
    de: {
      meta: {
        title: "Kassensystem für Gastro & Detailhandel",
        description: "Modernes Kassensystem für Restaurant, Café, Bar und Laden. Einrichtung und Schulung vor Ort, Support aus der Region. Jetzt unverbindlich anfragen.",
      },
      eyebrow: "Kassensystem für Gastronomie und Detailhandel",
      h1: "Das Kassensystem, das einfach funktioniert.",
      lead: "Für Restaurants, Cafés, Bars und Läden: schnell kassieren, alles im Blick, eingerichtet und geschult direkt bei Ihnen vor Ort.",
      bullets: ["Karte, TWINT und Bargeld", "Tischplan, Küchen- und Barbons", "Einrichtung & Schulung vor Ort"],
      benefitsTitle: "Darum lohnt sich der Wechsel",
      benefits: [
        { icon: "terminal", title: "Intuitive Bedienung", text: "Touch-Kasse auf Tablet oder Terminal. Neue Mitarbeitende sind in kurzer Zeit startklar." },
        { icon: "utensils", title: "Für die Gastronomie", text: "Tischplan, Bestellungen direkt an Küche und Bar, getrennte Rechnungen." },
        { icon: "bag", title: "Für den Detailhandel", text: "Artikel- und Lagerverwaltung, Barcode-Scan, Belege und Tagesabschluss auf Knopfdruck." },
        { icon: "users", title: "Support aus der Region", text: "Wir richten alles ein, schulen Ihr Team und sind erreichbar, wenn Sie uns brauchen." },
      ],
      faq: [
        { q: "Für welche Betriebe eignet sich das Kassensystem?", a: "Für Restaurants, Cafés, Bars, Take-aways sowie Läden und Boutiquen. Wir stimmen die Einrichtung auf Ihren Betrieb ab." },
        { q: "Welche Zahlungsarten werden unterstützt?", a: "Bargeld, Karten und TWINT. Die genaue Konfiguration klären wir im Erstgespräch." },
        { q: "Was kostet das Kassensystem?", a: "Das hängt von der Anzahl Kassen, Druckern und Funktionen ab. Sie erhalten eine unverbindliche Offerte nach einem kurzen Gespräch." },
      ],
      preset: ["pos"],
    },
    fr: {
      meta: {
        title: "Système de caisse restaurant & commerce",
        description: "Système de caisse moderne pour restaurant, café, bar et magasin. Installation et formation sur place, support régional. Demande sans engagement.",
      },
      eyebrow: "Système de caisse pour la restauration et le commerce",
      h1: "Le système de caisse qui fonctionne, tout simplement.",
      lead: "Pour restaurants, cafés, bars et magasins : encaisser vite, tout garder sous contrôle, installé et expliqué directement chez vous.",
      bullets: ["Carte, TWINT et espèces", "Plan de salle, bons cuisine et bar", "Installation et formation sur place"],
      benefitsTitle: "Pourquoi changer",
      benefits: [
        { icon: "terminal", title: "Utilisation intuitive", text: "Caisse tactile sur tablette ou terminal. Les nouveaux collaborateurs sont opérationnels rapidement." },
        { icon: "utensils", title: "Pour la restauration", text: "Plan de salle, commandes envoyées en cuisine et au bar, additions séparées." },
        { icon: "bag", title: "Pour le commerce", text: "Gestion des articles et du stock, scan des codes-barres, tickets et clôture journalière en un clic." },
        { icon: "users", title: "Support régional", text: "Nous installons tout, formons votre équipe et restons joignables quand vous avez besoin de nous." },
      ],
      faq: [
        { q: "Pour quels établissements ?", a: "Restaurants, cafés, bars, take-aways ainsi que magasins et boutiques. Nous adaptons la configuration à votre établissement." },
        { q: "Quels moyens de paiement ?", a: "Espèces, cartes et TWINT. Nous clarifions la configuration exacte lors du premier entretien." },
        { q: "Combien coûte le système de caisse ?", a: "Cela dépend du nombre de caisses, d'imprimantes et des fonctions. Vous recevez un devis sans engagement après un court échange." },
      ],
      preset: ["pos"],
    },
  },
};

export function lpMeta(locale: Locale, key: string) {
  return content[key][locale].meta;
}

export function LandingPage({ locale, lpKey }: { locale: Locale; lpKey: string }) {
  const d = getDict(locale);
  const c = content[lpKey][locale];
  return (
    <>
      <section className="relative isolate overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 -z-10 h-[520px] w-[520px] animate-drift rounded-full bg-accent/25 blur-[140px]" />
        <div className="container-x relative grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 lg:pt-6">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13px] text-white/75">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {c.eyebrow}
            </p>
            <h1 className="display text-[clamp(2.4rem,5.4vw,4.4rem)]">{c.h1}</h1>
            <p className="mt-6 text-[18px] leading-relaxed text-white/70">{c.lead}</p>
            <ul className="mt-8 space-y-3">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[16px]">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-night">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <a href={site.phoneHref} className="mt-10 inline-flex items-center gap-3 text-[17px] text-white/80 hover:text-accent">
              <Icon name="phone" className="h-5 w-5 text-accent" /> {site.phone}
            </a>
          </div>
          <div id="formular" className="lg:col-span-7">
            <LeadForm
              locale={locale}
              t={d.form}
              thanksHref={href(locale, "thanks")}
              privacyHref={href(locale, "legal:datenschutz")}
              source={`lp-${lpKey}`}
              preset={c.preset}
              dark
            />
          </div>
        </div>
      </section>

      <section className="bg-accent">
        <div className="container-x flex flex-wrap justify-center gap-x-10 gap-y-3 py-5 text-[15px] font-semibold text-night">
          {d.lp.trust.map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4" strokeWidth={2.6} /> {t}
            </span>
          ))}
        </div>
      </section>

      <section className="container-x py-24">
        <h2 className="h-section reveal mb-12">{c.benefitsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.benefits.map((b) => (
            <div key={b.title} className="reveal group rounded-[24px] border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-night">
              <span className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-night text-accent transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Icon name={b.icon} />
              </span>
              <h3 className="text-[20px] font-bold tracking-tight">{b.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqList locale={locale} faq={c.faq} />

      <section className="container-x pb-24 text-center">
        <a
          href="#formular"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-[16px] font-semibold text-night transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(75,102,0,0.6)]"
        >
          {d.nav.cta} <Icon name="arrow" className="h-4 w-4" />
        </a>
      </section>
    </>
  );
}

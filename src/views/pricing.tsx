import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CtaBand, HeroCtas, PageHero } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { FaqSection, ProcessSection, SectionHead } from "@/components/sections";
import { carePrice, chf, costAnswer, gbpPrice, packagePrice, pricePackages, swissNumber } from "@/content/pricing";
import type { Faq, Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href } from "@/lib/routes";
import { JsonLd, breadcrumbLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

export const pricingText = {
  de: {
    title: "Preise",
    metaTitle: "Preise: Was kostet eine Webseite?",
    metaDesc: `Webseiten ab ${chf(packagePrice("starter"))}, Onlineshops ab ${chf(packagePrice("shop"))}, Hosting und Wartung ${chf(carePrice)} pro Monat. Klare Pakete für Schweizer KMU. Jetzt kostenlos beraten lassen.`,
    h1: "Preise für Webseiten und Onlineshops",
    subline: "Klar vorab, ohne versteckte Kosten.",
    lead: "Alle Preise in Schweizer Franken. Hier sehen Sie, womit Sie rechnen können. Die genaue Offerte mit allen Positionen erhalten Sie nach einem kostenlosen Erstgespräch.",
    facts: ["Kostenloses Erstgespräch", "Schriftliche Offerte vor dem Start", "Hosting und Wartung im 1. Jahr inbegriffen"],
    packagesEyebrow: "Webseiten-Pakete",
    packagesTitle: "Vier Pakete, ein klarer Preis.",
    packagesLead: "Wählen Sie das Paket, das zu Ihrem Betrieb passt. Mehr Seiten, eine zweite Sprache oder zusätzliche Funktionen ergänzen wir als Extras.",
    from: "ab",
    once: "einmalig",
    recommended: "Unsere Empfehlung",
    choose: "Paket anfragen",
    firstYear: `Bei allen Paketen sind Hosting und Wartung im ersten Jahr inbegriffen, danach kosten sie ${chf(carePrice)} pro Monat.`,
    runningEyebrow: "Nach dem Start",
    runningTitle: "Laufende Kosten und Google-Profil",
    runningLead: "Damit Ihre Webseite sicher und aktuell bleibt und Ihr Betrieb auch in Google Maps gefunden wird.",
    perMonth: "pro Monat",
    care: {
      name: "Hosting und Wartung",
      note: "Im ersten Jahr im Projektpreis inbegriffen.",
      items: ["Hosting mit SSL-Zertifikat", "Tägliche Backups", "Updates und Sicherheit", "Kleine Anpassungen", "Persönlicher Support"],
      foot: "Für Webseiten anderer Anbieter erhalten Sie eine eigene Offerte.",
      more: "Mehr zur Wartung",
    },
    gbp: {
      name: "Google-Unternehmensprofil",
      care: `Betreuung auf Wunsch: ${chf(gbpPrice.monthly)} pro Monat`,
      items: ["Profil einrichten oder übernehmen", "Bestätigung bei Google", "Logo, Fotos und alle Angaben", "Bewertungen mit System"],
      careText: "Die Betreuung umfasst Beiträge, Antworten auf Bewertungen, die Pflege der Angaben und eine kurze Auswertung jeden Monat.",
      note: "Im Paket KMU ist die Einrichtung bereits enthalten.",
      more: "Mehr zum Google-Profil",
    },
    extrasEyebrow: "Extras",
    extrasTitle: "Sinnvoll erweitern",
    extrasLead: "Jedes Extra steht mit seinem Preis in Ihrer Offerte, bevor Sie entscheiden.",
    extras: [
      { icon: "layout", label: "Weitere Seiten" },
      { icon: "globe", label: "Zweite Sprache", id: "guide:zweisprachige-webseite" },
      { icon: "calendar", label: "Online-Buchung" },
      { icon: "file", label: "Blog oder News" },
      { icon: "pen", label: "Texte schreiben" },
      { icon: "image", label: "Bilder und Fotos" },
      { icon: "pen", label: "Logo und Branding", id: "service:branding" },
      { icon: "search", label: "SEO-Paket", id: "service:seo" },
      { icon: "terminal", label: "Anbindung ans Kassensystem", id: "service:kassensystem" },
      { icon: "mail", label: "Newsletter" },
      { icon: "refresh", label: "Übernahme der alten Webseite", id: "service:website-redesign" },
    ],
    stepsTitle: "So entsteht Ihr Preis",
    stepsLead: "Sie wissen vor dem Start, was Ihre Webseite kostet, und entscheiden erst dann.",
    steps: [
      { title: "Kostenloses Erstgespräch", text: "Wir klären Ziel, Umfang und Budget. Am Telefon, per Videocall oder bei Ihnen vor Ort." },
      { title: "Schriftliche Offerte", text: "Sie erhalten eine Offerte mit allen Positionen, auch den laufenden Kosten." },
      { title: "Start mit Ihrem OK", text: "Wir beginnen erst, wenn Sie der Offerte zugestimmt haben." },
    ],
    faq: [
      {
        q: "Was bedeutet «ab» bei den Preisen?",
        a: "Der Paketpreis gilt für den beschriebenen Umfang. Brauchen Sie mehr Seiten, eine zweite Sprache, Texte von uns oder eine Online-Buchung, steht das als eigene Position in der Offerte. So sehen Sie vor dem Start, was Ihre Webseite kostet.",
      },
      { q: "Was kostet eine Webseite bei Webnova?", a: costAnswer("de", "website") },
      { q: "Was kostet ein Onlineshop?", a: costAnswer("de", "shop") },
      {
        q: "Welche laufenden Kosten kommen dazu?",
        a: `Hosting und Wartung kosten ${chf(carePrice)} pro Monat. Im ersten Jahr sind sie im Projektpreis inbegriffen, verrechnet werden sie ab dem zweiten Jahr. Die Kosten für Ihre Domain stehen ebenfalls in der Offerte.`,
      },
      { q: "Was kostet das Google-Unternehmensprofil?", a: costAnswer("de", "gbp") },
      { q: "Gibt es versteckte Kosten?", a: "Nein. Vor dem Start erhalten Sie eine schriftliche Offerte mit allen Positionen, auch den laufenden Kosten. Wir beginnen erst, wenn Sie zugestimmt haben." },
      { q: "Ist das Erstgespräch kostenlos?", a: "Ja. Im Erstgespräch klären wir Ziel, Umfang und Budget, kostenlos und unverbindlich. Danach erhalten Sie eine schriftliche Offerte." },
      {
        q: "Kann ich klein starten und später ausbauen?",
        a: "Ja. Sie können mit Starter oder KMU beginnen und später Seiten, eine zweite Sprache oder einen Shop ergänzen, ohne die Webseite neu bauen zu müssen.",
      },
    ] as Faq[],
    offerName: "Webseite",
  },
  fr: {
    title: "Tarifs",
    metaTitle: "Tarifs : combien coûte un site internet ?",
    metaDesc: `Sites internet dès ${chf(packagePrice("starter"))}, boutiques en ligne dès ${chf(packagePrice("shop"))}, hébergement et maintenance ${chf(carePrice)} par mois. Des formules claires pour les PME suisses.`,
    h1: "Tarifs des sites internet et boutiques en ligne",
    subline: "Clairs dès le départ, sans coûts cachés.",
    lead: "Tous les prix en francs suisses. Vous voyez ici à quoi vous attendre. Vous recevez le devis exact avec tous les postes après un premier entretien gratuit.",
    facts: ["Premier entretien gratuit", "Devis écrit avant le début", "Hébergement et maintenance compris la 1re année"],
    packagesEyebrow: "Formules site internet",
    packagesTitle: "Quatre formules, un prix clair.",
    packagesLead: "Choisissez la formule qui correspond à votre entreprise. Pages supplémentaires, deuxième langue ou fonctions en plus s'ajoutent en options.",
    from: "dès",
    once: "paiement unique",
    recommended: "Notre recommandation",
    choose: "Demander cette formule",
    firstYear: `Avec toutes les formules, l'hébergement et la maintenance sont compris la première année, ensuite ils coûtent ${chf(carePrice)} par mois.`,
    runningEyebrow: "Après la mise en ligne",
    runningTitle: "Coûts récurrents et fiche Google",
    runningLead: "Pour que votre site reste sûr et à jour, et que votre entreprise soit aussi trouvée dans Google Maps.",
    perMonth: "par mois",
    care: {
      name: "Hébergement et maintenance",
      note: "Compris dans le prix du projet la première année.",
      items: ["Hébergement avec certificat SSL", "Sauvegardes quotidiennes", "Mises à jour et sécurité", "Petites adaptations", "Support personnel"],
      foot: "Pour les sites d'autres prestataires, vous recevez une offre séparée.",
      more: "En savoir plus sur la maintenance",
    },
    gbp: {
      name: "Fiche Google Business Profile",
      care: `Suivi sur demande : ${chf(gbpPrice.monthly)} par mois`,
      items: ["Création ou reprise de la fiche", "Validation auprès de Google", "Logo, photos et toutes les informations", "Avis clients avec méthode"],
      careText: "Le suivi comprend des publications, les réponses aux avis, la mise à jour des informations et un bref rapport chaque mois.",
      note: "Dans la formule PME, la mise en place est déjà comprise.",
      more: "En savoir plus sur la fiche Google",
    },
    extrasEyebrow: "Options",
    extrasTitle: "Compléter selon vos besoins",
    extrasLead: "Chaque option figure avec son prix dans votre devis, avant que vous décidiez.",
    extras: [
      { icon: "layout", label: "Pages supplémentaires" },
      { icon: "globe", label: "Deuxième langue", id: "guide:zweisprachige-webseite" },
      { icon: "calendar", label: "Réservation en ligne" },
      { icon: "file", label: "Blog ou actualités" },
      { icon: "pen", label: "Rédaction des textes" },
      { icon: "image", label: "Images et photos" },
      { icon: "pen", label: "Logo et identité visuelle", id: "service:branding" },
      { icon: "search", label: "Formule SEO", id: "service:seo" },
      { icon: "terminal", label: "Liaison avec la caisse", id: "service:kassensystem" },
      { icon: "mail", label: "Newsletter" },
      { icon: "refresh", label: "Reprise de l'ancien site", id: "service:website-redesign" },
    ],
    stepsTitle: "Comment se forme votre prix",
    stepsLead: "Vous savez avant le début ce que coûte votre site, et vous décidez ensuite.",
    steps: [
      { title: "Premier entretien gratuit", text: "Nous clarifions objectif, ampleur et budget. Par téléphone, en visioconférence ou chez vous." },
      { title: "Devis écrit", text: "Vous recevez un devis avec tous les postes, y compris les coûts récurrents." },
      { title: "Début avec votre accord", text: "Nous ne commençons qu'une fois le devis accepté." },
    ],
    faq: [
      {
        q: "Que signifie « dès » dans les prix ?",
        a: "Le prix de la formule vaut pour l'ampleur décrite. Si vous avez besoin de pages supplémentaires, d'une deuxième langue, de textes rédigés par nous ou d'une réservation en ligne, cela figure comme poste séparé dans le devis. Vous savez ainsi avant le début ce que coûte votre site.",
      },
      { q: "Combien coûte un site internet chez Webnova ?", a: costAnswer("fr", "website") },
      { q: "Combien coûte une boutique en ligne ?", a: costAnswer("fr", "shop") },
      {
        q: "Quels coûts récurrents s'ajoutent ?",
        a: `L'hébergement et la maintenance coûtent ${chf(carePrice)} par mois. Ils sont compris dans le prix du projet la première année et facturés dès la deuxième année. Les frais de votre nom de domaine figurent aussi dans le devis.`,
      },
      { q: "Combien coûte la fiche Google Business Profile ?", a: costAnswer("fr", "gbp") },
      { q: "Y a-t-il des coûts cachés ?", a: "Non. Avant le début, vous recevez un devis écrit avec tous les postes, y compris les coûts récurrents. Nous ne commençons qu'avec votre accord." },
      { q: "Le premier entretien est-il gratuit ?", a: "Oui. Lors du premier entretien, nous clarifions objectif, ampleur et budget, gratuitement et sans engagement. Vous recevez ensuite un devis écrit." },
      {
        q: "Puis-je commencer petit et agrandir plus tard ?",
        a: "Oui. Vous pouvez commencer avec Starter ou PME, puis ajouter des pages, une deuxième langue ou une boutique sans reconstruire le site.",
      },
    ] as Faq[],
    offerName: "Site internet",
  },
};

/** The price list: website packages, running costs, the Google profile, extras, how the price comes about and FAQ. */
export function PricingPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const t = pricingText[locale];
  const url = href(locale, "pricing");
  const request = href(locale, "request");
  const crumbs = [
    { name: d.common.home, url: href(locale, "home") },
    { name: t.title, url },
  ];
  const monthly = (price: number) => ({
    "@type": "UnitPriceSpecification",
    price,
    priceCurrency: "CHF",
    referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
  });
  const offers = [
    ...pricePackages.map((p) => ({
      "@type": "Offer",
      name: p.id === "shop" ? p.name[locale] : `${t.offerName} ${p.name[locale]}`,
      description: p.features[locale].join(", "),
      url: `${site.url}${url}#${p.id}`,
      priceSpecification: { "@type": "PriceSpecification", minPrice: p.price, priceCurrency: "CHF" },
    })),
    { "@type": "Offer", name: t.care.name, url: `${site.url}${url}#laufend`, priceSpecification: monthly(carePrice) },
    { "@type": "Offer", name: t.gbp.name, url: `${site.url}${url}#laufend`, price: gbpPrice.setup, priceCurrency: "CHF" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: t.h1,
          description: t.metaDesc,
          serviceType: locale === "de" ? "Webdesign" : "Création de sites internet",
          provider: { "@id": orgId },
          areaServed: { "@type": "Country", name: locale === "de" ? "Schweiz" : "Suisse" },
          url: `${site.url}${url}`,
          hasOfferCatalog: { "@type": "OfferCatalog", name: t.title, itemListElement: offers },
        }}
      />

      <PageHero eyebrow={t.title} title={t.h1} subline={t.subline} lead={t.lead} crumbs={[crumbs[0], { name: t.title }]}>
        <HeroCtas locale={locale} />
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[14.5px] text-white/80">
          {t.facts.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-light/15 text-accent-light">
                <Icon name="check" className="h-3 w-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </PageHero>

      <section id="pakete" className="container-x section-y scroll-mt-20" aria-labelledby="pakete-title">
        <SectionHead id="pakete-title" eyebrow={t.packagesEyebrow} title={t.packagesTitle} lead={t.packagesLead} />
        {/* On desktop the cards share their rows (subgrid), so prices, lists and buttons line up. */}
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricePackages.map((p) => {
            const rec = p.recommended;
            return (
              <li
                key={p.id}
                id={p.id}
                className={`relative flex scroll-mt-28 flex-col rounded-3xl p-6 sm:p-7 lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-y-0 ${
                  rec ? "stage-night text-white shadow-lift ring-1 ring-night" : "bg-white shadow-xs ring-1 ring-line"
                }`}
              >
                {rec && (
                  <span className="absolute -top-3 left-6 rounded-full bg-white px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-accent shadow-xs ring-1 ring-line">
                    {t.recommended}
                  </span>
                )}
                <h3 className="font-display text-[22px] font-semibold tracking-[-0.01em]">{p.name[locale]}</h3>
                <p className={`mt-2 text-[14.5px] leading-relaxed ${rec ? "text-white/70" : "text-ink-soft"}`}>{p.forWhom[locale]}</p>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-1.5">
                  <span className={`text-[15px] font-medium ${rec ? "text-white/75" : "text-ink-soft"}`}>
                    {t.from} CHF
                  </span>
                  <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{swissNumber(p.price)}</span>
                </p>
                <p className={`mt-2 text-[13.5px] ${rec ? "text-white/60" : "text-muted"}`}>{t.once}</p>
                <ul className={`mt-6 space-y-2.5 border-t pt-6 ${rec ? "border-white/15" : "border-line"}`}>
                  {p.features[locale].map((f) => (
                    <li key={f} className={`flex gap-2.5 text-[14.5px] leading-snug ${rec ? "text-white/85" : "text-ink-soft"}`}>
                      <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${rec ? "text-accent-light" : "text-bright"}`} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <ButtonLink href={`${request}?paket=${p.id}`} variant={rec ? "accent" : "ghost"} className="w-full">
                    {t.choose}
                  </ButtonLink>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-soft">
          <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-bright" />
          {t.firstYear}
        </p>
      </section>

      <section id="laufend" className="scroll-mt-20 bg-bg-2" aria-labelledby="laufend-title">
        <div className="container-x section-y">
          <SectionHead id="laufend-title" eyebrow={t.runningEyebrow} title={t.runningTitle} lead={t.runningLead} />
          <div className="grid gap-5 lg:grid-cols-2">
            <PriceCard
              icon="shield"
              name={t.care.name}
              price={chf(carePrice)}
              per={t.perMonth}
              note={t.care.note}
              items={t.care.items}
              foot={t.care.foot}
              more={hasRoute("service:wartung") ? { href: href(locale, "service:wartung"), label: t.care.more } : undefined}
            />
            <PriceCard
              icon="pin"
              name={t.gbp.name}
              price={chf(gbpPrice.setup)}
              per={t.once}
              note={t.gbp.care}
              items={t.gbp.items}
              text={t.gbp.careText}
              foot={t.gbp.note}
              more={hasRoute("service:google-profil") ? { href: href(locale, "service:google-profil"), label: t.gbp.more } : undefined}
            />
          </div>
        </div>
      </section>

      <section className="container-x section-y" aria-labelledby="extras-title">
        <SectionHead id="extras-title" eyebrow={t.extrasEyebrow} title={t.extrasTitle} lead={t.extrasLead} />
        <ul className="flex flex-wrap gap-3">
          {t.extras.map((x) => {
            const inner = (
              <>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bright-soft text-bright">
                  <Icon name={x.icon} className="h-4 w-4" />
                </span>
                {x.label}
              </>
            );
            const cls = "flex min-h-12 items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 text-[15px] font-medium text-ink ring-1 ring-inset ring-line";
            return (
              <li key={x.label}>
                {x.id && hasRoute(x.id) ? (
                  <Link href={href(locale, x.id)} className={`${cls} transition-colors hover:text-accent hover:ring-accent/30`}>
                    {inner}
                    <Icon name="arrow" className="h-4 w-4 text-bright" />
                  </Link>
                ) : (
                  <span className={cls}>{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <ProcessSection locale={locale} steps={t.steps} title={t.stepsTitle} lead={t.stepsLead} />

      <FaqSection locale={locale} faq={t.faq} />

      <div className="pt-20 md:pt-28">
        <CtaBand locale={locale} />
      </div>
    </>
  );
}

/** Card for a running cost or a one-off service next to the packages. */
function PriceCard({
  icon,
  name,
  price,
  per,
  note,
  items,
  text,
  foot,
  more,
}: {
  icon: string;
  name: string;
  price: string;
  per: string;
  note: string;
  items: string[];
  text?: string;
  foot?: string;
  more?: { href: string; label: string };
}) {
  return (
    <article className="flex flex-col rounded-3xl bg-white p-6 shadow-xs ring-1 ring-line sm:p-8">
      <div className="flex items-center gap-3">
        <span className="icon-tile">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <h3 className="font-display text-[21px] font-semibold tracking-[-0.01em]">{name}</h3>
      </div>
      <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-[36px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{price}</span>
        <span className="text-[15px] text-muted">{per}</span>
      </p>
      <p className="mt-3 text-[15px] font-medium text-accent">{note}</p>
      <ul className="mt-6 grid gap-2.5 border-t border-line pt-6 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-[14.5px] leading-snug text-ink-soft">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-bright" strokeWidth={2.5} />
            {it}
          </li>
        ))}
      </ul>
      {text && <p className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">{text}</p>}
      {foot && <p className="mt-3 text-[14px] text-muted">{foot}</p>}
      {more && (
        <Link href={more.href} className="link-arrow mt-auto pt-6">
          {more.label}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}

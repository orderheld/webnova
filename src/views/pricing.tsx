import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { CtaBand, HeroCtas, PageHero } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { FaqSection, ProcessSection, SectionHead } from "@/components/sections";
import {
  careTiers,
  chf,
  costAnswer,
  domainYearly,
  extraPagePrice,
  starterMaxPages,
  fromPrice,
  gbpPrice,
  billingNote,
  pricePackages,
  prices,
  websitePackages,
  swissNumber,
  vatNote,
} from "@/content/pricing";
import type { Faq, Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href } from "@/lib/routes";
import { JsonLd, breadcrumbLd, orgId } from "@/lib/seo";
import { site } from "@/lib/site";

export const pricingText = {
  de: {
    title: "Preise",
    metaTitle: "Preise: Was kostet eine Webseite?",
    metaDesc: `Onepager ab ${prices.starter}, bis 5 Seiten ab ${prices.kmu}, bis 10 Seiten ab ${prices.professional}, Onlineshops ab ${prices.shop}. Hosting ab ${prices.hosting} pro Monat. Endpreise, keine MWST.`,
    h1: "Preise für Webseiten und Onlineshops",
    subline: "Einmal bezahlt, ohne versteckte Kosten.",
    lead: "Ihre Webseite bezahlen Sie einmal. Hosting buchen Sie nur, wenn Sie es möchten, monatlich und jederzeit kündbar. Die genaue Offerte erhalten Sie nach einem kostenlosen Erstgespräch.",
    facts: ["Kostenloses Erstgespräch", "Webseite einmal bezahlt", "Hosting monatlich kündbar"],
    packagesEyebrow: "Pakete",
    packagesTitle: "Klare Pakete mit Startpreis.",
    packagesLead: "Starten Sie mit einer Design-Demo oder direkt mit einem Paket. Eine zweite Sprache, Texte von uns oder weitere Funktionen ergänzen wir als Extras.",
    from: "ab",
    recommended: "Unsere Empfehlung",
    runningEyebrow: "Nach dem Start",
    runningTitle: "Ihre Webseite im Betrieb",
    runningLead: `Für Webseiten, die wir gebaut haben. Verrechnet wird monatlich ab der Aufschaltung, jedes Paket kündigen Sie auf Ende Monat.`,
    perMonth: "pro Monat",
    once: "einmalig",
    careFoot: `Die Domain läuft auf Ihren Namen und kostet ca. ${chf(domainYearly)} pro Jahr, separat verrechnet. Für Webseiten anderer Anbieter erhalten Sie eine eigene Offerte.`,
    careMore: "Mehr zur Wartung",
    gbp: {
      name: "Google-Unternehmensprofil",
      care: `Betreuung auf Wunsch: ${prices.gbpMonthly} pro Monat`,
      items: ["Profil einrichten oder übernehmen", "Bestätigung bei Google", "Logo, Fotos und alle Angaben", "Bewertungen mit System"],
      careText: "Die Betreuung umfasst Beiträge, Antworten auf Bewertungen, die Pflege der Angaben und eine kurze Auswertung jeden Monat.",
      note: `Im Hosting-Paket Rundum ist die Betreuung dabei. Bei den Paketen KMU und Professional ist die Einrichtung Teil des Paketpreises.`,
      more: "Mehr zum Google-Profil",
    },
    extrasEyebrow: "Extras",
    extrasTitle: "Extras nach Bedarf",
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
      { title: "Schriftliche Offerte", text: `Sie erhalten eine Offerte mit allen Positionen. Auf Wunsch sehen Sie vorher Ihre Startseite als Design-Demo für ${prices.demo}.` },
      { title: "Start mit Ihrem OK", text: "Wir beginnen erst, wenn Sie der Offerte zugestimmt haben." },
    ],
    faq: [
      { q: "Was kostet eine Webseite bei Webnova?", a: costAnswer("de", "website") },
      {
        q: "Was ist im Paketpreis enthalten?",
        a: `Der Paketpreis gilt für den beschriebenen Umfang. Brauchen Sie mehr Seiten, eine zweite Sprache, Texte von uns oder zusätzliche Funktionen, steht das als eigene Position in der Offerte. Im Starter kostet jede weitere Seite ${chf(extraPagePrice)}, bis höchstens ${starterMaxPages} Seiten. So sehen Sie vor dem Start, was Ihre Webseite kostet.`,
      },
      {
        q: "Was ist die Design-Demo?",
        a: `Für ${prices.demo} gestalten wir die Startseite, wie Ihre neue Webseite aussehen würde, in Ihren Farben und mit Ihrem Logo. Sie sehen sie als Bild, programmiert wird erst, wenn Sie die Webseite bestellen. Dann ziehen wir die ${prices.demo} vom Preis ab.`,
      },
      { q: "Was kostet ein Onlineshop?", a: costAnswer("de", "shop") },
      {
        q: "Welche laufenden Kosten kommen dazu?",
        a: `Hosting ist freiwillig und monatlich kündbar: Hosting ${prices.hosting}, Hosting + SEO ${prices.hostingSeo} oder Rundum ${prices.rundum} pro Monat. Rundum enthält auch die Betreuung Ihres Google-Unternehmensprofils. Verrechnet wird ab der Aufschaltung. Die Domain läuft auf Ihren Namen, kostet ca. ${chf(domainYearly)} pro Jahr und wird separat verrechnet.`,
      },
      { q: "Kommt noch MWST dazu?", a: "Nein. Webnova ist nicht mehrwertsteuerpflichtig. Die Preise auf dieser Seite sind Endpreise, es kommt keine MWST dazu." },
      { q: "Was kostet das Google-Unternehmensprofil?", a: costAnswer("de", "gbp") },
      { q: "Gibt es versteckte Kosten?", a: "Nein. Vor dem Start erhalten Sie eine schriftliche Offerte mit allen Positionen, auch den laufenden Kosten. Wir beginnen erst, wenn Sie zugestimmt haben." },
      {
        q: "Kann ich klein starten und später ausbauen?",
        a: "Ja. Sie können mit Starter beginnen und später Seiten, eine zweite Sprache oder einen Shop ergänzen, ohne die Webseite neu bauen zu müssen.",
      },
    ] as Faq[],
    offerName: "Webseite",
  },
  fr: {
    title: "Tarifs",
    metaTitle: "Tarifs : combien coûte un site internet ?",
    metaDesc: `Site d'une page dès ${prices.starter}, jusqu'à 5 pages dès ${prices.kmu}, jusqu'à 10 pages dès ${prices.professional}, boutiques dès ${prices.shop}. Hébergement dès ${prices.hosting}/mois. Sans TVA.`,
    h1: "Tarifs des sites internet et boutiques en ligne",
    subline: "Payé une fois, sans coûts cachés.",
    lead: "Vous payez votre site une seule fois. L'hébergement, vous le prenez seulement si vous le souhaitez, au mois et résiliable en tout temps. Vous recevez le devis exact après un premier entretien gratuit.",
    facts: ["Premier entretien gratuit", "Site payé une fois", "Hébergement résiliable chaque mois"],
    packagesEyebrow: "Formules",
    packagesTitle: "Des formules claires avec prix de départ.",
    packagesLead: "Commencez par une démo design ou directement par une formule. Deuxième langue, textes rédigés par nous ou fonctions en plus s'ajoutent en options.",
    from: "dès",
    recommended: "Notre recommandation",
    runningEyebrow: "Après la mise en ligne",
    runningTitle: "Votre site en service",
    runningLead: `Pour les sites que nous avons réalisés. Facturation mensuelle dès la mise en ligne, chaque formule se résilie pour la fin du mois.`,
    perMonth: "par mois",
    once: "paiement unique",
    careFoot: `Le nom de domaine est à votre nom et coûte env. ${chf(domainYearly)} par an, facturé séparément. Pour les sites d'autres prestataires, vous recevez une offre séparée.`,
    careMore: "En savoir plus sur la maintenance",
    gbp: {
      name: "Fiche Google Business Profile",
      care: `Suivi sur demande : ${prices.gbpMonthly} par mois`,
      items: ["Création ou reprise de la fiche", "Validation auprès de Google", "Logo, photos et toutes les informations", "Avis clients avec méthode"],
      careText: "Le suivi comprend des publications, les réponses aux avis, la mise à jour des informations et un bref rapport chaque mois.",
      note: `La formule d'hébergement Tout compris inclut le suivi. Dans les formules PME et Professional, la mise en place fait partie du prix de la formule.`,
      more: "En savoir plus sur la fiche Google",
    },
    extrasEyebrow: "Options",
    extrasTitle: "Options selon vos besoins",
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
      { title: "Devis écrit", text: `Vous recevez un devis avec tous les postes. Si vous le souhaitez, vous voyez d'abord votre page d'accueil en démo design pour ${prices.demo}.` },
      { title: "Début avec votre accord", text: "Nous ne commençons qu'une fois le devis accepté." },
    ],
    faq: [
      { q: "Combien coûte un site internet chez Webnova ?", a: costAnswer("fr", "website") },
      {
        q: "Qu'est-ce qui est compris dans le prix de la formule ?",
        a: `Le prix de la formule vaut pour l'ampleur décrite. Si vous avez besoin de pages supplémentaires, d'une deuxième langue, de textes rédigés par nous ou de fonctions en plus, cela figure comme poste séparé dans le devis. Avec Starter, chaque page supplémentaire coûte ${chf(extraPagePrice)}, jusqu'à ${starterMaxPages} pages au maximum. Vous savez ainsi avant le début ce que coûte votre site.`,
      },
      {
        q: "Qu'est-ce que la démo design ?",
        a: `Pour ${prices.demo}, nous concevons la page d'accueil telle que votre nouveau site la montrerait, dans vos couleurs et avec votre logo. Vous la voyez en image, le développement ne commence que si vous commandez le site. Les ${prices.demo} sont alors déduits du prix.`,
      },
      { q: "Combien coûte une boutique en ligne ?", a: costAnswer("fr", "shop") },
      {
        q: "Quels coûts récurrents s'ajoutent ?",
        a: `L'hébergement est facultatif et résiliable chaque mois : Hébergement ${prices.hosting}, Hébergement + SEO ${prices.hostingSeo} ou Tout compris ${prices.rundum} par mois. Tout compris inclut aussi le suivi de votre fiche Google Business Profile. La facturation commence à la mise en ligne. Le nom de domaine est à votre nom, coûte env. ${chf(domainYearly)} par an et est facturé séparément.`,
      },
      { q: "Faut-il ajouter la TVA ?", a: "Non. Webnova n'est pas assujettie à la TVA. Les prix de cette page sont des prix finaux, aucune TVA ne s'y ajoute." },
      { q: "Combien coûte la fiche Google Business Profile ?", a: costAnswer("fr", "gbp") },
      { q: "Y a-t-il des coûts cachés ?", a: "Non. Avant le début, vous recevez un devis écrit avec tous les postes, y compris les coûts récurrents. Nous ne commençons qu'avec votre accord." },
      {
        q: "Puis-je commencer petit et agrandir plus tard ?",
        a: "Oui. Vous pouvez commencer avec Starter, puis ajouter des pages, une deuxième langue ou une boutique sans reconstruire le site.",
      },
    ] as Faq[],
    offerName: "Site internet",
  },
};

/** The price list: demo and website packages, hosting, the Google profile, extras, how the price comes about and FAQ. */
export function PricingPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const t = pricingText[locale];
  const url = href(locale, "pricing");
  const request = href(locale, "request");
  const demo = pricePackages.find((p) => p.id === "demo");
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
      name: p.id === "demo" ? p.name[locale] : `${t.offerName} ${p.name[locale]}`,
      description: p.features[locale].join(" · "),
      url: `${site.url}${url}#${p.id}`,
      priceSpecification: p.from ? { "@type": "PriceSpecification", minPrice: p.price, priceCurrency: "CHF" } : { "@type": "PriceSpecification", price: p.price, priceCurrency: "CHF" },
    })),
    ...careTiers.map((c) => ({
      "@type": "Offer",
      name: c.name[locale],
      description: c.items[locale].join(" · "),
      url: `${site.url}${url}#laufend`,
      priceSpecification: monthly(c.price),
    })),
    { "@type": "Offer", name: t.gbp.name, url: `${site.url}${url}#laufend`, priceSpecification: [{ "@type": "PriceSpecification", minPrice: gbpPrice.setup, priceCurrency: "CHF" }, monthly(gbpPrice.monthly)] },
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
          {websitePackages.map((p) => {
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
                  <span className={`text-[15px] font-medium ${rec ? "text-white/75" : "text-ink-soft"}`}>{p.from ? `${t.from} CHF` : "CHF"}</span>{" "}
                  <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{swissNumber(p.price)}</span>
                </p>
                <p className={`mt-2 text-[13.5px] ${rec ? "text-white/60" : "text-muted"}`}>{p.note[locale]}</p>
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
                    {p.cta[locale]}
                  </ButtonLink>
                </div>
              </li>
            );
          })}
        </ol>
        {demo && (
          <div id="demo" className="mt-5 grid scroll-mt-28 gap-6 rounded-3xl bg-bright-soft p-6 ring-1 ring-line sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] lg:items-center lg:gap-10">
            <div>
              <h3 className="font-display text-[22px] font-semibold tracking-[-0.01em]">{demo.name[locale]}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{demo.forWhom[locale]}</p>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-[34px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{chf(demo.price)}</span>{" "}
                <span className="text-[14px] text-muted">{demo.note[locale]}</span>
              </p>
            </div>
            <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {demo.features[locale].map((f) => (
                <li key={f} className="flex gap-2.5 text-[14.5px] leading-snug text-ink-soft">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-bright" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <ButtonLink href={`${request}?paket=${demo.id}`} variant="ghost" className="w-full lg:w-auto">
              {demo.cta[locale]}
            </ButtonLink>
          </div>
        )}
        <p className="mt-8 flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-soft">
          <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-bright" />
          {vatNote[locale]}
        </p>
      </section>

      <section id="laufend" className="scroll-mt-20 bg-bg-2" aria-labelledby="laufend-title">
        <div className="container-x section-y">
          <SectionHead id="laufend-title" eyebrow={t.runningEyebrow} title={t.runningTitle} lead={t.runningLead} />
          <ul className="grid gap-5 md:grid-cols-3">
            {careTiers.map((c) => (
              <li key={c.id} className="flex flex-col rounded-3xl bg-white p-6 shadow-xs ring-1 ring-line sm:p-7">
                <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em]">{c.name[locale]}</h3>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-[34px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{chf(c.price)}</span>{" "}
                  <span className="text-[15px] text-muted">{t.perMonth}</span>
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                  {c.items[locale].map((it) => (
                    <li key={it} className="flex gap-2.5 text-[14.5px] leading-snug text-ink-soft">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-bright" strokeWidth={2.5} />
                      {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[14.5px] leading-relaxed text-ink-soft">
            {t.careFoot}{" "}
            {hasRoute("service:wartung") && (
              <Link href={href(locale, "service:wartung")} className="link-arrow inline-flex">
                {t.careMore}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            )}
          </p>
          <div className="mt-12">
            <PriceCard
              icon="pin"
              name={t.gbp.name}
              price={fromPrice(locale, gbpPrice.setup)}
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

      <div className="container-x mt-10">
        <p className="max-w-4xl text-[13px] leading-relaxed text-muted">{billingNote[locale]}</p>
      </div>

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
        <span className="font-display text-[36px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{price}</span>{" "}
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

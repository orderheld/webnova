import Image from "next/image";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hoursLines } from "@/lib/hours";
import { site } from "@/lib/site";
import { Icon } from "./icons";
import { SocialIcons } from "./social-icons";
import { photo } from "@/lib/photos";

/**
 * Editorial building blocks: photo slots, the founder portrait card and the contact list.
 * Server components only, no client JS.
 */

/**
 * A figure that shows a real photo when one is set (src/lib/photos.ts), otherwise an honest
 * fallback: the FD monogram or any node passed in.
 */
export function PhotoSlot({
  photo,
  fallback,
  caption,
  ratio = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className = "",
}: {
  photo?: { src: string; alt: string };
  fallback: "monogram" | React.ReactNode;
  caption?: React.ReactNode;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  let inner: React.ReactNode;
  if (photo) {
    inner = <Image src={photo.src} alt={photo.alt} fill sizes={sizes} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} className="object-cover" />;
  } else if (fallback === "monogram") {
    inner = (
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center bg-bg-2">
        <span className="font-display text-[clamp(3rem,6vw,4.5rem)] font-semibold tracking-[-0.015em] text-accent">FD</span>
        <span className="absolute inset-3 border border-accent/15" />
      </div>
    );
  } else {
    inner = <div className="absolute inset-0 bg-bg-2">{fallback as React.ReactNode}</div>;
  }
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden ${ratio}`}>{inner}</div>
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </figure>
  );
}

const cl = {
  de: { phone: "Telefon", email: "E-Mail", address: "Adresse", whatsapp: "WhatsApp", write: "Nachricht schreiben", hours: "Bürozeiten", sunday: "Sonntag geschlossen" },
  fr: { phone: "Téléphone", email: "E-mail", address: "Adresse", whatsapp: "WhatsApp", write: "Écrire un message", hours: "Horaires", sunday: "Fermé le dimanche" },
};

/** Contact lines as a labelled list on hairlines (phone, WhatsApp, e-mail, address, office hours), then the social icons. */
export function ContactList({ locale, hours = false, dark = false, className = "" }: { locale: Locale; hours?: boolean; dark?: boolean; className?: string }) {
  const t = cl[locale];
  const lines = hours ? hoursLines(locale) : [];
  const row = `grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4 border-b py-4 ${dark ? "border-white/15" : "border-line"}`;
  const lab = `text-[12px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/55" : "text-muted"}`;
  const val = `text-[15.5px] font-medium transition-colors ${dark ? "text-white hover:text-accent-light" : "text-ink hover:text-accent"}`;
  return (
    <div className={className}>
      <dl className={`border-t ${dark ? "border-white/15" : "border-line"}`}>
        <div className={row}>
          <dt className={lab}>{t.phone}</dt>
          <dd>
            <a href={site.phoneHref} className={val}>
              {site.phone}
            </a>
          </dd>
        </div>
        <div className={row}>
          <dt className={lab}>{t.whatsapp}</dt>
          <dd>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={`${val} inline-flex items-center gap-1.5`}>
              {t.write}
              <Icon name="arrow" className="h-3.5 w-3.5 -rotate-45" />
            </a>
          </dd>
        </div>
        <div className={row}>
          <dt className={lab}>{t.email}</dt>
          <dd>
            <a href={`mailto:${site.email}`} className={`${val} break-all`}>
              {site.email}
            </a>
          </dd>
        </div>
        <div className={row}>
          <dt className={lab}>{t.address}</dt>
          <dd className={`text-[15.5px] leading-relaxed ${dark ? "text-white/85" : "text-ink-soft"}`}>
            <address className="not-italic">
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </address>
            {site.google.maps && (
              <a href={site.google.maps} target="_blank" rel="noopener noreferrer" className={`mt-1 inline-block text-[14px] ${dark ? "text-accent-light" : "text-bright"}`}>
                {getDict(locale).pages.openInMaps}
              </a>
            )}
          </dd>
        </div>
        {lines.length > 0 && (
          <div className={row}>
            <dt className={lab}>{t.hours}</dt>
            <dd className={`text-[15px] leading-relaxed ${dark ? "text-white/80" : "text-ink-soft"}`}>
              {lines.map((h) => (
                <span key={h} className="block">
                  {h}
                </span>
              ))}
              <span className={`block ${dark ? "text-white/55" : "text-muted"}`}>{t.sunday}</span>
            </dd>
          </div>
        )}
      </dl>
      <SocialIcons dark={dark} className="mt-6" />
    </div>
  );
}


const pc = {
  de: { role: "Ihr Ansprechpartner", line: "Persönlich vom ersten Gespräch bis nach dem Launch" },
  fr: { role: "Votre interlocuteur", line: "Personnellement, du premier entretien jusqu'après la mise en ligne" },
};

/**
 * Ferhat Demir's portrait (greyscale, light Schieferblau backdrop) in a soft rounded frame with a
 * Schieferblau accent shape and a name plate. 4:5, the face is never cropped.
 */
export function PortraitCard({ locale, className = "", sizes = "(min-width: 1024px) 420px, 90vw", priority = false, plate = true }: { locale: Locale; className?: string; sizes?: string; priority?: boolean; plate?: boolean }) {
  const p = photo("founder", locale);
  const t = pc[locale];
  return (
    <figure className={`relative ${className}`}>
      <div aria-hidden="true" className="stage-accent absolute -bottom-4 -right-4 h-2/3 w-2/3 rounded-3xl sm:-bottom-5 sm:-right-5" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-bg-2 ring-1 ring-black/5 shadow-lift">
        {p ? (
          // `priority` (Next 16 deprecated it) only preloaded the photo; as the LCP image it also needs fetchpriority=high.
          <Image src={p.src} alt={p.alt} fill sizes={sizes} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} className="object-cover object-top" />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-display text-[4rem] font-semibold text-accent">FD</span>
        )}
      </div>
      {plate && (
        <figcaption className="absolute bottom-4 left-4 right-10 rounded-2xl bg-white/95 px-4 py-3 shadow-card sm:bottom-5 sm:left-5">
          <span className="block font-display text-[17px] font-semibold text-ink">Ferhat Demir</span>
          <span className="block text-[13px] leading-snug text-muted">{t.role}</span>
        </figcaption>
      )}
    </figure>
  );
}

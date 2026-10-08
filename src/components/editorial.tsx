import Image from "next/image";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hoursLines } from "@/lib/hours";
import { site } from "@/lib/site";
import { Icon } from "./icons";
import { skylines } from "./skylines";

/**
 * Editorial building blocks for the studio look: photo slots with captions, the contact list and
 * the composed Swiss skyline. Server components only, no client JS.
 */

/**
 * A figure that shows a real photo when one is set (src/lib/photos.ts), otherwise an honest
 * fallback: the FD monogram, a city skyline drawing or any node passed in. Always with a caption.
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
  fallback: "monogram" | { skyline: string } | React.ReactNode;
  caption?: React.ReactNode;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  let inner: React.ReactNode;
  if (photo) {
    inner = <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />;
  } else if (fallback === "monogram") {
    inner = (
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center bg-bg-2">
        <span className="font-display text-[clamp(3rem,6vw,4.5rem)] font-semibold tracking-[-0.04em] text-accent">FD</span>
        <span className="absolute inset-3 border border-accent/15" />
      </div>
    );
  } else if (fallback && typeof fallback === "object" && "skyline" in fallback) {
    const Skyline = skylines[(fallback as { skyline: string }).skyline];
    inner = (
      <div aria-hidden="true" className="absolute inset-0 bg-bg-2 text-accent/70">
        {Skyline && <Skyline preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" />}
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

/** Contact lines as a labelled list on hairlines: phone, WhatsApp, e-mail, address and office hours. */
export function ContactList({ locale, hours = false, dark = false, className = "" }: { locale: Locale; hours?: boolean; dark?: boolean; className?: string }) {
  const t = cl[locale];
  const lines = hours ? hoursLines(locale) : [];
  const row = `grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4 border-b py-4 ${dark ? "border-white/15" : "border-line"}`;
  const lab = `text-[12px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/55" : "text-muted"}`;
  const val = `text-[15.5px] font-medium transition-colors ${dark ? "text-white hover:text-accent-light" : "text-ink hover:text-accent"}`;
  return (
    <dl className={`border-t ${dark ? "border-white/25" : "border-ink"} ${className}`}>
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
  );
}

/**
 * Wide composed Swiss skyline: several city line drawings side by side on one baseline.
 * Decorative only; the caption names the cities.
 */
export function SwissPanorama({ cities = ["basel", "zuerich", "bern", "luzern", "neuchatel"], animate = false, className = "" }: { cities?: string[]; animate?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex ${className}`}>
      {cities.map((k, i) => {
        const Skyline = skylines[k];
        if (!Skyline) return null;
        return (
          <div key={k} className={`h-full min-w-0 flex-1 border-current/40 ${i > 0 ? "border-l" : ""} ${i >= 3 ? "hidden md:block" : ""}`}>
            <Skyline animate={animate} preserveAspectRatio="xMidYMax slice" className="h-full w-full" />
          </div>
        );
      })}
    </div>
  );
}

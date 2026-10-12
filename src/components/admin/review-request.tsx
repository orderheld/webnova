import { Icon } from "@/components/admin/icons";
import { Card, btnSm } from "@/components/admin/ui";
import { reviewLink } from "@/lib/site";

export type ReviewPerson = { firstName: string | null; lastName: string | null; email: string | null; phone: string | null };

/** International number for wa.me, or null for Swiss landlines (no WhatsApp) and anything unusable. */
function whatsappNumber(phone: string | null): string | null {
  if (!phone) return null;
  const raw = phone.replace(/[^\d+]/g, "");
  const digits = raw.startsWith("+") ? raw.slice(1) : raw.startsWith("00") ? raw.slice(2) : raw.startsWith("0") ? `41${raw.slice(1)}` : raw;
  if (!/^\d{9,15}$/.test(digits)) return null;
  return digits.startsWith("41") && !digits.startsWith("417") ? null : digits;
}

const texts = {
  de: {
    hello: (name: string) => (name ? `Grüezi ${name}` : "Grüezi"),
    subject: "Ihre Meinung zu unserer Zusammenarbeit",
    body: "Herzlichen Dank für die angenehme Zusammenarbeit. Wenn Ihnen unsere Arbeit gefallen hat, würde ich mich sehr über eine kurze Bewertung auf Google freuen. Das dauert nur eine Minute:",
    bye: "Herzliche Grüsse",
  },
  fr: {
    hello: (name: string) => (name ? `Bonjour ${name}` : "Bonjour"),
    subject: "Votre avis sur notre collaboration",
    body: "Merci beaucoup pour cette agréable collaboration. Si notre travail vous a plu, un court avis sur Google me ferait très plaisir. Cela ne prend qu'une minute :",
    bye: "Meilleures salutations",
  },
};

/**
 * Asks a client for a Google review: WhatsApp or e-mail opens with the request in the client's language and the
 * short link webnova.ch/bewertung (or /avis), ready to adjust before sending. Reviews build trust with new
 * visitors and count for the ranking in Google Maps.
 */
export function ReviewRequestCard({ language, person }: { language: string; person: ReviewPerson }) {
  const locale = language === "fr" ? "fr" : "de";
  const t = texts[locale];
  const link = reviewLink(locale);
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ");
  const wa = whatsappNumber(person.phone);
  // Swiss German letters have no comma after the salutation, French ones do.
  const chat = `${t.hello(name)}${locale === "fr" ? "," : ""}\n\n${t.body}\n${link}\n\n${t.bye}\nFerhat Demir`;
  const mail = `${chat}\nWebnova`;
  return (
    <Card title="Google-Bewertung">
      <p className="text-[13.5px] leading-relaxed text-ink-soft">
        Zufriedene Kunden um eine Bewertung bitten. Bewertungen schaffen Vertrauen bei neuen Anfragen und helfen in Google Maps. Der Text ist auf{" "}
        {locale === "fr" ? "Französisch" : "Deutsch"} vorbereitet und lässt sich vor dem Senden anpassen.
      </p>
      {wa || person.email ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {wa && (
            <a href={`https://wa.me/${wa}?text=${encodeURIComponent(chat)}`} target="_blank" rel="noopener noreferrer" className={btnSm.ghost}>
              <Icon name="chat" className="h-3.5 w-3.5" /> Per WhatsApp
            </a>
          )}
          {person.email && (
            <a href={`mailto:${person.email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(mail)}`} className={btnSm.ghost}>
              <Icon name="mail" className="h-3.5 w-3.5" /> Per E-Mail
            </a>
          )}
        </div>
      ) : (
        <p className="mt-3 text-[13px] text-muted">Für WhatsApp braucht es eine Handynummer, für die Mail eine E-Mail-Adresse.</p>
      )}
      <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-muted">
        <Icon name="star" className="h-3.5 w-3.5 shrink-0 text-bright" />
        Kurzlink: <span className="select-all font-medium text-ink">{link.replace("https://", "")}</span>
      </p>
    </Card>
  );
}

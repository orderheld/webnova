import { FaqList } from "@/components/blocks";
import type { Faq, Locale } from "@/content/types";
import { JsonLd, faqLd } from "@/lib/seo";

/** FAQ list plus its FAQPage structured data, so both always show the same questions. */
export function FaqSection({ locale, faq }: { locale: Locale; faq: Faq[] }) {
  if (!faq.length) return null;
  return (
    <>
      <JsonLd data={faqLd(faq)} />
      <FaqList locale={locale} faq={faq} />
    </>
  );
}

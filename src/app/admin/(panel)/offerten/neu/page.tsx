import { DocumentEditor } from "@/components/admin/document-editor";
import { PageHeader } from "@/components/admin/ui";
import { addDaysIso, todayIso } from "@/lib/admin/money";
import { customerOptions } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Neue Offerte" };

export default async function NewQuote({ searchParams }: { searchParams: Promise<{ kunde?: string }> }) {
  const { kunde } = await searchParams;
  const [s, customers] = await Promise.all([getSettings(), customerOptions()]);
  const today = todayIso();
  return (
    <>
      <PageHeader title="Neue Offerte" sub="Die Nummer wird beim Speichern vergeben." />
      <DocumentEditor
        kind="quote"
        id={null}
        customers={customers}
        initial={{
          customerId: kunde ? Number(kunde) : null,
          title: "",
          intro: s.quoteIntro,
          outro: s.quoteOutro,
          items: [],
          discountPercent: 0,
          vatRate: s.vatEnabled ? s.vatRate : 0,
          issueDate: today,
          secondDate: addDaysIso(today, s.quoteValidityDays),
        }}
      />
    </>
  );
}

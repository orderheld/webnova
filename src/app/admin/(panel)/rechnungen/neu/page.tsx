import { DocumentEditor } from "@/components/admin/document-editor";
import { PageHeader } from "@/components/admin/ui";
import { addDaysIso, todayIso } from "@/lib/admin/money";
import { allProjectOptions, customerOptions, productOptions } from "@/lib/admin/queries";
import { getSettings } from "@/lib/admin/settings";

export const metadata = { title: "Neue Rechnung" };

export default async function NewInvoice({ searchParams }: { searchParams: Promise<{ kunde?: string; projekt?: string }> }) {
  const sp = await searchParams;
  const [s, customers, projects, products] = await Promise.all([getSettings(), customerOptions(), allProjectOptions(), productOptions()]);
  const today = todayIso();
  return (
    <>
      <PageHeader title="Neue Rechnung" sub="Die Nummer wird beim Speichern vergeben." back={{ href: "/admin/rechnungen", label: "Rechnungen" }} />
      <DocumentEditor
        kind="invoice"
        id={null}
        customers={customers}
        projects={projects}
        products={products}
        initial={{
          customerId: sp.kunde ? Number(sp.kunde) : null,
          projectId: sp.projekt ? Number(sp.projekt) : null,
          title: "",
          intro: s.invoiceIntro,
          outro: s.invoiceOutro,
          items: [],
          discountPercent: 0,
          vatRate: s.vatEnabled ? s.vatRate : 0,
          issueDate: today,
          secondDate: addDaysIso(today, s.paymentTermDays),
        }}
      />
    </>
  );
}

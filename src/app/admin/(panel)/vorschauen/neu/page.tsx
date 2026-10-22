import { PreviewNewForm } from "@/components/admin/preview-upload";
import { Card, PageHeader } from "@/components/admin/ui";
import { customerOptions } from "@/lib/admin/queries";

export const metadata = { title: "Neue Vorschau" };

export default async function NewPreviewPage() {
  const customers = await customerOptions();
  return (
    <>
      <PageHeader back={{ href: "/admin/vorschauen", label: "Vorschauen" }} title="Neue Vorschau" sub="Der Link enthält nur einen Zufallscode, nie den Namen des Kunden." />
      <Card className="max-w-3xl">
        <PreviewNewForm customers={customers} />
      </Card>
    </>
  );
}

import { SubscriptionForm } from "@/components/admin/forms";
import { Card, PageHeader } from "@/components/admin/ui";
import { allProjectOptions, customerOptions, productOptions } from "@/lib/admin/queries";

export const metadata = { title: "Neues Abo" };

export default async function NewSubscriptionPage({ searchParams }: { searchParams: Promise<{ kunde?: string; projekt?: string }> }) {
  const sp = await searchParams;
  const [customers, projects, products] = await Promise.all([customerOptions(), allProjectOptions(), productOptions()]);
  return (
    <>
      <PageHeader
        title="Neues Abo"
        sub="Ist das 1. Jahr im Projektpreis inbegriffen, wird erstmals 12 Monate nach Leistungsbeginn verrechnet."
        back={{ href: "/admin/abos", label: "Abos" }}
      />
      <Card className="max-w-3xl">
        <SubscriptionForm customers={customers} projects={projects} products={products} defaults={{ customerId: Number(sp.kunde) || null, projectId: Number(sp.projekt) || null }} />
      </Card>
    </>
  );
}

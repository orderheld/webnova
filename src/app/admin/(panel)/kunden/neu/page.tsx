import { CustomerForm } from "@/components/admin/customer-form";
import { Card, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Neuer Kunde" };

export default function NewCustomer() {
  return (
    <>
      <PageHeader title="Neuer Kunde" back={{ href: "/admin/kunden", label: "Kunden" }} />
      <Card className="max-w-3xl">
        <CustomerForm />
      </Card>
    </>
  );
}

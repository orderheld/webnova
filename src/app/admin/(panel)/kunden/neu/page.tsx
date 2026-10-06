import { Card, PageHeader } from "@/components/admin/ui";
import { CustomerForm } from "@/components/admin/customer-form";

export const metadata = { title: "Neuer Kunde" };

export default function NewCustomer() {
  return (
    <>
      <PageHeader title="Neuer Kunde" />
      <Card className="max-w-3xl">
        <CustomerForm />
      </Card>
    </>
  );
}

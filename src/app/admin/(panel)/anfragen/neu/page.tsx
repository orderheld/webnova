import { LeadForm } from "@/components/admin/lead-forms";
import { Card, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Neuer Lead" };

export default function NewLeadPage() {
  return (
    <>
      <PageHeader title="Neuer Lead" sub="Interessent aus der eigenen Lead-Suche, Empfehlung oder Telefonat erfassen" back={{ href: "/admin/anfragen", label: "Leads" }} />
      <Card className="max-w-4xl">
        <LeadForm />
      </Card>
    </>
  );
}

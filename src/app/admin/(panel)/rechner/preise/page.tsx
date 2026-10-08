import { CalculatorConfigForm } from "@/components/admin/calculator-config";
import { PageHeader } from "@/components/admin/ui";
import { getCalculatorConfig } from "@/lib/admin/settings";

export const metadata = { title: "Rechner: Preise" };

export default async function CalculatorPricesPage() {
  const cfg = await getCalculatorConfig();
  return (
    <>
      <PageHeader
        back={{ href: "/admin/rechner", label: "Rechner" }}
        title="Preise für den Rechner"
        sub="Pakete, Zusatzleistungen und wiederkehrende Kosten. Gilt für neue Kalkulationen; gespeicherte bleiben unverändert."
      />
      <CalculatorConfigForm initial={cfg} />
    </>
  );
}

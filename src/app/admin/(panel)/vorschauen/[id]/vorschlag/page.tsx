import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProposalForm } from "@/components/admin/proposal-form";
import { PageHeader } from "@/components/admin/ui";
import { db, schema } from "@/db";
import { previewPdf } from "@/lib/admin/previews";
import { initialProposal, previewPictures, previewShots, proposalLocale } from "@/lib/admin/proposal-server";
import { routeId } from "@/lib/admin/queries";

export const metadata = { title: "PDF-Vorschlag" };

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  if (!id) notFound();
  const [p] = await db().select().from(schema.previews).where(eq(schema.previews.id, id));
  if (!p) notFound();
  const [proposal, shots, pictures, pdf] = await Promise.all([
    p.proposal ?? initialProposal(p),
    previewShots(p.id),
    p.version > 0 ? previewPictures(p) : [],
    previewPdf(p),
  ]);

  return (
    <>
      <PageHeader
        back={{ href: `/admin/vorschauen/${p.id}`, label: p.title }}
        title="PDF-Vorschlag"
        sub="Konzept, Screenshots, Aufbau, Ablauf und Preis für den Kunden, im Querformat A4. Das fertige PDF geht mit der E-Mail mit."
      />
      <ProposalForm
        id={p.id}
        locale={proposalLocale(p)}
        initial={proposal}
        saved={!!p.proposal}
        shots={shots}
        pictures={pictures}
        pdfName={pdf?.path ?? null}
      />
    </>
  );
}

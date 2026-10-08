import { currentAdmin } from "@/lib/auth";
import { renderDocumentPdf } from "@/lib/admin/pdf";

export async function GET(_req: Request, ctx: RouteContext<"/api/admin/pdf/[kind]/[id]">) {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const { kind, id } = await ctx.params;
  if (kind !== "quote" && kind !== "invoice" && kind !== "reminder") return new Response("Not found", { status: 404 });
  let pdf;
  try {
    pdf = await renderDocumentPdf(kind, Number(id));
  } catch (e) {
    return new Response(`PDF konnte nicht erstellt werden: ${e instanceof Error ? e.message : e}`, { status: 500 });
  }
  if (!pdf) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(pdf.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdf.filename}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

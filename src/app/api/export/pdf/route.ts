import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { buildExport, fileSlug } from "@/lib/export-data";
import { stampFile } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const regional = new URL(req.url).searchParams.get("regional") || null;
  const d = await buildExport(regional);

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(15);
  doc.text(d.title, 40, 40);
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`Diunduh: ${d.downloadedAt}`, 40, 56);

  autoTable(doc, {
    startY: 70,
    head: [d.headers],
    body: d.body.map((r) => r.map(String)),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [109, 63, 208] },
    didParseCell: (data) => {
      if (data.section === "body" && d.rows[data.row.index]?.isTop) data.cell.styles.fillColor = [255, 243, 196];
    },
  });

  const buf = Buffer.from(doc.output("arraybuffer"));
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="penilaian-${fileSlug(regional)}-${stampFile()}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

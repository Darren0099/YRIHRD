import ExcelJS from "exceljs";
import { buildExport, fileSlug } from "@/lib/export-data";
import { stampFile } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const regional = new URL(req.url).searchParams.get("regional") || null;
  const d = await buildExport(regional);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Penilaian");
  const cols = d.headers.length;

  ws.addRow([d.title]);
  ws.addRow([`Diunduh: ${d.downloadedAt}`]);
  ws.addRow([]);
  ws.mergeCells(1, 1, 1, cols);
  ws.mergeCells(2, 1, 2, cols);
  ws.getCell("A1").font = { bold: true, size: 14 };
  ws.getCell("A2").font = { italic: true, color: { argb: "FF666666" } };

  const head = ws.addRow(d.headers);
  head.eachCell((c) => {
    c.font = { bold: true, color: { argb: "FFFFFFFF" } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6D3FD0" } };
    c.alignment = { vertical: "middle", horizontal: "center" };
  });

  d.body.forEach((row, i) => {
    const r = ws.addRow(row);
    if (d.rows[i].isTop) r.eachCell((c) => (c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF3C4" } }));
  });

  ws.columns.forEach((c, i) => (c.width = [5, 26, 20, 24, 18][i] ?? (i === cols - 1 ? 24 : 13)));
  ws.views = [{ state: "frozen", ySplit: 4 }];

  const buf = await wb.xlsx.writeBuffer();
  return new Response(new Uint8Array(buf as ArrayBuffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="penilaian-${fileSlug(regional)}-${stampFile()}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

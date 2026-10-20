import type { Metadata } from "next";
import { FileSpreadsheet, FileText, Trash2 } from "lucide-react";
import { deleteRegionalAction } from "@/app/actions";
import ConfirmButton from "@/components/ConfirmButton";
import { getAllRanked, regionalsOf } from "@/lib/queries";

export const metadata: Metadata = { title: "Export" };
export const dynamic = "force-dynamic";

export default async function ExportPage() {
  const rows = await getAllRanked();
  const regionals = regionalsOf(rows);

  return (
    <div className="stack">
      <h1 className="h1">Export data</h1>

      <form method="get" action="/api/export/excel" className="card form">
        <p className="muted">
          File berisi peringkat, status TOP, waktu input, dan <b>waktu unduh</b> (WIB).
        </p>
        <label className="field">
          <span>Regional</span>
          <select name="regional" defaultValue="">
            <option value="">Semua regional</option>
            {regionals.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <div className="btnrow">
          <button className="btn btn--primary btn--lg">
            <FileSpreadsheet size={18} aria-hidden="true" /> Unduh Excel
          </button>
          <button className="btn btn--sun btn--lg" formAction="/api/export/pdf">
            <FileText size={18} aria-hidden="true" /> Unduh PDF
          </button>
        </div>
      </form>

      <form action={deleteRegionalAction} className="card form danger">
        <h2 className="card__title">
          <Trash2 size={18} aria-hidden="true" /> Zona berbahaya
        </h2>
        <p className="muted">Menghapus semua kandidat di satu regional. Tidak bisa dibatalkan. Unduh dulu datanya.</p>
        <label className="field">
          <span>Regional yang dihapus</span>
          <select name="regional" required defaultValue="">
            <option value="" disabled>
              Pilih regional
            </option>
            {regionals.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <ConfirmButton message="Yakin hapus SEMUA kandidat di regional ini? Tindakan ini permanen." className="btn btn--danger">
          Hapus data regional
        </ConfirmButton>
      </form>
    </div>
  );
}

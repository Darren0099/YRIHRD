import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import Confetti from "@/components/Confetti";
import { DIVISI_LIST } from "@/config/hrd";
import { getAllRanked, regionalsOf } from "@/lib/queries";

export const metadata: Metadata = { title: "Kandidat" };
export const dynamic = "force-dynamic";

type SP = { q?: string; regional?: string; divisi?: string; saved?: string; top?: string };

export default async function KandidatPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getAllRanked();
  const q = (sp.q ?? "").trim().toLowerCase();

  const rows = all.filter(
    (r) =>
      (!q || r.nama.toLowerCase().includes(q)) &&
      (!sp.regional || r.regional === sp.regional) &&
      (!sp.divisi || r.divisi === sp.divisi),
  );
  const savedId = Number(sp.saved) || null;
  const regionals = regionalsOf(all);
  const divisis = [...new Set([...DIVISI_LIST, ...all.map((r) => r.divisi)])];

  return (
    <div className="stack">
      <Confetti fire={sp.top === "1"} />

      {savedId && (
        <p className="toast" role="status">
          {sp.top === "1" ? "Tersimpan! Kandidat ini masuk TOP 🎉" : "Penilaian tersimpan."}
        </p>
      )}

      <div className="row-between">
        <h1 className="h1">Kandidat</h1>
        <Link href="/kandidat/baru" className="btn btn--primary btn--sm">
          Tambah
        </Link>
      </div>

      <form className="filters card" method="get">
        <label className="search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Cari nama</span>
          <input type="search" name="q" defaultValue={sp.q} placeholder="Cari nama kandidat..." />
        </label>
        <select name="regional" defaultValue={sp.regional ?? ""} aria-label="Filter regional">
          <option value="">Semua regional</option>
          {regionals.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select name="divisi" defaultValue={sp.divisi ?? ""} aria-label="Filter divisi">
          <option value="">Semua divisi</option>
          {divisis.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <button className="btn btn--primary btn--sm">Terapkan</button>
      </form>

      <p className="muted small">{rows.length} kandidat</p>

      {rows.length === 0 ? (
        <div className="empty card">
          <p>Tidak ada kandidat yang cocok. Ubah filter atau tambahkan kandidat baru.</p>
        </div>
      ) : (
        <div className="list">
          {rows.map((r) => (
            <CandidateCard key={r.id} r={r} highlight={r.id === savedId} />
          ))}
        </div>
      )}
    </div>
  );
}

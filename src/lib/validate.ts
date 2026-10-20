import { SCORE_FIELDS, SCORE_MAX } from "@/config/hrd";

export interface PenilaianInput {
  nama: string;
  regional: string;
  divisi: string;
  pewawancara: string | null;
  skor: Record<string, number>;
  total: number;
  catatan: string | null;
}

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

/** Validasi form. Mengembalikan pesan error atau data bersih. */
export function parsePenilaian(fd: FormData): { error: string } | { data: PenilaianInput } {
  const nama = str(fd.get("nama"));
  const regional = str(fd.get("regional"));
  const divisi = str(fd.get("divisi"));
  if (nama.length < 2) return { error: "Nama kandidat minimal 2 huruf." };
  if (!regional) return { error: "Regional wajib diisi." };
  if (!divisi) return { error: "Pilih divisi." };

  const skor: Record<string, number> = {};
  let sum = 0;
  for (const f of SCORE_FIELDS) {
    const n = Math.round(Number(str(fd.get(`skor_${f.key}`))));
    const v = Number.isFinite(n) ? Math.min(SCORE_MAX, Math.max(1, n)) : 1;
    skor[f.key] = v;
    sum += v;
  }
  const total = Math.round((sum / (SCORE_FIELDS.length * SCORE_MAX)) * 100);

  return {
    data: {
      nama: nama.slice(0, 150),
      regional: regional.slice(0, 100),
      divisi: divisi.slice(0, 100),
      pewawancara: str(fd.get("pewawancara")).slice(0, 100) || null,
      skor,
      total,
      catatan: str(fd.get("catatan")).slice(0, 2000) || null,
    },
  };
}

export const totalFromScores = (skor: Record<string, number>) => {
  const sum = SCORE_FIELDS.reduce((s, f) => s + (skor[f.key] ?? 0), 0);
  return Math.round((sum / (SCORE_FIELDS.length * SCORE_MAX)) * 100);
};

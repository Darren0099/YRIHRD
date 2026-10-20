import { SCORE_FIELDS } from "@/config/hrd";
import { formatWaktu } from "@/lib/time";
import { getAllRanked } from "@/lib/queries";
import type { Ranked } from "@/lib/top";

export interface ExportBundle {
  title: string;
  downloadedAt: string;
  headers: string[];
  body: (string | number)[][];
  rows: Ranked[];
}

/** Data yang sama dipakai untuk Excel dan PDF. */
export async function buildExport(regional: string | null): Promise<ExportBundle> {
  const all = await getAllRanked();
  const rows = all
    .filter((r) => !regional || r.regional === regional)
    .sort((a, b) => a.regional.localeCompare(b.regional) || a.divisi.localeCompare(b.divisi) || a.rank - b.rank);

  const headers = [
    "No",
    "Nama",
    "Regional",
    "Divisi",
    "Pewawancara",
    ...SCORE_FIELDS.map((f) => f.label),
    "Total",
    "Peringkat",
    "Status",
    "Waktu input",
  ];

  const body = rows.map((r, i) => [
    i + 1,
    r.nama,
    r.regional,
    r.divisi,
    r.pewawancara ?? "-",
    ...SCORE_FIELDS.map((f) => r.skor[f.key] ?? 0),
    r.total,
    r.rank,
    r.isTop ? "TOP" : "-",
    formatWaktu(r.createdAt),
  ]);

  return {
    title: `Penilaian Kandidat HRD - ${regional ?? "Semua Regional"}`,
    downloadedAt: formatWaktu(new Date()),
    headers,
    body,
    rows,
  };
}

export const fileSlug = (regional: string | null) => (regional ?? "semua-regional").toLowerCase().replace(/[^a-z0-9]+/g, "-");

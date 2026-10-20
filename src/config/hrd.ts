/**
 * PENGATURAN UTAMA APLIKASI. Ubah di sini, tidak perlu menyentuh database.
 *
 * CATATAN: file asli (config/hrd.php) tidak bisa dibaca saat konversi, jadi
 * nilai di bawah adalah asumsi berdasarkan README. Hanya Secretary = 5 dan
 * Social Media Management = 4 yang tercantum di README lama. Sisanya CONTOH.
 */

/** Kriteria penilaian (tampil sebagai slider). Boleh ditambah/dikurangi kapan saja. */
export const SCORE_FIELDS = [
  { key: "komunikasi", label: "Komunikasi" },
  { key: "kepemimpinan", label: "Kepemimpinan" },
  { key: "komitmen", label: "Komitmen" },
  { key: "motivasi", label: "Motivasi" },
  { key: "kerjasama", label: "Kerja sama tim" },
] as const;

/** Skala slider: 1 sampai SCORE_MAX */
export const SCORE_MAX = 10;

/** Saran regional di form. Regional baru tetap bisa diketik bebas. */
export const REGIONALS = ["Sumatera Selatan"];

/** Divisi dan kuota TOP per regional. */
export const DIVISI_QUOTA: Record<string, number> = {
  Secretary: 5,
  "Social Media Management": 4,
  "Public Relations": 3, // contoh
  "Event Management": 3, // contoh
  "Design & Creative": 3, // contoh
  Treasurer: 2, // contoh
};

export const DEFAULT_QUOTA = 3;
export const DIVISI_LIST = Object.keys(DIVISI_QUOTA);
export const quotaFor = (divisi: string) => DIVISI_QUOTA[divisi] ?? DEFAULT_QUOTA;

export const TIMEZONE = "Asia/Jakarta";

/** Aturan gamifikasi (XP dan level) */
export const XP = {
  perInput: 10,
  noteBonus: 5,
  topBonus: 20,
  perLevel: 100,
};
export const LEVEL_TITLES = ["Rekrut Baru", "Pemburu Talenta", "Talent Scout", "Master Interviewer", "Legenda HRD"];

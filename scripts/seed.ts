// Data contoh. Jalankan: npm run db:seed
import { db } from "../src/db";
import { penilaian } from "../src/db/schema";
import { SCORE_FIELDS, SCORE_MAX } from "../src/config/hrd";

const names = ["Aulia Rahma", "Bagas Pratama", "Citra Dewi", "Dimas Saputra", "Eka Lestari", "Farhan Maulana", "Gita Sari", "Hafiz Ramadhan"];
const divisi = ["Secretary", "Social Media Management", "Public Relations"];

const rows = names.map((nama, i) => {
  const skor = Object.fromEntries(SCORE_FIELDS.map((f) => [f.key, 4 + ((i * 3 + f.key.length) % 7)]));
  const sum = Object.values(skor).reduce((a, b) => a + b, 0);
  return {
    nama,
    regional: "Sumatera Selatan",
    divisi: divisi[i % divisi.length],
    pewawancara: i % 2 ? "Darren" : "Desvi",
    skor,
    total: Math.round((sum / (SCORE_FIELDS.length * SCORE_MAX)) * 100),
    catatan: i % 3 === 0 ? "Komunikatif dan antusias." : null,
  };
});

(async () => {
  await db().insert(penilaian).values(rows);
  console.log(`Selesai: ${rows.length} data contoh ditambahkan.`);
  process.exit(0);
})();

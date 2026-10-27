# YRI HRD — Candidate Interview & Scoring Dashboard

Sistem web untuk mendukung proses **pencatatan dan evaluasi wawancara kandidat Youth Ranger Indonesia**. Aplikasi ini menyatukan input kandidat, penilaian, daftar unggulan per divisi, dan ekspor laporan dalam satu dashboard.

## Masalah yang ingin diselesaikan

Penilaian wawancara menjadi sulit dibandingkan saat catatan kandidat tersebar di berkas atau formulir berbeda. Tim HR memerlukan struktur nilai, ringkasan status kandidat, dan hasil yang bisa diunduh.

## Fitur yang tersedia di kode

- Form data kandidat dan **penilaian dengan lima aspek**: komunikasi, kepemimpinan, komitmen, motivasi, dan kerja sama tim.
- **Dashboard kandidat** dan halaman untuk membuat, melihat, serta mengubah data penilaian.
- **TOP kandidat per regional dan divisi** berdasarkan logika ranking aplikasi.
- **Ekspor Excel dan PDF** melalui route API.
- **Login** dan navigasi dashboard responsif.
- Elemen gamifikasi penilaian HR, seperti XP, level, serta tampilan pencapaian.

## Teknologi

**Next.js 15**, **React 19**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, **ExcelJS**, **jsPDF**, dan **Lucide React**.

## Catatan implementasi

Repository ini merupakan **versi Next.js hasil konversi konsep dari aplikasi HRD sebelumnya**. Ketentuan penilaian dan sebagian kuota divisi pada `src/config/hrd.ts` bersifat **asumsi/contoh dari proses konversi**, bukan kebijakan resmi YRI. Lima kriteria pada versi ini juga berbeda dari versi PHP lama yang dapat digunakan pada operasional lain.

## Hasil

Prototipe sistem HR berbasis database dengan alur penilaian, ranking, dan pelaporan yang lebih terstruktur. Nilai kuota dan aturan perhitungan perlu divalidasi oleh pengelola sebelum aplikasi dipakai sebagai dasar keputusan seleksi nyata.

> Repo ini tidak boleh dianggap telah memverifikasi data kandidat, keamanan akun, atau keputusan rekrutmen produksi tanpa pengujian tambahan.

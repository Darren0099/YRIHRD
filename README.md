# Interview HRD (Next.js + TypeScript)

Konversi dari versi Laravel `InterviewHRD` ke **Next.js 15 + TypeScript + Postgres**, siap deploy ke **Vercel**.
Tema ungu bergaya gamifikasi, ramah HP (navigasi bawah, slider, kartu kandidat), export Excel dan PDF.

## ⚠️ Baca dulu: asumsi saat konversi

File sumber asli (`config/hrd.php`, migrasi, controller, view) **tidak bisa dibaca** saat konversi. Aplikasi ini dibangun
dari fitur yang tertulis di README Laravel. Hal-hal berikut adalah ASUMSI dan mudah diubah:

| Asumsi | Ubah di |
| --- | --- |
| Kriteria penilaian: Komunikasi, Kepemimpinan, Komitmen, Motivasi, Kerja sama tim (slider 1-10, total 0-100) | `src/config/hrd.ts` → `SCORE_FIELDS` |
| Kuota TOP: Secretary 5 dan Social Media Management 4 (dari README lama). Divisi lain hanyalah CONTOH | `src/config/hrd.ts` → `DIVISI_QUOTA` |
| TOP dihitung per **regional + divisi**; skor sama → yang lebih dulu diinput menang | `src/lib/top.ts` |
| Kolom `pewawancara` (opsional) dipakai untuk "Leaderboard HRD" | `src/lib/gamification.ts` |
| Aturan XP/level/misi/badge dibuat ulang (rumus lama tidak terbaca) | `src/config/hrd.ts` (XP) dan `src/lib/gamification.ts` |

Skor disimpan sebagai JSON, jadi mengganti kriteria **tidak perlu migrasi database**.

## Menjalankan di komputer

```bash
npm install
cp .env.example .env.local      # lalu isi DATABASE_URL, HRD_PASSWORD, AUTH_SECRET
npm run db:push                 # membuat tabel (atau tempel schema.sql di SQL Editor Neon/Supabase)
npm run db:seed                 # opsional: data contoh
npm run dev
```

Database gratis: [Neon](https://neon.tech) atau [Supabase](https://supabase.com). Salin *connection string* ke `DATABASE_URL`.

## Deploy ke Vercel

1. Push folder ini ke repo GitHub, lalu *Import* di Vercel (preset Next.js terdeteksi otomatis).
2. Isi **Environment Variables**: `DATABASE_URL`, `HRD_USERNAME`, `HRD_PASSWORD`, `AUTH_SECRET`.
3. Deploy. Jika `HRD_PASSWORD` kosong di production, aplikasi sengaja menolak jalan (sama seperti versi Laravel).

## Peta Laravel → Next.js

| Laravel | Next.js |
| --- | --- |
| `DashboardController` + `dashboard.blade.php` | `src/app/(app)/page.tsx` + `components/DashboardView.tsx` |
| `KandidatController` (cari & filter) | `src/app/(app)/kandidat/page.tsx` |
| `PenilaianController@store/update/destroy` | `src/app/actions.ts` (`savePenilaian`, `deletePenilaianAction`) |
| `PenilaianController@destroyRegional` | `deleteRegionalAction` di `actions.ts`, UI di `/export` |
| `PenilaianController@top` | `src/app/(app)/top/page.tsx` |
| `ExportController@excel` / `@pdf` | `src/app/api/export/excel` dan `/pdf` |
| Login HR (`HRD_USERNAME/PASSWORD`) | `src/middleware.ts`, `src/lib/auth.ts`, `/login` |
| `config/hrd.php` | `src/config/hrd.ts` |
| Migrasi `penilaian` | `src/db/schema.ts` dan `schema.sql` |

## Memindahkan data lama (MySQL → Postgres)

Ekspor tabel `penilaian` lama ke CSV, lalu impor ke Postgres. Kolom lama yang berisi nilai per kriteria perlu
digabung ke kolom `skor` (JSON) dan `total` (0-100). Jika bentuk tabel lama dikirim, skrip konversinya mudah dibuat.

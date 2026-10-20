-- Alternatif tanpa drizzle-kit: tempel di SQL Editor Neon/Supabase.
CREATE TABLE IF NOT EXISTS penilaian (
  id          SERIAL PRIMARY KEY,
  nama        VARCHAR(150) NOT NULL,
  regional    VARCHAR(100) NOT NULL,
  divisi      VARCHAR(100) NOT NULL,
  pewawancara VARCHAR(100),
  skor        JSONB NOT NULL DEFAULT '{}'::jsonb,
  total       INTEGER NOT NULL DEFAULT 0,
  catatan     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS penilaian_regional_divisi_idx ON penilaian (regional, divisi);

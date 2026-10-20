import { LEVEL_TITLES, XP, DIVISI_LIST } from "@/config/hrd";
import { dayKey } from "@/lib/time";
import type { Ranked } from "@/lib/top";

export interface LevelInfo {
  level: number;
  title: string;
  xp: number;
  xpInLevel: number;
  xpPerLevel: number;
  pct: number;
}

export function computeLevel(rows: Ranked[]): LevelInfo {
  let xp = 0;
  for (const r of rows) {
    xp += XP.perInput;
    if (r.catatan && r.catatan.trim()) xp += XP.noteBonus;
    if (r.isTop) xp += XP.topBonus;
  }
  const level = Math.floor(xp / XP.perLevel) + 1;
  const xpInLevel = xp % XP.perLevel;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    xp,
    xpInLevel,
    xpPerLevel: XP.perLevel,
    pct: Math.round((xpInLevel / XP.perLevel) * 100),
  };
}

export interface Mission {
  id: string;
  title: string;
  current: number;
  target: number;
}

export function computeMissions(rows: Ranked[]): Mission[] {
  const today = dayKey(new Date());
  const todayCount = rows.filter((r) => dayKey(r.createdAt) === today).length;
  const divisiCount = new Set(rows.map((r) => r.divisi)).size;
  const withNotes = rows.filter((r) => r.catatan && r.catatan.trim()).length;
  const topCount = rows.filter((r) => r.isTop).length;
  return [
    { id: "today", title: "Nilai 5 kandidat hari ini", current: todayCount, target: 5 },
    { id: "divisi", title: "Jangkau 3 divisi berbeda", current: divisiCount, target: 3 },
    { id: "notes", title: "Tulis catatan untuk 10 kandidat", current: withNotes, target: 10 },
    { id: "top", title: "Loloskan 5 kandidat ke TOP", current: topCount, target: 5 },
  ];
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  earned: boolean;
}

export function computeBadges(rows: Ranked[]): Badge[] {
  const n = rows.length;
  const divisiCount = new Set(rows.map((r) => r.divisi)).size;
  const regionalCount = new Set(rows.map((r) => r.regional)).size;
  const hasStar = rows.some((r) => r.total >= 90);
  return [
    { id: "first", name: "Langkah Pertama", desc: "Menilai kandidat pertama", earned: n >= 1 },
    { id: "ten", name: "Rekruter Aktif", desc: "Menilai 10 kandidat", earned: n >= 10 },
    { id: "fifty", name: "Mesin Seleksi", desc: "Menilai 50 kandidat", earned: n >= 50 },
    { id: "alldiv", name: "Penjelajah Divisi", desc: "Menilai di semua divisi", earned: DIVISI_LIST.length > 0 && divisiCount >= DIVISI_LIST.length },
    { id: "regional", name: "Lintas Regional", desc: "Data dari 2 regional atau lebih", earned: regionalCount >= 2 },
    { id: "star", name: "Pemburu Bintang", desc: "Menemukan kandidat skor 90+", earned: hasStar },
  ];
}

export interface LeaderRow {
  name: string;
  count: number;
  avg: number;
}

/** Peringkat pewawancara berdasarkan jumlah kandidat yang dinilai */
export function computeLeaderboard(rows: Ranked[]): LeaderRow[] {
  const map = new Map<string, { count: number; sum: number }>();
  for (const r of rows) {
    const name = r.pewawancara?.trim();
    if (!name) continue;
    const cur = map.get(name) ?? { count: 0, sum: 0 };
    cur.count += 1;
    cur.sum += r.total;
    map.set(name, cur);
  }
  return [...map.entries()]
    .map(([name, v]) => ({ name, count: v.count, avg: Math.round(v.sum / v.count) }))
    .sort((a, b) => b.count - a.count || b.avg - a.avg)
    .slice(0, 5);
}

import type { Penilaian } from "@/db/schema";
import { quotaFor } from "@/config/hrd";

export interface Ranked extends Penilaian {
  rank: number;
  isTop: boolean;
  quota: number;
}

/**
 * Peringkat dihitung per regional + divisi: skor total tertinggi dulu,
 * jika sama maka yang lebih dulu diinput menang. Sebanyak kuota divisi = TOP.
 */
export function rankAll(rows: Penilaian[]): Ranked[] {
  const groups = new Map<string, Penilaian[]>();
  for (const r of rows) {
    const key = `${r.regional}||${r.divisi}`;
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }
  const out: Ranked[] = [];
  for (const list of groups.values()) {
    list.sort((a, b) => b.total - a.total || a.createdAt.getTime() - b.createdAt.getTime());
    const quota = quotaFor(list[0].divisi);
    list.forEach((r, i) => out.push({ ...r, rank: i + 1, isTop: i < quota, quota }));
  }
  return out;
}

export const newestFirst = (rows: Ranked[]) => [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

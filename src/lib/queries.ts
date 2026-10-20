import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { penilaian, type NewPenilaian } from "@/db/schema";
import { newestFirst, rankAll, type Ranked } from "@/lib/top";

/** Semua kandidat + peringkat/TOP, terbaru di atas. Data HRD kecil, jadi cukup dihitung di memori. */
export async function getAllRanked(): Promise<Ranked[]> {
  const rows = await db().select().from(penilaian).orderBy(desc(penilaian.createdAt));
  return newestFirst(rankAll(rows));
}

export async function getRankedById(id: number) {
  return (await getAllRanked()).find((r) => r.id === id) ?? null;
}

export async function insertPenilaian(v: NewPenilaian) {
  const [row] = await db().insert(penilaian).values(v).returning({ id: penilaian.id });
  return row.id;
}

export async function updatePenilaian(id: number, v: Partial<NewPenilaian>) {
  await db()
    .update(penilaian)
    .set({ ...v, updatedAt: new Date() })
    .where(eq(penilaian.id, id));
}

export async function deletePenilaian(id: number) {
  await db().delete(penilaian).where(eq(penilaian.id, id));
}

export async function deleteByRegional(regional: string) {
  await db().delete(penilaian).where(eq(penilaian.regional, regional));
}

export const regionalsOf = (rows: Ranked[]) => [...new Set(rows.map((r) => r.regional))].sort();

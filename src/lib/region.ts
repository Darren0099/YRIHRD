import { cookies } from "next/headers";
import { REGIONALS } from "@/config/hrd";
import type { Ranked } from "@/lib/top";

export const REGION_COOKIE = "yrihrd_region";

/** Pilihan regional hanya mengubah tampilan, bukan izin akses atau kepemilikan data. */
export async function getSelectedRegion(): Promise<string> {
  const value = (await cookies()).get(REGION_COOKIE)?.value ?? "";
  return (REGIONALS as readonly string[]).includes(value) ? value : "";
}

export function filterByRegion<T extends Pick<Ranked, "regional">>(rows: T[], region: string): T[] {
  return region ? rows.filter((row) => row.regional === region) : rows;
}

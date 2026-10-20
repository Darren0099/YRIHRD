import { TIMEZONE } from "@/config/hrd";

const fmt = (d: Date | string | number, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { timeZone: TIMEZONE, ...o }).format(new Date(d));

/** "20 Okt 2026, 14.35 WIB" */
export const formatWaktu = (d: Date | string | number) =>
  `${fmt(d, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })} WIB`;

export const formatTanggal = (d: Date | string | number) => fmt(d, { day: "numeric", month: "short", year: "numeric" });

/** Kunci hari (YYYY-MM-DD) menurut zona waktu Jakarta */
export const dayKey = (d: Date | string | number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(d));

/** Untuk nama file: 20261020-1435 */
export const stampFile = (d = new Date()) =>
  dayKey(d).replaceAll("-", "") +
  "-" +
  fmt(d, { hour: "2-digit", minute: "2-digit", hour12: false }).replace(/\D/g, "");

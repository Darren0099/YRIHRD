import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let instance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** Koneksi dibuat saat pertama dipakai (bukan saat build). */
export function db() {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL belum diisi. Lihat .env.example");
    const client = postgres(url, { prepare: false, max: 1 });
    instance = drizzle(client, { schema });
  }
  return instance;
}

export { schema };

import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Tabel penilaian kandidat.
 * Skor disimpan sebagai JSON { komunikasi: 8, ... } agar kriteria bisa diubah
 * lewat src/config/hrd.ts tanpa migrasi database.
 */
export const penilaian = pgTable("penilaian", {
  id: serial("id").primaryKey(),
  nama: varchar("nama", { length: 150 }).notNull(),
  regional: varchar("regional", { length: 100 }).notNull(),
  divisi: varchar("divisi", { length: 100 }).notNull(),
  pewawancara: varchar("pewawancara", { length: 100 }),
  skor: jsonb("skor").$type<Record<string, number>>().notNull().default({}),
  total: integer("total").notNull().default(0), // 0-100
  catatan: text("catatan"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Penilaian = typeof penilaian.$inferSelect;
export type NewPenilaian = typeof penilaian.$inferInsert;

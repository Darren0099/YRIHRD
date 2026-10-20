"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, SESSION_MAX_AGE, authMode, createToken } from "@/lib/auth";
import { parsePenilaian } from "@/lib/validate";
import {
  deleteByRegional,
  deletePenilaian,
  getAllRanked,
  insertPenilaian,
  updatePenilaian,
} from "@/lib/queries";

export interface FormState {
  error: string | null;
}

/* ---------------- Login ---------------- */

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  if (authMode() === "misconfigured") return { error: "HRD_PASSWORD belum diisi di server." };

  const user = String(fd.get("username") ?? "").trim();
  const pass = String(fd.get("password") ?? "");
  const okUser = user === (process.env.HRD_USERNAME ?? "hrd");
  const okPass = pass === process.env.HRD_PASSWORD;
  if (!okUser || !okPass) return { error: "Username atau password salah." };

  (await cookies()).set(COOKIE, await createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  const next = String(fd.get("next") ?? "/");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logoutAction() {
  (await cookies()).delete(COOKIE);
  redirect("/login");
}

/* ---------------- Penilaian ---------------- */

export async function savePenilaian(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = parsePenilaian(fd);
  if ("error" in parsed) return { error: parsed.error };

  const idRaw = Number(fd.get("id"));
  let id: number;
  try {
    if (Number.isInteger(idRaw) && idRaw > 0) {
      await updatePenilaian(idRaw, parsed.data);
      id = idRaw;
    } else {
      id = await insertPenilaian(parsed.data);
    }
  } catch (e) {
    console.error(e);
    return { error: "Gagal menyimpan ke database. Cek DATABASE_URL dan pastikan tabel sudah dibuat." };
  }

  // Cek apakah kandidat ini masuk TOP (memicu konfeti di halaman berikutnya)
  const all = await getAllRanked();
  const inTop = all.find((r) => r.id === id)?.isTop ? 1 : 0;

  revalidatePath("/", "layout");
  redirect(`/kandidat?saved=${id}&top=${inTop}`);
}

export async function deletePenilaianAction(fd: FormData) {
  const id = Number(fd.get("id"));
  if (Number.isInteger(id) && id > 0) await deletePenilaian(id);
  revalidatePath("/", "layout");
  redirect("/kandidat");
}

export async function deleteRegionalAction(fd: FormData) {
  const regional = String(fd.get("regional") ?? "").trim();
  if (regional) await deleteByRegional(regional);
  revalidatePath("/", "layout");
  redirect("/export");
}

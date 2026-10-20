/**
 * Sesi login sederhana: cookie bertanda tangan HMAC (jalan di Edge middleware maupun server).
 */
export const COOKIE = "hrd_session";
const WEEK = 7 * 24 * 60 * 60 * 1000;

export type AuthMode = "open" | "required" | "misconfigured";

/** open = tanpa login (hanya lokal); misconfigured = production tapi password kosong */
export function authMode(): AuthMode {
  const hasPass = !!process.env.HRD_PASSWORD;
  if (hasPass) return "required";
  return process.env.NODE_ENV === "production" ? "misconfigured" : "open";
}

const enc = new TextEncoder();

function secret() {
  return process.env.AUTH_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-secret-ubah-di-production");
}

function toB64Url(buf: ArrayBuffer) {
  let s = "";
  new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toB64Url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function createToken() {
  if (!secret()) throw new Error("AUTH_SECRET belum diisi");
  const exp = String(Date.now() + WEEK);
  return `${exp}.${await sign(exp)}`;
}

export async function verifyToken(token?: string | null) {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = await sign(exp);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export const SESSION_MAX_AGE = WEEK / 1000;

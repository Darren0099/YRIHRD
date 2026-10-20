import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { authMode } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const mode = authMode();

  return (
    <main className="login">
      <div className="login__card card page-in">
        <span className="brand__mark brand__mark--lg" aria-hidden="true">
          HR
        </span>
        <h1 className="h1">Interview HRD</h1>
        {mode === "misconfigured" ? (
          <p className="alert" role="alert">
            Aplikasi dihentikan: HRD_PASSWORD belum diisi di environment variables server.
          </p>
        ) : mode === "open" ? (
          <p className="muted">Login nonaktif (mode lokal). Isi HRD_PASSWORD di .env.local untuk mengaktifkannya.</p>
        ) : (
          <LoginForm next={next ?? "/"} />
        )}
      </div>
    </main>
  );
}

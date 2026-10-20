import AppNav from "@/components/AppNav";
import { authMode } from "@/lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav showLogout={authMode() === "required"} />
      <main className="page">{children}</main>
    </>
  );
}

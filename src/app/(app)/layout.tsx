import AppNav from "@/components/AppNav";
import { authMode } from "@/lib/auth";
import { getSelectedRegion } from "@/lib/region";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const selectedRegion = await getSelectedRegion();
  return (
    <>
      <AppNav showLogout={authMode() === "required"} selectedRegion={selectedRegion} />
      <main className="page">{children}</main>
    </>
  );
}

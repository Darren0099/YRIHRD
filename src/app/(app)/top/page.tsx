import type { Metadata } from "next";
import TopView from "@/components/TopView";
import { getAllRanked } from "@/lib/queries";
import { getSelectedRegion, filterByRegion } from "@/lib/region";

export const metadata: Metadata = { title: "TOP per divisi" };
export const dynamic = "force-dynamic";

export default async function TopPage() {
  const selectedRegion = await getSelectedRegion();
  const rows = filterByRegion(await getAllRanked(), selectedRegion);
  return (
    <div className="stack">
      <h1 className="h1">TOP per divisi{selectedRegion ? ` · ${selectedRegion}` : ""}</h1>
      <p className="muted">Peringkat dihitung per regional dan divisi. Jumlah TOP mengikuti kuota di pengaturan.</p>
      <TopView rows={rows} />
    </div>
  );
}

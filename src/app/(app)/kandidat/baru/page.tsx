import type { Metadata } from "next";
import PenilaianForm from "@/components/PenilaianForm";
import { REGIONALS } from "@/config/hrd";
import { getSelectedRegion } from "@/lib/region";

export const metadata: Metadata = { title: "Nilai kandidat" };
export const dynamic = "force-dynamic";

export default async function BaruPage() {
  const selectedRegion = await getSelectedRegion();
  return (
    <div className="stack">
      <h1 className="h1">Nilai kandidat</h1>
      <PenilaianForm regionals={[...REGIONALS]} selectedRegion={selectedRegion} />
    </div>
  );
}

import type { Metadata } from "next";
import PenilaianForm from "@/components/PenilaianForm";
import { REGIONALS } from "@/config/hrd";
import { getAllRanked, regionalsOf } from "@/lib/queries";

export const metadata: Metadata = { title: "Nilai kandidat" };
export const dynamic = "force-dynamic";

export default async function BaruPage() {
  const all = await getAllRanked().catch(() => []);
  const regionals = [...new Set([...REGIONALS, ...regionalsOf(all)])];
  return (
    <div className="stack">
      <h1 className="h1">Nilai kandidat</h1>
      <PenilaianForm regionals={regionals} />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PenilaianForm from "@/components/PenilaianForm";
import { REGIONALS } from "@/config/hrd";
import { getAllRanked, regionalsOf } from "@/lib/queries";

export const metadata: Metadata = { title: "Ubah penilaian" };
export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getAllRanked();
  const row = all.find((r) => r.id === Number(id));
  if (!row) notFound();
  const regionals = [...new Set([...REGIONALS, ...regionalsOf(all)])];

  return (
    <div className="stack">
      <h1 className="h1">Ubah penilaian</h1>
      <PenilaianForm initial={row} regionals={regionals} />
    </div>
  );
}

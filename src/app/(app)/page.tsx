import DashboardView from "@/components/DashboardView";
import { getAllRanked } from "@/lib/queries";
import { getSelectedRegion, filterByRegion } from "@/lib/region";

export const dynamic = "force-dynamic";

export default async function Home() {
  const selectedRegion = await getSelectedRegion();
  const rows = filterByRegion(await getAllRanked(), selectedRegion);
  return <DashboardView rows={rows} />;
}

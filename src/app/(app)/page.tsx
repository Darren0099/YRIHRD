import DashboardView from "@/components/DashboardView";
import { getAllRanked } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await getAllRanked();
  return <DashboardView rows={rows} />;
}

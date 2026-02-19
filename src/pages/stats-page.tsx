import { SummaryCards } from "../components/stats/summary-cards.tsx";

export function StatsPage() {
  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold">Stats</h1>
      <div class="mt-4">
        <SummaryCards />
      </div>
    </div>
  );
}

import { useSignal } from "@preact/signals";
import { PageHeader } from "../components/layout/page-header.tsx";
import { SummaryCards } from "../components/stats/summary-cards.tsx";
import { TulChart } from "../components/stats/tul-chart.tsx";
import { WeightChart } from "../components/stats/weight-chart.tsx";
import { workoutHistory } from "../stores/history-store.ts";
import { exercises } from "../stores/exercise-store.ts";
import type { ChartFilter } from "../components/stats/tul-chart.tsx";

function getDateRangeStart(range: string): string | undefined {
  if (range === "all") return undefined;
  const now = new Date();
  const days = range === "30d" ? 30 : range === "90d" ? 90 : 365;
  now.setDate(now.getDate() - days);
  return now.toISOString().split("T")[0];
}

export function StatsPage() {
  const selectedExerciseId = useSignal<string>("");
  const selectedRange = useSignal("all");

  const dateRangeStart = getDateRangeStart(selectedRange.value);
  const filter: ChartFilter = {
    exerciseId: selectedExerciseId.value || undefined,
    dateRange: dateRangeStart
      ? { start: dateRangeStart, end: new Date().toISOString().split("T")[0] }
      : undefined,
  };

  return (
    <div>
      <PageHeader title="Stats" />
      <div class="space-y-4 p-4">
        <SummaryCards />

        {workoutHistory.value.length > 0 && (
          <>
            {/* Filters */}
            <div class="flex gap-2">
              <select
                value={selectedExerciseId.value}
                onChange={(e) => {
                  selectedExerciseId.value = (
                    e.target as HTMLSelectElement
                  ).value;
                }}
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Exercises</option>
                {exercises.value.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedRange.value}
                onChange={(e) => {
                  selectedRange.value = (e.target as HTMLSelectElement).value;
                }}
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="1y">1 Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Charts */}
            <TulChart filter={filter} />
            {selectedExerciseId.value && (
              <WeightChart
                exerciseId={selectedExerciseId.value}
                dateRange={filter.dateRange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

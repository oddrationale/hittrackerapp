import { computed } from "@preact/signals";
import { PageHeader } from "../components/layout/page-header.tsx";
import { WorkoutDetail } from "../components/history/workout-detail.tsx";
import { workoutHistory } from "../stores/history-store.ts";
import { routines } from "../stores/routine-store.ts";
import { useLocation } from "preact-iso";

const sortedHistory = computed(() =>
  [...workoutHistory.value].sort((a, b) => b.date.localeCompare(a.date)),
);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function HistoryPage() {
  const { path } = useLocation();

  // If path has an ID, show detail view
  const match = path.match(/^\/history\/(.+)$/);
  if (match) {
    return <WorkoutDetail workoutId={match[1]} />;
  }

  return (
    <div>
      <PageHeader title="History" />
      <div class="p-4">
        {sortedHistory.value.length === 0 ? (
          <p class="py-8 text-center text-gray-500">No workouts yet</p>
        ) : (
          <div class="space-y-2">
            {sortedHistory.value.map((workout) => {
              const routine = workout.routineId
                ? routines.value.find((r) => r.id === workout.routineId)
                : null;
              return (
                <a
                  key={workout.id}
                  href={`/history/${workout.id}`}
                  class="block rounded-lg bg-white p-4 shadow-sm"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900">
                        {routine ? routine.name : "Freeform"}
                      </div>
                      <div class="text-sm text-gray-500">
                        {formatDate(workout.date)}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-medium text-gray-900">
                        {formatTime(workout.totalTul)} TUL
                      </div>
                      <div class="text-sm text-gray-500">
                        {workout.exerciseLogs.length} exercises
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

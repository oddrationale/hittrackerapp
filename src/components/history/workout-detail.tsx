import { PageHeader } from "../layout/page-header.tsx";
import { getWorkout, deleteWorkout } from "../../stores/history-store.ts";
import { exercises } from "../../stores/exercise-store.ts";
import { settings } from "../../stores/settings-store.ts";
import { formatTime } from "../../utils/format.ts";
import { useLocation } from "preact-iso";

interface WorkoutDetailProps {
  workoutId: string;
}

export function WorkoutDetail({ workoutId }: WorkoutDetailProps) {
  const { route } = useLocation();
  const workout = getWorkout(workoutId);

  if (!workout) {
    return (
      <div>
        <PageHeader title="Workout Detail" onBack={() => route("/history")} />
        <p class="p-4 text-center text-gray-500">Workout not found</p>
      </div>
    );
  }

  const tulPercent =
    workout.tulRatio > 0 ? Math.round(workout.tulRatio * 100) : 0;

  async function handleDelete() {
    if (confirm("Delete this workout? This cannot be undone.")) {
      await deleteWorkout(workoutId);
      route("/history");
    }
  }

  return (
    <div>
      <PageHeader title="Workout Detail" onBack={() => route("/history")} />
      <div class="p-4">
        {/* Date */}
        <p class="mb-4 text-sm text-gray-500">{workout.date}</p>

        {/* Stats */}
        <div class="mb-6 grid grid-cols-3 gap-2">
          <div class="rounded-lg bg-white p-3 text-center shadow-sm">
            <p class="text-xs text-gray-500">Total Time</p>
            <p class="text-xl font-bold">{formatTime(workout.totalTime)}</p>
          </div>
          <div class="rounded-lg bg-white p-3 text-center shadow-sm">
            <p class="text-xs text-gray-500">Total TUL</p>
            <p class="text-xl font-bold">{formatTime(workout.totalTul)}</p>
          </div>
          <div class="rounded-lg bg-white p-3 text-center shadow-sm">
            <p class="text-xs text-gray-500">TUL Ratio</p>
            <p class="text-xl font-bold">{tulPercent}%</p>
          </div>
        </div>

        {/* Exercise list */}
        <h2 class="mb-2 text-sm font-medium text-gray-500">Exercises</h2>
        <div class="space-y-2">
          {workout.exerciseLogs.map((log) => {
            const exercise = exercises.value.find(
              (e) => e.id === log.exerciseId,
            );
            const directionIcon =
              log.weightDirection === "increase"
                ? "\u2191"
                : log.weightDirection === "decrease"
                  ? "\u2193"
                  : "=";
            return (
              <div key={log.id} class="rounded-lg bg-white p-3 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="font-medium">{exercise?.name ?? "Unknown"}</div>
                  <span class="text-lg">{directionIcon}</span>
                </div>
                <div class="text-sm text-gray-500">
                  {log.weight} {settings.value.weightUnit} ·{" "}
                  {formatTime(log.tul)}
                  {log.reps ? ` · ${log.reps} reps` : ""}
                </div>
                {log.notes && (
                  <div class="mt-1 text-sm text-gray-400 italic">
                    {log.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          class="mt-6 w-full rounded-lg bg-red-50 py-3 text-sm font-medium text-red-600"
        >
          Delete Workout
        </button>
      </div>
    </div>
  );
}

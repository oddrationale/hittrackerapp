import { lastCompletedWorkout } from "../../stores/workout-store.ts";
import { exercises } from "../../stores/exercise-store.ts";
import { settings } from "../../stores/settings-store.ts";
import { formatTime } from "../../utils/format.ts";
import { useLocation } from "preact-iso";

export function WorkoutSummary() {
  const { route } = useLocation();
  const workout = lastCompletedWorkout.value;

  if (!workout) {
    return <p class="p-4 text-center text-gray-500">No workout data</p>;
  }

  const tulPercent =
    workout.tulRatio > 0 ? Math.round(workout.tulRatio * 100) : 0;

  return (
    <div class="p-4">
      <h1 class="mb-4 text-center text-2xl font-bold">Workout Complete!</h1>

      {/* Stats cards */}
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
          const exercise = exercises.value.find((e) => e.id === log.exerciseId);
          const directionIcon =
            log.weightDirection === "increase"
              ? "\u2191"
              : log.weightDirection === "decrease"
                ? "\u2193"
                : "=";
          return (
            <div
              key={log.id}
              class="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
            >
              <div>
                <div class="font-medium">{exercise?.name ?? "Unknown"}</div>
                <div class="text-sm text-gray-500">
                  {log.weight} {settings.value.weightUnit} &middot;{" "}
                  {formatTime(log.tul)}
                  {log.reps ? ` \u00B7 ${log.reps} reps` : ""}
                </div>
              </div>
              <span class="text-lg">{directionIcon}</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => route("/")}
        class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white"
      >
        Done
      </button>
    </div>
  );
}

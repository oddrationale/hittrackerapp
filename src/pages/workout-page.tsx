import { PageHeader } from "../components/layout/page-header.tsx";
import { routines } from "../stores/routine-store.ts";
import {
  startWorkout,
  isWorkoutActive,
} from "../stores/workout-store.ts";

export function WorkoutPage() {
  // If workout is active, show active workout view (placeholder for now)
  if (isWorkoutActive.value) {
    return (
      <div>
        <PageHeader title="Active Workout" />
        <div class="p-4">
          <p>Workout in progress...</p>
          {/* Active workout content will be added in Task 25 */}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Start Workout" />
      <div class="space-y-4 p-4">
        {/* Freeform option */}
        <button
          onClick={() => startWorkout()}
          class="w-full rounded-lg bg-blue-600 p-4 text-left text-white shadow-sm"
        >
          <div class="text-lg font-semibold">Freeform Workout</div>
          <div class="text-sm text-blue-200">Choose exercises as you go</div>
        </button>

        {/* Routines */}
        {routines.value.length > 0 && (
          <div>
            <h2 class="mb-2 text-sm font-medium text-gray-500">Routines</h2>
            <div class="space-y-2">
              {routines.value.map((routine) => (
                <button
                  key={routine.id}
                  onClick={() => startWorkout(routine.id)}
                  class="w-full rounded-lg bg-white p-4 text-left shadow-sm"
                >
                  <div class="font-semibold text-gray-900">{routine.name}</div>
                  <div class="text-sm text-gray-500">
                    {routine.exerciseIds.length} exercises
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

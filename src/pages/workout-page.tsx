import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { PageHeader } from "../components/layout/page-header.tsx";
import { ExerciseCard } from "../components/workout/exercise-card.tsx";
import { ExercisePicker } from "../components/workout/exercise-picker.tsx";
import { WorkoutSummary } from "../components/workout/workout-summary.tsx";
import { routines } from "../stores/routine-store.ts";
import { exercises } from "../stores/exercise-store.ts";
import {
  startWorkout,
  isWorkoutActive,
  activeWorkout,
  currentExerciseIndex,
  addExerciseLog,
  finishWorkout,
  cancelWorkout,
} from "../stores/workout-store.ts";
import { requestWakeLock, releaseWakeLock } from "../utils/wake-lock.ts";
import type { Exercise, ExerciseLog } from "../types/index.ts";

function ActiveWorkout() {
  const { route } = useLocation();
  const selectedExercise = useSignal<Exercise | null>(null);

  // Wake lock on mount, release on unmount
  useEffect(() => {
    requestWakeLock();
    return () => {
      releaseWakeLock();
    };
  }, []);

  const workout = activeWorkout.value!;
  const routine = workout.routineId
    ? routines.value.find((r) => r.id === workout.routineId)
    : null;

  // For routine workouts: get the current exercise
  const currentExercise = routine
    ? exercises.value.find(
        (e) => e.id === routine.exerciseIds[currentExerciseIndex.value],
      )
    : selectedExercise.value;

  function handleSave(logData: Omit<ExerciseLog, "id">) {
    const log: ExerciseLog = {
      id: crypto.randomUUID(),
      ...logData,
    };
    addExerciseLog(log);
    selectedExercise.value = null; // Reset for freeform
  }

  async function handleFinish() {
    await finishWorkout();
    await releaseWakeLock();
    route("/workout/summary");
  }

  function handleCancel() {
    cancelWorkout();
    releaseWakeLock();
  }

  // Overall workout time display
  const workoutElapsed = Math.floor((Date.now() - workout.startTime) / 1000);
  const workoutMins = Math.floor(workoutElapsed / 60);
  const workoutSecs = workoutElapsed % 60;

  // If all exercises in routine are done
  const allExercisesDone = routine
    ? currentExerciseIndex.value >= routine.exerciseIds.length
    : false;

  if (allExercisesDone) {
    return (
      <div>
        <PageHeader title="Active Workout" />
        <div class="p-4">
          <div class="mb-4 text-center">
            <p class="text-gray-500">All exercises complete!</p>
            <p class="text-2xl font-bold">
              {workout.exerciseLogs.length} exercises logged
            </p>
          </div>
          <button
            onClick={handleFinish}
            class="w-full rounded-lg bg-green-600 py-3 text-lg font-bold text-white"
          >
            Finish Workout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Active Workout" />
      <div class="p-4">
        {/* Overall time */}
        <div class="mb-4 text-center text-sm text-gray-500">
          Workout: {workoutMins}:{workoutSecs.toString().padStart(2, "0")}
          {" \u00B7 "}
          {workout.exerciseLogs.length} exercises done
        </div>

        {/* Current exercise or picker */}
        {currentExercise ? (
          <ExerciseCard
            key={currentExercise.id + "-" + currentExerciseIndex.value}
            exerciseId={currentExercise.id}
            exerciseName={currentExercise.name}
            onSave={handleSave}
          />
        ) : (
          <div>
            <h2 class="mb-2 text-lg font-semibold">Pick next exercise</h2>
            <ExercisePicker
              onSelect={(ex) => {
                selectedExercise.value = ex;
              }}
            />
          </div>
        )}

        {/* Action buttons */}
        <div class="mt-4 flex gap-2">
          <button
            onClick={handleFinish}
            class="flex-1 rounded-lg bg-green-600 py-3 font-semibold text-white"
          >
            Finish Workout
          </button>
          <button
            onClick={handleCancel}
            class="rounded-lg bg-gray-200 px-4 py-3 font-semibold text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkoutPage() {
  const { path } = useLocation();

  // If workout is active, show active workout view
  if (isWorkoutActive.value) {
    return <ActiveWorkout />;
  }

  // Show summary after finishing a workout
  if (path === "/workout/summary") {
    return <WorkoutSummary />;
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

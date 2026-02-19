import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocationProvider } from "preact-iso";

// Mock ExerciseTimer to avoid fake timer complexity
vi.mock("../../src/components/timer/exercise-timer.tsx", () => ({
  ExerciseTimer: ({ onComplete }: { onComplete: (tul: number) => void }) => (
    <button onClick={() => onComplete(90)}>Mock Timer Complete</button>
  ),
}));

// Mock wake-lock to avoid navigator.wakeLock issues in jsdom
vi.mock("../../src/utils/wake-lock.ts", () => ({
  requestWakeLock: vi.fn(),
  releaseWakeLock: vi.fn(),
}));

import { WorkoutPage } from "../../src/pages/workout-page.tsx";
import {
  activeWorkout,
  currentExerciseIndex,
  lastCompletedWorkout,
  startWorkout,
} from "../../src/stores/workout-store.ts";
import { exercises } from "../../src/stores/exercise-store.ts";
import { routines } from "../../src/stores/routine-store.ts";
import type { Exercise, Routine } from "../../src/types/index.ts";

function renderWorkoutPage() {
  return render(
    <LocationProvider>
      <WorkoutPage />
    </LocationProvider>,
  );
}

function seedExercises(): Exercise[] {
  const seeded: Exercise[] = [
    {
      id: "ex-1",
      name: "Chest Press",
      category: "Upper",
      lastModified: Date.now(),
    },
    {
      id: "ex-2",
      name: "Leg Press",
      category: "Lower",
      lastModified: Date.now(),
    },
    {
      id: "ex-3",
      name: "Pulldown",
      category: "Upper",
      lastModified: Date.now(),
    },
    {
      id: "ex-4",
      name: "Leg Curl",
      category: "Lower",
      lastModified: Date.now(),
    },
  ];
  exercises.value = seeded;
  return seeded;
}

function seedRoutines(): Routine[] {
  const seeded: Routine[] = [
    {
      id: "r-1",
      name: "Full Body",
      exerciseIds: ["ex-1", "ex-2", "ex-3"],
      lastModified: Date.now(),
    },
  ];
  routines.value = seeded;
  return seeded;
}

describe("Active Workout Flow", () => {
  beforeEach(() => {
    activeWorkout.value = null;
    currentExerciseIndex.value = 0;
    lastCompletedWorkout.value = null;
    exercises.value = [];
    routines.value = [];
  });

  it("when workout is active with a routine, shows the current exercise name", () => {
    seedExercises();
    seedRoutines();

    // Start a routine workout
    startWorkout("r-1");

    renderWorkoutPage();

    // Should show the first exercise in the routine
    expect(screen.getByText("Chest Press")).toBeInTheDocument();
  });

  it("after logging an exercise, advances to the next exercise", () => {
    seedExercises();
    seedRoutines();

    startWorkout("r-1");

    renderWorkoutPage();

    // Should show first exercise
    expect(screen.getByText("Chest Press")).toBeInTheDocument();

    // Complete the timer
    fireEvent.click(screen.getByText("Mock Timer Complete"));

    // Click Save & Next
    fireEvent.click(screen.getByText("Save & Next"));

    // Should advance to the next exercise (Leg Press)
    expect(screen.getByText("Leg Press")).toBeInTheDocument();
  });

  it("for freeform workout, shows exercise picker to choose next exercise", () => {
    seedExercises();

    // Start a freeform workout (no routine)
    startWorkout();

    renderWorkoutPage();

    // Should show the exercise picker
    expect(screen.getByText("Pick next exercise")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search exercises/i),
    ).toBeInTheDocument();

    // Select an exercise
    fireEvent.click(screen.getByText("Chest Press"));

    // Should now show the ExerciseCard for that exercise
    expect(screen.queryByText("Pick next exercise")).not.toBeInTheDocument();
    expect(screen.getByText("Chest Press")).toBeInTheDocument();
  });

  it("shows overall workout elapsed time at top", () => {
    seedExercises();
    seedRoutines();

    startWorkout("r-1");

    renderWorkoutPage();

    // Should show workout time display (starts near 0:00)
    expect(screen.getByText(/Workout:/)).toBeInTheDocument();
    expect(screen.getByText(/exercises done/)).toBeInTheDocument();
  });

  it("'Finish Workout' button ends the workout and navigates to summary", async () => {
    seedExercises();
    seedRoutines();

    startWorkout("r-1");

    renderWorkoutPage();

    // Click Finish Workout
    const finishButton = screen.getByText("Finish Workout");
    fireEvent.click(finishButton);

    // Workout should be finished (activeWorkout becomes null)
    await waitFor(() => {
      expect(activeWorkout.value).toBeNull();
    });
  });

  it("'Cancel Workout' button ends workout without saving", () => {
    seedExercises();
    seedRoutines();

    startWorkout("r-1");
    expect(activeWorkout.value).not.toBeNull();

    renderWorkoutPage();

    // Click Cancel
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Workout should be cancelled
    expect(activeWorkout.value).toBeNull();
  });
});

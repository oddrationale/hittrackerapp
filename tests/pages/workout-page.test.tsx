import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, beforeEach } from "vitest";
import { LocationProvider } from "preact-iso";
import { WorkoutPage } from "../../src/pages/workout-page.tsx";
import {
  activeWorkout,
  currentExerciseIndex,
  isWorkoutActive,
} from "../../src/stores/workout-store.ts";
import { routines } from "../../src/stores/routine-store.ts";
import type { Routine } from "../../src/types/index.ts";

function renderWorkoutPage() {
  return render(
    <LocationProvider>
      <WorkoutPage />
    </LocationProvider>,
  );
}

function seedRoutines(): Routine[] {
  const seeded: Routine[] = [
    {
      id: "r-1",
      name: "Push Day",
      exerciseIds: ["ex-1", "ex-2", "ex-3"],
      lastModified: Date.now(),
    },
    {
      id: "r-2",
      name: "Pull Day",
      exerciseIds: ["ex-4", "ex-5"],
      lastModified: Date.now(),
    },
  ];
  routines.value = seeded;
  return seeded;
}

describe("WorkoutPage", () => {
  beforeEach(() => {
    activeWorkout.value = null;
    currentExerciseIndex.value = 0;
    routines.value = [];
  });

  it("shows 'Start Workout' heading when no workout is active", () => {
    renderWorkoutPage();
    expect(screen.getByText("Start Workout")).toBeInTheDocument();
  });

  it("shows list of routines available to pick from", () => {
    seedRoutines();
    renderWorkoutPage();

    expect(screen.getByText("Push Day")).toBeInTheDocument();
    expect(screen.getByText("3 exercises")).toBeInTheDocument();
    expect(screen.getByText("Pull Day")).toBeInTheDocument();
    expect(screen.getByText("2 exercises")).toBeInTheDocument();
  });

  it("shows 'Freeform Workout' option", () => {
    renderWorkoutPage();
    expect(screen.getByText("Freeform Workout")).toBeInTheDocument();
    expect(
      screen.getByText("Choose exercises as you go"),
    ).toBeInTheDocument();
  });

  it("shows no routines section when none exist", () => {
    renderWorkoutPage();

    // The "Routines" heading should not appear when there are no routines
    expect(screen.queryByText("Routines")).not.toBeInTheDocument();
  });

  it("clicking a routine calls startWorkout(routineId) and shows active workout view", () => {
    seedRoutines();
    renderWorkoutPage();

    const pushDayButton = screen.getByText("Push Day").closest("button")!;
    fireEvent.click(pushDayButton);

    expect(isWorkoutActive.value).toBe(true);
    expect(activeWorkout.value?.routineId).toBe("r-1");
    expect(screen.getByText("Active Workout")).toBeInTheDocument();
  });

  it("clicking freeform calls startWorkout() with no routine", () => {
    renderWorkoutPage();

    const freeformButton = screen
      .getByText("Freeform Workout")
      .closest("button")!;
    fireEvent.click(freeformButton);

    expect(isWorkoutActive.value).toBe(true);
    expect(activeWorkout.value?.routineId).toBeUndefined();
    expect(screen.getByText("Active Workout")).toBeInTheDocument();
  });
});

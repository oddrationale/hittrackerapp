import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocationProvider } from "preact-iso";
import { WorkoutSummary } from "../../../src/components/workout/workout-summary.tsx";
import { lastCompletedWorkout } from "../../../src/stores/workout-store.ts";
import { exercises } from "../../../src/stores/exercise-store.ts";
import { settings } from "../../../src/stores/settings-store.ts";
import type { Workout, Exercise } from "../../../src/types/index.ts";

const mockRoute = vi.fn();

vi.mock("preact-iso", async () => {
  const actual =
    await vi.importActual<typeof import("preact-iso")>("preact-iso");
  return {
    ...actual,
    useLocation: () => ({
      url: "/workout/summary",
      path: "/workout/summary",
      route: mockRoute,
      query: {},
    }),
  };
});

function mockWorkout(): Workout {
  return {
    id: "w-1",
    date: "2026-02-18",
    startTime: 1000000,
    endTime: 1000000 + 600_000, // 600s = 10 min total
    exerciseLogs: [
      {
        id: "log-1",
        exerciseId: "ex-1",
        weight: 100,
        tul: 90, // 1:30
        weightDirection: "increase",
      },
      {
        id: "log-2",
        exerciseId: "ex-2",
        weight: 200,
        tul: 75, // 1:15
        reps: 8,
        weightDirection: "decrease",
      },
      {
        id: "log-3",
        exerciseId: "ex-3",
        weight: 150,
        tul: 60, // 1:00
        weightDirection: "maintain",
      },
    ],
    totalTul: 225, // 90+75+60 = 225 => 3:45
    totalTime: 600, // 10:00
    tulRatio: 225 / 600, // 0.375 => 38%
    lastModified: Date.now(),
  };
}

function mockExerciseList(): Exercise[] {
  return [
    { id: "ex-1", name: "Chest Press", category: "Upper", lastModified: 1 },
    { id: "ex-2", name: "Leg Press", category: "Lower", lastModified: 2 },
    { id: "ex-3", name: "Pulldown", category: "Upper", lastModified: 3 },
  ];
}

function renderSummary() {
  return render(
    <LocationProvider>
      <WorkoutSummary />
    </LocationProvider>,
  );
}

describe("WorkoutSummary", () => {
  beforeEach(() => {
    lastCompletedWorkout.value = null;
    exercises.value = [];
    settings.value = {
      weightUnit: "lbs",
      metronomeEnabled: false,
      countdownDuration: 3,
    };
    mockRoute.mockClear();
  });

  it("shows 'No workout data' when no completed workout exists", () => {
    renderSummary();
    expect(screen.getByText("No workout data")).toBeInTheDocument();
  });

  it("shows total workout time formatted as MM:SS", () => {
    lastCompletedWorkout.value = mockWorkout();
    exercises.value = mockExerciseList();

    renderSummary();

    // totalTime = 600s = 10:00
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("shows total TUL formatted as MM:SS", () => {
    lastCompletedWorkout.value = mockWorkout();
    exercises.value = mockExerciseList();

    renderSummary();

    // totalTul = 225s = 3:45
    expect(screen.getByText("3:45")).toBeInTheDocument();
  });

  it("shows TUL ratio as a percentage", () => {
    lastCompletedWorkout.value = mockWorkout();
    exercises.value = mockExerciseList();

    renderSummary();

    // tulRatio = 0.375 => 38%
    expect(screen.getByText("38%")).toBeInTheDocument();
  });

  it("lists each exercise with name, weight, TUL, and weight direction indicator", () => {
    lastCompletedWorkout.value = mockWorkout();
    exercises.value = mockExerciseList();

    renderSummary();

    // Exercise names
    expect(screen.getByText("Chest Press")).toBeInTheDocument();
    expect(screen.getByText("Leg Press")).toBeInTheDocument();
    expect(screen.getByText("Pulldown")).toBeInTheDocument();

    // Weight + TUL info (check that weight and formatted TUL appear)
    expect(screen.getByText(/100 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/1:30/)).toBeInTheDocument();

    expect(screen.getByText(/200 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/1:15/)).toBeInTheDocument();
    expect(screen.getByText(/8 reps/)).toBeInTheDocument();

    expect(screen.getByText(/150 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/1:00/)).toBeInTheDocument();

    // Weight direction indicators
    // increase = up arrow, decrease = down arrow, maintain = equals sign
    const allText = document.body.textContent ?? "";
    expect(allText).toContain("\u2191"); // up arrow for increase
    expect(allText).toContain("\u2193"); // down arrow for decrease
    expect(allText).toContain("="); // equals for maintain
  });

  it("'Done' button navigates back to start workout page", () => {
    lastCompletedWorkout.value = mockWorkout();
    exercises.value = mockExerciseList();

    renderSummary();

    const doneButton = screen.getByText("Done");
    fireEvent.click(doneButton);

    expect(mockRoute).toHaveBeenCalledWith("/");
  });
});

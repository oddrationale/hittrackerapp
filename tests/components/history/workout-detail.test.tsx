import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocationProvider } from "preact-iso";
import { WorkoutDetail } from "../../../src/components/history/workout-detail.tsx";
import { workoutHistory } from "../../../src/stores/history-store.ts";
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
      url: "/history/w-1",
      path: "/history/w-1",
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
    endTime: 1000000 + 600_000,
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
        notes: "Felt strong today",
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

function renderDetail(workoutId = "w-1") {
  return render(
    <LocationProvider>
      <WorkoutDetail workoutId={workoutId} />
    </LocationProvider>,
  );
}

describe("WorkoutDetail", () => {
  beforeEach(() => {
    workoutHistory.value = [];
    exercises.value = [];
    settings.value = {
      weightUnit: "lbs",
      metronomeEnabled: false,
      countdownDuration: 3,
    };
    mockRoute.mockClear();
  });

  it("shows date, total time, total TUL, and TUL ratio", () => {
    workoutHistory.value = [mockWorkout()];
    exercises.value = mockExerciseList();

    renderDetail("w-1");

    // Date
    expect(screen.getByText("2026-02-18")).toBeInTheDocument();
    // Total Time = 600s = 10:00
    expect(screen.getByText("10:00")).toBeInTheDocument();
    // Total TUL = 225s = 3:45
    expect(screen.getByText("3:45")).toBeInTheDocument();
    // TUL Ratio = 0.375 => 38%
    expect(screen.getByText("38%")).toBeInTheDocument();
  });

  it("lists all exercises with name, weight, TUL, reps, notes, and weight direction", () => {
    workoutHistory.value = [mockWorkout()];
    exercises.value = mockExerciseList();

    renderDetail("w-1");

    // Exercise names
    expect(screen.getByText("Chest Press")).toBeInTheDocument();
    expect(screen.getByText("Leg Press")).toBeInTheDocument();
    expect(screen.getByText("Pulldown")).toBeInTheDocument();

    // Weight and TUL info
    expect(screen.getByText(/100 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/1:30/)).toBeInTheDocument();

    expect(screen.getByText(/200 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/1:15/)).toBeInTheDocument();
    // Reps
    expect(screen.getByText(/8 reps/)).toBeInTheDocument();

    expect(screen.getByText(/150 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/1:00/)).toBeInTheDocument();

    // Notes
    expect(screen.getByText("Felt strong today")).toBeInTheDocument();

    // Weight direction indicators
    const allText = document.body.textContent ?? "";
    expect(allText).toContain("\u2191"); // up arrow for increase
    expect(allText).toContain("\u2193"); // down arrow for decrease
    expect(allText).toContain("="); // equals for maintain
  });

  it("'Delete Workout' button with confirmation deletes and navigates away", async () => {
    workoutHistory.value = [mockWorkout()];
    exercises.value = mockExerciseList();

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    renderDetail("w-1");

    const deleteButton = screen.getByText("Delete Workout");
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith(
      "Delete this workout? This cannot be undone.",
    );

    // Wait for async deleteWorkout to complete
    await vi.waitFor(() => {
      expect(mockRoute).toHaveBeenCalledWith("/history");
    });

    // Workout should be removed from the store
    expect(workoutHistory.value.find((w) => w.id === "w-1")).toBeUndefined();

    confirmSpy.mockRestore();
  });

  it("shows 'Workout not found' when ID doesn't match", () => {
    workoutHistory.value = [mockWorkout()];
    exercises.value = mockExerciseList();

    renderDetail("nonexistent-id");

    expect(screen.getByText("Workout not found")).toBeInTheDocument();
  });
});

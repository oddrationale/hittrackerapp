import { render, screen } from "@testing-library/preact";
import { describe, it, expect, beforeEach } from "vitest";
import { LocationProvider } from "preact-iso";
import { HistoryPage } from "../../src/pages/history-page.tsx";
import { workoutHistory } from "../../src/stores/history-store.ts";
import { routines } from "../../src/stores/routine-store.ts";
import type { Workout, Routine } from "../../src/types/index.ts";

function renderHistoryPage() {
  return render(
    <LocationProvider>
      <HistoryPage />
    </LocationProvider>,
  );
}

function createWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    id: crypto.randomUUID(),
    date: "2026-02-18",
    startTime: Date.now(),
    endTime: Date.now() + 3600_000,
    routineId: undefined,
    exerciseLogs: [],
    totalTul: 0,
    totalTime: 3600,
    tulRatio: 0,
    lastModified: Date.now(),
    ...overrides,
  };
}

describe("HistoryPage", () => {
  beforeEach(() => {
    workoutHistory.value = [];
    routines.value = [];
  });

  it("shows 'No workouts yet' when history is empty", () => {
    renderHistoryPage();
    expect(screen.getByText("No workouts yet")).toBeInTheDocument();
  });

  it("shows list of past workouts sorted by date (most recent first)", () => {
    workoutHistory.value = [
      createWorkout({ id: "w-old", date: "2026-02-10", totalTul: 120 }),
      createWorkout({ id: "w-new", date: "2026-02-18", totalTul: 180 }),
    ];

    renderHistoryPage();

    const links = screen.getAllByRole("link");
    // Most recent first — w-new should appear before w-old
    expect(links[0]).toHaveAttribute("href", "/history/w-new");
    expect(links[1]).toHaveAttribute("href", "/history/w-old");
  });

  it("each item shows date, routine name, exercise count, and total TUL", () => {
    const routine: Routine = {
      id: "r-1",
      name: "Push Day",
      exerciseIds: ["ex-1", "ex-2"],
      lastModified: Date.now(),
    };
    routines.value = [routine];

    workoutHistory.value = [
      createWorkout({
        id: "w-1",
        date: "2026-02-15",
        routineId: "r-1",
        totalTul: 185,
        exerciseLogs: [
          {
            id: "l-1",
            exerciseId: "ex-1",
            weight: 100,
            tul: 90,
            weightDirection: "maintain",
          },
          {
            id: "l-2",
            exerciseId: "ex-2",
            weight: 80,
            tul: 95,
            weightDirection: "increase",
          },
        ],
      }),
    ];

    renderHistoryPage();

    // Routine name
    expect(screen.getByText("Push Day")).toBeInTheDocument();
    // Total TUL formatted as minutes:seconds (185s = 3:05)
    expect(screen.getByText("3:05 TUL")).toBeInTheDocument();
    // Exercise count
    expect(screen.getByText("2 exercises")).toBeInTheDocument();
  });

  it("shows 'Freeform' for workouts without a routineId", () => {
    workoutHistory.value = [
      createWorkout({
        id: "w-free",
        date: "2026-02-16",
        routineId: undefined,
        totalTul: 60,
        exerciseLogs: [
          {
            id: "l-1",
            exerciseId: "ex-1",
            weight: 50,
            tul: 60,
            weightDirection: "maintain",
          },
        ],
      }),
    ];

    renderHistoryPage();

    expect(screen.getByText("Freeform")).toBeInTheDocument();
  });

  it("clicking a workout navigates to /history/:id", () => {
    workoutHistory.value = [
      createWorkout({
        id: "w-click",
        date: "2026-02-17",
        totalTul: 90,
        exerciseLogs: [
          {
            id: "l-1",
            exerciseId: "ex-1",
            weight: 100,
            tul: 90,
            weightDirection: "maintain",
          },
        ],
      }),
    ];

    renderHistoryPage();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/history/w-click");
  });
});

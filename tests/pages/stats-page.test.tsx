import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { LocationProvider } from "preact-iso";
import type { Workout, Exercise } from "../../src/types/index.ts";

// Mock chart.js so canvas-dependent code doesn't break in jsdom
vi.mock("chart.js", () => {
  function MockChart() {
    return { destroy: vi.fn(), update: vi.fn() };
  }
  MockChart.register = vi.fn();
  return { Chart: MockChart, registerables: [] };
});

// Static import works because vi.mock is hoisted above it
import { StatsPage } from "../../src/pages/stats-page.tsx";
import { workoutHistory } from "../../src/stores/history-store.ts";
import { exercises } from "../../src/stores/exercise-store.ts";

function createWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    id: crypto.randomUUID(),
    date: "2026-02-18",
    startTime: Date.now(),
    endTime: Date.now() + 3600_000,
    routineId: undefined,
    exerciseLogs: [],
    totalTul: 300,
    totalTime: 1200,
    tulRatio: 0.25,
    lastModified: Date.now(),
    ...overrides,
  };
}

function createExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: crypto.randomUUID(),
    name: "Chest Press",
    lastModified: Date.now(),
    ...overrides,
  };
}

function renderStatsPage() {
  return render(
    <LocationProvider>
      <StatsPage />
    </LocationProvider>,
  );
}

describe("StatsPage", () => {
  beforeEach(() => {
    workoutHistory.value = [];
    exercises.value = [];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders summary cards", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    workoutHistory.value = [
      createWorkout({ date: "2026-02-18", totalTul: 300, tulRatio: 0.25 }),
    ];

    renderStatsPage();

    expect(screen.getByText("Total Workouts")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("renders exercise filter dropdown", () => {
    workoutHistory.value = [
      createWorkout({ totalTul: 300, tulRatio: 0.25 }),
    ];
    exercises.value = [
      createExercise({ id: "ex-1", name: "Chest Press" }),
      createExercise({ id: "ex-2", name: "Leg Press" }),
    ];

    renderStatsPage();

    // The exercise filter dropdown should have "All Exercises" plus the two exercises
    const exerciseSelect = screen.getByDisplayValue("All Exercises");
    expect(exerciseSelect).toBeInTheDocument();
    expect(screen.getByText("Chest Press")).toBeInTheDocument();
    expect(screen.getByText("Leg Press")).toBeInTheDocument();
  });

  it("renders date range filter (30d, 90d, 1y, all)", () => {
    workoutHistory.value = [
      createWorkout({ totalTul: 300, tulRatio: 0.25 }),
    ];

    renderStatsPage();

    expect(screen.getByText("30 Days")).toBeInTheDocument();
    expect(screen.getByText("90 Days")).toBeInTheDocument();
    expect(screen.getByText("1 Year")).toBeInTheDocument();
    expect(screen.getByText("All Time")).toBeInTheDocument();
  });

  it("shows 'No workout data yet' when no workouts exist", () => {
    renderStatsPage();

    expect(screen.getByText("No workout data yet")).toBeInTheDocument();
  });

  it("changing exercise filter updates which exercise is selected", () => {
    workoutHistory.value = [
      createWorkout({ totalTul: 300, tulRatio: 0.25 }),
    ];
    exercises.value = [
      createExercise({ id: "ex-1", name: "Chest Press" }),
      createExercise({ id: "ex-2", name: "Leg Press" }),
    ];

    renderStatsPage();

    const exerciseSelect = screen.getByDisplayValue(
      "All Exercises",
    ) as HTMLSelectElement;
    expect(exerciseSelect.value).toBe("");

    fireEvent.change(exerciseSelect, { target: { value: "ex-2" } });

    expect(exerciseSelect.value).toBe("ex-2");
  });
});

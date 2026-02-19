import { describe, it, expect } from "vitest";
import type { Workout, ExerciseLog } from "../../../src/types/index.ts";

function createExerciseLog(overrides: Partial<ExerciseLog> = {}): ExerciseLog {
  return {
    id: crypto.randomUUID(),
    exerciseId: "ex-1",
    weight: 100,
    tul: 90,
    weightDirection: "maintain",
    ...overrides,
  };
}

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

describe("prepareWeightChartData", () => {
  it("returns labels and data for weight over time for a specific exercise", async () => {
    const { prepareWeightChartData } = await import(
      "../../../src/components/stats/weight-chart.tsx"
    );

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-02-10",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 100 }),
        ],
      }),
      createWorkout({
        date: "2026-02-15",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 110 }),
        ],
      }),
      createWorkout({
        date: "2026-02-18",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 115 }),
        ],
      }),
    ];

    const result = prepareWeightChartData(workouts, "ex-1");

    expect(result.labels).toEqual(["2026-02-10", "2026-02-15", "2026-02-18"]);
    expect(result.data).toEqual([100, 110, 115]);
  });

  it("returns empty arrays when exercise not found in any workout", async () => {
    const { prepareWeightChartData } = await import(
      "../../../src/components/stats/weight-chart.tsx"
    );

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-02-10",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 100 }),
        ],
      }),
      createWorkout({
        date: "2026-02-15",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-2", weight: 80 }),
        ],
      }),
    ];

    const result = prepareWeightChartData(workouts, "ex-999");

    expect(result.labels).toEqual([]);
    expect(result.data).toEqual([]);
  });

  it("filtering by date range limits the data", async () => {
    const { prepareWeightChartData } = await import(
      "../../../src/components/stats/weight-chart.tsx"
    );

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-01-20",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 90 }),
        ],
      }),
      createWorkout({
        date: "2026-02-05",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 100 }),
        ],
      }),
      createWorkout({
        date: "2026-02-10",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 110 }),
        ],
      }),
      createWorkout({
        date: "2026-03-01",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 120 }),
        ],
      }),
    ];

    const result = prepareWeightChartData(workouts, "ex-1", {
      start: "2026-02-01",
      end: "2026-02-28",
    });

    expect(result.labels).toEqual(["2026-02-05", "2026-02-10"]);
    expect(result.data).toEqual([100, 110]);
  });

  it("sorts by date ascending regardless of input order", async () => {
    const { prepareWeightChartData } = await import(
      "../../../src/components/stats/weight-chart.tsx"
    );

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-02-18",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 115 }),
        ],
      }),
      createWorkout({
        date: "2026-02-10",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 100 }),
        ],
      }),
      createWorkout({
        date: "2026-02-15",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 110 }),
        ],
      }),
    ];

    const result = prepareWeightChartData(workouts, "ex-1");

    expect(result.labels).toEqual(["2026-02-10", "2026-02-15", "2026-02-18"]);
    expect(result.data).toEqual([100, 110, 115]);
  });

  it("returns only workouts containing the specified exercise", async () => {
    const { prepareWeightChartData } = await import(
      "../../../src/components/stats/weight-chart.tsx"
    );

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-02-10",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 100 }),
          createExerciseLog({ exerciseId: "ex-2", weight: 60 }),
        ],
      }),
      createWorkout({
        date: "2026-02-12",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-2", weight: 65 }),
        ],
      }),
      createWorkout({
        date: "2026-02-15",
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", weight: 110 }),
          createExerciseLog({ exerciseId: "ex-2", weight: 70 }),
        ],
      }),
    ];

    const result = prepareWeightChartData(workouts, "ex-1");

    // Workout on 2026-02-12 has no ex-1 log, so it's excluded
    expect(result.labels).toEqual(["2026-02-10", "2026-02-15"]);
    expect(result.data).toEqual([100, 110]);
  });
});

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

describe("prepareTulChartData", () => {
  it("returns labels and data arrays for TUL over time", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const workouts: Workout[] = [
      createWorkout({ date: "2026-02-10", totalTul: 200 }),
      createWorkout({ date: "2026-02-15", totalTul: 350 }),
      createWorkout({ date: "2026-02-18", totalTul: 400 }),
    ];

    const result = prepareTulChartData(workouts);

    expect(result.labels).toEqual(["2026-02-10", "2026-02-15", "2026-02-18"]);
    expect(result.data).toEqual([200, 350, 400]);
  });

  it("filtering by exercise shows only that exercise's data", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-02-10",
        totalTul: 200,
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", tul: 90 }),
          createExerciseLog({ exerciseId: "ex-2", tul: 110 }),
        ],
      }),
      createWorkout({
        date: "2026-02-12",
        totalTul: 150,
        exerciseLogs: [createExerciseLog({ exerciseId: "ex-2", tul: 150 })],
      }),
      createWorkout({
        date: "2026-02-15",
        totalTul: 300,
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", tul: 120 }),
          createExerciseLog({ exerciseId: "ex-2", tul: 180 }),
        ],
      }),
    ];

    const result = prepareTulChartData(workouts, { exerciseId: "ex-1" });

    // Workout on 2026-02-12 has no ex-1 log, so it's excluded
    expect(result.labels).toEqual(["2026-02-10", "2026-02-15"]);
    expect(result.data).toEqual([90, 120]);
  });

  it("filtering by date range limits the data", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const workouts: Workout[] = [
      createWorkout({ date: "2026-01-20", totalTul: 100 }),
      createWorkout({ date: "2026-02-05", totalTul: 200 }),
      createWorkout({ date: "2026-02-10", totalTul: 300 }),
      createWorkout({ date: "2026-03-01", totalTul: 400 }),
    ];

    const result = prepareTulChartData(workouts, {
      dateRange: { start: "2026-02-01", end: "2026-02-28" },
    });

    expect(result.labels).toEqual(["2026-02-05", "2026-02-10"]);
    expect(result.data).toEqual([200, 300]);
  });

  it("returns empty arrays when no data matches", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const workouts: Workout[] = [
      createWorkout({ date: "2026-01-10", totalTul: 100 }),
      createWorkout({ date: "2026-01-20", totalTul: 200 }),
    ];

    const result = prepareTulChartData(workouts, {
      dateRange: { start: "2026-03-01", end: "2026-03-31" },
    });

    expect(result.labels).toEqual([]);
    expect(result.data).toEqual([]);
  });

  it("returns empty arrays when workouts array is empty", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const result = prepareTulChartData([]);

    expect(result.labels).toEqual([]);
    expect(result.data).toEqual([]);
  });

  it("per-workout total TUL: each data point is the total TUL of a workout", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-02-10",
        totalTul: 250,
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", tul: 100 }),
          createExerciseLog({ exerciseId: "ex-2", tul: 150 }),
        ],
      }),
      createWorkout({
        date: "2026-02-15",
        totalTul: 400,
        exerciseLogs: [
          createExerciseLog({ exerciseId: "ex-1", tul: 200 }),
          createExerciseLog({ exerciseId: "ex-2", tul: 200 }),
        ],
      }),
    ];

    // Without exercise filter, should use totalTul (not individual exercise TULs)
    const result = prepareTulChartData(workouts);

    expect(result.labels).toEqual(["2026-02-10", "2026-02-15"]);
    expect(result.data).toEqual([250, 400]);
  });

  it("sorts workouts by date ascending regardless of input order", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const workouts: Workout[] = [
      createWorkout({ date: "2026-02-18", totalTul: 400 }),
      createWorkout({ date: "2026-02-10", totalTul: 200 }),
      createWorkout({ date: "2026-02-15", totalTul: 350 }),
    ];

    const result = prepareTulChartData(workouts);

    expect(result.labels).toEqual(["2026-02-10", "2026-02-15", "2026-02-18"]);
    expect(result.data).toEqual([200, 350, 400]);
  });

  it("combines exercise filter with date range filter", async () => {
    const { prepareTulChartData } =
      await import("../../../src/components/stats/tul-chart.tsx");

    const workouts: Workout[] = [
      createWorkout({
        date: "2026-01-15",
        totalTul: 200,
        exerciseLogs: [createExerciseLog({ exerciseId: "ex-1", tul: 80 })],
      }),
      createWorkout({
        date: "2026-02-10",
        totalTul: 300,
        exerciseLogs: [createExerciseLog({ exerciseId: "ex-1", tul: 100 })],
      }),
      createWorkout({
        date: "2026-02-15",
        totalTul: 350,
        exerciseLogs: [createExerciseLog({ exerciseId: "ex-2", tul: 150 })],
      }),
      createWorkout({
        date: "2026-03-01",
        totalTul: 400,
        exerciseLogs: [createExerciseLog({ exerciseId: "ex-1", tul: 120 })],
      }),
    ];

    const result = prepareTulChartData(workouts, {
      exerciseId: "ex-1",
      dateRange: { start: "2026-02-01", end: "2026-02-28" },
    });

    // Only 2026-02-10 matches both filters (ex-1 + date range)
    expect(result.labels).toEqual(["2026-02-10"]);
    expect(result.data).toEqual([100]);
  });
});

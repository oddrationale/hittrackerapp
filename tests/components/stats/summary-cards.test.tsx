import { render, screen } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { Workout } from "../../../src/types/index.ts";

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

describe("computeStats", () => {
  it("returns null when no workouts exist", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");
    expect(computeStats([])).toBeNull();
  });

  it("computes total workout count", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");
    const workouts = [
      createWorkout({ totalTul: 200, tulRatio: 0.2 }),
      createWorkout({ totalTul: 400, tulRatio: 0.4 }),
      createWorkout({ totalTul: 300, tulRatio: 0.3 }),
    ];
    const stats = computeStats(workouts);
    expect(stats).not.toBeNull();
    expect(stats!.totalWorkouts).toBe(3);
  });

  it("computes average TUL per workout (rounded)", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");
    // (200 + 400 + 300) / 3 = 300
    const workouts = [
      createWorkout({ totalTul: 200, tulRatio: 0.2 }),
      createWorkout({ totalTul: 400, tulRatio: 0.4 }),
      createWorkout({ totalTul: 300, tulRatio: 0.3 }),
    ];
    const stats = computeStats(workouts);
    expect(stats!.avgTul).toBe(300);
  });

  it("rounds average TUL when not evenly divisible", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");
    // (100 + 200) / 2 = 150 (even)
    // (100 + 201) / 2 = 150.5 -> rounds to 151
    const workouts = [
      createWorkout({ totalTul: 100, tulRatio: 0.2 }),
      createWorkout({ totalTul: 201, tulRatio: 0.3 }),
    ];
    const stats = computeStats(workouts);
    expect(stats!.avgTul).toBe(151);
  });

  it("computes average TUL ratio", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");
    // (0.2 + 0.4 + 0.3) / 3 = 0.3
    const workouts = [
      createWorkout({ totalTul: 200, tulRatio: 0.2 }),
      createWorkout({ totalTul: 400, tulRatio: 0.4 }),
      createWorkout({ totalTul: 300, tulRatio: 0.3 }),
    ];
    const stats = computeStats(workouts);
    expect(stats!.avgRatio).toBeCloseTo(0.3, 5);
  });

  it("computes streak of consecutive weeks with workouts", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");

    // Use fake timers so "now" is a fixed date
    vi.useFakeTimers();
    // Set "now" to Wednesday, Feb 18, 2026
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    // Create workouts in consecutive weeks:
    // Current week (Feb 16-22, 2026)
    // Previous week (Feb 9-15, 2026)
    // Two weeks ago (Feb 2-8, 2026)
    const workouts = [
      createWorkout({ date: "2026-02-18", tulRatio: 0.3 }),
      createWorkout({ date: "2026-02-10", tulRatio: 0.3 }),
      createWorkout({ date: "2026-02-03", tulRatio: 0.3 }),
    ];

    const stats = computeStats(workouts);
    expect(stats!.streak).toBe(3);

    vi.useRealTimers();
  });

  it("streak breaks when a week is missed", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    // Current week has a workout, but then skip a week, then one 2 weeks ago
    const workouts = [
      createWorkout({ date: "2026-02-18", tulRatio: 0.3 }), // current week
      // no workout in week of Feb 9-15
      createWorkout({ date: "2026-02-03", tulRatio: 0.3 }), // two weeks ago
    ];

    const stats = computeStats(workouts);
    expect(stats!.streak).toBe(1); // only current week counts

    vi.useRealTimers();
  });

  it("computes stats correctly from mock workout data", async () => {
    const { computeStats } =
      await import("../../../src/components/stats/summary-cards.tsx");

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    const workouts = [
      createWorkout({
        date: "2026-02-18",
        totalTul: 360,
        tulRatio: 0.3,
      }),
      createWorkout({
        date: "2026-02-11",
        totalTul: 240,
        tulRatio: 0.2,
      }),
      createWorkout({
        date: "2026-02-04",
        totalTul: 300,
        tulRatio: 0.25,
      }),
      createWorkout({
        date: "2026-01-28",
        totalTul: 180,
        tulRatio: 0.15,
      }),
    ];

    const stats = computeStats(workouts);
    expect(stats).not.toBeNull();
    expect(stats!.totalWorkouts).toBe(4);
    // avg TUL: (360+240+300+180)/4 = 1080/4 = 270
    expect(stats!.avgTul).toBe(270);
    // avg ratio: (0.3+0.2+0.25+0.15)/4 = 0.9/4 = 0.225
    expect(stats!.avgRatio).toBeCloseTo(0.225, 5);
    // streak: 4 consecutive weeks
    expect(stats!.streak).toBe(4);

    vi.useRealTimers();
  });
});

describe("SummaryCards component", () => {
  beforeEach(async () => {
    const { workoutHistory } =
      await import("../../../src/stores/history-store.ts");
    workoutHistory.value = [];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows 'No workout data yet' when no workouts exist", async () => {
    const { SummaryCards } =
      await import("../../../src/components/stats/summary-cards.tsx");
    render(<SummaryCards />);
    expect(screen.getByText("No workout data yet")).toBeInTheDocument();
  });

  it("shows total workout count", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    const { workoutHistory } =
      await import("../../../src/stores/history-store.ts");
    workoutHistory.value = [
      createWorkout({ date: "2026-02-18", totalTul: 300, tulRatio: 0.25 }),
      createWorkout({ date: "2026-02-11", totalTul: 200, tulRatio: 0.2 }),
    ];

    const { SummaryCards } =
      await import("../../../src/components/stats/summary-cards.tsx");
    render(<SummaryCards />);
    expect(screen.getByText("Total Workouts")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows average TUL per workout", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    const { workoutHistory } =
      await import("../../../src/stores/history-store.ts");
    // avg = (300 + 200) / 2 = 250 seconds = 4:10
    workoutHistory.value = [
      createWorkout({ date: "2026-02-18", totalTul: 300, tulRatio: 0.25 }),
      createWorkout({ date: "2026-02-11", totalTul: 200, tulRatio: 0.2 }),
    ];

    const { SummaryCards } =
      await import("../../../src/components/stats/summary-cards.tsx");
    render(<SummaryCards />);
    expect(screen.getByText("Avg TUL / Workout")).toBeInTheDocument();
    expect(screen.getByText("4:10")).toBeInTheDocument();
  });

  it("shows average TUL ratio as percentage", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    const { workoutHistory } =
      await import("../../../src/stores/history-store.ts");
    // avg ratio = (0.25 + 0.35) / 2 = 0.3 => 30%
    workoutHistory.value = [
      createWorkout({ date: "2026-02-18", totalTul: 300, tulRatio: 0.25 }),
      createWorkout({ date: "2026-02-11", totalTul: 200, tulRatio: 0.35 }),
    ];

    const { SummaryCards } =
      await import("../../../src/components/stats/summary-cards.tsx");
    render(<SummaryCards />);
    expect(screen.getByText("Avg TUL Ratio")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("shows current streak in weeks", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-18T12:00:00"));

    const { workoutHistory } =
      await import("../../../src/stores/history-store.ts");
    workoutHistory.value = [
      createWorkout({ date: "2026-02-18", totalTul: 300, tulRatio: 0.25 }),
      createWorkout({ date: "2026-02-11", totalTul: 200, tulRatio: 0.2 }),
    ];

    const { SummaryCards } =
      await import("../../../src/components/stats/summary-cards.tsx");
    render(<SummaryCards />);
    expect(screen.getByText("Streak")).toBeInTheDocument();
    expect(screen.getByText("2 weeks")).toBeInTheDocument();
  });
});

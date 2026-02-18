// tests/types.test.ts
import { describe, it, expect } from "vitest";
import type {
  Exercise,
  Routine,
  ExerciseLog,
  Workout,
  UserSettings,
  WeightDirection,
  ExportData,
} from "../src/types/index.ts";

describe("Types", () => {
  it("creates a valid Exercise", () => {
    const exercise: Exercise = {
      id: "ex-1",
      name: "Chest Press",
      category: "Upper Body Push",
      notes: "Seat position 5",
      lastModified: Date.now(),
    };
    expect(exercise.id).toBe("ex-1");
    expect(exercise.name).toBe("Chest Press");
  });

  it("creates a valid Routine", () => {
    const routine: Routine = {
      id: "rt-1",
      name: "Big 5",
      exerciseIds: ["ex-1", "ex-2", "ex-3"],
      lastModified: Date.now(),
    };
    expect(routine.exerciseIds).toHaveLength(3);
  });

  it("creates a valid ExerciseLog", () => {
    const direction: WeightDirection = "increase";
    const log: ExerciseLog = {
      id: "log-1",
      exerciseId: "ex-1",
      weight: 150,
      tul: 90,
      reps: 8,
      notes: "Seat 5, felt strong",
      weightDirection: direction,
    };
    expect(log.tul).toBe(90);
    expect(log.weightDirection).toBe("increase");
  });

  it("creates a valid Workout", () => {
    const workout: Workout = {
      id: "wk-1",
      date: "2026-02-18",
      startTime: Date.now(),
      exerciseLogs: [],
      totalTul: 0,
      totalTime: 0,
      tulRatio: 0,
      lastModified: Date.now(),
    };
    expect(workout.exerciseLogs).toHaveLength(0);
  });

  it("creates valid UserSettings", () => {
    const settings: UserSettings = {
      weightUnit: "lbs",
      metronomeEnabled: true,
      countdownDuration: 3,
    };
    expect(settings.weightUnit).toBe("lbs");
  });

  it("creates valid ExportData", () => {
    const data: ExportData = {
      schemaVersion: 1,
      exercises: [],
      routines: [],
      workouts: [],
      settings: {
        weightUnit: "lbs",
        metronomeEnabled: false,
        countdownDuration: 3,
      },
    };
    expect(data.schemaVersion).toBe(1);
  });
});

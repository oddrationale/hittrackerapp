import { describe, it, expect, beforeEach, vi } from "vitest";
import { db } from "../../src/db/database.ts";
import type { ExerciseLog } from "../../src/types/index.ts";
import {
  activeWorkout,
  currentExerciseIndex,
  isWorkoutActive,
  startWorkout,
  addExerciseLog,
  finishWorkout,
  cancelWorkout,
} from "../../src/stores/workout-store.ts";

function makeExerciseLog(overrides: Partial<ExerciseLog> = {}): ExerciseLog {
  return {
    id: crypto.randomUUID(),
    exerciseId: "ex-1",
    weight: 100,
    tul: 90,
    weightDirection: "maintain",
    ...overrides,
  };
}

describe("Workout Store", () => {
  beforeEach(async () => {
    await db.workouts.clear();
    activeWorkout.value = null;
    currentExerciseIndex.value = 0;
  });

  describe("startWorkout()", () => {
    it("initializes a freeform workout with startTime and empty exerciseLogs when no routineId", () => {
      const mockId = "mock-uuid-1234";
      vi.spyOn(crypto, "randomUUID").mockReturnValueOnce(
        mockId as `${string}-${string}-${string}-${string}-${string}`,
      );

      const before = Date.now();
      startWorkout();
      const after = Date.now();

      expect(activeWorkout.value).not.toBeNull();
      expect(activeWorkout.value!.id).toBe(mockId);
      expect(activeWorkout.value!.routineId).toBeUndefined();
      expect(activeWorkout.value!.exerciseLogs).toEqual([]);
      expect(activeWorkout.value!.startTime).toBeGreaterThanOrEqual(before);
      expect(activeWorkout.value!.startTime).toBeLessThanOrEqual(after);
      expect(activeWorkout.value!.totalTul).toBe(0);
      expect(activeWorkout.value!.totalTime).toBe(0);
      expect(activeWorkout.value!.tulRatio).toBe(0);
      expect(activeWorkout.value!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("initializes a routine workout with the routineId set", () => {
      startWorkout("routine-1");

      expect(activeWorkout.value).not.toBeNull();
      expect(activeWorkout.value!.routineId).toBe("routine-1");
      expect(activeWorkout.value!.exerciseLogs).toEqual([]);
    });

    it("does not allow starting a new workout when one is already active", () => {
      startWorkout();
      const firstWorkoutId = activeWorkout.value!.id;

      startWorkout("routine-2");

      // Should still be the first workout
      expect(activeWorkout.value!.id).toBe(firstWorkoutId);
      expect(activeWorkout.value!.routineId).toBeUndefined();
    });
  });

  describe("addExerciseLog()", () => {
    it("appends to exerciseLogs and updates totalTul", () => {
      startWorkout();

      const log1 = makeExerciseLog({ tul: 60 });
      addExerciseLog(log1);

      expect(activeWorkout.value!.exerciseLogs).toHaveLength(1);
      expect(activeWorkout.value!.exerciseLogs[0]).toEqual(log1);
      expect(activeWorkout.value!.totalTul).toBe(60);
      expect(currentExerciseIndex.value).toBe(1);

      const log2 = makeExerciseLog({ tul: 90 });
      addExerciseLog(log2);

      expect(activeWorkout.value!.exerciseLogs).toHaveLength(2);
      expect(activeWorkout.value!.totalTul).toBe(150);
      expect(currentExerciseIndex.value).toBe(2);
    });

    it("does nothing when no workout is active", () => {
      const log = makeExerciseLog();
      addExerciseLog(log);

      expect(activeWorkout.value).toBeNull();
    });
  });

  describe("finishWorkout()", () => {
    it("sets endTime, computes totalTime and tulRatio, persists to DB, and clears active workout", async () => {
      startWorkout();
      const workoutId = activeWorkout.value!.id;

      // Manually set startTime to a known value for deterministic totalTime
      const startTime = Date.now() - 5000; // 5 seconds ago
      activeWorkout.value = { ...activeWorkout.value!, startTime };

      const log = makeExerciseLog({ tul: 90 });
      addExerciseLog(log);

      const completed = await finishWorkout();

      // Should return the completed workout
      expect(completed).not.toBeNull();
      expect(completed!.id).toBe(workoutId);
      expect(completed!.endTime).toBeDefined();
      expect(completed!.endTime).toBeTypeOf("number");
      expect(completed!.totalTime).toBeGreaterThan(0);
      expect(completed!.tulRatio).toBe(
        completed!.totalTul / completed!.totalTime,
      );

      // Active workout should be cleared
      expect(activeWorkout.value).toBeNull();
      expect(currentExerciseIndex.value).toBe(0);

      // Should be persisted to DB
      const stored = await db.workouts.get(workoutId);
      expect(stored).toBeDefined();
      expect(stored!.endTime).toBe(completed!.endTime);
      expect(stored!.totalTime).toBe(completed!.totalTime);
    });

    it("returns null when no workout is active", async () => {
      const result = await finishWorkout();
      expect(result).toBeNull();
    });
  });

  describe("cancelWorkout()", () => {
    it("clears active workout state without persisting", async () => {
      startWorkout();
      const workoutId = activeWorkout.value!.id;

      const log = makeExerciseLog();
      addExerciseLog(log);

      cancelWorkout();

      expect(activeWorkout.value).toBeNull();
      expect(currentExerciseIndex.value).toBe(0);

      // Should NOT be persisted
      const stored = await db.workouts.get(workoutId);
      expect(stored).toBeUndefined();
    });
  });

  describe("activeWorkout signal", () => {
    it("reflects current state (null when no workout active)", () => {
      expect(activeWorkout.value).toBeNull();

      startWorkout();
      expect(activeWorkout.value).not.toBeNull();

      cancelWorkout();
      expect(activeWorkout.value).toBeNull();
    });
  });

  describe("isWorkoutActive computed signal", () => {
    it("returns true when workout is in progress", () => {
      expect(isWorkoutActive.value).toBe(false);

      startWorkout();
      expect(isWorkoutActive.value).toBe(true);

      cancelWorkout();
      expect(isWorkoutActive.value).toBe(false);
    });
  });
});

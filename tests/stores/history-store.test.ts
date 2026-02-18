import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/db/database.ts";
import type { Workout } from "../../src/types/index.ts";
import {
  workoutHistory,
  loadHistory,
  getWorkout,
  deleteWorkout,
} from "../../src/stores/history-store.ts";

function makeWorkout(overrides: Partial<Workout> = {}): Workout {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    date: "2026-01-15",
    startTime: now - 600_000,
    endTime: now,
    exerciseLogs: [],
    totalTul: 300,
    totalTime: 600,
    tulRatio: 0.5,
    lastModified: now,
    ...overrides,
  };
}

describe("History Store", () => {
  beforeEach(async () => {
    await db.workouts.clear();
    workoutHistory.value = [];
  });

  describe("loadHistory()", () => {
    it("hydrates workouts from DB sorted by date descending (most recent first)", async () => {
      const oldest = makeWorkout({ id: "w-1", date: "2026-01-10" });
      const middle = makeWorkout({ id: "w-2", date: "2026-01-15" });
      const newest = makeWorkout({ id: "w-3", date: "2026-01-20" });

      // Insert in non-sorted order
      await db.workouts.bulkAdd([middle, oldest, newest]);

      await loadHistory();

      expect(workoutHistory.value).toHaveLength(3);
      expect(workoutHistory.value[0].id).toBe("w-3"); // newest first
      expect(workoutHistory.value[1].id).toBe("w-2");
      expect(workoutHistory.value[2].id).toBe("w-1"); // oldest last
    });

    it("returns empty array when no workouts exist", async () => {
      await loadHistory();

      expect(workoutHistory.value).toEqual([]);
    });
  });

  describe("getWorkout()", () => {
    it("returns a specific workout by ID", async () => {
      const workout = makeWorkout({ id: "w-find-me" });
      const other = makeWorkout({ id: "w-other" });

      await db.workouts.bulkAdd([workout, other]);
      await loadHistory();

      const found = getWorkout("w-find-me");

      expect(found).toBeDefined();
      expect(found!.id).toBe("w-find-me");
    });

    it("returns undefined for non-existent ID", async () => {
      const workout = makeWorkout({ id: "w-exists" });
      await db.workouts.add(workout);
      await loadHistory();

      const result = getWorkout("w-does-not-exist");

      expect(result).toBeUndefined();
    });
  });

  describe("deleteWorkout()", () => {
    it("removes from signal and DB", async () => {
      const w1 = makeWorkout({ id: "w-keep", date: "2026-01-10" });
      const w2 = makeWorkout({ id: "w-delete", date: "2026-01-20" });

      await db.workouts.bulkAdd([w1, w2]);
      await loadHistory();

      expect(workoutHistory.value).toHaveLength(2);

      await deleteWorkout("w-delete");

      // Signal should be updated
      expect(workoutHistory.value).toHaveLength(1);
      expect(workoutHistory.value[0].id).toBe("w-keep");

      // DB should be updated
      const stored = await db.workouts.get("w-delete");
      expect(stored).toBeUndefined();

      // Other workout should still be in DB
      const kept = await db.workouts.get("w-keep");
      expect(kept).toBeDefined();
    });
  });
});

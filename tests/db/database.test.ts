import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/db/database.ts";
import { seedExercisesIfEmpty } from "../../src/db/seed.ts";
import type { Exercise, Routine, Workout } from "../../src/types/index.ts";

describe("Database", () => {
  beforeEach(async () => {
    await db.exercises.clear();
    await db.routines.clear();
    await db.workouts.clear();
    await db.settings.clear();
  });

  it("adds and retrieves an exercise", async () => {
    const exercise: Exercise = {
      id: "ex-1",
      name: "Chest Press",
      lastModified: Date.now(),
    };
    await db.exercises.add(exercise);
    const result = await db.exercises.get("ex-1");
    expect(result?.name).toBe("Chest Press");
  });

  it("adds and retrieves a routine", async () => {
    const routine: Routine = {
      id: "rt-1",
      name: "Big 5",
      exerciseIds: ["ex-1", "ex-2"],
      lastModified: Date.now(),
    };
    await db.routines.add(routine);
    const result = await db.routines.get("rt-1");
    expect(result?.exerciseIds).toHaveLength(2);
  });

  it("adds and retrieves a workout", async () => {
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
    await db.workouts.add(workout);
    const result = await db.workouts.get("wk-1");
    expect(result?.date).toBe("2026-02-18");
  });

  it("queries workouts by date", async () => {
    const now = Date.now();
    await db.workouts.bulkAdd([
      {
        id: "wk-1",
        date: "2026-02-15",
        startTime: now,
        exerciseLogs: [],
        totalTul: 0,
        totalTime: 0,
        tulRatio: 0,
        lastModified: now,
      },
      {
        id: "wk-2",
        date: "2026-02-18",
        startTime: now,
        exerciseLogs: [],
        totalTul: 0,
        totalTime: 0,
        tulRatio: 0,
        lastModified: now,
      },
    ]);
    const results = await db.workouts
      .where("date")
      .equals("2026-02-18")
      .toArray();
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("wk-2");
  });

  it("seeds default exercises when table is empty", async () => {
    await seedExercisesIfEmpty();
    const count = await db.exercises.count();
    expect(count).toBe(12);
  });

  it("does not re-seed when exercises exist", async () => {
    await db.exercises.add({ id: "custom", name: "Custom", lastModified: 0 });
    await seedExercisesIfEmpty();
    const count = await db.exercises.count();
    expect(count).toBe(1); // only the custom one
  });
});

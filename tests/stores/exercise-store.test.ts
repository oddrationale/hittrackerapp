import { describe, it, expect, beforeEach, vi } from "vitest";
import { db } from "../../src/db/database.ts";
import {
  exercises,
  loadExercises,
  addExercise,
  updateExercise,
  deleteExercise,
  exercisesByCategory,
} from "../../src/stores/exercise-store.ts";

describe("Exercise Store", () => {
  beforeEach(async () => {
    await db.exercises.clear();
    exercises.value = [];
  });

  describe("loadExercises()", () => {
    it("hydrates exercises from DB", async () => {
      const exercise = {
        id: "test-1",
        name: "Bench Press",
        category: "Chest",
        lastModified: Date.now(),
      };
      await db.exercises.add(exercise);

      await loadExercises();

      expect(exercises.value).toHaveLength(1);
      expect(exercises.value[0]).toEqual(exercise);
    });

    it("returns empty array when DB is empty", async () => {
      await loadExercises();
      expect(exercises.value).toEqual([]);
    });
  });

  describe("addExercise()", () => {
    it("creates exercise with generated UUID and persists", async () => {
      const mockId = "mock-uuid-1234";
      vi.spyOn(crypto, "randomUUID").mockReturnValueOnce(
        mockId as `${string}-${string}-${string}-${string}-${string}`,
      );

      const result = await addExercise("Squat", "Legs");

      expect(result.id).toBe(mockId);
      expect(result.name).toBe("Squat");
      expect(result.category).toBe("Legs");
      expect(result.lastModified).toBeTypeOf("number");

      // Signal should be updated
      expect(exercises.value).toHaveLength(1);
      expect(exercises.value[0].name).toBe("Squat");

      // DB should be updated
      const stored = await db.exercises.get(mockId);
      expect(stored).toBeDefined();
      expect(stored!.name).toBe("Squat");
    });

    it("creates exercise without category", async () => {
      const result = await addExercise("Pull Up");

      expect(result.name).toBe("Pull Up");
      expect(result.category).toBeUndefined();
      expect(exercises.value).toHaveLength(1);
    });

    it("sets lastModified to current timestamp", async () => {
      const before = Date.now();
      const result = await addExercise("Deadlift");
      const after = Date.now();

      expect(result.lastModified).toBeGreaterThanOrEqual(before);
      expect(result.lastModified).toBeLessThanOrEqual(after);
    });
  });

  describe("updateExercise()", () => {
    it("modifies exercise and persists to DB", async () => {
      await db.exercises.add({
        id: "ex-1",
        name: "Bench Press",
        category: "Chest",
        lastModified: 1000,
      });
      exercises.value = [
        {
          id: "ex-1",
          name: "Bench Press",
          category: "Chest",
          lastModified: 1000,
        },
      ];

      await updateExercise("ex-1", { name: "Incline Bench Press" });

      // Signal should be updated
      expect(exercises.value[0].name).toBe("Incline Bench Press");
      expect(exercises.value[0].category).toBe("Chest");
      expect(exercises.value[0].lastModified).toBeGreaterThan(1000);

      // DB should be updated
      const stored = await db.exercises.get("ex-1");
      expect(stored!.name).toBe("Incline Bench Press");
      expect(stored!.lastModified).toBeGreaterThan(1000);
    });

    it("updates lastModified timestamp", async () => {
      await db.exercises.add({
        id: "ex-1",
        name: "Squat",
        lastModified: 1000,
      });
      exercises.value = [{ id: "ex-1", name: "Squat", lastModified: 1000 }];

      const before = Date.now();
      await updateExercise("ex-1", { category: "Legs" });
      const after = Date.now();

      expect(exercises.value[0].lastModified).toBeGreaterThanOrEqual(before);
      expect(exercises.value[0].lastModified).toBeLessThanOrEqual(after);
    });
  });

  describe("deleteExercise()", () => {
    it("removes exercise from signal and DB", async () => {
      await db.exercises.add({
        id: "ex-1",
        name: "Bench Press",
        lastModified: 1000,
      });
      exercises.value = [
        { id: "ex-1", name: "Bench Press", lastModified: 1000 },
      ];

      await deleteExercise("ex-1");

      // Signal should be empty
      expect(exercises.value).toHaveLength(0);

      // DB should be empty
      const stored = await db.exercises.get("ex-1");
      expect(stored).toBeUndefined();
    });

    it("only removes the targeted exercise", async () => {
      await db.exercises.bulkAdd([
        { id: "ex-1", name: "Bench Press", lastModified: 1000 },
        { id: "ex-2", name: "Squat", lastModified: 1000 },
      ]);
      exercises.value = [
        { id: "ex-1", name: "Bench Press", lastModified: 1000 },
        { id: "ex-2", name: "Squat", lastModified: 1000 },
      ];

      await deleteExercise("ex-1");

      expect(exercises.value).toHaveLength(1);
      expect(exercises.value[0].id).toBe("ex-2");

      const remaining = await db.exercises.toArray();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe("ex-2");
    });
  });

  describe("exercisesByCategory", () => {
    it("groups exercises by category", () => {
      exercises.value = [
        {
          id: "ex-1",
          name: "Bench Press",
          category: "Chest",
          lastModified: 1000,
        },
        { id: "ex-2", name: "Squat", category: "Legs", lastModified: 1000 },
        {
          id: "ex-3",
          name: "Incline Press",
          category: "Chest",
          lastModified: 1000,
        },
      ];

      const grouped = exercisesByCategory.value;

      expect(Object.keys(grouped)).toHaveLength(2);
      expect(grouped["Chest"]).toHaveLength(2);
      expect(grouped["Legs"]).toHaveLength(1);
    });

    it("uses 'Uncategorized' for exercises without category", () => {
      exercises.value = [
        { id: "ex-1", name: "Bench Press", lastModified: 1000 },
        { id: "ex-2", name: "Squat", category: "Legs", lastModified: 1000 },
      ];

      const grouped = exercisesByCategory.value;

      expect(grouped["Uncategorized"]).toHaveLength(1);
      expect(grouped["Uncategorized"][0].name).toBe("Bench Press");
      expect(grouped["Legs"]).toHaveLength(1);
    });

    it("returns empty object when no exercises exist", () => {
      exercises.value = [];
      expect(exercisesByCategory.value).toEqual({});
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { db } from "../../src/db/database.ts";
import {
  routines,
  loadRoutines,
  addRoutine,
  updateRoutine,
  deleteRoutine,
  reorderExercises,
} from "../../src/stores/routine-store.ts";

describe("Routine Store", () => {
  beforeEach(async () => {
    await db.routines.clear();
    routines.value = [];
  });

  describe("loadRoutines()", () => {
    it("hydrates routines from DB", async () => {
      const routine = {
        id: "test-1",
        name: "Push Day",
        exerciseIds: ["ex-1", "ex-2"],
        lastModified: Date.now(),
      };
      await db.routines.add(routine);

      await loadRoutines();

      expect(routines.value).toHaveLength(1);
      expect(routines.value[0]).toEqual(routine);
    });

    it("returns empty array when DB is empty", async () => {
      await loadRoutines();
      expect(routines.value).toEqual([]);
    });
  });

  describe("addRoutine()", () => {
    it("creates routine with generated UUID and persists", async () => {
      const mockId = "mock-uuid-1234";
      vi.spyOn(crypto, "randomUUID").mockReturnValueOnce(
        mockId as `${string}-${string}-${string}-${string}-${string}`,
      );

      const result = await addRoutine("Push Day", ["ex-1", "ex-2"]);

      expect(result.id).toBe(mockId);
      expect(result.name).toBe("Push Day");
      expect(result.exerciseIds).toEqual(["ex-1", "ex-2"]);
      expect(result.lastModified).toBeTypeOf("number");

      // Signal should be updated
      expect(routines.value).toHaveLength(1);
      expect(routines.value[0].name).toBe("Push Day");

      // DB should be updated
      const stored = await db.routines.get(mockId);
      expect(stored).toBeDefined();
      expect(stored!.name).toBe("Push Day");
      expect(stored!.exerciseIds).toEqual(["ex-1", "ex-2"]);
    });

    it("sets lastModified to current timestamp", async () => {
      const before = Date.now();
      const result = await addRoutine("Leg Day", ["ex-3"]);
      const after = Date.now();

      expect(result.lastModified).toBeGreaterThanOrEqual(before);
      expect(result.lastModified).toBeLessThanOrEqual(after);
    });
  });

  describe("updateRoutine()", () => {
    it("modifies routine and persists to DB", async () => {
      await db.routines.add({
        id: "rt-1",
        name: "Push Day",
        exerciseIds: ["ex-1", "ex-2"],
        lastModified: 1000,
      });
      routines.value = [
        {
          id: "rt-1",
          name: "Push Day",
          exerciseIds: ["ex-1", "ex-2"],
          lastModified: 1000,
        },
      ];

      await updateRoutine("rt-1", { name: "Upper Body Push" });

      // Signal should be updated
      expect(routines.value[0].name).toBe("Upper Body Push");
      expect(routines.value[0].exerciseIds).toEqual(["ex-1", "ex-2"]);
      expect(routines.value[0].lastModified).toBeGreaterThan(1000);

      // DB should be updated
      const stored = await db.routines.get("rt-1");
      expect(stored!.name).toBe("Upper Body Push");
      expect(stored!.lastModified).toBeGreaterThan(1000);
    });

    it("updates lastModified timestamp", async () => {
      await db.routines.add({
        id: "rt-1",
        name: "Push Day",
        exerciseIds: ["ex-1"],
        lastModified: 1000,
      });
      routines.value = [
        {
          id: "rt-1",
          name: "Push Day",
          exerciseIds: ["ex-1"],
          lastModified: 1000,
        },
      ];

      const before = Date.now();
      await updateRoutine("rt-1", { name: "Pull Day" });
      const after = Date.now();

      expect(routines.value[0].lastModified).toBeGreaterThanOrEqual(before);
      expect(routines.value[0].lastModified).toBeLessThanOrEqual(after);
    });
  });

  describe("deleteRoutine()", () => {
    it("removes routine from signal and DB", async () => {
      await db.routines.add({
        id: "rt-1",
        name: "Push Day",
        exerciseIds: ["ex-1"],
        lastModified: 1000,
      });
      routines.value = [
        {
          id: "rt-1",
          name: "Push Day",
          exerciseIds: ["ex-1"],
          lastModified: 1000,
        },
      ];

      await deleteRoutine("rt-1");

      // Signal should be empty
      expect(routines.value).toHaveLength(0);

      // DB should be empty
      const stored = await db.routines.get("rt-1");
      expect(stored).toBeUndefined();
    });

    it("only removes the targeted routine", async () => {
      await db.routines.bulkAdd([
        {
          id: "rt-1",
          name: "Push Day",
          exerciseIds: ["ex-1"],
          lastModified: 1000,
        },
        {
          id: "rt-2",
          name: "Pull Day",
          exerciseIds: ["ex-2"],
          lastModified: 1000,
        },
      ]);
      routines.value = [
        {
          id: "rt-1",
          name: "Push Day",
          exerciseIds: ["ex-1"],
          lastModified: 1000,
        },
        {
          id: "rt-2",
          name: "Pull Day",
          exerciseIds: ["ex-2"],
          lastModified: 1000,
        },
      ];

      await deleteRoutine("rt-1");

      expect(routines.value).toHaveLength(1);
      expect(routines.value[0].id).toBe("rt-2");

      const remaining = await db.routines.toArray();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe("rt-2");
    });
  });

  describe("reorderExercises()", () => {
    it("updates the exerciseIds order for a routine", async () => {
      await db.routines.add({
        id: "rt-1",
        name: "Push Day",
        exerciseIds: ["ex-1", "ex-2", "ex-3"],
        lastModified: 1000,
      });
      routines.value = [
        {
          id: "rt-1",
          name: "Push Day",
          exerciseIds: ["ex-1", "ex-2", "ex-3"],
          lastModified: 1000,
        },
      ];

      await reorderExercises("rt-1", ["ex-3", "ex-1", "ex-2"]);

      // Signal should be updated
      expect(routines.value[0].exerciseIds).toEqual([
        "ex-3",
        "ex-1",
        "ex-2",
      ]);
      expect(routines.value[0].lastModified).toBeGreaterThan(1000);

      // DB should be updated
      const stored = await db.routines.get("rt-1");
      expect(stored!.exerciseIds).toEqual(["ex-3", "ex-1", "ex-2"]);
      expect(stored!.lastModified).toBeGreaterThan(1000);
    });
  });
});

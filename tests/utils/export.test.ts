import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/db/database.ts";
import {
  exportData,
  importData,
  parseImportFile,
} from "../../src/utils/export.ts";
import type {
  Exercise,
  ExportData,
  Routine,
  Workout,
} from "../../src/types/index.ts";

const now = Date.now();

const sampleExercise: Exercise = {
  id: "ex-1",
  name: "Chest Press",
  category: "Chest",
  lastModified: now,
};

const sampleRoutine: Routine = {
  id: "rt-1",
  name: "Big 5",
  exerciseIds: ["ex-1", "ex-2"],
  lastModified: now,
};

const sampleWorkout: Workout = {
  id: "wk-1",
  date: "2026-02-18",
  startTime: now,
  exerciseLogs: [],
  totalTul: 0,
  totalTime: 0,
  tulRatio: 0,
  lastModified: now,
};

describe("Export Utility", () => {
  beforeEach(async () => {
    await db.exercises.clear();
    await db.routines.clear();
    await db.workouts.clear();
    await db.settings.clear();
  });

  describe("exportData()", () => {
    it("returns an ExportData object with schemaVersion 1 and all tables", async () => {
      // Seed data
      await db.exercises.add(sampleExercise);
      await db.routines.add(sampleRoutine);
      await db.workouts.add(sampleWorkout);
      await db.settings.put({
        id: "user-settings",
        weightUnit: "kg",
        metronomeEnabled: true,
        countdownDuration: 5,
      });

      const result = await exportData();

      expect(result.schemaVersion).toBe(1);
      expect(result.exercises).toHaveLength(1);
      expect(result.exercises[0]).toEqual(sampleExercise);
      expect(result.routines).toHaveLength(1);
      expect(result.routines[0]).toEqual(sampleRoutine);
      expect(result.workouts).toHaveLength(1);
      expect(result.workouts[0]).toEqual(sampleWorkout);
      expect(result.settings).toEqual({
        weightUnit: "kg",
        metronomeEnabled: true,
        countdownDuration: 5,
      });
    });

    it("returns default settings when no settings exist in DB", async () => {
      const result = await exportData();

      expect(result.settings).toEqual({
        weightUnit: "lbs",
        metronomeEnabled: false,
        countdownDuration: 3,
      });
    });
  });

  describe("importData()", () => {
    it("validates schema version and throws on invalid version", async () => {
      const data: ExportData = {
        schemaVersion: 999,
        exercises: [],
        routines: [],
        workouts: [],
        settings: {
          weightUnit: "lbs",
          metronomeEnabled: false,
          countdownDuration: 3,
        },
      };

      await expect(importData(data)).rejects.toThrow(
        "Unsupported schema version: 999. Expected: 1",
      );
    });

    it("adds new records that don't exist in DB", async () => {
      const data: ExportData = {
        schemaVersion: 1,
        exercises: [sampleExercise],
        routines: [sampleRoutine],
        workouts: [sampleWorkout],
        settings: {
          weightUnit: "lbs",
          metronomeEnabled: false,
          countdownDuration: 3,
        },
      };

      const result = await importData(data);

      expect(result.added).toBe(3);
      expect(result.updated).toBe(0);
      expect(result.skipped).toBe(0);

      // Verify records exist in DB
      const exercise = await db.exercises.get("ex-1");
      expect(exercise?.name).toBe("Chest Press");

      const routine = await db.routines.get("rt-1");
      expect(routine?.name).toBe("Big 5");

      const workout = await db.workouts.get("wk-1");
      expect(workout?.date).toBe("2026-02-18");
    });

    it("updates records with newer lastModified timestamps", async () => {
      // Seed existing data with older timestamps
      await db.exercises.add({ ...sampleExercise, lastModified: now - 1000 });
      await db.routines.add({ ...sampleRoutine, lastModified: now - 1000 });
      await db.workouts.add({ ...sampleWorkout, lastModified: now - 1000 });

      // Import data with newer timestamps
      const data: ExportData = {
        schemaVersion: 1,
        exercises: [
          { ...sampleExercise, name: "Updated Chest Press", lastModified: now },
        ],
        routines: [
          { ...sampleRoutine, name: "Updated Big 5", lastModified: now },
        ],
        workouts: [{ ...sampleWorkout, date: "2026-02-19", lastModified: now }],
        settings: {
          weightUnit: "lbs",
          metronomeEnabled: false,
          countdownDuration: 3,
        },
      };

      const result = await importData(data);

      expect(result.added).toBe(0);
      expect(result.updated).toBe(3);
      expect(result.skipped).toBe(0);

      // Verify records were updated
      const exercise = await db.exercises.get("ex-1");
      expect(exercise?.name).toBe("Updated Chest Press");

      const routine = await db.routines.get("rt-1");
      expect(routine?.name).toBe("Updated Big 5");

      const workout = await db.workouts.get("wk-1");
      expect(workout?.date).toBe("2026-02-19");
    });

    it("skips records with older lastModified timestamps", async () => {
      // Seed existing data with newer timestamps
      await db.exercises.add({ ...sampleExercise, lastModified: now + 1000 });
      await db.routines.add({ ...sampleRoutine, lastModified: now + 1000 });
      await db.workouts.add({ ...sampleWorkout, lastModified: now + 1000 });

      // Import data with older timestamps
      const data: ExportData = {
        schemaVersion: 1,
        exercises: [
          {
            ...sampleExercise,
            name: "Should Not Update",
            lastModified: now,
          },
        ],
        routines: [
          {
            ...sampleRoutine,
            name: "Should Not Update",
            lastModified: now,
          },
        ],
        workouts: [
          {
            ...sampleWorkout,
            date: "2026-01-01",
            lastModified: now,
          },
        ],
        settings: {
          weightUnit: "lbs",
          metronomeEnabled: false,
          countdownDuration: 3,
        },
      };

      const result = await importData(data);

      expect(result.added).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.skipped).toBe(3);

      // Verify records were NOT updated
      const exercise = await db.exercises.get("ex-1");
      expect(exercise?.name).toBe("Chest Press");

      const routine = await db.routines.get("rt-1");
      expect(routine?.name).toBe("Big 5");

      const workout = await db.workouts.get("wk-1");
      expect(workout?.date).toBe("2026-02-18");
    });

    it("returns counts: { added, updated, skipped }", async () => {
      // Seed one exercise with old timestamp (will be updated)
      await db.exercises.add({
        id: "ex-existing",
        name: "Old Exercise",
        lastModified: now - 1000,
      });

      // Seed one routine with new timestamp (will be skipped)
      await db.routines.add({
        id: "rt-existing",
        name: "Current Routine",
        exerciseIds: [],
        lastModified: now + 1000,
      });

      const data: ExportData = {
        schemaVersion: 1,
        exercises: [
          // This is new -> added
          sampleExercise,
          // This exists with older timestamp -> updated
          {
            id: "ex-existing",
            name: "Updated Exercise",
            lastModified: now,
          },
        ],
        routines: [
          // This exists with newer timestamp -> skipped
          {
            id: "rt-existing",
            name: "Imported Routine",
            exerciseIds: [],
            lastModified: now,
          },
        ],
        workouts: [
          // This is new -> added
          sampleWorkout,
        ],
        settings: {
          weightUnit: "lbs",
          metronomeEnabled: false,
          countdownDuration: 3,
        },
      };

      const result = await importData(data);

      expect(result.added).toBe(2); // ex-1 + wk-1
      expect(result.updated).toBe(1); // ex-existing
      expect(result.skipped).toBe(1); // rt-existing
    });
  });

  describe("parseImportFile()", () => {
    it("reads and validates a JSON file", async () => {
      const exportDataObj: ExportData = {
        schemaVersion: 1,
        exercises: [sampleExercise],
        routines: [sampleRoutine],
        workouts: [sampleWorkout],
        settings: {
          weightUnit: "kg",
          metronomeEnabled: true,
          countdownDuration: 5,
        },
      };

      const file = new File([JSON.stringify(exportDataObj)], "export.json", {
        type: "application/json",
      });

      const result = await parseImportFile(file);

      expect(result.schemaVersion).toBe(1);
      expect(result.exercises).toHaveLength(1);
      expect(result.exercises[0]).toEqual(sampleExercise);
      expect(result.routines).toHaveLength(1);
      expect(result.workouts).toHaveLength(1);
      expect(result.settings).toEqual({
        weightUnit: "kg",
        metronomeEnabled: true,
        countdownDuration: 5,
      });
    });

    it("throws on invalid JSON", async () => {
      const file = new File(["not valid json"], "bad.json", {
        type: "application/json",
      });

      await expect(parseImportFile(file)).rejects.toThrow();
    });

    it("throws when schemaVersion is missing", async () => {
      const file = new File(
        [JSON.stringify({ exercises: [], routines: [], workouts: [] })],
        "no-version.json",
        { type: "application/json" },
      );

      await expect(parseImportFile(file)).rejects.toThrow(
        "Invalid export file: missing schemaVersion",
      );
    });
  });
});

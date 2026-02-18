import { db } from "../db/database.ts";
import type {
  ExportData,
  UserSettings,
} from "../types/index.ts";

const CURRENT_SCHEMA_VERSION = 1;

export async function exportData(): Promise<ExportData> {
  const [exercises, routines, workouts, settingsRecord] = await Promise.all([
    db.exercises.toArray(),
    db.routines.toArray(),
    db.workouts.toArray(),
    db.settings.get("user-settings"),
  ]);

  const settings: UserSettings = settingsRecord
    ? {
        weightUnit: settingsRecord.weightUnit,
        metronomeEnabled: settingsRecord.metronomeEnabled,
        countdownDuration: settingsRecord.countdownDuration,
      }
    : { weightUnit: "lbs", metronomeEnabled: false, countdownDuration: 3 };

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exercises,
    routines,
    workouts,
    settings,
  };
}

export async function importData(
  data: ExportData,
): Promise<{ added: number; updated: number; skipped: number }> {
  if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported schema version: ${data.schemaVersion}. Expected: ${CURRENT_SCHEMA_VERSION}`,
    );
  }

  let added = 0;
  let updated = 0;
  let skipped = 0;

  // Merge exercises
  for (const exercise of data.exercises) {
    const existing = await db.exercises.get(exercise.id);
    if (!existing) {
      await db.exercises.add(exercise);
      added++;
    } else if (exercise.lastModified > existing.lastModified) {
      await db.exercises.put(exercise);
      updated++;
    } else {
      skipped++;
    }
  }

  // Merge routines
  for (const routine of data.routines) {
    const existing = await db.routines.get(routine.id);
    if (!existing) {
      await db.routines.add(routine);
      added++;
    } else if (routine.lastModified > existing.lastModified) {
      await db.routines.put(routine);
      updated++;
    } else {
      skipped++;
    }
  }

  // Merge workouts
  for (const workout of data.workouts) {
    const existing = await db.workouts.get(workout.id);
    if (!existing) {
      await db.workouts.add(workout);
      added++;
    } else if (workout.lastModified > existing.lastModified) {
      await db.workouts.put(workout);
      updated++;
    } else {
      skipped++;
    }
  }

  // Settings: always import if provided
  if (data.settings) {
    await db.settings.put({ id: "user-settings", ...data.settings });
  }

  return { added, updated, skipped };
}

export function downloadExport(data: ExportData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hit-tracker-export-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseImportFile(file: File): Promise<ExportData> {
  const text = await file.text();
  const data = JSON.parse(text) as ExportData;
  if (typeof data.schemaVersion !== "number") {
    throw new Error("Invalid export file: missing schemaVersion");
  }
  return data;
}

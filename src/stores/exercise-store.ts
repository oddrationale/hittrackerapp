import { signal, computed } from "@preact/signals";
import { db } from "../db/database.ts";
import type { Exercise } from "../types/index.ts";

export const exercises = signal<Exercise[]>([]);

export async function loadExercises(): Promise<void> {
  const all = await db.exercises.toArray();
  exercises.value = all;
}

export async function addExercise(
  name: string,
  category?: string,
): Promise<Exercise> {
  const exercise: Exercise = {
    id: crypto.randomUUID(),
    name,
    category,
    lastModified: Date.now(),
  };
  await db.exercises.add(exercise);
  exercises.value = [...exercises.value, exercise];
  return exercise;
}

export async function updateExercise(
  id: string,
  updates: Partial<Omit<Exercise, "id">>,
): Promise<void> {
  const updated = { ...updates, lastModified: Date.now() };
  await db.exercises.update(id, updated);
  exercises.value = exercises.value.map((e) =>
    e.id === id ? { ...e, ...updated } : e,
  );
}

export async function deleteExercise(id: string): Promise<void> {
  await db.exercises.delete(id);
  exercises.value = exercises.value.filter((e) => e.id !== id);
}

export const exercisesByCategory = computed(() => {
  const grouped: Record<string, Exercise[]> = {};
  for (const ex of exercises.value) {
    const cat = ex.category ?? "Uncategorized";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(ex);
  }
  return grouped;
});

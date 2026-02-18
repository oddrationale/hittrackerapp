import { signal } from "@preact/signals";
import { db } from "../db/database.ts";
import type { Routine } from "../types/index.ts";

export const routines = signal<Routine[]>([]);

export async function loadRoutines(): Promise<void> {
  const all = await db.routines.toArray();
  routines.value = all;
}

export async function addRoutine(
  name: string,
  exerciseIds: string[],
): Promise<Routine> {
  const routine: Routine = {
    id: crypto.randomUUID(),
    name,
    exerciseIds,
    lastModified: Date.now(),
  };
  await db.routines.add(routine);
  routines.value = [...routines.value, routine];
  return routine;
}

export async function updateRoutine(
  id: string,
  updates: Partial<Omit<Routine, "id">>,
): Promise<void> {
  const updated = { ...updates, lastModified: Date.now() };
  await db.routines.update(id, updated);
  routines.value = routines.value.map((r) =>
    r.id === id ? { ...r, ...updated } : r,
  );
}

export async function deleteRoutine(id: string): Promise<void> {
  await db.routines.delete(id);
  routines.value = routines.value.filter((r) => r.id !== id);
}

export async function reorderExercises(
  routineId: string,
  exerciseIds: string[],
): Promise<void> {
  await updateRoutine(routineId, { exerciseIds });
}

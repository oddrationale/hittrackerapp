import { signal } from "@preact/signals";
import { db } from "../db/database.ts";
import type { Workout } from "../types/index.ts";

export const workoutHistory = signal<Workout[]>([]);

export async function loadHistory(): Promise<void> {
  const all = await db.workouts.orderBy("date").reverse().toArray();
  workoutHistory.value = all;
}

export function getWorkout(id: string): Workout | undefined {
  return workoutHistory.value.find((w) => w.id === id);
}

export async function deleteWorkout(id: string): Promise<void> {
  await db.workouts.delete(id);
  workoutHistory.value = workoutHistory.value.filter((w) => w.id !== id);
}

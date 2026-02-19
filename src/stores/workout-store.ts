import { signal, computed } from "@preact/signals";
import { db } from "../db/database.ts";
import type { Workout, ExerciseLog } from "../types/index.ts";

export const activeWorkout = signal<Workout | null>(null);
export const currentExerciseIndex = signal(0);
export const lastCompletedWorkout = signal<Workout | null>(null);
export const isWorkoutActive = computed(() => activeWorkout.value !== null);

export function startWorkout(routineId?: string): void {
  if (activeWorkout.value) return; // prevent double-start
  const now = Date.now();
  activeWorkout.value = {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
    startTime: now,
    routineId,
    exerciseLogs: [],
    totalTul: 0,
    totalTime: 0,
    tulRatio: 0,
    lastModified: now,
  };
  currentExerciseIndex.value = 0;
}

export function addExerciseLog(log: ExerciseLog): void {
  if (!activeWorkout.value) return;
  const workout = activeWorkout.value;
  const exerciseLogs = [...workout.exerciseLogs, log];
  const totalTul = exerciseLogs.reduce((sum, l) => sum + l.tul, 0);
  activeWorkout.value = {
    ...workout,
    exerciseLogs,
    totalTul,
    lastModified: Date.now(),
  };
  currentExerciseIndex.value = exerciseLogs.length;
}

export async function finishWorkout(): Promise<Workout | null> {
  if (!activeWorkout.value) return null;
  const now = Date.now();
  const endTime = now;
  const totalTime = Math.round(
    (endTime - activeWorkout.value.startTime) / 1000,
  );
  const totalTul = activeWorkout.value.totalTul;
  const tulRatio = totalTime > 0 ? totalTul / totalTime : 0;
  const completed: Workout = {
    ...activeWorkout.value,
    endTime,
    totalTime,
    tulRatio,
    lastModified: now,
  };
  await db.workouts.add(completed);
  lastCompletedWorkout.value = completed;
  activeWorkout.value = null;
  currentExerciseIndex.value = 0;
  return completed;
}

export function cancelWorkout(): void {
  activeWorkout.value = null;
  currentExerciseIndex.value = 0;
}

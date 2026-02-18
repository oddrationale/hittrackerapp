export type WeightDirection = "increase" | "decrease" | "maintain";
export type WeightUnit = "lbs" | "kg";
export type TimerPhase = "idle" | "countdown" | "running" | "stopped";

export interface Exercise {
  id: string;
  name: string;
  category?: string;
  notes?: string;
  lastModified: number;
}

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
  lastModified: number;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  weight: number;
  tul: number; // seconds
  reps?: number;
  notes?: string;
  weightDirection: WeightDirection;
}

export interface Workout {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  startTime: number; // Unix timestamp ms
  endTime?: number; // Unix timestamp ms
  routineId?: string; // undefined for freeform
  exerciseLogs: ExerciseLog[];
  totalTul: number; // sum of exercise TULs in seconds
  totalTime: number; // endTime - startTime in seconds
  tulRatio: number; // totalTul / totalTime
  lastModified: number;
}

export interface UserSettings {
  weightUnit: WeightUnit;
  metronomeEnabled: boolean;
  countdownDuration: number; // seconds, default 3
}

export interface ExportData {
  schemaVersion: number;
  exercises: Exercise[];
  routines: Routine[];
  workouts: Workout[];
  settings: UserSettings;
}

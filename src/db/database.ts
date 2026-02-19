import Dexie from "dexie";
import type {
  Exercise,
  Routine,
  Workout,
  UserSettings,
} from "../types/index.ts";

export class HitTrackerDB extends Dexie {
  exercises!: Dexie.Table<Exercise, string>;
  routines!: Dexie.Table<Routine, string>;
  workouts!: Dexie.Table<Workout, string>;
  settings!: Dexie.Table<UserSettings & { id: string }, string>;

  constructor() {
    super("HitTrackerDB");
    this.version(1).stores({
      exercises: "id, name, category, lastModified",
      routines: "id, name, lastModified",
      workouts: "id, date, startTime, lastModified",
      settings: "id",
    });
  }
}

export const db = new HitTrackerDB();

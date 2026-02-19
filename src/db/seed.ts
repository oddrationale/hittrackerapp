import { db } from "./database.ts";
import type { Exercise } from "../types/index.ts";

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "ex-chest-press",
    name: "Chest Press",
    category: "Upper Body Push",
    lastModified: 0,
  },
  {
    id: "ex-overhead-press",
    name: "Overhead Press",
    category: "Upper Body Push",
    lastModified: 0,
  },
  {
    id: "ex-seated-row",
    name: "Seated Row",
    category: "Upper Body Pull",
    lastModified: 0,
  },
  {
    id: "ex-pulldown",
    name: "Pulldown",
    category: "Upper Body Pull",
    lastModified: 0,
  },
  {
    id: "ex-leg-press",
    name: "Leg Press",
    category: "Lower Body",
    lastModified: 0,
  },
  {
    id: "ex-leg-curl",
    name: "Leg Curl",
    category: "Lower Body",
    lastModified: 0,
  },
  {
    id: "ex-leg-extension",
    name: "Leg Extension",
    category: "Lower Body",
    lastModified: 0,
  },
  {
    id: "ex-chest-fly",
    name: "Chest Fly",
    category: "Upper Body Push",
    lastModified: 0,
  },
  {
    id: "ex-lateral-raise",
    name: "Lateral Raise",
    category: "Upper Body Push",
    lastModified: 0,
  },
  {
    id: "ex-bicep-curl",
    name: "Bicep Curl",
    category: "Arms",
    lastModified: 0,
  },
  {
    id: "ex-tricep-extension",
    name: "Tricep Extension",
    category: "Arms",
    lastModified: 0,
  },
  {
    id: "ex-calf-raise",
    name: "Calf Raise",
    category: "Lower Body",
    lastModified: 0,
  },
];

export async function seedExercisesIfEmpty(): Promise<void> {
  const count = await db.exercises.count();
  if (count === 0) {
    await db.exercises.bulkAdd(DEFAULT_EXERCISES);
  }
}

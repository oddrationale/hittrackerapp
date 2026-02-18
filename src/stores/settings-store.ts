import { signal } from "@preact/signals";
import { db } from "../db/database.ts";
import type { UserSettings } from "../types/index.ts";

const DEFAULT_SETTINGS: UserSettings = {
  weightUnit: "lbs",
  metronomeEnabled: false,
  countdownDuration: 3,
};

export const settings = signal<UserSettings>({ ...DEFAULT_SETTINGS });

export async function loadSettings(): Promise<void> {
  const stored = await db.settings.get("user-settings");
  if (stored) {
    const { id: _, ...rest } = stored;
    settings.value = rest as UserSettings;
  }
}

export async function updateSettings(
  updates: Partial<UserSettings>,
): Promise<void> {
  settings.value = { ...settings.value, ...updates };
  await db.settings.put({ id: "user-settings", ...settings.value });
}

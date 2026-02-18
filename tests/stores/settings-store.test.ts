import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/db/database.ts";
import {
  settings,
  loadSettings,
  updateSettings,
} from "../../src/stores/settings-store.ts";

const DEFAULT_SETTINGS = {
  weightUnit: "lbs" as const,
  metronomeEnabled: false,
  countdownDuration: 3,
};

describe("Settings Store", () => {
  beforeEach(async () => {
    await db.settings.clear();
    settings.value = { ...DEFAULT_SETTINGS };
  });

  it("has correct default values", () => {
    expect(settings.value.weightUnit).toBe("lbs");
    expect(settings.value.metronomeEnabled).toBe(false);
    expect(settings.value.countdownDuration).toBe(3);
  });

  it("loadSettings() returns default settings when DB is empty", async () => {
    await loadSettings();
    expect(settings.value).toEqual(DEFAULT_SETTINGS);
  });

  it("loadSettings() hydrates from DB when data exists", async () => {
    await db.settings.put({
      id: "user-settings",
      weightUnit: "kg",
      metronomeEnabled: true,
      countdownDuration: 5,
    });

    await loadSettings();

    expect(settings.value.weightUnit).toBe("kg");
    expect(settings.value.metronomeEnabled).toBe(true);
    expect(settings.value.countdownDuration).toBe(5);
  });

  it("updateSettings() updates the signal AND persists to DB", async () => {
    await updateSettings({ weightUnit: "kg" });

    // Signal should be updated
    expect(settings.value.weightUnit).toBe("kg");
    // Other values should remain at defaults
    expect(settings.value.metronomeEnabled).toBe(false);
    expect(settings.value.countdownDuration).toBe(3);

    // DB should be updated
    const stored = await db.settings.get("user-settings");
    expect(stored).toBeDefined();
    expect(stored!.weightUnit).toBe("kg");
    expect(stored!.metronomeEnabled).toBe(false);
    expect(stored!.countdownDuration).toBe(3);
  });

  it("updateSettings() merges partial updates", async () => {
    await updateSettings({ metronomeEnabled: true });
    await updateSettings({ countdownDuration: 5 });

    expect(settings.value).toEqual({
      weightUnit: "lbs",
      metronomeEnabled: true,
      countdownDuration: 5,
    });

    const stored = await db.settings.get("user-settings");
    expect(stored!.weightUnit).toBe("lbs");
    expect(stored!.metronomeEnabled).toBe(true);
    expect(stored!.countdownDuration).toBe(5);
  });
});

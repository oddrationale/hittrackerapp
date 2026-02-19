import { useLocation } from "preact-iso";
import { settings, updateSettings } from "../stores/settings-store.ts";
import { PageHeader } from "../components/layout/page-header.tsx";
import { ExerciseManager } from "../components/settings/exercise-manager.tsx";
import { RoutineManager } from "../components/settings/routine-manager.tsx";
import { DataManager } from "../components/settings/data-manager.tsx";

export function SettingsPage() {
  const { path } = useLocation();

  if (path === "/settings/exercises") {
    return <ExerciseManager />;
  }

  if (path === "/settings/routines") {
    return <RoutineManager />;
  }

  return (
    <div>
      <PageHeader title="Settings" />
      <div class="space-y-4 p-4">
        {/* Weight Unit */}
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Weight Unit
          </label>
          <div class="flex gap-2">
            <button
              class={`flex-1 rounded-lg py-2 text-sm font-medium ${
                settings.value.weightUnit === "lbs"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => updateSettings({ weightUnit: "lbs" })}
            >
              lbs
            </button>
            <button
              class={`flex-1 rounded-lg py-2 text-sm font-medium ${
                settings.value.weightUnit === "kg"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => updateSettings({ weightUnit: "kg" })}
            >
              kg
            </button>
          </div>
        </div>

        {/* Metronome Toggle */}
        <div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <span class="text-sm font-medium text-gray-700">Metronome Sound</span>
          <button
            role="switch"
            aria-checked={settings.value.metronomeEnabled}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.value.metronomeEnabled ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() =>
              updateSettings({
                metronomeEnabled: !settings.value.metronomeEnabled,
              })
            }
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.value.metronomeEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Countdown Duration */}
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Countdown Duration (seconds)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.value.countdownDuration}
            onInput={(e) => {
              const val = parseInt((e.target as HTMLInputElement).value, 10);
              if (val >= 1 && val <= 10) {
                updateSettings({ countdownDuration: val });
              }
            }}
            class="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center"
          />
        </div>

        {/* Navigation Links */}
        <div class="rounded-lg bg-white shadow-sm">
          <a
            href="/settings/exercises"
            class="flex items-center justify-between border-b border-gray-100 p-4"
          >
            <span class="text-sm font-medium text-gray-700">
              Manage Exercises
            </span>
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a
            href="/settings/routines"
            class="flex items-center justify-between p-4"
          >
            <span class="text-sm font-medium text-gray-700">
              Manage Routines
            </span>
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        {/* Data Management */}
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <DataManager />
        </div>
      </div>
    </div>
  );
}

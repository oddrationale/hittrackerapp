import { useSignal } from "@preact/signals";
import type { ExerciseLog, WeightDirection } from "../../types/index.ts";
import { ExerciseTimer } from "../timer/exercise-timer.tsx";
import { WeightDirectionSelector } from "./weight-direction.tsx";

interface ExerciseCardProps {
  exerciseId: string;
  exerciseName: string;
  defaultWeight?: number;
  defaultNotes?: string;
  onSave: (log: Omit<ExerciseLog, "id">) => void;
}

export function ExerciseCard({
  exerciseId,
  exerciseName,
  defaultWeight,
  defaultNotes,
  onSave,
}: ExerciseCardProps) {
  const tul = useSignal(0);
  const timerDone = useSignal(false);
  const weight = useSignal(defaultWeight ?? 0);
  const reps = useSignal<number | undefined>(undefined);
  const notes = useSignal(defaultNotes ?? "");
  const weightDirection = useSignal<WeightDirection>("maintain");

  function handleTimerComplete(tulSeconds: number) {
    tul.value = tulSeconds;
    timerDone.value = true;
  }

  function handleSave() {
    onSave({
      exerciseId,
      weight: weight.value,
      tul: tul.value,
      reps: reps.value,
      notes: notes.value || undefined,
      weightDirection: weightDirection.value,
    });
  }

  return (
    <div class="rounded-lg bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-xl font-bold text-gray-900">{exerciseName}</h2>

      {!timerDone.value ? (
        <ExerciseTimer onComplete={handleTimerComplete} />
      ) : (
        <div class="space-y-4">
          {/* TUL display */}
          <div>
            <label class="block text-sm font-medium text-gray-500">
              Time Under Load
            </label>
            <div class="text-3xl font-bold text-gray-900 tabular-nums">
              {Math.floor(tul.value / 60)}:
              {(tul.value % 60).toString().padStart(2, "0")}
            </div>
          </div>

          {/* Weight input */}
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={weight.value}
              onInput={(e) => {
                weight.value =
                  parseFloat((e.target as HTMLInputElement).value) || 0;
              }}
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="0"
            />
          </div>

          {/* Reps input (optional) */}
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Reps (optional)
            </label>
            <input
              type="number"
              min="0"
              value={reps.value ?? ""}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value;
                reps.value = val ? parseInt(val, 10) : undefined;
              }}
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Optional"
            />
          </div>

          {/* Notes (optional) */}
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              value={notes.value}
              onInput={(e) => {
                notes.value = (e.target as HTMLTextAreaElement).value;
              }}
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={2}
              placeholder="Seat position, machine config..."
            />
          </div>

          {/* Weight Direction */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Next Time
            </label>
            <WeightDirectionSelector
              value={weightDirection.value}
              onChange={(dir) => {
                weightDirection.value = dir;
              }}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            class="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white"
          >
            Save & Next
          </button>
        </div>
      )}
    </div>
  );
}

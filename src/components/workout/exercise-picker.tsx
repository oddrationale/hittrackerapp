import { useSignal } from "@preact/signals";
import { exercises } from "../../stores/exercise-store.ts";
import type { Exercise } from "../../types/index.ts";

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void;
}

export function ExercisePicker({ onSelect }: ExercisePickerProps) {
  const search = useSignal("");

  const filtered = search.value
    ? exercises.value.filter((e) =>
        e.name.toLowerCase().includes(search.value.toLowerCase()),
      )
    : exercises.value;

  // Group filtered exercises by category
  const grouped: Record<string, Exercise[]> = {};
  for (const ex of filtered) {
    const cat = ex.category ?? "Uncategorized";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(ex);
  }

  return (
    <div class="space-y-4">
      <input
        type="text"
        placeholder="Search exercises..."
        value={search.value}
        onInput={(e) => {
          search.value = (e.target as HTMLInputElement).value;
        }}
        class="w-full rounded-lg border border-gray-300 px-3 py-2"
      />

      {Object.keys(grouped).length === 0 ? (
        <p class="py-4 text-center text-gray-500">No exercises found</p>
      ) : (
        Object.entries(grouped).map(([category, exs]) => (
          <div key={category}>
            <h3 class="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              {category}
            </h3>
            <div class="space-y-1">
              {exs.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelect(ex)}
                  class="w-full rounded-lg bg-white p-3 text-left shadow-sm"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

import { signal } from "@preact/signals";
import {
  routines,
  addRoutine,
  updateRoutine,
  deleteRoutine,
} from "../../stores/routine-store.ts";
import { exercisesByCategory } from "../../stores/exercise-store.ts";
import { PageHeader } from "../layout/page-header.tsx";
import { useLocation } from "preact-iso";

const showForm = signal(false);
const editingId = signal<string | null>(null);
const formName = signal("");
const selectedExerciseIds = signal<string[]>([]);

export function resetRoutineManager(): void {
  showForm.value = false;
  editingId.value = null;
  formName.value = "";
  selectedExerciseIds.value = [];
}

export function RoutineManager() {
  const { route } = useLocation();

  function toggleExercise(exerciseId: string) {
    const current = selectedExerciseIds.value;
    if (current.includes(exerciseId)) {
      selectedExerciseIds.value = current.filter((id) => id !== exerciseId);
    } else {
      selectedExerciseIds.value = [...current, exerciseId];
    }
  }

  function handleAdd() {
    if (formName.value.trim() && selectedExerciseIds.value.length > 0) {
      addRoutine(formName.value.trim(), [...selectedExerciseIds.value]);
      formName.value = "";
      selectedExerciseIds.value = [];
      showForm.value = false;
    }
  }

  function handleEdit(id: string) {
    const routine = routines.value.find((r) => r.id === id);
    if (routine) {
      editingId.value = id;
      formName.value = routine.name;
      selectedExerciseIds.value = [...routine.exerciseIds];
    }
  }

  function handleSaveEdit() {
    if (editingId.value && formName.value.trim()) {
      updateRoutine(editingId.value, {
        name: formName.value.trim(),
        exerciseIds: [...selectedExerciseIds.value],
      });
      editingId.value = null;
      formName.value = "";
      selectedExerciseIds.value = [];
    }
  }

  function handleCancelEdit() {
    editingId.value = null;
    formName.value = "";
    selectedExerciseIds.value = [];
  }

  function handleDelete(id: string) {
    if (confirm("Delete this routine?")) {
      deleteRoutine(id);
    }
  }

  function getExerciseCount(exerciseIds: string[]): number {
    return exerciseIds.length;
  }

  const grouped = exercisesByCategory.value;
  const categoryNames = Object.keys(grouped).sort();
  const hasRoutines = routines.value.length > 0;

  function renderExerciseChecklist() {
    return (
      <div class="space-y-3">
        <p class="text-sm font-medium text-gray-700">Select Exercises</p>
        {categoryNames.map((category) => (
          <div key={category}>
            <p class="mb-1 text-xs font-semibold text-gray-500 uppercase">
              {category}
            </p>
            {grouped[category].map((exercise) => (
              <label
                key={exercise.id}
                class="flex items-center gap-2 py-1"
              >
                <input
                  type="checkbox"
                  checked={selectedExerciseIds.value.includes(exercise.id)}
                  onChange={() => toggleExercise(exercise.id)}
                  class="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span class="text-sm text-gray-700">{exercise.name}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Manage Routines"
        onBack={() => route("/settings")}
      />
      <div class="space-y-4 p-4">
        {/* Add Routine Button / Form */}
        {showForm.value ? (
          <div class="rounded-lg bg-white p-4 shadow-sm">
            <h2 class="mb-3 text-sm font-medium text-gray-700">
              Add Routine
            </h2>
            <div class="space-y-3">
              <input
                type="text"
                placeholder="Routine name"
                value={formName.value}
                onInput={(e) => {
                  formName.value = (e.target as HTMLInputElement).value;
                }}
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {renderExerciseChecklist()}
              <div class="flex gap-2">
                <button
                  onClick={handleAdd}
                  class="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    showForm.value = false;
                    formName.value = "";
                    selectedExerciseIds.value = [];
                  }}
                  class="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              showForm.value = true;
            }}
            class="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white"
          >
            Add Routine
          </button>
        )}

        {/* Empty State */}
        {!hasRoutines && !showForm.value && (
          <div class="rounded-lg bg-white p-8 text-center shadow-sm">
            <p class="text-sm text-gray-500">
              No routines yet. Add your first routine to get started.
            </p>
          </div>
        )}

        {/* Routine List */}
        {routines.value.map((routine) => (
          <div key={routine.id} class="rounded-lg bg-white shadow-sm">
            {editingId.value === routine.id ? (
              <div class="space-y-3 p-4">
                <input
                  type="text"
                  placeholder="Routine name"
                  value={formName.value}
                  onInput={(e) => {
                    formName.value = (e.target as HTMLInputElement).value;
                  }}
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                {renderExerciseChecklist()}
                <div class="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    class="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    class="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div class="flex items-center justify-between px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-gray-800">
                    {routine.name}
                  </p>
                  <p class="text-xs text-gray-500">
                    {getExerciseCount(routine.exerciseIds)} exercises
                  </p>
                </div>
                <div class="flex gap-1">
                  <button
                    onClick={() => handleEdit(routine.id)}
                    class="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label={`Edit ${routine.name}`}
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(routine.id)}
                    class="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${routine.name}`}
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

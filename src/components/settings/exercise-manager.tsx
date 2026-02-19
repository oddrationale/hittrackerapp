import { signal } from "@preact/signals";
import {
  exercises,
  exercisesByCategory,
  addExercise,
  updateExercise,
  deleteExercise,
} from "../../stores/exercise-store.ts";
import { PageHeader } from "../layout/page-header.tsx";
import { useLocation } from "preact-iso";

const showForm = signal(false);
const editingId = signal<string | null>(null);
const formName = signal("");
const formCategory = signal("");

export function resetExerciseManager(): void {
  showForm.value = false;
  editingId.value = null;
  formName.value = "";
  formCategory.value = "";
}

export function ExerciseManager() {
  const { route } = useLocation();

  function handleAdd() {
    if (formName.value.trim()) {
      addExercise(
        formName.value.trim(),
        formCategory.value.trim() || undefined,
      );
      formName.value = "";
      formCategory.value = "";
      showForm.value = false;
    }
  }

  function handleEdit(id: string) {
    const exercise = exercises.value.find((e) => e.id === id);
    if (exercise) {
      editingId.value = id;
      formName.value = exercise.name;
      formCategory.value = exercise.category ?? "";
    }
  }

  function handleSaveEdit() {
    if (editingId.value && formName.value.trim()) {
      updateExercise(editingId.value, {
        name: formName.value.trim(),
        category: formCategory.value.trim() || undefined,
      });
      editingId.value = null;
      formName.value = "";
      formCategory.value = "";
    }
  }

  function handleCancelEdit() {
    editingId.value = null;
    formName.value = "";
    formCategory.value = "";
  }

  function handleDelete(id: string) {
    if (confirm("Delete this exercise?")) {
      deleteExercise(id);
    }
  }

  const grouped = exercisesByCategory.value;
  const categoryNames = Object.keys(grouped).sort();
  const hasExercises = exercises.value.length > 0;

  return (
    <div>
      <PageHeader title="Manage Exercises" onBack={() => route("/settings")} />
      <div class="space-y-4 p-4">
        {/* Add Exercise Button / Form */}
        {showForm.value ? (
          <div class="rounded-lg bg-white p-4 shadow-sm">
            <h2 class="mb-3 text-sm font-medium text-gray-700">Add Exercise</h2>
            <div class="space-y-3">
              <input
                type="text"
                placeholder="Exercise name"
                value={formName.value}
                onInput={(e) => {
                  formName.value = (e.target as HTMLInputElement).value;
                }}
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Category (optional)"
                value={formCategory.value}
                onInput={(e) => {
                  formCategory.value = (e.target as HTMLInputElement).value;
                }}
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
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
                    formCategory.value = "";
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
            Add Exercise
          </button>
        )}

        {/* Empty State */}
        {!hasExercises && (
          <div class="rounded-lg bg-white p-8 text-center shadow-sm">
            <p class="text-sm text-gray-500">
              No exercises yet. Add your first exercise to get started.
            </p>
          </div>
        )}

        {/* Grouped Exercise List */}
        {categoryNames.map((category) => (
          <div key={category} class="rounded-lg bg-white shadow-sm">
            <h3 class="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-800">
              {category}
            </h3>
            <ul>
              {grouped[category].map((exercise) => (
                <li
                  key={exercise.id}
                  class="border-b border-gray-50 last:border-b-0"
                >
                  {editingId.value === exercise.id ? (
                    <div class="space-y-2 p-4">
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={formName.value}
                        onInput={(e) => {
                          formName.value = (e.target as HTMLInputElement).value;
                        }}
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Category (optional)"
                        value={formCategory.value}
                        onInput={(e) => {
                          formCategory.value = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
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
                      <span class="text-sm text-gray-700">{exercise.name}</span>
                      <div class="flex gap-1">
                        <button
                          onClick={() => handleEdit(exercise.id)}
                          class="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          aria-label={`Edit ${exercise.name}`}
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
                          onClick={() => handleDelete(exercise.id)}
                          class="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${exercise.name}`}
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
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocationProvider } from "preact-iso";
import {
  ExerciseManager,
  resetExerciseManager,
} from "../../../src/components/settings/exercise-manager.tsx";
import { exercises } from "../../../src/stores/exercise-store.ts";
import type { Exercise } from "../../../src/types/index.ts";

function renderExerciseManager() {
  return render(
    <LocationProvider>
      <ExerciseManager />
    </LocationProvider>,
  );
}

function seedExercises(): Exercise[] {
  const seeded: Exercise[] = [
    {
      id: "ex-1",
      name: "Bench Press",
      category: "Chest",
      lastModified: Date.now(),
    },
    {
      id: "ex-2",
      name: "Incline Press",
      category: "Chest",
      lastModified: Date.now(),
    },
    {
      id: "ex-3",
      name: "Squat",
      category: "Legs",
      lastModified: Date.now(),
    },
    {
      id: "ex-4",
      name: "Leg Curl",
      category: "Legs",
      lastModified: Date.now(),
    },
    {
      id: "ex-5",
      name: "Pull Up",
      lastModified: Date.now(),
    },
  ];
  exercises.value = seeded;
  return seeded;
}

describe("ExerciseManager", () => {
  beforeEach(() => {
    exercises.value = [];
    resetExerciseManager();
  });

  it("lists exercises grouped by category", () => {
    seedExercises();
    renderExerciseManager();

    // Category headers should be visible
    expect(screen.getByText("Chest")).toBeInTheDocument();
    expect(screen.getByText("Legs")).toBeInTheDocument();
    expect(screen.getByText("Uncategorized")).toBeInTheDocument();

    // Exercise names should be visible
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Incline Press")).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Leg Curl")).toBeInTheDocument();
    expect(screen.getByText("Pull Up")).toBeInTheDocument();
  });

  it("shows 'Add Exercise' button that reveals a form", () => {
    renderExerciseManager();

    const addButton = screen.getByRole("button", { name: /add exercise/i });
    expect(addButton).toBeInTheDocument();

    // Form should not be visible initially
    expect(
      screen.queryByPlaceholderText(/exercise name/i),
    ).not.toBeInTheDocument();

    // Click to reveal form
    fireEvent.click(addButton);

    // Form should now be visible
    expect(screen.getByPlaceholderText(/exercise name/i)).toBeInTheDocument();
  });

  it("add form has name and category fields", () => {
    renderExerciseManager();

    fireEvent.click(screen.getByRole("button", { name: /add exercise/i }));

    expect(screen.getByPlaceholderText(/exercise name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument();
  });

  it("submitting the form with name adds an exercise", async () => {
    renderExerciseManager();

    fireEvent.click(screen.getByRole("button", { name: /add exercise/i }));

    const nameInput = screen.getByPlaceholderText(/exercise name/i);
    const categoryInput = screen.getByPlaceholderText(/category/i);

    fireEvent.input(nameInput, { target: { value: "Deadlift" } });
    fireEvent.input(categoryInput, { target: { value: "Back" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Deadlift")).toBeInTheDocument();
    });
  });

  it("each exercise has an edit and delete button", () => {
    seedExercises();
    renderExerciseManager();

    // There should be edit and delete buttons for each exercise
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    expect(editButtons.length).toBe(5);
    expect(deleteButtons.length).toBe(5);
  });

  it("clicking delete removes the exercise (with confirmation)", async () => {
    seedExercises();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderExerciseManager();

    expect(screen.getByText("Bench Press")).toBeInTheDocument();

    // Find the delete button for Bench Press (first delete button)
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith("Delete this exercise?");

    await waitFor(() => {
      expect(screen.queryByText("Bench Press")).not.toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("shows empty state when no exercises exist", () => {
    renderExerciseManager();

    expect(screen.getByText(/no exercises/i)).toBeInTheDocument();
  });
});

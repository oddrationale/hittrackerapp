import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocationProvider } from "preact-iso";
import {
  RoutineManager,
  resetRoutineManager,
} from "../../../src/components/settings/routine-manager.tsx";
import { routines } from "../../../src/stores/routine-store.ts";
import { exercises } from "../../../src/stores/exercise-store.ts";
import type { Exercise } from "../../../src/types/index.ts";
import type { Routine } from "../../../src/types/index.ts";

function renderRoutineManager() {
  return render(
    <LocationProvider>
      <RoutineManager />
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

function seedRoutines(): Routine[] {
  const seeded: Routine[] = [
    {
      id: "rt-1",
      name: "Upper Body",
      exerciseIds: ["ex-1", "ex-2", "ex-5"],
      lastModified: Date.now(),
    },
    {
      id: "rt-2",
      name: "Lower Body",
      exerciseIds: ["ex-3", "ex-4"],
      lastModified: Date.now(),
    },
  ];
  routines.value = seeded;
  return seeded;
}

describe("RoutineManager", () => {
  beforeEach(() => {
    exercises.value = [];
    routines.value = [];
    resetRoutineManager();
  });

  it("lists all routines with their exercise counts", () => {
    seedExercises();
    seedRoutines();
    renderRoutineManager();

    expect(screen.getByText("Upper Body")).toBeInTheDocument();
    expect(screen.getByText(/3 exercises/i)).toBeInTheDocument();

    expect(screen.getByText("Lower Body")).toBeInTheDocument();
    expect(screen.getByText(/2 exercises/i)).toBeInTheDocument();
  });

  it("shows 'Add Routine' button that reveals a form", () => {
    seedExercises();
    renderRoutineManager();

    const addButton = screen.getByRole("button", { name: /add routine/i });
    expect(addButton).toBeInTheDocument();

    // Form should not be visible initially
    expect(
      screen.queryByPlaceholderText(/routine name/i),
    ).not.toBeInTheDocument();

    // Click to reveal form
    fireEvent.click(addButton);

    // Form should now be visible
    expect(screen.getByPlaceholderText(/routine name/i)).toBeInTheDocument();
  });

  it("form has name field and exercise selection (checkboxes from exercise library)", () => {
    seedExercises();
    renderRoutineManager();

    fireEvent.click(screen.getByRole("button", { name: /add routine/i }));

    // Name field
    expect(screen.getByPlaceholderText(/routine name/i)).toBeInTheDocument();

    // Exercise checkboxes - each exercise should appear as a checkbox option
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(5);

    // Exercise names should be visible as labels
    expect(screen.getByLabelText("Bench Press")).toBeInTheDocument();
    expect(screen.getByLabelText("Incline Press")).toBeInTheDocument();
    expect(screen.getByLabelText("Squat")).toBeInTheDocument();
    expect(screen.getByLabelText("Leg Curl")).toBeInTheDocument();
    expect(screen.getByLabelText("Pull Up")).toBeInTheDocument();
  });

  it("submitting the form creates a routine", async () => {
    seedExercises();
    renderRoutineManager();

    fireEvent.click(screen.getByRole("button", { name: /add routine/i }));

    const nameInput = screen.getByPlaceholderText(/routine name/i);
    fireEvent.input(nameInput, { target: { value: "Full Body" } });

    // Select some exercises
    fireEvent.click(screen.getByLabelText("Bench Press"));
    fireEvent.click(screen.getByLabelText("Squat"));

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Full Body")).toBeInTheDocument();
      expect(screen.getByText(/2 exercises/i)).toBeInTheDocument();
    });
  });

  it("each routine has edit and delete buttons", () => {
    seedExercises();
    seedRoutines();
    renderRoutineManager();

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);
  });

  it("clicking delete removes the routine (with confirmation)", async () => {
    seedExercises();
    seedRoutines();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderRoutineManager();

    expect(screen.getByText("Upper Body")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith("Delete this routine?");

    await waitFor(() => {
      expect(screen.queryByText("Upper Body")).not.toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("shows empty state when no routines exist", () => {
    renderRoutineManager();

    expect(screen.getByText(/no routines/i)).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ExercisePicker } from "../../../src/components/workout/exercise-picker.tsx";
import { exercises } from "../../../src/stores/exercise-store.ts";
import type { Exercise } from "../../../src/types/index.ts";

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

describe("ExercisePicker", () => {
  beforeEach(() => {
    exercises.value = [];
  });

  it("shows list of exercises grouped by category", () => {
    seedExercises();
    const onSelect = vi.fn();
    render(<ExercisePicker onSelect={onSelect} />);

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

  it("selecting an exercise calls onSelect callback with the exercise", () => {
    const seeded = seedExercises();
    const onSelect = vi.fn();
    render(<ExercisePicker onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Squat"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(seeded[2]);
  });

  it("search input filters exercises by name", () => {
    seedExercises();
    const onSelect = vi.fn();
    render(<ExercisePicker onSelect={onSelect} />);

    const searchInput = screen.getByPlaceholderText(/search exercises/i);
    fireEvent.input(searchInput, { target: { value: "press" } });

    // Matching exercises should be visible
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Incline Press")).toBeInTheDocument();

    // Non-matching exercises should not be visible
    expect(screen.queryByText("Squat")).not.toBeInTheDocument();
    expect(screen.queryByText("Leg Curl")).not.toBeInTheDocument();
    expect(screen.queryByText("Pull Up")).not.toBeInTheDocument();
  });

  it("shows 'No exercises found' when search has no results", () => {
    seedExercises();
    const onSelect = vi.fn();
    render(<ExercisePicker onSelect={onSelect} />);

    const searchInput = screen.getByPlaceholderText(/search exercises/i);
    fireEvent.input(searchInput, { target: { value: "zzzzz" } });

    expect(screen.getByText("No exercises found")).toBeInTheDocument();
  });
});

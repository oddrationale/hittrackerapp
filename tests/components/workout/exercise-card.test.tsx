import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi } from "vitest";

// Mock ExerciseTimer to simplify testing the form logic
vi.mock("../../../src/components/timer/exercise-timer.tsx", () => ({
  ExerciseTimer: ({ onComplete }: { onComplete: (tul: number) => void }) => (
    <button onClick={() => onComplete(90)}>Mock Timer Complete</button>
  ),
}));

import { ExerciseCard } from "../../../src/components/workout/exercise-card.tsx";

describe("ExerciseCard", () => {
  const defaultProps = {
    exerciseId: "ex-1",
    exerciseName: "Chest Press",
    onSave: vi.fn(),
  };

  it("shows exercise name", () => {
    render(<ExerciseCard {...defaultProps} />);

    expect(screen.getByText("Chest Press")).toBeInTheDocument();
  });

  it("shows ExerciseTimer initially (before timer stops)", () => {
    render(<ExerciseCard {...defaultProps} />);

    // The mocked timer renders a button with "Mock Timer Complete"
    expect(screen.getByText("Mock Timer Complete")).toBeInTheDocument();

    // The logging form should NOT be visible yet
    expect(screen.queryByText("Save & Next")).not.toBeInTheDocument();
  });

  it("after timer completes (onTimerComplete called), shows the logging form", () => {
    render(<ExerciseCard {...defaultProps} />);

    // Simulate timer completing with 90 seconds TUL
    fireEvent.click(screen.getByText("Mock Timer Complete"));

    // Timer should be gone, form should appear
    expect(screen.queryByText("Mock Timer Complete")).not.toBeInTheDocument();
    expect(screen.getByText("Save & Next")).toBeInTheDocument();
  });

  it("logging form has weight input, TUL display, optional reps input, optional notes textarea", () => {
    render(<ExerciseCard {...defaultProps} />);

    // Complete the timer
    fireEvent.click(screen.getByText("Mock Timer Complete"));

    // TUL display (90 seconds = 1:30)
    expect(screen.getByText("Time Under Load")).toBeInTheDocument();
    expect(screen.getByText("1:30")).toBeInTheDocument();

    // Weight input
    expect(screen.getByText("Weight")).toBeInTheDocument();
    const weightInput = screen.getByPlaceholderText("0");
    expect(weightInput).toBeInTheDocument();
    expect(weightInput).toHaveAttribute("type", "number");

    // Reps input (optional)
    expect(screen.getByText("Reps (optional)")).toBeInTheDocument();
    const repsInput = screen.getByPlaceholderText("Optional");
    expect(repsInput).toBeInTheDocument();
    expect(repsInput).toHaveAttribute("type", "number");

    // Notes textarea (optional)
    expect(screen.getByText("Notes (optional)")).toBeInTheDocument();
    const notesTextarea = screen.getByPlaceholderText(
      "Seat position, machine config...",
    );
    expect(notesTextarea).toBeInTheDocument();
    expect(notesTextarea.tagName.toLowerCase()).toBe("textarea");
  });

  it("shows weight direction selector", () => {
    render(<ExerciseCard {...defaultProps} />);

    // Complete the timer
    fireEvent.click(screen.getByText("Mock Timer Complete"));

    // Weight direction selector should be visible with all three options
    expect(screen.getByText("Increase")).toBeInTheDocument();
    expect(screen.getByText("Maintain")).toBeInTheDocument();
    expect(screen.getByText("Decrease")).toBeInTheDocument();
  });

  it("'Save & Next' button calls onSave with the exercise log data", () => {
    const onSave = vi.fn();
    render(
      <ExerciseCard {...defaultProps} onSave={onSave} defaultWeight={100} />,
    );

    // Complete the timer (TUL = 90 seconds)
    fireEvent.click(screen.getByText("Mock Timer Complete"));

    // Fill in reps
    const repsInput = screen.getByPlaceholderText("Optional");
    fireEvent.input(repsInput, { target: { value: "8" } });

    // Fill in notes
    const notesTextarea = screen.getByPlaceholderText(
      "Seat position, machine config...",
    );
    fireEvent.input(notesTextarea, { target: { value: "Seat 5" } });

    // Click "Increase" weight direction
    fireEvent.click(screen.getByText("Increase"));

    // Click Save & Next
    fireEvent.click(screen.getByText("Save & Next"));

    expect(onSave).toHaveBeenCalledWith({
      exerciseId: "ex-1",
      weight: 100,
      tul: 90,
      reps: 8,
      notes: "Seat 5",
      weightDirection: "increase",
    });
  });

  it("default weight direction is 'maintain'", () => {
    const onSave = vi.fn();
    render(<ExerciseCard {...defaultProps} onSave={onSave} />);

    // Complete the timer
    fireEvent.click(screen.getByText("Mock Timer Complete"));

    // Click Save & Next without changing direction
    fireEvent.click(screen.getByText("Save & Next"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        weightDirection: "maintain",
      }),
    );
  });
});

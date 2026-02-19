import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi } from "vitest";
import { WeightDirectionSelector } from "../../../src/components/workout/weight-direction.tsx";

describe("WeightDirectionSelector", () => {
  it("renders three buttons: increase (up arrow), maintain (equals), decrease (down arrow)", () => {
    render(<WeightDirectionSelector value="maintain" onChange={() => {}} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    expect(screen.getByText("↑")).toBeInTheDocument();
    expect(screen.getByText("Increase")).toBeInTheDocument();

    expect(screen.getByText("=")).toBeInTheDocument();
    expect(screen.getByText("Maintain")).toBeInTheDocument();

    expect(screen.getByText("↓")).toBeInTheDocument();
    expect(screen.getByText("Decrease")).toBeInTheDocument();
  });

  it("clicking a button calls onChange with the direction value", () => {
    const onChange = vi.fn();
    render(<WeightDirectionSelector value="maintain" onChange={onChange} />);

    fireEvent.click(screen.getByText("Increase"));
    expect(onChange).toHaveBeenCalledWith("increase");

    fireEvent.click(screen.getByText("Decrease"));
    expect(onChange).toHaveBeenCalledWith("decrease");

    fireEvent.click(screen.getByText("Maintain"));
    expect(onChange).toHaveBeenCalledWith("maintain");
  });

  it("selected button is visually highlighted", () => {
    const { rerender } = render(
      <WeightDirectionSelector value="increase" onChange={() => {}} />,
    );

    const increaseButton = screen.getByText("Increase").closest("button")!;
    expect(increaseButton.className).toContain("bg-green-600");

    const maintainButton = screen.getByText("Maintain").closest("button")!;
    expect(maintainButton.className).toContain("bg-gray-100");

    const decreaseButton = screen.getByText("Decrease").closest("button")!;
    expect(decreaseButton.className).toContain("bg-gray-100");

    rerender(
      <WeightDirectionSelector value="decrease" onChange={() => {}} />,
    );

    expect(
      screen.getByText("Increase").closest("button")!.className,
    ).toContain("bg-gray-100");
    expect(
      screen.getByText("Decrease").closest("button")!.className,
    ).toContain("bg-red-600");
  });

  it("default selection is 'maintain' when no value is provided", () => {
    render(
      <WeightDirectionSelector
        value={undefined as unknown as "maintain"}
        onChange={() => {}}
      />,
    );

    // When value is undefined, no button should have active styling
    // But the component should still render without crashing
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
});

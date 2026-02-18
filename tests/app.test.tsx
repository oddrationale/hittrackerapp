import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect } from "vitest";
import { App } from "../src/app";

describe("App", () => {
  it("renders hello world heading", () => {
    render(<App />);
    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });

  it("increments count on button click", () => {
    render(<App />);
    const button = screen.getByText("Increment");
    fireEvent.click(button);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

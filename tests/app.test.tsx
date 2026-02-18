import { render, screen } from "@testing-library/preact";
import { describe, it, expect } from "vitest";
import { LocationProvider } from "preact-iso";
import { App } from "../src/app.tsx";

describe("App", () => {
  it("renders the tab bar navigation", () => {
    render(
      <LocationProvider>
        <App />
      </LocationProvider>,
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Workout" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "History" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stats" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();
  });
});

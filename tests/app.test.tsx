import { render, screen, waitFor } from "@testing-library/preact";
import { describe, it, expect, beforeEach } from "vitest";
import { LocationProvider } from "preact-iso";
import { App, resetLoading } from "../src/app.tsx";
import { db } from "../src/db/database.ts";

describe("App", () => {
  beforeEach(async () => {
    resetLoading();
    await db.exercises.clear();
    await db.routines.clear();
    await db.workouts.clear();
    await db.settings.clear();
  });

  it("shows loading state initially", () => {
    render(
      <LocationProvider>
        <App />
      </LocationProvider>,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the tab bar navigation after loading", async () => {
    render(
      <LocationProvider>
        <App />
      </LocationProvider>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Workout" }),
      ).toBeInTheDocument();
    });
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "History" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stats" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Settings" }),
    ).toBeInTheDocument();
  });
});

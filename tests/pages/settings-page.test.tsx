import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, beforeEach } from "vitest";
import { LocationProvider } from "preact-iso";
import { SettingsPage } from "../../src/pages/settings-page.tsx";
import { settings } from "../../src/stores/settings-store.ts";

function renderSettingsPage() {
  return render(
    <LocationProvider>
      <SettingsPage />
    </LocationProvider>,
  );
}

describe("SettingsPage", () => {
  beforeEach(() => {
    settings.value = {
      weightUnit: "lbs",
      metronomeEnabled: false,
      countdownDuration: 3,
    };
  });

  it("renders weight unit toggle showing current value 'lbs'", () => {
    renderSettingsPage();
    const lbsButton = screen.getByRole("button", { name: "lbs" });
    const kgButton = screen.getByRole("button", { name: "kg" });
    expect(lbsButton).toBeInTheDocument();
    expect(kgButton).toBeInTheDocument();
  });

  it("renders weight unit toggle showing current value 'kg' when set", () => {
    settings.value = { ...settings.value, weightUnit: "kg" };
    renderSettingsPage();
    expect(screen.getByRole("button", { name: "kg" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "lbs" })).toBeInTheDocument();
  });

  it("renders metronome toggle (off by default)", () => {
    renderSettingsPage();
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("renders metronome toggle (on when enabled)", () => {
    settings.value = { ...settings.value, metronomeEnabled: true };
    renderSettingsPage();
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("renders countdown duration display", () => {
    renderSettingsPage();
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("3");
  });

  it("renders navigation link to 'Manage Exercises'", () => {
    renderSettingsPage();
    const link = screen.getByRole("link", { name: /manage exercises/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/settings/exercises");
  });

  it("renders navigation link to 'Manage Routines'", () => {
    renderSettingsPage();
    const link = screen.getByRole("link", { name: /manage routines/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/settings/routines");
  });

  it("renders 'Export Data' and 'Import Data' buttons", () => {
    renderSettingsPage();
    expect(
      screen.getByRole("button", { name: "Export Data" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Import Data" }),
    ).toBeInTheDocument();
  });

  it("toggling weight unit to 'kg' calls updateSettings", () => {
    renderSettingsPage();
    fireEvent.click(screen.getByRole("button", { name: "kg" }));
    expect(settings.value.weightUnit).toBe("kg");
  });

  it("toggling weight unit to 'lbs' calls updateSettings", () => {
    settings.value = { ...settings.value, weightUnit: "kg" };
    renderSettingsPage();
    fireEvent.click(screen.getByRole("button", { name: "lbs" }));
    expect(settings.value.weightUnit).toBe("lbs");
  });
});

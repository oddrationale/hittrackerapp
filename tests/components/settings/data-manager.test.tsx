import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  DataManager,
  resetDataManager,
} from "../../../src/components/settings/data-manager.tsx";
import type { ExportData } from "../../../src/types/index.ts";

const mockExportData = vi.fn<() => Promise<ExportData>>();
const mockDownloadExport = vi.fn();
const mockImportData =
  vi.fn<
    (
      data: ExportData,
    ) => Promise<{ added: number; updated: number; skipped: number }>
  >();
const mockParseImportFile = vi.fn<(file: File) => Promise<ExportData>>();

vi.mock("../../../src/utils/export.ts", () => ({
  exportData: (...args: unknown[]) => mockExportData(...(args as [])),
  downloadExport: (...args: unknown[]) => mockDownloadExport(...(args as [])),
  importData: (...args: unknown[]) => mockImportData(...(args as [ExportData])),
  parseImportFile: (...args: unknown[]) =>
    mockParseImportFile(...(args as [File])),
}));

const fakeExport: ExportData = {
  schemaVersion: 1,
  exercises: [],
  routines: [],
  workouts: [],
  settings: {
    weightUnit: "lbs",
    metronomeEnabled: false,
    countdownDuration: 3,
  },
};

describe("DataManager", () => {
  beforeEach(() => {
    resetDataManager();
    vi.clearAllMocks();
  });

  it("renders 'Export Data' button", () => {
    render(<DataManager />);
    expect(
      screen.getByRole("button", { name: /export data/i }),
    ).toBeInTheDocument();
  });

  it("renders 'Import Data' button", () => {
    render(<DataManager />);
    expect(
      screen.getByRole("button", { name: /import data/i }),
    ).toBeInTheDocument();
  });

  it("clicking 'Export Data' triggers the export flow", async () => {
    mockExportData.mockResolvedValue(fakeExport);

    render(<DataManager />);
    const exportButton = screen.getByRole("button", { name: /export data/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockExportData).toHaveBeenCalledOnce();
    });
    expect(mockDownloadExport).toHaveBeenCalledWith(fakeExport);
  });

  it("after a successful import, shows summary (X added, Y updated, Z skipped)", async () => {
    const result = { added: 3, updated: 2, skipped: 1 };
    mockParseImportFile.mockResolvedValue(fakeExport);
    mockImportData.mockResolvedValue(result);

    // Intercept document.createElement to capture the file input
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === "input") {
        // Simulate a file being selected after click
        el.click = () => {
          // Define files property
          Object.defineProperty(el, "files", {
            value: [
              new File(["{}"], "export.json", { type: "application/json" }),
            ],
          });
          // Trigger onchange
          if ((el as HTMLInputElement).onchange) {
            (el as HTMLInputElement).onchange!(new Event("change"));
          }
        };
      }
      return el;
    });

    render(<DataManager />);
    const importButton = screen.getByRole("button", { name: /import data/i });
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/3 added/)).toBeInTheDocument();
    });
    expect(screen.getByText(/2 updated/)).toBeInTheDocument();
    expect(screen.getByText(/1 skipped/)).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it("import error shows error message", async () => {
    mockParseImportFile.mockRejectedValue(new Error("Invalid file format"));

    // Intercept document.createElement to capture the file input
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === "input") {
        el.click = () => {
          Object.defineProperty(el, "files", {
            value: [new File(["{}"], "bad.json", { type: "application/json" })],
          });
          if ((el as HTMLInputElement).onchange) {
            (el as HTMLInputElement).onchange!(new Event("change"));
          }
        };
      }
      return el;
    });

    render(<DataManager />);
    const importButton = screen.getByRole("button", { name: /import data/i });
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid file format/i)).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });
});

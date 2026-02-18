import { signal } from "@preact/signals";
import {
  exportData,
  downloadExport,
  importData,
  parseImportFile,
} from "../../utils/export.ts";

const importResult = signal<{
  added: number;
  updated: number;
  skipped: number;
} | null>(null);
const importError = signal<string | null>(null);
const isExporting = signal(false);
const isImporting = signal(false);

export function resetDataManager() {
  importResult.value = null;
  importError.value = null;
  isExporting.value = false;
  isImporting.value = false;
}

export function DataManager() {
  async function handleExport() {
    isExporting.value = true;
    try {
      const data = await exportData();
      downloadExport(data);
    } finally {
      isExporting.value = false;
    }
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      isImporting.value = true;
      importError.value = null;
      importResult.value = null;
      try {
        const data = await parseImportFile(file);
        const result = await importData(data);
        importResult.value = result;
      } catch (e) {
        importError.value = e instanceof Error ? e.message : "Import failed";
      } finally {
        isImporting.value = false;
      }
    };
    input.click();
  }

  return (
    <div class="space-y-3">
      <h2 class="text-sm font-medium text-gray-700">Data</h2>
      <div class="flex gap-2">
        <button
          onClick={handleExport}
          disabled={isExporting.value}
          class="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700"
        >
          {isExporting.value ? "Exporting..." : "Export Data"}
        </button>
        <button
          onClick={handleImport}
          disabled={isImporting.value}
          class="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700"
        >
          {isImporting.value ? "Importing..." : "Import Data"}
        </button>
      </div>
      {importResult.value && (
        <div class="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Import complete: {importResult.value.added} added,{" "}
          {importResult.value.updated} updated,{" "}
          {importResult.value.skipped} skipped
        </div>
      )}
      {importError.value && (
        <div class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Error: {importError.value}
        </div>
      )}
    </div>
  );
}

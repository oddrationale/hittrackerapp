# HIT Tracker App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile-first, offline-first PWA for tracking High-Intensity Training (HIT) workouts with Time-Under-Load as the primary metric.

**Architecture:** Signal-centric state management with `@preact/signals` as runtime source of truth and Dexie.js (IndexedDB) as the persistence layer. Preact + TypeScript + Tailwind CSS 4. Routing via preact-iso. Charts via Chart.js. PWA via vite-plugin-pwa.

**Tech Stack:** Preact, @preact/signals, Dexie.js, preact-iso, Chart.js, vite-plugin-pwa, Web Audio API, Tailwind CSS 4, Vitest

**Key Preact conventions:** Use `class` not `className` in JSX. Access signals with `.value` in code, direct reference in JSX. Use `/preact-signals` skill for all state management work.

---

## Phase 1: Foundation

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install production dependencies**

Run:
```bash
pnpm add dexie preact-iso chart.js
```

**Step 2: Install dev dependencies**

Run:
```bash
pnpm add -D vite-plugin-pwa fake-indexeddb
```

`fake-indexeddb` provides an in-memory IndexedDB for testing Dexie in jsdom.

**Step 3: Update test setup to include fake-indexeddb**

Modify: `tests/test-setup.ts`

Add at the top:
```typescript
import "fake-indexeddb/auto";
```

This must be the first import so IndexedDB is available before any Dexie code runs.

**Step 4: Verify everything installs cleanly**

Run: `pnpm typecheck && pnpm test`
Expected: PASS (existing tests still pass)

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml tests/test-setup.ts
git commit -m "feat: add dexie, preact-iso, chart.js, and vite-plugin-pwa dependencies"
```

---

### Task 2: Define TypeScript Types

**Files:**
- Create: `src/types/index.ts`
- Test: `tests/types.test.ts`

**Step 1: Write the test**

```typescript
// tests/types.test.ts
import { describe, it, expect } from "vitest";
import type {
  Exercise,
  Routine,
  ExerciseLog,
  Workout,
  UserSettings,
  WeightDirection,
  ExportData,
} from "../src/types/index.ts";

describe("Types", () => {
  it("creates a valid Exercise", () => {
    const exercise: Exercise = {
      id: "ex-1",
      name: "Chest Press",
      category: "Upper Body Push",
      notes: "Seat position 5",
      lastModified: Date.now(),
    };
    expect(exercise.id).toBe("ex-1");
    expect(exercise.name).toBe("Chest Press");
  });

  it("creates a valid Routine", () => {
    const routine: Routine = {
      id: "rt-1",
      name: "Big 5",
      exerciseIds: ["ex-1", "ex-2", "ex-3"],
      lastModified: Date.now(),
    };
    expect(routine.exerciseIds).toHaveLength(3);
  });

  it("creates a valid ExerciseLog", () => {
    const log: ExerciseLog = {
      id: "log-1",
      exerciseId: "ex-1",
      weight: 150,
      tul: 90,
      reps: 8,
      notes: "Seat 5, felt strong",
      weightDirection: "increase",
    };
    expect(log.tul).toBe(90);
    expect(log.weightDirection).toBe("increase");
  });

  it("creates a valid Workout", () => {
    const workout: Workout = {
      id: "wk-1",
      date: "2026-02-18",
      startTime: Date.now(),
      exerciseLogs: [],
      totalTul: 0,
      totalTime: 0,
      tulRatio: 0,
      lastModified: Date.now(),
    };
    expect(workout.exerciseLogs).toHaveLength(0);
  });

  it("creates valid UserSettings", () => {
    const settings: UserSettings = {
      weightUnit: "lbs",
      metronomeEnabled: true,
      countdownDuration: 3,
    };
    expect(settings.weightUnit).toBe("lbs");
  });

  it("creates valid ExportData", () => {
    const data: ExportData = {
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
    expect(data.schemaVersion).toBe(1);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/types.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement the types**

```typescript
// src/types/index.ts
export type WeightDirection = "increase" | "decrease" | "maintain";
export type WeightUnit = "lbs" | "kg";
export type TimerPhase = "idle" | "countdown" | "running" | "stopped";

export interface Exercise {
  id: string;
  name: string;
  category?: string;
  notes?: string;
  lastModified: number;
}

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
  lastModified: number;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  weight: number;
  tul: number; // seconds
  reps?: number;
  notes?: string;
  weightDirection: WeightDirection;
}

export interface Workout {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  startTime: number; // Unix timestamp ms
  endTime?: number; // Unix timestamp ms
  routineId?: string; // undefined for freeform
  exerciseLogs: ExerciseLog[];
  totalTul: number; // sum of exercise TULs in seconds
  totalTime: number; // endTime - startTime in seconds
  tulRatio: number; // totalTul / totalTime
  lastModified: number;
}

export interface UserSettings {
  weightUnit: WeightUnit;
  metronomeEnabled: boolean;
  countdownDuration: number; // seconds, default 3
}

export interface ExportData {
  schemaVersion: number;
  exercises: Exercise[];
  routines: Routine[];
  workouts: Workout[];
  settings: UserSettings;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/types.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/types/index.ts tests/types.test.ts
git commit -m "feat: define TypeScript types for HIT tracker data model"
```

---

### Task 3: Dexie Database Setup

**Files:**
- Create: `src/db/database.ts`
- Create: `src/db/seed.ts`
- Test: `tests/db/database.test.ts`

**Step 1: Write the test**

```typescript
// tests/db/database.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/db/database.ts";
import type { Exercise, Routine, Workout } from "../../src/types/index.ts";

describe("Database", () => {
  beforeEach(async () => {
    // Clear all tables before each test
    await db.exercises.clear();
    await db.routines.clear();
    await db.workouts.clear();
    await db.settings.clear();
  });

  it("adds and retrieves an exercise", async () => {
    const exercise: Exercise = {
      id: "ex-1",
      name: "Chest Press",
      lastModified: Date.now(),
    };
    await db.exercises.add(exercise);
    const result = await db.exercises.get("ex-1");
    expect(result?.name).toBe("Chest Press");
  });

  it("adds and retrieves a routine", async () => {
    const routine: Routine = {
      id: "rt-1",
      name: "Big 5",
      exerciseIds: ["ex-1", "ex-2"],
      lastModified: Date.now(),
    };
    await db.routines.add(routine);
    const result = await db.routines.get("rt-1");
    expect(result?.exerciseIds).toHaveLength(2);
  });

  it("adds and retrieves a workout", async () => {
    const workout: Workout = {
      id: "wk-1",
      date: "2026-02-18",
      startTime: Date.now(),
      exerciseLogs: [],
      totalTul: 0,
      totalTime: 0,
      tulRatio: 0,
      lastModified: Date.now(),
    };
    await db.workouts.add(workout);
    const result = await db.workouts.get("wk-1");
    expect(result?.date).toBe("2026-02-18");
  });

  it("queries workouts by date", async () => {
    const now = Date.now();
    await db.workouts.bulkAdd([
      { id: "wk-1", date: "2026-02-15", startTime: now, exerciseLogs: [], totalTul: 0, totalTime: 0, tulRatio: 0, lastModified: now },
      { id: "wk-2", date: "2026-02-18", startTime: now, exerciseLogs: [], totalTul: 0, totalTime: 0, tulRatio: 0, lastModified: now },
    ]);
    const results = await db.workouts.where("date").equals("2026-02-18").toArray();
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("wk-2");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/db/database.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement the database**

```typescript
// src/db/database.ts
import Dexie from "dexie";
import type { Exercise, Routine, Workout, UserSettings } from "../types/index.ts";

export class HitTrackerDB extends Dexie {
  exercises!: Dexie.Table<Exercise, string>;
  routines!: Dexie.Table<Routine, string>;
  workouts!: Dexie.Table<Workout, string>;
  settings!: Dexie.Table<UserSettings & { id: string }, string>;

  constructor() {
    super("HitTrackerDB");
    this.version(1).stores({
      exercises: "id, name, category, lastModified",
      routines: "id, name, lastModified",
      workouts: "id, date, startTime, lastModified",
      settings: "id",
    });
  }
}

export const db = new HitTrackerDB();
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/db/database.test.ts`
Expected: PASS

**Step 5: Create seed data for common HIT exercises**

```typescript
// src/db/seed.ts
import { db } from "./database.ts";
import type { Exercise } from "../types/index.ts";

const DEFAULT_EXERCISES: Exercise[] = [
  { id: "ex-chest-press", name: "Chest Press", category: "Upper Body Push", lastModified: 0 },
  { id: "ex-overhead-press", name: "Overhead Press", category: "Upper Body Push", lastModified: 0 },
  { id: "ex-seated-row", name: "Seated Row", category: "Upper Body Pull", lastModified: 0 },
  { id: "ex-pulldown", name: "Pulldown", category: "Upper Body Pull", lastModified: 0 },
  { id: "ex-leg-press", name: "Leg Press", category: "Lower Body", lastModified: 0 },
  { id: "ex-leg-curl", name: "Leg Curl", category: "Lower Body", lastModified: 0 },
  { id: "ex-leg-extension", name: "Leg Extension", category: "Lower Body", lastModified: 0 },
  { id: "ex-chest-fly", name: "Chest Fly", category: "Upper Body Push", lastModified: 0 },
  { id: "ex-lateral-raise", name: "Lateral Raise", category: "Upper Body Push", lastModified: 0 },
  { id: "ex-bicep-curl", name: "Bicep Curl", category: "Arms", lastModified: 0 },
  { id: "ex-tricep-extension", name: "Tricep Extension", category: "Arms", lastModified: 0 },
  { id: "ex-calf-raise", name: "Calf Raise", category: "Lower Body", lastModified: 0 },
];

export async function seedExercisesIfEmpty(): Promise<void> {
  const count = await db.exercises.count();
  if (count === 0) {
    await db.exercises.bulkAdd(DEFAULT_EXERCISES);
  }
}
```

**Step 6: Commit**

```bash
git add src/db/database.ts src/db/seed.ts tests/db/database.test.ts
git commit -m "feat: add Dexie database schema and seed data for exercises"
```

---

## Phase 2: Signal Stores

> **Skill reminder:** Use `/preact-signals` skill for all store implementations.

### Task 4: Settings Store

**Files:**
- Create: `src/stores/settings-store.ts`
- Test: `tests/stores/settings-store.test.ts`

**Step 1: Write the test**

Test that:
- `loadSettings()` returns default settings when DB is empty
- `loadSettings()` hydrates from DB when data exists
- `updateSettings()` updates the signal and persists to DB
- Default values: `weightUnit: "lbs"`, `metronomeEnabled: false`, `countdownDuration: 3`

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/stores/settings-store.test.ts`

**Step 3: Implement the store**

Pattern for all stores:
```typescript
import { signal } from "@preact/signals";
import { db } from "../db/database.ts";
import type { UserSettings } from "../types/index.ts";

const DEFAULT_SETTINGS: UserSettings = {
  weightUnit: "lbs",
  metronomeEnabled: false,
  countdownDuration: 3,
};

export const settings = signal<UserSettings>(DEFAULT_SETTINGS);

export async function loadSettings(): Promise<void> {
  const stored = await db.settings.get("user-settings");
  if (stored) {
    const { id: _, ...rest } = stored;
    settings.value = rest as UserSettings;
  }
}

export async function updateSettings(updates: Partial<UserSettings>): Promise<void> {
  settings.value = { ...settings.value, ...updates };
  await db.settings.put({ id: "user-settings", ...settings.value });
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/stores/settings-store.test.ts`

**Step 5: Commit**

```bash
git add src/stores/settings-store.ts tests/stores/settings-store.test.ts
git commit -m "feat: add settings store with Dexie persistence"
```

---

### Task 5: Exercise Store

**Files:**
- Create: `src/stores/exercise-store.ts`
- Test: `tests/stores/exercise-store.test.ts`

**Step 1: Write the test**

Test that:
- `loadExercises()` hydrates from DB (run seed first to have data)
- `addExercise(name, category?)` creates exercise with generated ID and persists
- `updateExercise(id, updates)` modifies and persists
- `deleteExercise(id)` removes from signal and DB
- `getExercisesByCategory()` groups exercises by category

**Step 2: Run test to verify it fails**

**Step 3: Implement**

Use `crypto.randomUUID()` for ID generation (available in all modern browsers and Node 19+).

The store exports:
- `exercises` signal (array)
- `loadExercises()`, `addExercise()`, `updateExercise()`, `deleteExercise()`
- `getExercisesByCategory()` — returns a computed signal grouping exercises by category

**Step 4: Run test, verify pass**

**Step 5: Commit**

```bash
git add src/stores/exercise-store.ts tests/stores/exercise-store.test.ts
git commit -m "feat: add exercise store with CRUD operations"
```

---

### Task 6: Routine Store

**Files:**
- Create: `src/stores/routine-store.ts`
- Test: `tests/stores/routine-store.test.ts`

**Step 1: Write the test**

Test that:
- `loadRoutines()` hydrates from DB
- `addRoutine(name, exerciseIds)` creates and persists
- `updateRoutine(id, updates)` modifies and persists
- `deleteRoutine(id)` removes
- `reorderExercises(routineId, exerciseIds)` updates the order

**Step 2-5: Same TDD cycle as above**

**Commit:**
```bash
git add src/stores/routine-store.ts tests/stores/routine-store.test.ts
git commit -m "feat: add routine store with CRUD and reorder operations"
```

---

### Task 7: Workout Store (Active Workout State)

**Files:**
- Create: `src/stores/workout-store.ts`
- Test: `tests/stores/workout-store.test.ts`

**Step 1: Write the test**

Test that:
- `startWorkout(routineId?)` initializes a new workout with startTime and empty exerciseLogs
- `addExerciseLog(log)` appends to exerciseLogs, updates totalTul
- `finishWorkout()` sets endTime, computes totalTime, tulRatio, persists to DB
- `cancelWorkout()` clears active workout state without persisting
- `activeWorkout` signal reflects current state
- `isWorkoutActive` computed signal returns true when a workout is in progress

Active workout signals:
- `activeWorkout` — the in-progress Workout or null
- `currentExerciseIndex` — for routine-based workouts
- `isWorkoutActive` — computed boolean

**Step 2-5: Same TDD cycle**

**Commit:**
```bash
git add src/stores/workout-store.ts tests/stores/workout-store.test.ts
git commit -m "feat: add workout store for active workout state management"
```

---

### Task 8: History Store

**Files:**
- Create: `src/stores/history-store.ts`
- Test: `tests/stores/history-store.test.ts`

**Step 1: Write the test**

Test that:
- `loadHistory()` hydrates workouts from DB sorted by date descending
- `getWorkout(id)` returns a specific workout
- `deleteWorkout(id)` removes from signal and DB
- History loads most recent workouts first

**Step 2-5: Same TDD cycle**

**Commit:**
```bash
git add src/stores/history-store.ts tests/stores/history-store.test.ts
git commit -m "feat: add history store for past workout retrieval"
```

---

## Phase 3: Navigation & Layout

### Task 9: Router and App Shell

**Files:**
- Modify: `src/app.tsx` — replace demo counter with router
- Modify: `src/main.tsx` — wrap with LocationProvider
- Create: `src/pages/workout-page.tsx` — placeholder
- Create: `src/pages/history-page.tsx` — placeholder
- Create: `src/pages/stats-page.tsx` — placeholder
- Create: `src/pages/settings-page.tsx` — placeholder
- Create: `src/pages/not-found-page.tsx` — 404 fallback
- Modify: `tests/app.test.tsx` — update for new app structure
- Test: `tests/app.test.tsx`

**Step 1: Write the test**

```typescript
// tests/app.test.tsx
import { render, screen } from "@testing-library/preact";
import { describe, it, expect } from "vitest";
import { LocationProvider } from "preact-iso";
import { App } from "../src/app.tsx";

describe("App", () => {
  it("renders the tab bar navigation", () => {
    render(
      <LocationProvider>
        <App />
      </LocationProvider>
    );
    expect(screen.getByText("Workout")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement the router**

`src/app.tsx`:
```tsx
import { Router, Route, ErrorBoundary } from "preact-iso";
import { TabBar } from "./components/layout/tab-bar.tsx";
import { WorkoutPage } from "./pages/workout-page.tsx";
import { HistoryPage } from "./pages/history-page.tsx";
import { StatsPage } from "./pages/stats-page.tsx";
import { SettingsPage } from "./pages/settings-page.tsx";
import { NotFoundPage } from "./pages/not-found-page.tsx";

export function App() {
  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      <main class="flex-1 pb-16">
        <ErrorBoundary>
          <Router>
            <Route path="/" component={WorkoutPage} />
            <Route path="/workout/active" component={WorkoutPage} />
            <Route path="/workout/summary" component={WorkoutPage} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/history/:id" component={HistoryPage} />
            <Route path="/stats" component={StatsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/settings/exercises" component={SettingsPage} />
            <Route path="/settings/routines" component={SettingsPage} />
            <Route default component={NotFoundPage} />
          </Router>
        </ErrorBoundary>
      </main>
      <TabBar />
    </div>
  );
}
```

`src/main.tsx`:
```tsx
import { render } from "preact";
import { LocationProvider } from "preact-iso";
import "./index.css";
import { App } from "./app.tsx";

render(
  <LocationProvider>
    <App />
  </LocationProvider>,
  document.getElementById("app")!,
);
```

Create placeholder pages (each exports a simple component with heading).

**Step 4: Run test, verify pass**

**Step 5: Commit**

```bash
git add src/app.tsx src/main.tsx src/pages/ src/components/layout/ tests/app.test.tsx
git commit -m "feat: add preact-iso router with page placeholders and tab bar"
```

---

### Task 10: Tab Bar Component

**Files:**
- Create: `src/components/layout/tab-bar.tsx`
- Test: `tests/components/layout/tab-bar.test.tsx`

**Step 1: Write the test**

Test that:
- Renders 4 tab links: Workout (/), History (/history), Stats (/stats), Settings (/settings)
- Active tab is visually highlighted (test by checking class or aria-current)

**Step 2-5: Same TDD cycle**

Design: Fixed bottom bar, 4 equal-width tabs, icon + label per tab. Use simple SVG icons or emoji placeholders initially. Mobile-optimized touch targets (min 44px height). Tailwind classes: `fixed bottom-0 left-0 right-0`, `bg-white border-t`, `grid grid-cols-4`.

Use `useLocation()` from preact-iso to determine the active tab.

**Commit:**
```bash
git add src/components/layout/tab-bar.tsx tests/components/layout/tab-bar.test.tsx
git commit -m "feat: add bottom tab bar navigation component"
```

---

### Task 11: Page Header Component

**Files:**
- Create: `src/components/layout/page-header.tsx`
- Test: `tests/components/layout/page-header.test.tsx`

**Step 1: Write the test**

Test that:
- Renders title text passed as prop
- Optionally renders a back button when `onBack` prop is provided

**Step 2-5: Same TDD cycle**

Design: Sticky top bar with title. Optional left back arrow. Tailwind: `sticky top-0 bg-white border-b px-4 py-3`.

**Commit:**
```bash
git add src/components/layout/page-header.tsx tests/components/layout/page-header.test.tsx
git commit -m "feat: add page header component with optional back button"
```

---

### Task 12: Initialize App Data on Load

**Files:**
- Modify: `src/app.tsx` — add data loading on mount
- Test: `tests/app.test.tsx` — verify loading state

**Step 1: Write the test**

Test that the app calls `loadSettings`, `loadExercises`, `loadRoutines`, `loadHistory` on mount. Use vitest mocking to verify the store load functions are called.

**Step 2-5: Same TDD cycle**

In `App`, use Preact's `useEffect` (from `preact/hooks`) to call all store load functions on mount. Show a loading state while hydrating.

```typescript
import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { loadSettings } from "./stores/settings-store.ts";
import { loadExercises } from "./stores/exercise-store.ts";
import { loadRoutines } from "./stores/routine-store.ts";
import { loadHistory } from "./stores/history-store.ts";
import { seedExercisesIfEmpty } from "./db/seed.ts";

const isLoading = signal(true);

async function initializeApp() {
  await seedExercisesIfEmpty();
  await Promise.all([loadSettings(), loadExercises(), loadRoutines(), loadHistory()]);
  isLoading.value = false;
}
```

**Commit:**
```bash
git add src/app.tsx tests/app.test.tsx
git commit -m "feat: initialize stores from database on app load"
```

---

## Phase 4: Settings & Data Management

### Task 13: Settings Page

**Files:**
- Modify: `src/pages/settings-page.tsx`
- Test: `tests/pages/settings-page.test.tsx`

**Step 1: Write the test**

Test that:
- Renders weight unit toggle (lbs/kg)
- Renders metronome toggle (on/off)
- Renders countdown duration input
- Renders navigation links to "Manage Exercises" and "Manage Routines"
- Renders "Export Data" and "Import Data" buttons
- Toggling weight unit calls `updateSettings`

**Step 2-5: Same TDD cycle**

Design: Card-based layout. Toggle switches for boolean settings. Number input for countdown. Navigation links as list items with chevron icons.

**Commit:**
```bash
git add src/pages/settings-page.tsx tests/pages/settings-page.test.tsx
git commit -m "feat: add settings page with user preferences and navigation"
```

---

### Task 14: Exercise Manager

**Files:**
- Create: `src/components/settings/exercise-manager.tsx`
- Test: `tests/components/settings/exercise-manager.test.tsx`

**Step 1: Write the test**

Test that:
- Lists all exercises grouped by category
- "Add Exercise" button opens a form with name and category fields
- Submitting the form calls `addExercise`
- Each exercise has edit and delete buttons
- Editing pre-fills the form and calls `updateExercise`
- Delete calls `deleteExercise` (with confirmation)

**Step 2-5: Same TDD cycle**

Design: Searchable list with category headers. Inline add/edit form. Swipe-to-delete or delete icon button.

**Commit:**
```bash
git add src/components/settings/exercise-manager.tsx tests/components/settings/exercise-manager.test.tsx
git commit -m "feat: add exercise manager with CRUD operations"
```

---

### Task 15: Routine Manager

**Files:**
- Create: `src/components/settings/routine-manager.tsx`
- Test: `tests/components/settings/routine-manager.test.tsx`

**Step 1: Write the test**

Test that:
- Lists all routines
- "Add Routine" opens form with name field and exercise picker (multi-select)
- Submitting creates a routine
- Each routine shows exercise count and has edit/delete buttons
- Edit allows reordering exercises (drag or up/down buttons)

**Step 2-5: Same TDD cycle**

**Commit:**
```bash
git add src/components/settings/routine-manager.tsx tests/components/settings/routine-manager.test.tsx
git commit -m "feat: add routine manager with CRUD and exercise ordering"
```

---

### Task 16: Import/Export

**Files:**
- Create: `src/utils/export.ts`
- Test: `tests/utils/export.test.ts`

**Step 1: Write the test**

Test that:
- `exportData()` returns an ExportData object with schemaVersion 1 and all tables
- `importData(data)` validates schema version
- `importData` merges by ID: newer `lastModified` wins, new records are added
- `importData` does not overwrite records with older `lastModified`
- Invalid schema version throws an error
- `downloadExport()` creates a JSON file download (mock the DOM parts)

**Step 2-5: Same TDD cycle**

```typescript
// src/utils/export.ts
export async function exportData(): Promise<ExportData> { ... }
export async function importData(data: ExportData): Promise<{ added: number; updated: number; skipped: number }> { ... }
export function downloadExport(data: ExportData): void { ... } // Creates blob URL and triggers download
export function parseImportFile(file: File): Promise<ExportData> { ... } // Reads and validates JSON file
```

**Commit:**
```bash
git add src/utils/export.ts tests/utils/export.test.ts
git commit -m "feat: add JSON import/export with last-write-wins merge strategy"
```

---

### Task 17: Data Manager UI

**Files:**
- Create: `src/components/settings/data-manager.tsx`
- Test: `tests/components/settings/data-manager.test.tsx`

**Step 1: Write the test**

Test that:
- "Export Data" button triggers download
- "Import Data" button opens file picker
- After import, shows summary (X added, Y updated, Z skipped)
- Import error shows error message

**Step 2-5: Same TDD cycle**

**Commit:**
```bash
git add src/components/settings/data-manager.tsx tests/components/settings/data-manager.test.tsx
git commit -m "feat: add data manager UI for import/export"
```

---

## Phase 5: Workout Core

### Task 18: Audio Utility (Metronome)

**Files:**
- Create: `src/utils/audio.ts`
- Test: `tests/utils/audio.test.ts`

**Step 1: Write the test**

Test that:
- `createMetronome()` returns an object with `start()`, `stop()`, `isPlaying` methods
- Starting the metronome sets `isPlaying` to true
- Stopping sets `isPlaying` to false
- (Mock AudioContext for tests — jsdom doesn't have Web Audio)

**Step 2-5: Same TDD cycle**

Implementation notes:
- Create AudioContext lazily on first user interaction
- Generate a short beep: oscillator at 800Hz for 100ms with gain envelope
- `start()` sets up a 1-second interval that calls the beep function
- `stop()` clears the interval

```typescript
// src/utils/audio.ts
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playBeep(): void {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.value = 800;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}

export function createMetronome() { ... }
```

**Commit:**
```bash
git add src/utils/audio.ts tests/utils/audio.test.ts
git commit -m "feat: add Web Audio metronome utility"
```

---

### Task 19: Wake Lock Utility

**Files:**
- Create: `src/utils/wake-lock.ts`
- Test: `tests/utils/wake-lock.test.ts`

**Step 1: Write the test**

Test that:
- `requestWakeLock()` calls `navigator.wakeLock.request("screen")` when available
- `releaseWakeLock()` releases the lock
- Gracefully handles browsers without Wake Lock API

**Step 2-5: Same TDD cycle**

**Commit:**
```bash
git add src/utils/wake-lock.ts tests/utils/wake-lock.test.ts
git commit -m "feat: add screen wake lock utility for active workouts"
```

---

### Task 20: Timer Hook

**Files:**
- Create: `src/hooks/use-timer.ts`
- Test: `tests/hooks/use-timer.test.ts`

**Step 1: Write the test**

Test that:
- Initial state: phase is "idle", elapsedMs is 0
- `startCountdown()` sets phase to "countdown", counts down from `countdownDuration`
- After countdown reaches 0, phase transitions to "running"
- `stop()` sets phase to "stopped" and returns elapsed seconds (TUL)
- `reset()` returns to "idle" state
- Timer tracks elapsed milliseconds while running

Note: Use `vi.useFakeTimers()` for timer testing.

**Step 2-5: Same TDD cycle**

The hook uses signals internally:
```typescript
import { signal, computed } from "@preact/signals";
import type { TimerPhase } from "../types/index.ts";

export function useTimer(countdownDuration: number) {
  const phase = signal<TimerPhase>("idle");
  const elapsedMs = signal(0);
  const countdownRemaining = signal(countdownDuration);

  const elapsedSeconds = computed(() => Math.floor(elapsedMs.value / 1000));
  const displayTime = computed(() => {
    const total = elapsedSeconds.value;
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  });

  // startCountdown, stop, reset functions using requestAnimationFrame
  // ...

  return { phase, elapsedMs, elapsedSeconds, countdownRemaining, displayTime, startCountdown, stop, reset };
}
```

**Commit:**
```bash
git add src/hooks/use-timer.ts tests/hooks/use-timer.test.ts
git commit -m "feat: add timer hook with countdown and elapsed time tracking"
```

---

### Task 21: Start Workout Page

**Files:**
- Modify: `src/pages/workout-page.tsx`
- Test: `tests/pages/workout-page.test.tsx`

**Step 1: Write the test**

Test that when no workout is active:
- Shows "Start Workout" heading
- Shows list of routines to pick from
- Shows "Freeform Workout" option
- Clicking a routine calls `startWorkout(routineId)`
- Clicking freeform calls `startWorkout()` with no routine

When a workout IS active (mock `isWorkoutActive` to true):
- Redirects to the active workout view (or renders it inline)

**Step 2-5: Same TDD cycle**

Design: Large prominent buttons. Routine cards show name + exercise count. Freeform card at top or bottom.

**Commit:**
```bash
git add src/pages/workout-page.tsx tests/pages/workout-page.test.tsx
git commit -m "feat: add start workout page with routine selection"
```

---

### Task 22: Exercise Timer Component

**Files:**
- Create: `src/components/timer/countdown.tsx`
- Create: `src/components/timer/exercise-timer.tsx`
- Test: `tests/components/timer/exercise-timer.test.tsx`

**Step 1: Write the test**

Test that:
- Shows "Start Exercise" button in idle state
- Clicking start shows countdown (3... 2... 1...)
- After countdown, shows running timer with elapsed time
- Shows "Stop" button while running
- Clicking stop freezes the timer and shows the elapsed TUL

**Step 2-5: Same TDD cycle**

Countdown component: Full-screen overlay with large countdown number and pulse animation.
Timer component: Large centered time display (MM:SS), prominent stop button.

Integrates with `useTimer` hook and `createMetronome`.

**Commit:**
```bash
git add src/components/timer/ tests/components/timer/
git commit -m "feat: add exercise timer with countdown and metronome integration"
```

---

### Task 23: Exercise Card (Logging)

**Files:**
- Create: `src/components/workout/exercise-card.tsx`
- Test: `tests/components/workout/exercise-card.test.tsx`

**Step 1: Write the test**

Test that:
- Shows exercise name
- After timer stops, shows form with: weight input, TUL (read-only from timer), optional reps, optional notes
- Weight input pre-fills with last used weight for this exercise (from history)
- Notes pre-fill with last used notes for this exercise
- Shows weight direction selector (increase/decrease/maintain buttons)
- "Save & Next" button calls `addExerciseLog` and advances to next exercise

**Step 2-5: Same TDD cycle**

Design: Card layout. Large weight input with +/- steppers. TUL shown prominently. Three toggle buttons for weight direction (up arrow, down arrow, equals). Notes as a collapsible textarea.

**Commit:**
```bash
git add src/components/workout/exercise-card.tsx tests/components/workout/exercise-card.test.tsx
git commit -m "feat: add exercise card with weight, TUL, and direction logging"
```

---

### Task 24: Exercise Picker (Freeform)

**Files:**
- Create: `src/components/workout/exercise-picker.tsx`
- Test: `tests/components/workout/exercise-picker.test.tsx`

**Step 1: Write the test**

Test that:
- Shows searchable list of exercises grouped by category
- Selecting an exercise returns it (onSelect callback)
- Search filters exercises by name
- Recently used exercises appear at top

**Step 2-5: Same TDD cycle**

**Commit:**
```bash
git add src/components/workout/exercise-picker.tsx tests/components/workout/exercise-picker.test.tsx
git commit -m "feat: add exercise picker for freeform workouts"
```

---

### Task 25: Active Workout Flow

**Files:**
- Modify: `src/pages/workout-page.tsx` — integrate all workout components
- Test: `tests/pages/active-workout.test.tsx`

**Step 1: Write the test**

Test the full workout flow:
1. Start a routine workout → first exercise shown
2. Start timer → countdown → running → stop → log form shown
3. Fill in weight, select direction → save → next exercise shown
4. For freeform: after save, exercise picker shown for next exercise
5. "Finish Workout" button → navigates to summary
6. Overall workout timer shown at top (elapsed since workout start)

**Step 2-5: Same TDD cycle**

This task ties together: workout store, timer hook, exercise timer, exercise card, exercise picker. The page conditionally renders based on workout state.

Integrate wake lock: acquire on workout start, release on finish/cancel.

**Commit:**
```bash
git add src/pages/workout-page.tsx tests/pages/active-workout.test.tsx
git commit -m "feat: integrate active workout flow with timer, logging, and navigation"
```

---

### Task 26: Weight Direction Selector

**Files:**
- Create: `src/components/workout/weight-direction.tsx`
- Test: `tests/components/workout/weight-direction.test.tsx`

**Step 1: Write the test**

Test that:
- Renders three buttons: increase (up arrow), maintain (equals), decrease (down arrow)
- Clicking a button calls `onChange` with the direction
- Selected button is visually highlighted
- Default selection is "maintain"

**Step 2-5: Same TDD cycle**

Design: Three equal-width buttons in a row. Colors: green for increase, gray for maintain, red for decrease. Icon + text label.

**Commit:**
```bash
git add src/components/workout/weight-direction.tsx tests/components/workout/weight-direction.test.tsx
git commit -m "feat: add weight direction selector component"
```

---

### Task 27: Workout Summary

**Files:**
- Create: `src/components/workout/workout-summary.tsx`
- Test: `tests/components/workout/workout-summary.test.tsx`

**Step 1: Write the test**

Test that:
- Shows total workout time (formatted MM:SS)
- Shows total TUL (formatted MM:SS)
- Shows TUL ratio (percentage)
- Lists each exercise with: name, weight, TUL, weight direction indicator
- "Done" button navigates back to start workout page
- Summary data matches the completed workout from the store

**Step 2-5: Same TDD cycle**

Design: Stats at top in bold cards. Exercise list below as a table/card list. Celebrate completion with a subtle visual.

**Commit:**
```bash
git add src/components/workout/workout-summary.tsx tests/components/workout/workout-summary.test.tsx
git commit -m "feat: add workout summary with stats and exercise breakdown"
```

---

## Phase 6: History

### Task 28: Workout History List

**Files:**
- Modify: `src/pages/history-page.tsx`
- Test: `tests/pages/history-page.test.tsx`

**Step 1: Write the test**

Test that:
- Shows list of past workouts sorted by date (most recent first)
- Each item shows: date, routine name (or "Freeform"), exercise count, total TUL
- Empty state shows message "No workouts yet"
- Clicking a workout navigates to `/history/:id`

**Step 2-5: Same TDD cycle**

Design: Cards grouped by month. Each card: date on left, stats on right. Subtle dividers between months.

**Commit:**
```bash
git add src/pages/history-page.tsx tests/pages/history-page.test.tsx
git commit -m "feat: add workout history list with grouped display"
```

---

### Task 29: Workout Detail View

**Files:**
- Create: `src/components/history/workout-detail.tsx`
- Modify: `src/pages/history-page.tsx` — route to detail when ID present
- Test: `tests/components/history/workout-detail.test.tsx`

**Step 1: Write the test**

Test that:
- Shows date, total time, total TUL, TUL ratio
- Lists all exercises with: name, weight, TUL, reps (if recorded), notes, weight direction
- "Delete Workout" button with confirmation

**Step 2-5: Same TDD cycle**

**Commit:**
```bash
git add src/components/history/workout-detail.tsx src/pages/history-page.tsx tests/components/history/workout-detail.test.tsx
git commit -m "feat: add workout detail view with exercise breakdown"
```

---

## Phase 7: Stats

### Task 30: Summary Cards

**Files:**
- Create: `src/components/stats/summary-cards.tsx`
- Modify: `src/pages/stats-page.tsx`
- Test: `tests/components/stats/summary-cards.test.tsx`

**Step 1: Write the test**

Test that:
- Shows total workout count
- Shows average TUL per workout
- Shows average TUL ratio
- Shows current streak (consecutive weeks with 1+ workout)
- Shows "No data" state when no workouts exist
- Computes stats correctly from mock workout data

**Step 2-5: Same TDD cycle**

Design: 2x2 grid of stat cards. Each card: label on top, large number below, optional trend indicator.

**Commit:**
```bash
git add src/components/stats/summary-cards.tsx src/pages/stats-page.tsx tests/components/stats/summary-cards.test.tsx
git commit -m "feat: add summary stats cards with computed metrics"
```

---

### Task 31: TUL Chart

**Files:**
- Create: `src/components/stats/tul-chart.tsx`
- Test: `tests/components/stats/tul-chart.test.tsx`

**Step 1: Write the test**

Test that:
- Renders a canvas element for Chart.js
- Accepts exercise filter and date range filter
- Filters workout data correctly
- Shows "No data for this period" when filtered data is empty

Note: Chart.js renders to canvas, so test the data preparation logic separately from rendering.

**Step 2-5: Same TDD cycle**

Implementation: Create a reusable chart wrapper component. Use `useEffect` to instantiate/destroy Chart.js instances. Extract data preparation into testable pure functions.

```typescript
// Pure function to test separately
export function prepareTulChartData(
  workouts: Workout[],
  exerciseId?: string,
  dateRange?: { start: string; end: string }
): { labels: string[]; data: number[] } { ... }
```

**Commit:**
```bash
git add src/components/stats/tul-chart.tsx tests/components/stats/tul-chart.test.tsx
git commit -m "feat: add TUL over time chart with exercise and date filters"
```

---

### Task 32: Weight Progression Chart

**Files:**
- Create: `src/components/stats/weight-chart.tsx`
- Test: `tests/components/stats/weight-chart.test.tsx`

Same pattern as TUL chart but plots weight over time per exercise.

**Commit:**
```bash
git add src/components/stats/weight-chart.tsx tests/components/stats/weight-chart.test.tsx
git commit -m "feat: add weight progression chart per exercise"
```

---

### Task 33: Stats Dashboard Assembly

**Files:**
- Modify: `src/pages/stats-page.tsx`
- Test: `tests/pages/stats-page.test.tsx`

**Step 1: Write the test**

Test that:
- Renders summary cards at top
- Renders exercise filter dropdown
- Renders date range filter (30d, 90d, 1y, all)
- Renders TUL chart and weight chart
- Changing filters updates the charts

**Step 2-5: Same TDD cycle**

Design: Summary cards at top. Filter bar below. Charts stacked vertically, scrollable. Each chart in a card with a title.

**Commit:**
```bash
git add src/pages/stats-page.tsx tests/pages/stats-page.test.tsx
git commit -m "feat: assemble stats dashboard with filters and charts"
```

---

## Phase 8: PWA

### Task 34: PWA Setup

**Files:**
- Modify: `vite.config.ts` — add VitePWA plugin
- Modify: `index.html` — update title, add meta tags for PWA
- Create: `public/icons/` — placeholder icons (can use a simple SVG for now)

**Step 1: Update vite.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "HIT Tracker",
        short_name: "HIT Tracker",
        description: "Track your High-Intensity Training workouts",
        theme_color: "#1e40af",
        background_color: "#f9fafb",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/test-setup.ts",
  },
});
```

**Step 2: Update index.html**

Add: `<meta name="theme-color" content="#1e40af">`, update `<title>HIT Tracker</title>`, add apple-touch-icon link.

**Step 3: Create placeholder icons**

Generate simple placeholder PNG icons at 192x192 and 512x512 (can be solid color squares with "HIT" text — replace with real icons later).

**Step 4: Verify build works**

Run: `pnpm build`
Expected: Build succeeds, generates sw.js and manifest in dist/

**Step 5: Commit**

```bash
git add vite.config.ts index.html public/icons/
git commit -m "feat: add PWA configuration with service worker and manifest"
```

---

## Phase 9: Polish & Integration

### Task 35: Run Full Test Suite and Fix Issues

**Files:**
- Various fixes as needed

**Step 1: Run all tests**

Run: `pnpm test`

**Step 2: Fix any failing tests**

**Step 3: Run type checking**

Run: `pnpm typecheck`

**Step 4: Fix any type errors**

**Step 5: Run linting and formatting**

Run: `pnpm lint:fix && pnpm format`

**Step 6: Commit**

```bash
git add -A
git commit -m "fix: resolve test failures, type errors, and formatting issues"
```

---

### Task 36: Build and Manual Verification

**Step 1: Build the app**

Run: `pnpm build`

**Step 2: Preview the build**

Run: `pnpm preview`

**Step 3: Manually verify in browser:**

- [ ] App loads and shows Start Workout page
- [ ] Tab navigation works (all 4 tabs)
- [ ] Can add/edit/delete exercises in Settings
- [ ] Can create a routine in Settings
- [ ] Can start a freeform workout
- [ ] Can start a routine workout
- [ ] Timer countdown works (3-2-1)
- [ ] Timer runs and can be stopped
- [ ] Metronome toggles on/off
- [ ] Can log weight, TUL, reps, notes for each exercise
- [ ] Weight direction selector works
- [ ] Workout summary shows correct totals
- [ ] Workout appears in History
- [ ] Workout detail shows all data
- [ ] Stats charts render with data
- [ ] Export creates a JSON file
- [ ] Import merges data correctly
- [ ] App works offline (disable network, reload)
- [ ] App installable as PWA

**Step 4: Fix any issues found during manual testing**

**Step 5: Final commit**

```bash
git add -A
git commit -m "fix: address issues found during manual verification"
```

---

## Task Dependency Graph

```
Phase 1: [Task 1] → [Task 2] → [Task 3]
Phase 2: [Task 3] → [Tasks 4,5,6,7,8] (parallel within phase)
Phase 3: [Tasks 4-8] → [Task 9] → [Tasks 10,11] (parallel) → [Task 12]
Phase 4: [Task 12] → [Tasks 13,14] (parallel) → [Task 16] → [Task 15] → [Task 17]
Phase 5: [Tasks 18,19] (parallel) → [Task 20] → [Task 21] → [Tasks 22,24,26] → [Task 23] → [Task 25] → [Task 27]
Phase 6: [Task 8, Task 27] → [Task 28] → [Task 29]
Phase 7: [Task 28] → [Task 30] → [Tasks 31,32] (parallel) → [Task 33]
Phase 8: [Task 33] → [Task 34] → [Task 35] → [Task 36]
```

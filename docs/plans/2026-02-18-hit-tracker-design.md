# HIT Tracker App Design

**Date:** 2026-02-18
**Status:** Approved

## Overview

A mobile-first, offline-first PWA for tracking High-Intensity Training (HIT) workouts. HIT workouts emphasize single sets to failure where Time-Under-Load (TUL) is the primary metric, making traditional rep/set trackers inadequate.

Follows the Obsidian model: free app, local data, full user ownership via JSON export/import, with a potential future paid sync service.

## Technology Decisions

| Decision         | Choice                           | Rationale                                                       |
| ---------------- | -------------------------------- | --------------------------------------------------------------- |
| UI Framework     | Preact + TypeScript              | Already in place                                                |
| State Management | @preact/signals (signal-centric) | Signals are runtime source of truth; Dexie is persistence layer |
| Local Storage    | IndexedDB via Dexie.js           | Structured, queryable, good for offline-first, easy JSON export |
| Routing          | preact-iso                       | Lightweight, Preact-native router                               |
| Charts           | Chart.js                         | Popular, responsive, good mobile support                        |
| Metronome Audio  | Web Audio API                    | Programmatic tone generation, no asset dependencies             |
| UI Components    | Custom Tailwind                  | Full control, no component library dependency                   |
| PWA              | vite-plugin-pwa                  | Service worker generation, cache-first strategy                 |
| Styling          | Tailwind CSS v4                  | Already in place                                                |

## Data Model

```typescript
interface Exercise {
  id: string;
  name: string;
  category?: string;
  notes?: string;
  lastModified: number;
}

interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
  lastModified: number;
}

interface ExerciseLog {
  id: string;
  exerciseId: string;
  weight: number;
  tul: number; // seconds
  reps?: number;
  notes?: string;
  weightDirection: "increase" | "decrease" | "maintain";
}

interface Workout {
  id: string;
  date: string; // ISO date
  startTime: number; // Unix timestamp ms
  endTime?: number;
  routineId?: string; // null for freeform
  exerciseLogs: ExerciseLog[];
  totalTul: number; // sum of exercise TULs
  totalTime: number; // endTime - startTime
  tulRatio: number; // totalTul / totalTime
  lastModified: number;
}

interface UserSettings {
  weightUnit: "lbs" | "kg";
  metronomeEnabled: boolean;
  countdownDuration: number; // default 3 seconds
}
```

## Architecture

### State Management (Signal-Centric)

All app state lives in `@preact/signals` stores organized by domain. Dexie handles persistence as a write-behind layer.

**Stores:**

- `workoutStore` — Active workout state: current exercise index, timer state, elapsed time, exercise logs in progress
- `exerciseStore` — Exercise library
- `routineStore` — Routines
- `historyStore` — Past workouts (paginated)
- `settingsStore` — User preferences

**Persistence pattern:**

1. On app load: hydrate all stores from Dexie
2. On state change: write-behind to Dexie (debounced where appropriate, immediate for workout completion)
3. Active workout state persisted on every exercise completion (crash recovery)

### Dexie Schema

Tables: `exercises`, `routines`, `workouts`, `settings`

Each record includes `lastModified` timestamp for conflict resolution.

### Conflict Resolution (Import/Export)

- Export: dump all tables to a single JSON file with schema version
- Import: validate schema version, merge by ID using last-write-wins on `lastModified`
- Format: `{ schemaVersion: 1, exercises: [...], routines: [...], workouts: [...], settings: {...} }`

## App Structure & Views

### Navigation

Bottom tab bar with 4 tabs: Workout, History, Stats, Settings.

### Routes

| View             | Path                  | Description                                            |
| ---------------- | --------------------- | ------------------------------------------------------ |
| Start Workout    | `/`                   | Choose routine or freeform, start button               |
| Active Workout   | `/workout/active`     | Exercise timer, log entries, in-progress state         |
| Workout Summary  | `/workout/summary`    | Post-workout stats                                     |
| History List     | `/history`            | Past workouts, grouped by date                         |
| Workout Detail   | `/history/:id`        | Single past workout details                            |
| Stats Dashboard  | `/stats`              | Charts and summary stats                               |
| Settings         | `/settings`           | User prefs, exercise/routine management, import/export |
| Manage Exercises | `/settings/exercises` | CRUD for exercise library                              |
| Manage Routines  | `/settings/routines`  | CRUD for routines                                      |

### Active Workout Flow

1. User picks routine or freeform -> workout starts, clock begins
2. Routine: next exercise shown. Freeform: user picks from library.
3. "Start Exercise" -> 3-second countdown (with optional metronome) -> timer runs
4. "Stop" -> timer stops -> TUL recorded
5. User enters weight, optional reps, optional notes
6. User selects weight direction (increase/decrease/maintain)
7. Next exercise or finish workout
8. Workout summary shown

## Timer, Countdown & Metronome

- `requestAnimationFrame` for display updates
- `setInterval` (1s) heartbeat for metronome
- Timer signals: `timerPhase` (idle | countdown | running | stopped), `elapsedMs`, `countdownRemaining`
- 3-second countdown with visual pulse animation
- Web Audio API metronome: ~100ms beep at ~800Hz, fires every 1s
- AudioContext created on first user interaction (browser autoplay policy)
- Screen Wake Lock API during active workout

## Stats & Charts

### Charts (Chart.js)

| Chart                           | Type | Data                    |
| ------------------------------- | ---- | ----------------------- |
| TUL over time per exercise      | Line | X: date, Y: TUL seconds |
| Weight progression per exercise | Line | X: date, Y: weight      |
| Workout frequency               | Bar  | X: week/month, Y: count |
| Total TUL per workout           | Line | X: date, Y: total TUL   |
| TUL ratio trend                 | Line | X: date, Y: ratio       |

### Filters

- By exercise (dropdown)
- By date range (30 days, 90 days, 1 year, all time)

### Summary Cards

- Total workouts
- Average TUL per workout
- Average TUL ratio
- Streak (consecutive weeks with 1+ workout)

## PWA Configuration

- vite-plugin-pwa for service worker generation
- Cache-first strategy for all app assets
- Standalone display mode
- App icons in multiple sizes
- Fully offline after first load

## File Structure

```
src/
├── main.tsx
├── app.tsx
├── index.css
├── db/
│   ├── database.ts
│   └── seed.ts
├── stores/
│   ├── workout-store.ts
│   ├── exercise-store.ts
│   ├── routine-store.ts
│   ├── history-store.ts
│   └── settings-store.ts
├── types/
│   └── index.ts
├── components/
│   ├── layout/
│   │   ├── tab-bar.tsx
│   │   └── page-header.tsx
│   ├── timer/
│   │   ├── countdown.tsx
│   │   ├── exercise-timer.tsx
│   │   └── metronome.ts
│   ├── workout/
│   │   ├── exercise-picker.tsx
│   │   ├── exercise-card.tsx
│   │   ├── weight-direction.tsx
│   │   └── workout-summary.tsx
│   ├── history/
│   │   ├── workout-list.tsx
│   │   └── workout-detail.tsx
│   ├── stats/
│   │   ├── stats-dashboard.tsx
│   │   ├── tul-chart.tsx
│   │   ├── weight-chart.tsx
│   │   └── summary-cards.tsx
│   └── settings/
│       ├── settings-page.tsx
│       ├── exercise-manager.tsx
│       ├── routine-manager.tsx
│       └── data-manager.tsx
├── utils/
│   ├── wake-lock.ts
│   ├── audio.ts
│   └── export.ts
└── hooks/
    └── use-timer.ts
```

import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { Router, Route, ErrorBoundary, useLocation } from "preact-iso";
import { TabBar } from "./components/layout/tab-bar.tsx";
import { WorkoutPage } from "./pages/workout-page.tsx";
import { HistoryPage } from "./pages/history-page.tsx";
import { StatsPage } from "./pages/stats-page.tsx";
import { SettingsPage } from "./pages/settings-page.tsx";
import { NotFoundPage } from "./pages/not-found-page.tsx";
import { Concept1 } from "./pages/concepts/concept-1.tsx";
import { Concept2 } from "./pages/concepts/concept-2.tsx";
import { Concept3 } from "./pages/concepts/concept-3.tsx";
import { Concept4 } from "./pages/concepts/concept-4.tsx";
import { Concept5 } from "./pages/concepts/concept-5.tsx";
import { loadSettings } from "./stores/settings-store.ts";
import { loadExercises } from "./stores/exercise-store.ts";
import { loadRoutines } from "./stores/routine-store.ts";
import { loadHistory } from "./stores/history-store.ts";
import { seedExercisesIfEmpty } from "./db/seed.ts";

const isLoading = signal(true);

let initGeneration = 0;

export function resetLoading(): void {
  initGeneration++;
  isLoading.value = true;
}

async function initializeApp(): Promise<void> {
  const gen = initGeneration;
  await seedExercisesIfEmpty();
  if (gen !== initGeneration) return;
  await Promise.all([
    loadSettings(),
    loadExercises(),
    loadRoutines(),
    loadHistory(),
  ]);
  if (gen !== initGeneration) return;
  isLoading.value = false;
}

export function App() {
  const { path } = useLocation();

  useEffect(() => {
    initializeApp();
  }, []);

  const isConceptRoute = /^\/[1-5]$/.test(path);

  if (isConceptRoute) {
    return (
      <ErrorBoundary>
        <Router>
          <Route path="/1" component={Concept1} />
          <Route path="/2" component={Concept2} />
          <Route path="/3" component={Concept3} />
          <Route path="/4" component={Concept4} />
          <Route path="/5" component={Concept5} />
        </Router>
      </ErrorBoundary>
    );
  }

  if (isLoading.value) {
    return (
      <div class="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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

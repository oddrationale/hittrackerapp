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

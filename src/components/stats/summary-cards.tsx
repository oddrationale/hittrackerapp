import { workoutHistory } from "../../stores/history-store.ts";
import type { Workout } from "../../types/index.ts";

export function computeStats(workouts: Workout[]) {
  if (workouts.length === 0) return null;

  const totalWorkouts = workouts.length;
  const avgTul = Math.round(
    workouts.reduce((sum, w) => sum + w.totalTul, 0) / totalWorkouts,
  );
  const avgRatio =
    workouts.reduce((sum, w) => sum + w.tulRatio, 0) / totalWorkouts;

  // Streak: consecutive weeks with at least 1 workout
  const streak = computeStreak(workouts);

  return { totalWorkouts, avgTul, avgRatio, streak };
}

function computeStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;

  // Get the week key for each workout date
  const weeks = new Set(workouts.map((w) => getWeekKey(w.date)));

  // Start from current week and go backwards
  const now = new Date();
  let streak = 0;
  const checkDate = new Date(now);

  // Check current week and previous weeks
  for (let i = 0; i < 52; i++) {
    const key = getWeekKey(checkDate.toISOString().split("T")[0]);
    if (weeks.has(key)) {
      streak++;
    } else if (i > 0) {
      // Allow current week to have no workouts yet
      break;
    }
    checkDate.setDate(checkDate.getDate() - 7);
  }

  return streak;
}

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${weekNum}`;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function SummaryCards() {
  const stats = computeStats(workoutHistory.value);

  if (!stats) {
    return <p class="py-4 text-center text-gray-500">No workout data yet</p>;
  }

  return (
    <div class="grid grid-cols-2 gap-2">
      <div class="rounded-lg bg-white p-3 shadow-sm">
        <p class="text-xs text-gray-500">Total Workouts</p>
        <p class="text-2xl font-bold">{stats.totalWorkouts}</p>
      </div>
      <div class="rounded-lg bg-white p-3 shadow-sm">
        <p class="text-xs text-gray-500">Avg TUL / Workout</p>
        <p class="text-2xl font-bold">{formatTime(stats.avgTul)}</p>
      </div>
      <div class="rounded-lg bg-white p-3 shadow-sm">
        <p class="text-xs text-gray-500">Avg TUL Ratio</p>
        <p class="text-2xl font-bold">{Math.round(stats.avgRatio * 100)}%</p>
      </div>
      <div class="rounded-lg bg-white p-3 shadow-sm">
        <p class="text-xs text-gray-500">Streak</p>
        <p class="text-2xl font-bold">{stats.streak} weeks</p>
      </div>
    </div>
  );
}

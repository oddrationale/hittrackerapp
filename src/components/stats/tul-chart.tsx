import { useEffect, useRef } from "preact/hooks";
import { Chart, registerables } from "chart.js";
import { workoutHistory } from "../../stores/history-store.ts";
import type { Workout } from "../../types/index.ts";

Chart.register(...registerables);

export interface ChartFilter {
  exerciseId?: string;
  dateRange?: { start: string; end: string };
}

// Pure function — easy to test
export function prepareTulChartData(
  workouts: Workout[],
  filter?: ChartFilter,
): { labels: string[]; data: number[] } {
  let filtered = workouts;

  // Filter by date range
  if (filter?.dateRange) {
    filtered = filtered.filter(
      (w) =>
        w.date >= filter.dateRange!.start && w.date <= filter.dateRange!.end,
    );
  }

  // Sort by date ascending
  filtered = [...filtered].sort((a, b) => a.date.localeCompare(b.date));

  if (filter?.exerciseId) {
    // Per-exercise TUL over time
    const labels: string[] = [];
    const data: number[] = [];
    for (const workout of filtered) {
      const log = workout.exerciseLogs.find(
        (l) => l.exerciseId === filter.exerciseId,
      );
      if (log) {
        labels.push(workout.date);
        data.push(log.tul);
      }
    }
    return { labels, data };
  }

  // Total TUL per workout
  return {
    labels: filtered.map((w) => w.date),
    data: filtered.map((w) => w.totalTul),
  };
}

interface TulChartProps {
  filter?: ChartFilter;
}

export function TulChart({ filter }: TulChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const { labels, data } = prepareTulChartData(
      workoutHistory.value,
      filter,
    );

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (labels.length === 0) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "TUL (seconds)",
            data,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Seconds" } },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [
    workoutHistory.value,
    filter?.exerciseId,
    filter?.dateRange?.start,
    filter?.dateRange?.end,
  ]);

  const { labels } = prepareTulChartData(workoutHistory.value, filter);

  if (labels.length === 0) {
    return (
      <p class="py-4 text-center text-sm text-gray-500">
        No data for this period
      </p>
    );
  }

  return (
    <div class="rounded-lg bg-white p-4 shadow-sm">
      <h3 class="mb-2 text-sm font-medium text-gray-700">TUL Over Time</h3>
      <div class="h-48">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

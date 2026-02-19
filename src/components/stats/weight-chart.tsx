import { useEffect, useRef } from "preact/hooks";
import { Chart, registerables } from "chart.js";
import { workoutHistory } from "../../stores/history-store.ts";
import type { Workout } from "../../types/index.ts";

Chart.register(...registerables);

// Pure function — easy to test
export function prepareWeightChartData(
  workouts: Workout[],
  exerciseId: string,
  dateRange?: { start: string; end: string },
): { labels: string[]; data: number[] } {
  let filtered = workouts;

  if (dateRange) {
    filtered = filtered.filter(
      (w) => w.date >= dateRange.start && w.date <= dateRange.end,
    );
  }

  filtered = [...filtered].sort((a, b) => a.date.localeCompare(b.date));

  const labels: string[] = [];
  const data: number[] = [];
  for (const workout of filtered) {
    const log = workout.exerciseLogs.find((l) => l.exerciseId === exerciseId);
    if (log) {
      labels.push(workout.date);
      data.push(log.weight);
    }
  }

  return { labels, data };
}

interface WeightChartProps {
  exerciseId: string;
  dateRange?: { start: string; end: string };
}

export function WeightChart({ exerciseId, dateRange }: WeightChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const { labels, data } = prepareWeightChartData(
      workoutHistory.value,
      exerciseId,
      dateRange,
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
            label: "Weight",
            data,
            borderColor: "#059669",
            backgroundColor: "rgba(5, 150, 105, 0.1)",
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
          y: {
            beginAtZero: false,
            title: { display: true, text: "Weight" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    workoutHistory.value,
    exerciseId,
    dateRange,
    dateRange?.start,
    dateRange?.end,
  ]);

  const { labels } = prepareWeightChartData(
    workoutHistory.value,
    exerciseId,
    dateRange,
  );

  if (labels.length === 0) {
    return (
      <p class="py-4 text-center text-sm text-gray-500">
        No data for this exercise
      </p>
    );
  }

  return (
    <div class="rounded-lg bg-white p-4 shadow-sm">
      <h3 class="mb-2 text-sm font-medium text-gray-700">Weight Progression</h3>
      <div class="h-48">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

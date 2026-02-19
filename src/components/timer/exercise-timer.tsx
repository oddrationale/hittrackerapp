import { createTimer } from "../../hooks/use-timer.ts";
import { createMetronome } from "../../utils/audio.ts";
import { settings } from "../../stores/settings-store.ts";
import { Countdown } from "./countdown.tsx";
import { useRef } from "preact/hooks";

interface ExerciseTimerProps {
  onComplete: (tulSeconds: number) => void;
}

export function ExerciseTimer({ onComplete }: ExerciseTimerProps) {
  // Create timer and metronome once per mount
  const timerRef = useRef(createTimer(settings.value.countdownDuration));
  const metronomeRef = useRef(createMetronome());
  const timer = timerRef.current;
  const metronome = metronomeRef.current;

  function handleStart() {
    timer.startCountdown();
  }

  function handleStop() {
    const tul = timer.stop();
    metronome.stop();
    onComplete(tul);
  }

  const phase = timer.phase.value;

  if (phase === "idle") {
    return (
      <div class="flex flex-col items-center py-8">
        <button
          onClick={handleStart}
          class="rounded-full bg-blue-600 px-12 py-6 text-2xl font-bold text-white shadow-lg"
        >
          Start Exercise
        </button>
      </div>
    );
  }

  if (phase === "countdown") {
    return <Countdown remaining={timer.countdownRemaining.value} />;
  }

  if (phase === "running") {
    // Start metronome if enabled and not already playing
    if (settings.value.metronomeEnabled && !metronome.isPlaying()) {
      metronome.start();
    }
    return (
      <div class="flex flex-col items-center py-8">
        <div class="mb-4 text-6xl font-bold tabular-nums text-gray-900">
          {timer.displayTime.value}
        </div>
        <button
          onClick={handleStop}
          class="rounded-full bg-red-600 px-12 py-6 text-2xl font-bold text-white shadow-lg"
        >
          Stop
        </button>
      </div>
    );
  }

  // Stopped phase — show final TUL
  return (
    <div class="flex flex-col items-center py-8">
      <p class="mb-2 text-sm text-gray-500">Time Under Load</p>
      <div class="text-5xl font-bold tabular-nums text-gray-900">
        {timer.displayTime.value}
      </div>
    </div>
  );
}

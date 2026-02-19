import { signal, computed } from "@preact/signals";
import type { TimerPhase } from "../types/index.ts";

export function createTimer(countdownDuration: number) {
  const phase = signal<TimerPhase>("idle");
  const elapsedMs = signal(0);
  const countdownRemaining = signal(countdownDuration);

  let animFrameId: number | null = null;
  let startTimestamp: number | null = null;
  let countdownIntervalId: ReturnType<typeof setInterval> | null = null;

  const elapsedSeconds = computed(() => Math.floor(elapsedMs.value / 1000));

  const displayTime = computed(() => {
    const total = elapsedSeconds.value;
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  });

  function tick() {
    if (startTimestamp !== null && phase.value === "running") {
      elapsedMs.value = Date.now() - startTimestamp;
      animFrameId = requestAnimationFrame(tick);
    }
  }

  function startCountdown() {
    if (phase.value !== "idle") return;
    phase.value = "countdown";
    countdownRemaining.value = countdownDuration;

    countdownIntervalId = setInterval(() => {
      countdownRemaining.value--;
      if (countdownRemaining.value <= 0) {
        if (countdownIntervalId !== null) {
          clearInterval(countdownIntervalId);
          countdownIntervalId = null;
        }
        // Transition to running
        phase.value = "running";
        startTimestamp = Date.now();
        animFrameId = requestAnimationFrame(tick);
      }
    }, 1000);
  }

  function stop(): number {
    if (phase.value === "running") {
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      // Final elapsed calc
      if (startTimestamp !== null) {
        elapsedMs.value = Date.now() - startTimestamp;
      }
      phase.value = "stopped";
    } else if (phase.value === "countdown") {
      if (countdownIntervalId !== null) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
      }
      phase.value = "stopped";
    }
    return elapsedSeconds.value;
  }

  function reset() {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId);
    if (countdownIntervalId !== null) clearInterval(countdownIntervalId);
    animFrameId = null;
    countdownIntervalId = null;
    startTimestamp = null;
    phase.value = "idle";
    elapsedMs.value = 0;
    countdownRemaining.value = countdownDuration;
  }

  return {
    phase,
    elapsedMs,
    elapsedSeconds,
    countdownRemaining,
    displayTime,
    startCountdown,
    stop,
    reset,
  };
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTimer } from "../../src/hooks/use-timer.ts";

describe("createTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "requestAnimationFrame",
      (cb: FrameRequestCallback) =>
        setTimeout(() => cb(Date.now()), 16) as unknown as number,
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("initial state: phase is 'idle', elapsedMs is 0", () => {
    const timer = createTimer(3);
    expect(timer.phase.value).toBe("idle");
    expect(timer.elapsedMs.value).toBe(0);
    expect(timer.countdownRemaining.value).toBe(3);
    expect(timer.elapsedSeconds.value).toBe(0);
    expect(timer.displayTime.value).toBe("0:00");
  });

  it("startCountdown() sets phase to 'countdown'", () => {
    const timer = createTimer(3);
    timer.startCountdown();
    expect(timer.phase.value).toBe("countdown");
  });

  it("countdown decrements countdownRemaining each second", () => {
    const timer = createTimer(3);
    timer.startCountdown();
    expect(timer.countdownRemaining.value).toBe(3);

    vi.advanceTimersByTime(1000);
    expect(timer.countdownRemaining.value).toBe(2);

    vi.advanceTimersByTime(1000);
    expect(timer.countdownRemaining.value).toBe(1);
  });

  it("after countdown reaches 0, phase transitions to 'running'", () => {
    const timer = createTimer(3);
    timer.startCountdown();

    vi.advanceTimersByTime(3000);
    expect(timer.countdownRemaining.value).toBe(0);
    expect(timer.phase.value).toBe("running");
  });

  it("in 'running' phase, elapsedMs increases", () => {
    const timer = createTimer(3);
    timer.startCountdown();

    // Complete countdown
    vi.advanceTimersByTime(3000);
    expect(timer.phase.value).toBe("running");

    // Advance time while running - allow rAF ticks to fire
    vi.advanceTimersByTime(2000);
    expect(timer.elapsedMs.value).toBeGreaterThan(0);
  });

  it("stop() sets phase to 'stopped' and returns elapsed seconds", () => {
    const timer = createTimer(3);
    timer.startCountdown();

    // Complete countdown
    vi.advanceTimersByTime(3000);
    expect(timer.phase.value).toBe("running");

    // Run for 5 seconds
    vi.advanceTimersByTime(5000);

    const tul = timer.stop();
    expect(timer.phase.value).toBe("stopped");
    expect(tul).toBeGreaterThanOrEqual(4);
    expect(typeof tul).toBe("number");
  });

  it("stop() during countdown sets phase to 'stopped'", () => {
    const timer = createTimer(3);
    timer.startCountdown();

    vi.advanceTimersByTime(1000);
    const tul = timer.stop();
    expect(timer.phase.value).toBe("stopped");
    expect(tul).toBe(0);
  });

  it("reset() returns to 'idle' state and resets all values", () => {
    const timer = createTimer(3);
    timer.startCountdown();

    // Complete countdown and run for a bit
    vi.advanceTimersByTime(3000);
    vi.advanceTimersByTime(2000);

    timer.stop();
    timer.reset();

    expect(timer.phase.value).toBe("idle");
    expect(timer.elapsedMs.value).toBe(0);
    expect(timer.countdownRemaining.value).toBe(3);
    expect(timer.elapsedSeconds.value).toBe(0);
    expect(timer.displayTime.value).toBe("0:00");
  });

  it("displayTime formats correctly (e.g., '1:30' for 90 seconds)", () => {
    const timer = createTimer(1);
    timer.startCountdown();

    // Complete countdown
    vi.advanceTimersByTime(1000);
    expect(timer.phase.value).toBe("running");

    // Run for 90 seconds
    vi.advanceTimersByTime(90_000);

    // Stop to freeze the time
    timer.stop();

    expect(timer.elapsedSeconds.value).toBeGreaterThanOrEqual(90);
    // Check the format is "M:SS"
    const display = timer.displayTime.value;
    expect(display).toMatch(/^\d+:\d{2}$/);

    // For ~90 seconds, should display "1:30"
    const mins = Math.floor(timer.elapsedSeconds.value / 60);
    const secs = timer.elapsedSeconds.value % 60;
    expect(display).toBe(`${mins}:${secs.toString().padStart(2, "0")}`);
  });

  it("startCountdown() does nothing if phase is not 'idle'", () => {
    const timer = createTimer(3);
    timer.startCountdown();
    expect(timer.phase.value).toBe("countdown");

    // Try starting again - should be ignored
    timer.startCountdown();
    expect(timer.phase.value).toBe("countdown");
  });
});

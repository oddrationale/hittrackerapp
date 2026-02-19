import { render, screen, fireEvent, act } from "@testing-library/preact";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { settings } from "../../../src/stores/settings-store.ts";

// Mock AudioContext before any imports that use it
const mockOscillator = {
  connect: vi.fn(),
  frequency: { value: 0 },
  start: vi.fn(),
  stop: vi.fn(),
};

const mockGain = {
  connect: vi.fn(),
  gain: {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
};

const mockAudioContext = {
  createOscillator: vi.fn(() => mockOscillator),
  createGain: vi.fn(() => mockGain),
  destination: {},
  currentTime: 0,
};

beforeAll(() => {
  vi.stubGlobal(
    "AudioContext",
    vi.fn(function () {
      return mockAudioContext;
    }),
  );
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16),
  );
  vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
});

import { ExerciseTimer } from "../../../src/components/timer/exercise-timer.tsx";

describe("ExerciseTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    settings.value = {
      weightUnit: "lbs",
      metronomeEnabled: false,
      countdownDuration: 3,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("shows 'Start Exercise' button in idle state", () => {
    const onComplete = vi.fn();
    render(<ExerciseTimer onComplete={onComplete} />);

    expect(screen.getByText("Start Exercise")).toBeInTheDocument();
  });

  it("clicking start shows countdown (3... 2... 1...)", () => {
    const onComplete = vi.fn();
    render(<ExerciseTimer onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Start Exercise"));

    // Should show countdown overlay with "3"
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Get ready...")).toBeInTheDocument();

    // Advance 1 second -> should show "2"
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("2")).toBeInTheDocument();

    // Advance 1 second -> should show "1"
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("after countdown, shows running timer with elapsed time", () => {
    const onComplete = vi.fn();
    render(<ExerciseTimer onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Start Exercise"));

    // Advance through full countdown (3 seconds)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should now be in running phase showing elapsed time
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("shows 'Stop' button while running", () => {
    const onComplete = vi.fn();
    render(<ExerciseTimer onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Start Exercise"));

    // Advance through full countdown
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("Stop")).toBeInTheDocument();
  });

  it("clicking stop freezes the timer and displays the TUL", () => {
    const onComplete = vi.fn();
    render(<ExerciseTimer onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Start Exercise"));

    // Advance through countdown
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Let timer run for a bit
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Click stop
    fireEvent.click(screen.getByText("Stop"));

    // Should show "Time Under Load" label
    expect(screen.getByText("Time Under Load")).toBeInTheDocument();

    // onComplete should have been called with the TUL seconds
    expect(onComplete).toHaveBeenCalledWith(expect.any(Number));
  });
});

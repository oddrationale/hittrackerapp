import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";

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
});

import { createMetronome, playBeep } from "../../src/utils/audio.ts";

describe("createMetronome", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns an object with start(), stop(), and isPlaying() methods", () => {
    const metronome = createMetronome();
    expect(typeof metronome.start).toBe("function");
    expect(typeof metronome.stop).toBe("function");
    expect(typeof metronome.isPlaying).toBe("function");
  });

  it("starting the metronome sets isPlaying() to true", () => {
    const metronome = createMetronome();
    expect(metronome.isPlaying()).toBe(false);
    metronome.start();
    expect(metronome.isPlaying()).toBe(true);
    metronome.stop();
  });

  it("stopping the metronome sets isPlaying() to false", () => {
    const metronome = createMetronome();
    metronome.start();
    expect(metronome.isPlaying()).toBe(true);
    metronome.stop();
    expect(metronome.isPlaying()).toBe(false);
  });

  it("playBeep() can be called without error", () => {
    expect(() => playBeep()).not.toThrow();
  });
});

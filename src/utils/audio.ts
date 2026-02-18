let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playBeep(): void {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.value = 800;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}

export interface Metronome {
  start(): void;
  stop(): void;
  isPlaying(): boolean;
}

export function createMetronome(): Metronome {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let playing = false;

  return {
    start() {
      if (playing) return;
      playing = true;
      playBeep(); // immediate first beep
      intervalId = setInterval(() => playBeep(), 1000);
    },
    stop() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      playing = false;
    },
    isPlaying() {
      return playing;
    },
  };
}

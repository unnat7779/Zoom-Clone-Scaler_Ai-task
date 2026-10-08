import { getAudioContext } from "./audioContext";

export interface LevelMeter {
  /** current RMS of the signal (linear, 0..1) */
  rms(): number;
  dispose(): void;
}

/** AnalyserNode RMS of a stream's audio (PRD §7.10.4). The stream is measured, not played. */
export function createLevelMeter(stream: MediaStream): LevelMeter {
  const audio = getAudioContext();
  const source = audio.createMediaStreamSource(stream);
  const analyser = audio.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const samples = new Float32Array(analyser.fftSize);
  return {
    rms() {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) sum += sample * sample;
      return Math.sqrt(sum / samples.length);
    },
    dispose() {
      source.disconnect();
      analyser.disconnect();
    },
  };
}

const FLOOR_DB = -50;
const RANGE_DB = 40;

/** Meter height 0..1: −50 dBFS → 0, −10 dBFS → 1. */
export function rmsToLevel(rms: number): number {
  if (rms <= 0) return 0;
  const db = 20 * Math.log10(rms);
  return Math.min(1, Math.max(0, (db - FLOOR_DB) / RANGE_DB));
}

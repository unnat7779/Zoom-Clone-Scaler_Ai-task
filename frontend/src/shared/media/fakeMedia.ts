/**
 * Synthetic devices for `NEXT_PUBLIC_FAKE_MEDIA=1` (the built-in browser has no
 * camera): an animated canvas stands in for the camera and a pulsing 220 Hz
 * oscillator for the microphone, so previews, tiles, the audio meter, active-speaker
 * detection and WebRTC can all be exercised.
 */
import { env } from "@/shared/lib/env";
import { getAudioContext } from "./audioContext";
import type { MediaDeviceLists } from "./mediaTypes";

export const isFakeMediaEnabled = (): boolean => env.fakeMedia;

export const FAKE_DEVICES: MediaDeviceLists = {
  microphones: [{ deviceId: "fake-microphone", label: "Fake Microphone (synthetic tone)" }],
  speakers: [{ deviceId: "fake-speaker", label: "Fake Speaker" }],
  cameras: [{ deviceId: "fake-camera", label: "Fake Camera (canvas)" }],
};

const VIDEO_WIDTH = 1280;
const VIDEO_HEIGHT = 720;
const FRAME_MS = 1000 / 30;
/** soft tone: peak amplitude 0.1, volume pulsing at 0.6 Hz */
const TONE_GAIN = 0.05;
const PULSE_HZ = 0.6;

/** Calls `onEnded` once every track of `stream` has been stopped (stop() fires no event). */
function watchStopped(stream: MediaStream, onEnded: () => void): void {
  const timer = window.setInterval(() => {
    if (stream.getTracks().every((track) => track.readyState === "ended")) {
      window.clearInterval(timer);
      onEnded();
    }
  }, 500);
}

function drawFrame(context: CanvasRenderingContext2D, label: string, time: number): void {
  const gradient = context.createLinearGradient(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  gradient.addColorStop(0, "#1F3A5F");
  gradient.addColorStop(1, "#4A2A63");
  context.fillStyle = gradient;
  context.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  context.fillStyle = "#F7C948";
  context.beginPath();
  context.arc(VIDEO_WIDTH / 2 + Math.sin(time / 900) * 360, VIDEO_HEIGHT / 2, 90, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#FFFFFF";
  context.font = "600 56px system-ui, sans-serif";
  context.fillText(label, 64, 112);
  context.font = "400 40px system-ui, sans-serif";
  context.fillText(new Date().toLocaleTimeString(), 64, VIDEO_HEIGHT - 64);
}

/** Animated canvas camera; `label` is drawn on it (the room passes the display name). */
export function createFakeVideoStream(label = "FAKE CAMERA"): MediaStream {
  const canvas = document.createElement("canvas");
  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;
  const context = canvas.getContext("2d");
  const stream = canvas.captureStream(30);
  if (!context) return stream;
  drawFrame(context, label, performance.now());
  const timer = window.setInterval(() => drawFrame(context, label, performance.now()), FRAME_MS);
  watchStopped(stream, () => window.clearInterval(timer));
  return stream;
}

/** A 220 Hz tone whose volume pulses, so level meters rise and fall. */
export function createFakeAudioStream(): MediaStream {
  const audio = getAudioContext();
  const tone = audio.createOscillator();
  tone.frequency.value = 220;
  const volume = audio.createGain();
  volume.gain.value = TONE_GAIN;
  const pulse = audio.createOscillator();
  pulse.frequency.value = PULSE_HZ;
  const pulseDepth = audio.createGain();
  pulseDepth.gain.value = TONE_GAIN;
  pulse.connect(pulseDepth).connect(volume.gain);
  const destination = audio.createMediaStreamDestination();
  tone.connect(volume).connect(destination);
  tone.start();
  pulse.start();
  watchStopped(destination.stream, () => {
    tone.stop();
    pulse.stop();
    volume.disconnect();
    pulseDepth.disconnect();
  });
  return destination.stream;
}

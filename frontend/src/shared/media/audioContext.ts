/**
 * One shared AudioContext for level meters and the synthetic microphone.
 * Browsers start it suspended until a user gesture, so it resumes on the next
 * pointer/key press (autoplay policy).
 */
import { warnOnFailure } from "@/shared/lib/logger";

let context: AudioContext | null = null;

function resumeOnGesture(audio: AudioContext) {
  const resume = () => {
    if (audio.state === "suspended") void audio.resume().catch(warnOnFailure("media: AudioContext resume failed"));
  };
  window.addEventListener("pointerdown", resume, { capture: true });
  window.addEventListener("keydown", resume, { capture: true });
}

export function getAudioContext(): AudioContext {
  if (!context) {
    context = new AudioContext();
    resumeOnGesture(context);
  }
  if (context.state === "suspended") void context.resume().catch(warnOnFailure("media: AudioContext resume failed"));
  return context;
}

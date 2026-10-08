/**
 * What the toolbar's Audio and Video buttons show (PRD §8.5.3, spec 05 §5.3 [J]).
 * A pending request wins over everything (the browser prompt is open), then a blocked device.
 */
export type AudioControlState = "joining" | "blocked" | "muted" | "live";
export type VideoControlState = "starting" | "blocked" | "on" | "off";

export function audioControlState({ joining, blocked, muted }: { joining: boolean; blocked: boolean; muted: boolean }): AudioControlState {
  if (joining) return "joining";
  if (blocked) return "blocked";
  return muted ? "muted" : "live";
}

export function videoControlState({ starting, blocked, on }: { starting: boolean; blocked: boolean; on: boolean }): VideoControlState {
  if (starting) return "starting";
  if (blocked) return "blocked";
  return on ? "on" : "off";
}

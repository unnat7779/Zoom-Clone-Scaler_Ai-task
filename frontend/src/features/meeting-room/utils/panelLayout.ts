/**
 * Where the right panels go:
 * - side: Zoom's 400px column next to the stage (PRD §8.7);
 * - floating: when the stage would drop below 480px (a tablet in portrait, the in-shell room at
 *   768), Zoom pops the panel out into a 400×508 window over the stage (spec 05 §8.1), so the
 *   stage and the toolbar stay usable;
 * - sheet: phones, a full-screen sheet (DV10).
 */
export type PanelLayout = "side" | "floating" | "sheet";

const PANEL_WIDTH = 400;
const MIN_STAGE = 480;

/** `roomWidth` 0 = not measured yet → the desktop side column (no flash on first paint). */
export function panelLayoutFor(roomWidth: number, phone: boolean): PanelLayout {
  if (phone) return "sheet";
  return roomWidth > 0 && roomWidth - PANEL_WIDTH < MIN_STAGE ? "floating" : "side";
}

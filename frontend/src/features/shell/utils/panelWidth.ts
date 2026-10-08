/** Activity Center panel width when it opens: 328 [M] (content column 1280 → 946 at 1366×768). */
export const PANEL_DEFAULT_WIDTH = 328;
/** Drag range [D]: never narrower than Zoom's default, at most 600 wide. */
export const PANEL_MAX_WIDTH = 600;
/** The content column keeps at least this much room while the panel is dragged wider [D]. */
export const CONTENT_MIN_WIDTH = 400;
/** One arrow-key step on the resize handle [D]. */
export const PANEL_KEY_STEP = 16;

/**
 * Clamps a dragged panel width to [328, 600], leaving the content column at least 400px of the
 * `room` the two share (content column + panel). Never below the default, even in a tight window.
 */
export function clampPanelWidth(width: number, room: number): number {
  const max = Math.max(PANEL_DEFAULT_WIDTH, Math.min(PANEL_MAX_WIDTH, room - CONTENT_MIN_WIDTH));
  return Math.round(Math.min(max, Math.max(PANEL_DEFAULT_WIDTH, width)));
}

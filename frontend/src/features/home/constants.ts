/** Home feature constants (PRD §7.1, §7.2). */

/** URL search param holding the calendar widget's selected day (`/wc/home?day=2026-10-08`) [D]. */
export const DAY_PARAM = "day";

/** Recent meetings card: newest ended instances shown (PRD §7.1.9). */
export const RECENT_MEETINGS_LIMIT = 5;

/** A meeting is "Starting soon" this long before it starts, and keeps its action button this long after [D]. */
export const SOON_WINDOW_MS = 15 * 60_000;

/** A short (landscape) viewport, where floating panels must not run off the bottom [D]; the CSS uses the same 540px. */
export const SHORT_VIEWPORT_QUERY = "(max-height: 540px)";

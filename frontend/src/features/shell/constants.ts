/** DOM ids that tie the Activity Center bell, panel and tab panel together (aria-controls, focus return). */
export const ACTIVITY_IDS = {
  toggle: "activity-center-toggle",
  panel: "activity-center-panel",
  tabpanel: "activity-center-tabpanel",
} as const;

/** Exit fades before the overlay unmounts (keep in sync with the CSS): MUI Fade .195s (Search, PRD §6.4), History 200ms (§6.3). */
export const SEARCH_EXIT_MS = 195;
export const HISTORY_EXIT_MS = 200;

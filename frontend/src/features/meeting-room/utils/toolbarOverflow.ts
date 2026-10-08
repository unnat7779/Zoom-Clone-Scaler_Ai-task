/**
 * Toolbar overflow (PRD §8.5.5 [M] / U14 [D]): when the stage narrows (a panel
 * open → 880), middle buttons that don't fit move into More, in the order
 * Host tools → Share → React → Chat. Widths are the measured button widths.
 * A narrow stage on a wider viewport (in-shell tablet, a panel open) keeps Zoom's
 * full-size buttons and only overflows more of them.
 *
 * The compact bar (DV10, PRD §11.5.3) is used on phones in either orientation, and on any
 * stage too narrow for even the smallest full-size bar (a tablet in portrait with a side
 * panel): Audio · Video | Participants · Chat · More | End/Leave, the rest in More. Its
 * buttons share the width evenly (CSS), so it fits every phone (6 × 60px at 360).
 *
 * An item picked from More is "promoted" (spec 05 §5.3 [M]): it gets a temporary toolbar
 * button after a 1px divider, just before More. It does not push other buttons into More
 * (room-33 / room-34: at 880 Breakout Rooms sits next to Share with only Host tools in More);
 * it is left out when even that does not fit, and never shown on the compact phone bar.
 */
export type MidItem = "participants" | "chat" | "react" | "share" | "hostTools";

/** The More extras that can be promoted (spec 05 §6.6). */
export type ExtraItem = "captions" | "breakout" | "whiteboards" | "settings" | "stopIncomingVideo";

const WIDTH: Record<MidItem | "more", number> = {
  participants: 91,
  chat: 86,
  react: 86,
  share: 86,
  hostTools: 86,
  more: 86,
};
/** Promoted buttons: Show Captions 108 and Breakout Rooms 116 [M]; the others from their labels [D] */
const PROMOTED_WIDTH: Record<ExtraItem, number> = {
  captions: 108,
  breakout: 116,
  whiteboards: 90,
  settings: 86,
  stopIncomingVideo: 136,
};
/** `#footer-temporary-icon-divider`: a 1px line with 8px margins */
const PROMOTED_DIVIDER = 17;
/** Audio + Video (left) and End (right) */
const SIDES_WIDTH = 90 + 90 + 86;
/** breathing room on each side of the middle group [D]: at 880 Host tools overflows, as in Zoom */
const MIN_GAP = 60;
/** the gap left on each side with a promoted button [D]: room-33 keeps ≈23px at 880 */
const PROMOTED_MIN_GAP = 16;
const OVERFLOW_ORDER: MidItem[] = ["hostTools", "share", "react", "chat"];

/** The compact bar keeps these in the middle (with More); everything else is in More. */
const COMPACT_INLINE: MidItem[] = ["participants", "chat"];
/** The smallest full-size bar: Audio · Video | Participants · More | End (90 + 90 + 91 + 86 + 86). */
export const MIN_FULL_TOOLBAR = SIDES_WIDTH + WIDTH.participants + WIDTH.more;

/** Phones always get the compact bar; other screens only when the stage can't hold the full-size one. */
export function isCompactToolbar(stageWidth: number, phone: boolean): boolean {
  return phone || (stageWidth > 0 && stageWidth < MIN_FULL_TOOLBAR);
}

export interface ToolbarSplit {
  inline: MidItem[];
  overflow: MidItem[];
  /** the promoted item when its button fits, else null (it stays in More) */
  promoted: ExtraItem | null;
}

export function splitToolbar(items: MidItem[], stageWidth: number, compact: boolean, promoted: ExtraItem | null = null): ToolbarSplit {
  if (compact) {
    return {
      inline: items.filter((item) => COMPACT_INLINE.includes(item)),
      overflow: items.filter((item) => !COMPACT_INLINE.includes(item)),
      promoted: null,
    };
  }
  const available = stageWidth - SIDES_WIDTH - 2 * MIN_GAP;
  const inline = [...items];
  const overflow: MidItem[] = [];
  const total = () => inline.reduce((sum, item) => sum + WIDTH[item], WIDTH.more);
  for (const candidate of OVERFLOW_ORDER) {
    if (total() <= available) break;
    const index = inline.indexOf(candidate);
    if (index < 0) continue;
    inline.splice(index, 1);
    overflow.push(candidate);
  }
  const promotedFits =
    promoted !== null && total() + PROMOTED_DIVIDER + PROMOTED_WIDTH[promoted] <= stageWidth - SIDES_WIDTH - 2 * PROMOTED_MIN_GAP;
  return { inline, overflow, promoted: promotedFits ? promoted : null };
}

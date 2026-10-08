"use client";

import { DEVICE_TILES, EXTRA_ORDER, EXTRA_TILES, type MoreTile, OVERFLOW_TILES, isExtraItem } from "../components/toolbar/moreMenuItems";
import { useMeetingRoom } from "../realtime/useMeetingRoom";
import { useRoomUi } from "../state/useRoomUi";
import type { ExtraItem, MidItem } from "../utils/toolbarOverflow";
import { useMoreAction } from "./useMoreAction";

/**
 * More tiles in two groups (Zoom separates them with a full-row divider when both are there):
 * the toolbar items — overflowed buttons, then the device menus (compact bar: its carets are
 * hidden) — and the static extras, minus the one already promoted to the toolbar ("items
 * already on the toolbar are omitted", spec 05 §6.6).
 */
export function useMoreMenuTiles(overflow: MidItem[], promoted: ExtraItem | null, deviceTiles: boolean, onClose: () => void) {
  const { isHost } = useMeetingRoom();
  const { promote, resetToolbar } = useRoomUi();
  const perform = useMoreAction();
  const toolbarTiles: MoreTile[] = [...overflow.map((item) => OVERFLOW_TILES[item]), ...(deviceTiles ? DEVICE_TILES : [])];
  const extraTiles = EXTRA_ORDER.filter((item) => item !== promoted)
    .map((item) => EXTRA_TILES[item])
    .filter((tile) => isHost || !tile.hostOnly);

  /** Choosing a tile closes the menu first and promotes an extra to the toolbar (spec 05 §6.6). */
  const run = ({ key, action }: MoreTile) => {
    onClose();
    if (isExtraItem(key)) promote(key);
    perform(action);
  };

  /** "Reset to default · Reset": drops the promoted button. */
  const reset = () => {
    resetToolbar();
    onClose();
  };

  return { toolbarTiles, extraTiles, run, reset };
}

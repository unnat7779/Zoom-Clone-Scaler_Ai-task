"use client";

import { type RefObject, useRef } from "react";
import { useMenuNavigation } from "@/shared/ui";
import { useKeepInRoom } from "../../hooks/useKeepInRoom";
import { useMoreMenuTiles } from "../../hooks/useMoreMenuTiles";
import { usePhoneRoom } from "../../hooks/usePhoneRoom";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useRestoreFocus } from "../../hooks/useRestoreFocus";
import type { ExtraItem, MidItem } from "../../utils/toolbarOverflow";
import { BottomSheet } from "../menus/BottomSheet";
import type { MoreTile } from "./moreMenuItems";
import styles from "./MoreMenu.module.css";

interface MoreMenuProps {
  anchorRef: RefObject<HTMLElement | null>;
  overflow: MidItem[];
  /** the extra shown as a temporary toolbar button (left out of the grid) */
  promoted: ExtraItem | null;
  /** the compact bar hides the Audio / Video carets: offer their device menus here */
  deviceTiles: boolean;
  onClose: () => void;
}

/**
 * 3-column tile grid above More (PRD §8.6.7): overflowed toolbar buttons (still working),
 * a full-row divider, then the static extras. Shifted left when it would leave the room (narrow stages); on phones a
 * bottom sheet with a 4-column grid of 72px tiles [D].
 */
export function MoreMenu({ anchorRef, overflow, promoted, deviceTiles, onClose }: MoreMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const phone = usePhoneRoom();
  const { toolbarTiles, extraTiles, run, reset } = useMoreMenuTiles(overflow, promoted, deviceTiles, onClose);
  const renderTile = (tile: MoreTile) => (
    <button key={tile.key} type="button" role="menuitem" className={styles.tile} onClick={() => run(tile)}>
      <tile.Icon />
      <span className={styles.label}>{tile.label}</span>
    </button>
  );
  usePopoverDismiss([ref, anchorRef], true, onClose);
  useKeepInRoom(ref, !phone);
  useRestoreFocus(true, ref);
  const onKeyDown = useMenuNavigation(ref, true);

  const content = (
    <>
      <div className={styles.grid}>
        {toolbarTiles.map(renderTile)}
        {toolbarTiles.length > 0 && extraTiles.length > 0 ? <div className={styles.groupDivider} role="separator" /> : null}
        {extraTiles.map(renderTile)}
      </div>
      <div className={styles.divider} />
      <div className={styles.footer}>
        <span className={styles.footerText}>Reset to default</span>
        <button type="button" className={styles.reset} onClick={reset}>
          Reset
        </button>
      </div>
    </>
  );
  if (phone) {
    return (
      <BottomSheet ref={ref} role="menu" className={styles.sheet} aria-label="More meeting control" onKeyDown={onKeyDown}>
        {content}
      </BottomSheet>
    );
  }
  return (
    <div ref={ref} className={styles.menu} role="menu" aria-label="More meeting control" onKeyDown={onKeyDown}>
      {content}
    </div>
  );
}

"use client";

import type { RefObject } from "react";
import clsx from "clsx";
import { RoomFloating } from "../../menus/RoomFloating";
import { useMeetingRoom } from "../../../realtime/useMeetingRoom";
import { useRoomUi } from "../../../state/useRoomUi";
import styles from "./FooterMoreMenu.module.css";

interface FooterMoreMenuProps {
  open: boolean;
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Ask all to unmute · Mute all upon entry (✓ after Mute All) · Host tools for participants — static. */
export function FooterMoreMenu({ open, anchorRef, onClose }: FooterMoreMenuProps) {
  const { settings } = useMeetingRoom();
  const { openHostTools } = useRoomUi();
  return (
    <RoomFloating open={open} onClose={onClose} anchorRef={anchorRef} placement="top-end" className={styles.menu} aria-label="More">
      <button type="button" role="menuitem" className={styles.item} onClick={onClose}>
        Ask all to unmute
      </button>
      <button type="button" role="menuitem" className={clsx(styles.item, settings.mute_on_entry && styles.checked)} onClick={onClose}>
        Mute all upon entry
      </button>
      <button
        type="button"
        role="menuitem"
        className={styles.item}
        onClick={() => {
          onClose();
          openHostTools("participants");
        }}
      >
        Host tools for participants
      </button>
    </RoomFloating>
  );
}

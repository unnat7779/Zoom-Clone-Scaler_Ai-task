"use client";

import { type RefObject, useRef } from "react";
import { MenuItem } from "@/shared/ui";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useRoomUi } from "../../state/useRoomUi";
import { RoomDropdown } from "../menus/RoomDropdown";
import styles from "./CaretMenu.module.css";

interface ShareMenuProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Share caret (PRD §8.6.5): one item, opening Host tools › Share (static). */
export function ShareMenu({ anchorRef, onClose }: ShareMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { openHostTools } = useRoomUi();
  usePopoverDismiss([ref, anchorRef], true, onClose);
  return (
    <RoomDropdown ref={ref} className={styles.menu} aria-label="Host tools for share">
      <MenuItem onSelect={() => openHostTools("share")}>Host tools for share</MenuItem>
    </RoomDropdown>
  );
}

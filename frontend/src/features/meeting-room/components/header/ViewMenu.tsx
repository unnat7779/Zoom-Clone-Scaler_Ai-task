"use client";

import { type RefObject, useRef, useState } from "react";
import { RoomChevronRightIcon } from "@/shared/icons/generated/RoomChevronRightIcon";
import { RoomViewGalleryIcon } from "@/shared/icons/generated/RoomViewGalleryIcon";
import { RoomViewMultispeakerIcon } from "@/shared/icons/generated/RoomViewMultispeakerIcon";
import { RoomViewSpeakerMenuIcon } from "@/shared/icons/generated/RoomViewSpeakerMenuIcon";
import { MenuDivider, MenuItem } from "@/shared/ui";
import { useFullscreen } from "../../hooks/useFullscreen";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useRoomUi } from "../../state/useRoomUi";
import { RoomDropdown } from "../menus/RoomDropdown";
import styles from "./ViewMenu.module.css";

const SORT_OPTIONS = [
  "First Name (A - Z)",
  "First Name (Z - A)",
  "Last Name (A - Z)",
  "Last Name (Z - A)",
  "Entry Time (First - Last)",
  "Entry Time (Last - First)",
];

interface ViewMenuProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Speaker / Gallery, Hide Self View and Fullscreen work; the other rows are static (PRD §2.2). */
export function ViewMenu({ anchorRef, onClose }: ViewMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [sorting, setSorting] = useState(false);
  const { view, setView, hideSelfView, toggleHideSelfView, roomRef } = useRoomUi();
  const fullscreen = useFullscreen(roomRef);
  usePopoverDismiss([ref, anchorRef], true, onClose);
  const choose = (action: () => void) => () => {
    action();
    onClose();
  };

  if (sorting) {
    return (
      <RoomDropdown ref={ref} className={styles.menu} aria-label="Sort Gallery By">
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option} className={styles.item} onSelect={onClose}>
            {option}
          </MenuItem>
        ))}
      </RoomDropdown>
    );
  }

  return (
    <RoomDropdown ref={ref} className={styles.menu} aria-label="View">
      <MenuItem className={styles.item} selected={view === "speaker"} onSelect={choose(() => setView("speaker"))}>
        Speaker View
        <RoomViewSpeakerMenuIcon className={styles.icon} />
      </MenuItem>
      <MenuItem className={styles.item} selected={view === "gallery"} onSelect={choose(() => setView("gallery"))}>
        Gallery View
        <RoomViewGalleryIcon className={styles.icon} />
      </MenuItem>
      <MenuItem className={styles.item} onSelect={onClose}>
        Multi-speaker View
        <RoomViewMultispeakerIcon className={styles.icon} />
      </MenuItem>
      <MenuDivider />
      <MenuItem className={styles.item} onSelect={() => setSorting(true)}>
        Sort Gallery By
        <RoomChevronRightIcon className={styles.chevron} />
      </MenuItem>
      <MenuItem className={styles.item} onSelect={onClose}>
        Follow Host&apos;s Video Order
      </MenuItem>
      <MenuDivider />
      <MenuItem className={styles.item} onSelect={choose(toggleHideSelfView)}>
        {hideSelfView ? "Show Self View" : "Hide Self View"}
      </MenuItem>
      <MenuItem className={styles.item} onSelect={onClose}>
        Hide Non-video Participants
      </MenuItem>
      <MenuDivider />
      <MenuItem className={styles.item} onSelect={choose(fullscreen.toggle)}>
        {fullscreen.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </MenuItem>
    </RoomDropdown>
  );
}

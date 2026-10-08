"use client";

import { type RefObject, useRef } from "react";
import { MenuItem } from "@/shared/ui";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { useRoomUi } from "../../state/useRoomUi";
import { RoomDropdown } from "../menus/RoomDropdown";
import styles from "./CaretMenu.module.css";

interface ParticipantsMenuProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onCopyLink: () => void;
}

/** Participants caret (PRD §8.6.4): Invite ... · Copy invite link · Host tools for participants (host). */
export function ParticipantsMenu({ anchorRef, onClose, onCopyLink }: ParticipantsMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isHost } = useMeetingRoom();
  const { setInviteOpen, openHostTools } = useRoomUi();
  usePopoverDismiss([ref, anchorRef], true, onClose);

  return (
    <RoomDropdown ref={ref} className={styles.menu} aria-label="Participants Settings">
      <MenuItem onSelect={() => setInviteOpen(true)}>Invite ...</MenuItem>
      <MenuItem
        onSelect={() => {
          onCopyLink();
          onClose();
        }}
      >
        Copy invite link
      </MenuItem>
      {isHost ? <MenuItem onSelect={() => openHostTools("participants")}>Host tools for participants</MenuItem> : null}
    </RoomDropdown>
  );
}

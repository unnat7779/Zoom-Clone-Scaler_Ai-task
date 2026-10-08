"use client";

import type { RefObject } from "react";
import clsx from "clsx";
import { RoomFloating } from "../../menus/RoomFloating";
import { MEETING_GROUP_CHAT } from "../../../hooks/useChatComposer";
import { useParticipants } from "../../../realtime/useParticipants";
import styles from "./ChatRecipientMenu.module.css";

interface ChatRecipientMenuProps {
  open: boolean;
  anchorRef: RefObject<HTMLButtonElement | null>;
  selected: string;
  onSelect: (recipient: string) => void;
  onClose: () => void;
}

/** "Meeting Group Chat" ✓ + every other participant; choosing only changes the pill text. */
export function ChatRecipientMenu({ open, anchorRef, selected, onSelect, onClose }: ChatRecipientMenuProps) {
  const { remotes } = useParticipants();
  const options = [MEETING_GROUP_CHAT, ...remotes.map((participant) => participant.display_name)];
  return (
    <RoomFloating open={open} onClose={onClose} anchorRef={anchorRef} placement="top-start" className={styles.menu} aria-label="Send to">
      {options.map((option, index) => (
        <button
          key={`${option}-${index}`}
          type="button"
          role="menuitemradio"
          aria-checked={option === selected}
          className={clsx(styles.item, option === selected && styles.checked)}
          onClick={() => {
            onSelect(option);
            onClose();
          }}
        >
          {option}
        </button>
      ))}
    </RoomFloating>
  );
}

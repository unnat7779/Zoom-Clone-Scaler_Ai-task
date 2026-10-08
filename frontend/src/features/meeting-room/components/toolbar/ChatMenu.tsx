"use client";

import { type RefObject, useRef } from "react";
import { MenuGroupTitle, MenuItem } from "@/shared/ui";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { RoomDropdown } from "../menus/RoomDropdown";
import styles from "./CaretMenu.module.css";

const OPTIONS = ["No one", "Host and co-hosts", "Everyone", "Everyone and anyone directly"];

interface ChatMenuProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Chat caret "Chat Settings" — Static UI only (chat is out of scope, PRD §2.2). */
export function ChatMenu({ anchorRef, onClose }: ChatMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePopoverDismiss([ref, anchorRef], true, onClose);
  return (
    <RoomDropdown ref={ref} className={styles.menu} aria-label="Chat Settings">
      <MenuGroupTitle>Participants Can Chat with:</MenuGroupTitle>
      {OPTIONS.map((option) => (
        <MenuItem key={option} selected={option === "Everyone and anyone directly"} onSelect={onClose}>
          {option}
        </MenuItem>
      ))}
    </RoomDropdown>
  );
}

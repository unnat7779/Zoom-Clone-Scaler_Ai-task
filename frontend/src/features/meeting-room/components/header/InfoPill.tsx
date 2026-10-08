"use client";

import type { Ref } from "react";
import { RoomInfoIcon } from "@/shared/icons/generated/RoomInfoIcon";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import styles from "./InfoPill.module.css";

interface InfoPillProps {
  ref: Ref<HTMLButtonElement>;
  open: boolean;
  onClick: () => void;
}

/** Left of the header: ⓘ + meeting topic; opens the Meeting information popover. */
export function InfoPill({ ref, open, onClick }: InfoPillProps) {
  const { meeting } = useMeetingRoom();
  return (
    <div className={styles.wrap}>
      <button
        ref={ref}
        type="button"
        className={styles.button}
        aria-label="Meeting information"
        aria-expanded={open}
        onClick={onClick}
      >
        <RoomInfoIcon className={styles.icon} />
        <span className={styles.title}>{meeting?.topic ?? ""}</span>
      </button>
    </div>
  );
}

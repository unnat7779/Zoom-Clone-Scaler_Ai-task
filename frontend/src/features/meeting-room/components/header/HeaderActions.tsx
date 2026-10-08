"use client";

import type { RefObject } from "react";
import clsx from "clsx";
import { RoomAiIcon } from "@/shared/icons/generated/RoomAiIcon";
import { RoomEncryptionIcon } from "@/shared/icons/generated/RoomEncryptionIcon";
import { RoomSwitchNativeIcon } from "@/shared/icons/generated/RoomSwitchNativeIcon";
import { RoomViewGalleryIcon } from "@/shared/icons/generated/RoomViewGalleryIcon";
import { RoomViewSpeakerIcon } from "@/shared/icons/generated/RoomViewSpeakerIcon";
import { useRoomUi } from "../../state/useRoomUi";
import styles from "./HeaderActions.module.css";

interface HeaderActionsProps {
  encryptionRef: RefObject<HTMLButtonElement | null>;
  viewRef: RefObject<HTMLButtonElement | null>;
  encryptionOpen: boolean;
  viewOpen: boolean;
  onEncryption: () => void;
  onView: () => void;
}

/** Encryption · Zoom AI (static) · divider · View · Switch to Zoom Workplace Client (static). */
export function HeaderActions({ encryptionRef, viewRef, encryptionOpen, viewOpen, onEncryption, onView }: HeaderActionsProps) {
  const { view } = useRoomUi();
  const ViewIcon = view === "gallery" ? RoomViewGalleryIcon : RoomViewSpeakerIcon;
  return (
    <>
      <button
        ref={encryptionRef}
        type="button"
        className={clsx(styles.circle, styles.encryption)}
        aria-label="Encryption information"
        aria-expanded={encryptionOpen}
        onClick={onEncryption}
      >
        <RoomEncryptionIcon />
      </button>
      <button type="button" className={clsx(styles.circle, styles.ai)} aria-label="Zoom AI">
        <RoomAiIcon />
      </button>
      <span className={styles.divider} aria-hidden />
      <button
        ref={viewRef}
        type="button"
        className={styles.view}
        aria-label="View"
        aria-haspopup="menu"
        aria-expanded={viewOpen}
        onClick={onView}
      >
        <ViewIcon />
      </button>
      <button type="button" className={styles.switch} aria-label="Switch to Zoom Workplace Client">
        <RoomSwitchNativeIcon />
      </button>
    </>
  );
}

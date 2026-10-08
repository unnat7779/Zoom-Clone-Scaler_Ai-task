"use client";

import type { RefObject } from "react";
import { MEDIA, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import type { User } from "@/shared/types/api";
import type { PresenceStatus } from "@/shared/ui/Avatar";
import { Popover } from "@/shared/ui/Popover";
import { ProfileMenuBody } from "./ProfileMenuBody";
import { ProfileSheetHeader } from "./ProfileSheetHeader";
import styles from "./ProfileMenu.module.css";

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  user: User;
  presence: PresenceStatus;
}

/**
 * Static profile placeholder menu (PRD §6.6): 268px wide, 4px under the avatar, `opacity .3s linear`.
 * At ≤768px it is a full-screen sheet (not anchored) with a header and a close button (§11.1).
 */
export function ProfileMenu({ open, onClose, anchorRef, user, presence }: ProfileMenuProps) {
  const sheet = useMediaQuery(MEDIA.tablet);
  return (
    <Popover
      key={sheet ? "sheet" : "menu"}
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      anchored={!sheet}
      placement="bottom-end"
      offset={4}
      motion="fade-linear"
      className={styles.popover}
      aria-label="Profile"
    >
      <ProfileSheetHeader onClose={onClose} />
      <ProfileMenuBody user={user} presence={presence} sheet={sheet} onClose={onClose} />
    </Popover>
  );
}

"use client";

import { useRef } from "react";
import clsx from "clsx";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { avatarColorFromHex } from "@/shared/lib/avatar";
import touch from "@/shared/styles/touch.module.css";
import { Avatar } from "@/shared/ui/Avatar";
import { useShellContext } from "../../context/ShellContext";
import { useFocusReturn } from "../../hooks/useFocusReturn";
import { useShellMenu } from "../../hooks/useShellIntegration";
import { ProfileMenu } from "./ProfileMenu";
import styles from "./ProfileMenu.module.css";

/**
 * Header avatar (32px, radius 10, presence glyph) that opens the profile menu (PRD §6.2, §6.6).
 * Closing the menu (Escape, a row, ⌘K) returns focus to the avatar.
 */
export function ProfileButton() {
  const { user } = useCurrentUser();
  const shell = useShellContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menu = useShellMenu("profile");
  useFocusReturn(menu.open, buttonRef);

  if (!user) return <span className={styles.avatarSlot} />;
  const presence = shell?.inMeeting ? "meeting" : (shell?.status ?? "available");

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={clsx(styles.avatarButton, touch.target)}
        aria-label={`${user.display_name}, profile options`}
        aria-haspopup="true"
        aria-expanded={menu.open}
        onClick={menu.toggle}
      >
        <Avatar name={user.display_name} color={avatarColorFromHex(user.avatar_color)} presence={presence} />
      </button>
      <ProfileMenu open={menu.open} onClose={menu.close} anchorRef={buttonRef} user={user} presence={presence} />
    </>
  );
}

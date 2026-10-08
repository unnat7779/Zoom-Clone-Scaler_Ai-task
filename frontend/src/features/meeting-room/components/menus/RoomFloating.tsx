"use client";

import { type ReactNode, type RefObject, useRef } from "react";
import clsx from "clsx";
import { useMenuNavigation } from "@/shared/ui";
import { usePhoneRoom } from "../../hooks/usePhoneRoom";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useRestoreFocus } from "../../hooks/useRestoreFocus";
import { type RoomPlacement, useRoomAnchor } from "../../hooks/useRoomAnchor";
import { BottomSheet } from "./BottomSheet";
import styles from "./RoomFloating.module.css";

interface RoomFloatingProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  placement: RoomPlacement;
  offset?: number;
  role?: "menu" | "dialog";
  "aria-label": string;
  className?: string;
  children: ReactNode;
}

/**
 * Anchored menu layer rendered in place (no portal): it escapes the panels' scroll
 * clipping yet stays inside the room — and inside View → Fullscreen. Menus get the
 * first item focused on open, arrow-key navigation and focus back on the trigger.
 * On phones it is a bottom sheet with 48px rows instead [D].
 */
export function RoomFloating({ open, onClose, anchorRef, placement, offset = 4, role = "menu", className, children, ...aria }: RoomFloatingProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isMenu = role === "menu";
  const phone = usePhoneRoom();
  useRoomAnchor({ anchorRef, floatingRef: ref, open: open && !phone, placement, offset });
  usePopoverDismiss([ref, anchorRef], open, onClose);
  useRestoreFocus(open, ref);
  const onKeyDown = useMenuNavigation(ref, open && isMenu);
  if (!open) return null;
  if (phone) {
    return (
      <BottomSheet ref={ref} role={role} className={styles.sheet} onKeyDown={isMenu ? onKeyDown : undefined} {...aria}>
        {children}
      </BottomSheet>
    );
  }
  return (
    <div ref={ref} role={role} className={clsx(styles.floating, className)} onKeyDown={isMenu ? onKeyDown : undefined} {...aria}>
      {children}
    </div>
  );
}

"use client";

import { type ReactNode, type Ref, useRef } from "react";
import clsx from "clsx";
import { useMergedRef } from "@/shared/lib/mergeRefs";
import { Menu } from "@/shared/ui";
import { usePhoneRoom } from "../../hooks/usePhoneRoom";
import { useRestoreFocus } from "../../hooks/useRestoreFocus";
import { BottomSheet } from "./BottomSheet";
import styles from "./RoomDropdown.module.css";

interface RoomDropdownProps {
  ref?: Ref<HTMLDivElement>;
  /** positions the box (absolute) and may override fonts — not used for the phone sheet */
  className?: string;
  "aria-label": string;
  children: ReactNode;
}

/**
 * Dark dropdown box + keyboard-navigable menu list (shared `Menu`, dark tone). It is
 * mounted only while open: the first item takes focus and the trigger gets it back.
 * On phones the same menu is a bottom sheet with 48px rows [D].
 */
export function RoomDropdown({ ref, className, children, ...aria }: RoomDropdownProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRef(boxRef, ref);
  const phone = usePhoneRoom();
  useRestoreFocus(true, boxRef);
  const menu = (
    <Menu tone="dark" autoFocus className={phone ? styles.sheetMenu : undefined} {...aria}>
      {children}
    </Menu>
  );
  if (phone) return <BottomSheet ref={mergedRef}>{menu}</BottomSheet>;
  return (
    <div ref={mergedRef} className={clsx(styles.dropdown, className)}>
      {menu}
    </div>
  );
}

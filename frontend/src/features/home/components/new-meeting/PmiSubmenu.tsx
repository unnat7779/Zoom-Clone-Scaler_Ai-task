import type { KeyboardEvent, RefObject } from "react";
import { useMenuNavigation } from "@/shared/ui";
import { usePmiActions } from "../../hooks/usePmiActions";
import styles from "./NewMeetingPopover.module.css";

interface PmiSubmenuProps {
  pmi: string | null;
  menuRef: RefObject<HTMLDivElement | null>;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  /** closes the submenu and the New-meeting popover */
  onDone: () => void;
}

/** `.pmi-submenu-popover` 146×118 next to the PMI row (PRD §7.1.4). */
export function PmiSubmenu({ pmi, menuRef, onKeyDown, onDone }: PmiSubmenuProps) {
  const actions = usePmiActions(pmi, onDone);
  const onNavigate = useMenuNavigation(menuRef, false);
  const items = [
    { label: "Copy ID", onSelect: actions.copyId },
    { label: "Copy Invitation", onSelect: actions.copyInvitation },
    { label: "PMI Settings", onSelect: actions.openSettings },
  ];

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Personal Meeting ID options"
      className={styles.submenu}
      onKeyDown={(event) => {
        onNavigate(event);
        onKeyDown(event);
      }}
    >
      {items.map((item) => (
        <button key={item.label} type="button" role="menuitem" tabIndex={-1} className={styles.submenuItem} onClick={item.onSelect}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

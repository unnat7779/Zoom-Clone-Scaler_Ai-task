"use client";

import { type KeyboardEvent, type MouseEventHandler, type ReactNode, useRef } from "react";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";
import { JoinChevronSmallLeftIcon } from "@/shared/icons/generated/JoinChevronSmallLeftIcon";
import { Menu } from "@/shared/ui/Menu";
import { useSubmenuPosition } from "../../hooks/useSubmenuPosition";
import styles from "./ProfileSubmenu.module.css";

interface ProfileSubmenuProps {
  /** the row that opened it */
  row: HTMLElement;
  /** sheet header (≤768) and the list's accessible name */
  title: string;
  focusFirst: boolean;
  /** closes this submenu and focuses its row (Escape, ←, the sheet's back button) */
  onBack: () => void;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
  /** a nested submenu, rendered outside this list (its own arrow-key scope) */
  nested?: ReactNode;
}

/**
 * Profile-menu submenu (PRD §6.6, 01-shell-home §7.2–7.3): zoom-ui floating menu 232 wide, list
 * padding 12, `opacity .3s linear`, 3px left of its parent. At ≤768px it is a full-screen sheet with
 * a back header (`.common-header-profile__submenu-header`).
 */
export function ProfileSubmenu({ row, title, focusFirst, onBack, onMouseEnter, onMouseLeave, children, nested }: ProfileSubmenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useSubmenuPosition(panelRef, row);
  useEscapeKey(onBack);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft") return;
    event.stopPropagation();
    onBack();
  };

  return (
    <div
      ref={panelRef}
      data-profile-panel
      className={styles.panel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
    >
      <div className={styles.sheetHeader}>
        <button type="button" className={styles.back} onClick={onBack}>
          <JoinChevronSmallLeftIcon width={16} height={16} className={styles.backIcon} />
          <span className={styles.backLabel}>{title}</span>
        </button>
      </div>
      <Menu density="profile" autoFocus={focusFirst} aria-label={title}>
        {children}
      </Menu>
      {nested}
    </div>
  );
}

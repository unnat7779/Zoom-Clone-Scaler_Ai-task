import clsx from "clsx";
import { SchSubmenuChevronIcon } from "@/shared/icons/generated/SchSubmenuChevronIcon";
import styles from "./SideMenu.module.css";

interface CollapsedMenuBarProps {
  label: string;
  open: boolean;
  menuId: string;
  onToggle: () => void;
}

/**
 * ≤1023px: full-width 38px bar with the current section ("Meetings") and a 40×34 toggle (› / ⌄).
 * The whole bar is the toggle, so a tap anywhere on it opens the menu (Zoom: only the chevron).
 */
export function CollapsedMenuBar({ label, open, menuId, onToggle }: CollapsedMenuBarProps) {
  return (
    <button type="button" className={styles.collapsedBar} aria-expanded={open} aria-controls={menuId} onClick={onToggle}>
      <span className={styles.collapsedLabel}>{label}</span>
      <span className={styles.collapsedToggle}>
        <SchSubmenuChevronIcon width={12} height={12} className={clsx(styles.groupChevron, styles.collapsedChevron, { [styles.groupChevronOpen ?? ""]: open })} />
      </span>
    </button>
  );
}

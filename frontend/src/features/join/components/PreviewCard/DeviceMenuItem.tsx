import type { ReactNode } from "react";
import styles from "./DeviceMenu.module.css";

interface DeviceMenuItemProps {
  /** Zoom's aria-label: "{section title} {device}" */
  label: string;
  checked: boolean;
  onSelect: () => void;
  children: ReactNode;
}

/** `li.preview__dropdown-menuitem[role=menuitemradio]`; the checked row shows Zoom's SvgSelectedRight. */
export function DeviceMenuItem({ label, checked, onSelect, children }: DeviceMenuItemProps) {
  return (
    <li role="none">
      <button
        type="button"
        className={styles.item}
        role="menuitemradio"
        aria-checked={checked}
        aria-label={label}
        tabIndex={-1}
        onClick={onSelect}
      >
        {checked ? (
          <svg className={styles.check} viewBox="0 0 16 16" fill="none" aria-hidden>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4 8.5 6.286 11 12 5" />
          </svg>
        ) : null}
        <span>{children}</span>
      </button>
    </li>
  );
}

import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./HomeActions.module.css";

interface ActionButtonProps {
  /** aria-label, Zoom's: "New meeting" / "Join" / "Schedule" */
  label: string;
  /** orange: New meeting · blue: Join, Schedule */
  tone: "orange" | "blue";
  icon: ReactNode;
  /** content under the button (plain label, or label + chevron for New meeting) */
  caption: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

/** One 56px Home action column (PRD §7.1.3): rounded button that lifts on hover/focus, label below. */
export function ActionButton({ label, tone, icon, caption, disabled = false, onClick }: ActionButtonProps) {
  return (
    <div className={clsx(styles.column, { [styles.disabled ?? ""]: disabled })}>
      <button
        type="button"
        aria-label={label}
        className={clsx(styles.button, styles[tone])}
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </button>
      {caption}
    </div>
  );
}

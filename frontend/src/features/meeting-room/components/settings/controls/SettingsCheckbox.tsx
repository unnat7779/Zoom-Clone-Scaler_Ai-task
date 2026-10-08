"use client";

import clsx from "clsx";
import { useToggle } from "@/shared/hooks";
import styles from "./SettingsCheckbox.module.css";

interface SettingsCheckboxProps {
  label: string;
  /** controlled (wired to room state); otherwise the box toggles visually only (Static UI) */
  checked?: boolean;
  onChange?: () => void;
  defaultChecked?: boolean;
  className?: string;
}

/** Dark settings checkbox (spec 05 §12): 16px box, #707070 border, checked #0E71EB + white check. */
export function SettingsCheckbox({ label, checked, onChange, defaultChecked = false, className }: SettingsCheckboxProps) {
  const [localChecked, toggleLocal] = useToggle(defaultChecked);
  const controlled = checked !== undefined;
  return (
    <label className={clsx(styles.row, className)}>
      <input
        type="checkbox"
        className={styles.input}
        checked={controlled ? checked : localChecked}
        onChange={controlled ? onChange : toggleLocal}
      />
      <span className={styles.box} aria-hidden />
      <span className={styles.label}>{label}</span>
    </label>
  );
}

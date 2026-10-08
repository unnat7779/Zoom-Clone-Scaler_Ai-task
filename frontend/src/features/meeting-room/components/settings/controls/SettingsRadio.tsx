import clsx from "clsx";
import styles from "./SettingsRadio.module.css";

interface SettingsRadioProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
  /** Breakout Rooms draws Zoom's larger 16px radios with 16px labels (room-20) */
  variant?: "settings" | "breakout";
}

/** Dark settings radio (spec 05 §12): native, uncontrolled — the choice is visual only (Static UI). */
export function SettingsRadio({ name, label, defaultChecked = false, variant = "settings" }: SettingsRadioProps) {
  return (
    <label className={clsx(styles.row, variant === "breakout" && styles.breakout)}>
      <input type="radio" name={name} className={styles.input} defaultChecked={defaultChecked} />
      <span className={styles.dot} aria-hidden />
      {label}
    </label>
  );
}

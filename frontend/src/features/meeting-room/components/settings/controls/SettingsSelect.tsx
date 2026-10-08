import clsx from "clsx";
import { ChevronDownIcon } from "@/shared/icons/generated/ChevronDownIcon";
import type { MediaDeviceOption } from "@/shared/media";
import styles from "./SettingsSelect.module.css";

interface SettingsSelectProps {
  label: string;
  options: MediaDeviceOption[];
  value?: string;
  onChange?: (deviceId: string) => void;
  placeholder?: string;
  className?: string;
}

/** Dark device select of the Audio / Video panes (native, so it also works on phones). */
export function SettingsSelect({ label, options, value, onChange, placeholder = "Select...", className }: SettingsSelectProps) {
  const known = options.some((option) => option.deviceId === value);
  return (
    <span className={clsx(styles.wrap, className)}>
      <select
        className={styles.select}
        aria-label={label}
        value={known ? value : ""}
        disabled={options.length === 0}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {known ? null : (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.deviceId || option.label} value={option.deviceId}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className={styles.chevron} aria-hidden />
    </span>
  );
}

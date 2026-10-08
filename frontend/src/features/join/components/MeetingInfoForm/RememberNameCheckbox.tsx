import styles from "./RememberNameCheckbox.module.css";

interface RememberNameCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** `div.zm-checkbox.preview-remember-name` — 16px box, 4px gap, 13px/19.5px label. */
export function RememberNameCheckbox({ checked, onChange }: RememberNameCheckboxProps) {
  return (
    <label className={styles.row}>
      <input type="checkbox" className={styles.input} checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={styles.box} aria-hidden />
      <span className={styles.label}>Remember my name for future meetings</span>
    </label>
  );
}

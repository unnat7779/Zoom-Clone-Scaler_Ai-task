import styles from "./InfoPopover.module.css";

/** One label/value row of the Meeting information popover (120px label column). */
export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

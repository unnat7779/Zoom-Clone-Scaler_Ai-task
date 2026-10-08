import { Spinner } from "@/shared/ui";
import styles from "./LoadingOverlay.module.css";

/** `.zoom-loading` over the day list while a day loads or refreshes (PRD §7.1.8). */
export function LoadingOverlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.wrapper}>
        <Spinner size={32} tone="dark" label="Loading" />
      </div>
    </div>
  );
}

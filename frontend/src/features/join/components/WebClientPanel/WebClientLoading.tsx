import styles from "./WebClientLoading.module.css";

/**
 * `.pwa-webclient__loading`: centred `.pwa-webclient__loading-icon`, Zoom's 32×32 blue ring
 * (inline PNG from pwa-main.css), rotate-infinite 1.5s linear (PRD §7.2.8, critic C4).
 */
export function WebClientLoading() {
  return (
    <div className={styles.loading} role="status" aria-label="Loading">
      <span className={styles.spinner} />
    </div>
  );
}

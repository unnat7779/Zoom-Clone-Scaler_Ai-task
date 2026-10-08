import { WebClientLoading } from "./WebClientLoading";
import styles from "./WebClientLoading.module.css";

/** Full-viewport counterpart of the panel's loading state: white page, centred spinner. */
export function FullViewportLoading() {
  return (
    <div className={styles.page}>
      <WebClientLoading />
    </div>
  );
}

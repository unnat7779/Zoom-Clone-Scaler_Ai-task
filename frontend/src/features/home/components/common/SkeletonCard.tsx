import { SkeletonBar } from "./SkeletonBar";
import styles from "./SkeletonCard.module.css";

/** One `.loading-event-list` skeleton card (calendar first load, Recent meetings). */
export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden>
      <SkeletonBar className={styles.title} />
      <SkeletonBar className={styles.content} />
      <SkeletonBar className={styles.config} />
    </div>
  );
}

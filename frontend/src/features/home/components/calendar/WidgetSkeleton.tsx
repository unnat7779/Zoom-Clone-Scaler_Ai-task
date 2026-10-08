import { SkeletonBar } from "../common/SkeletonBar";
import { SkeletonCard } from "../common/SkeletonCard";
import styles from "./WidgetSkeleton.module.css";

/** `.sidebar-event-loading`: the widget's first-load skeleton (config bar + two cards, PRD §7.1.8). */
export function WidgetSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading meetings">
      <SkeletonBar className={styles.configBar} />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

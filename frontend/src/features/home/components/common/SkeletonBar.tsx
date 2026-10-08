import clsx from "clsx";
import styles from "./SkeletonBar.module.css";

/** One pulsing skeleton bar (`skeleton-pulse 1.5s`, PRD §5.8.16); size it with `className`. */
export function SkeletonBar({ className }: { className?: string }) {
  return <div className={clsx(styles.bar, className)} />;
}

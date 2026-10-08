import { formatClockTime, formatLongDate } from "@/shared/lib/format";
import styles from "./HomeClock.module.css";

/**
 * Clock block (PRD §7.1.2): `h:mm A` and `EEEE, MMMM d` in the browser time zone. `now` comes from
 * the minute-aligned `useClock`; it is null before hydration, when the block keeps its size empty.
 */
export function HomeClock({ now }: { now: Date | null }) {
  return (
    <div className={styles.clock}>
      <div className={styles.time}>{now ? formatClockTime(now) : null}</div>
      <div className={styles.date}>{now ? formatLongDate(now) : null}</div>
    </div>
  );
}

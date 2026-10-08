import clsx from "clsx";
import { MONTHS_SHORT } from "../../../utils/calendar";
import styles from "./DatePicker.module.css";

interface MonthGridProps {
  visibleMonth: Date;
  selected: Date;
  today: Date;
  onPick: (monthIndex: number) => void;
}

/** Month view (P2): 3×4 cells 54×32; months before this month are disabled. */
export function MonthGrid({ visibleMonth, selected, today, onPick }: MonthGridProps) {
  const year = visibleMonth.getFullYear();
  const thisMonth = today.getFullYear() * 12 + today.getMonth();
  return (
    <div className={styles.wideGrid}>
      {MONTHS_SHORT.map((label, index) => {
        const past = year * 12 + index < thisMonth;
        const isSelected = selected.getFullYear() === year && selected.getMonth() === index;
        const isCurrent = year * 12 + index === thisMonth;
        return (
          <button
            key={label}
            type="button"
            aria-disabled={past || undefined}
            aria-pressed={isSelected}
            className={clsx(styles.wideCell, {
              [styles.past ?? ""]: past,
              [styles.selected ?? ""]: isSelected,
              [styles.today ?? ""]: isCurrent && !isSelected,
            })}
            onClick={() => (past ? undefined : onPick(index))}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

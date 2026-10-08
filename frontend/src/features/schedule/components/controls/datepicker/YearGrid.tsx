import clsx from "clsx";
import { decadeStart } from "../../../utils/calendar";
import styles from "./DatePicker.module.css";

interface YearGridProps {
  visibleMonth: Date;
  selected: Date;
  today: Date;
  onPick: (year: number) => void;
}

/** Year view (P2): `2020 - 2029` with 2019…2030; past years disabled, next decade `#686F79`. */
export function YearGrid({ visibleMonth, selected, today, onPick }: YearGridProps) {
  const first = decadeStart(visibleMonth.getFullYear());
  const years = Array.from({ length: 12 }, (_, index) => first - 1 + index);
  return (
    <div className={styles.wideGrid}>
      {years.map((year) => {
        const past = year < today.getFullYear();
        const isSelected = year === selected.getFullYear();
        return (
          <button
            key={year}
            type="button"
            aria-disabled={past || undefined}
            aria-pressed={isSelected}
            className={clsx(styles.wideCell, {
              [styles.past ?? ""]: past,
              [styles.outside ?? ""]: !past && (year < first || year > first + 9),
              [styles.selected ?? ""]: isSelected,
            })}
            onClick={() => (past ? undefined : onPick(year))}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}

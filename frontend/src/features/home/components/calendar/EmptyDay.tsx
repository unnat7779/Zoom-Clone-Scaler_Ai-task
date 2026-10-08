import { format } from "date-fns";
import { HomeEmptyBeachIcon } from "@/shared/icons/generated/HomeEmptyBeachIcon";
import { WidgetTextButton } from "../common/WidgetTextButton";
import styles from "./EmptyDay.module.css";

interface EmptyDayProps {
  /** DV2: first later day with meetings → "Next: Thu, Oct 8" jumps there */
  nextDay: Date | null;
  onSelectDay: (day: Date) => void;
}

/** `.no__events--container` (PRD §7.1.8): beach illustration + "No meetings scheduled." */
export function EmptyDay({ nextDay, onSelectDay }: EmptyDayProps) {
  return (
    <div className={styles.empty}>
      <HomeEmptyBeachIcon className={styles.beach} />
      <div className={styles.text}>No meetings scheduled.</div>
      {nextDay ? <WidgetTextButton onClick={() => onSelectDay(nextDay)}>Next: {format(nextDay, "EEE, MMM d")}</WidgetTextButton> : null}
    </div>
  );
}

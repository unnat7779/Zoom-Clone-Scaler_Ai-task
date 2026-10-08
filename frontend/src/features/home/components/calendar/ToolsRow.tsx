import clsx from "clsx";
import { HomeCalNextIcon } from "@/shared/icons/generated/HomeCalNextIcon";
import { HomeCalPrevIcon } from "@/shared/icons/generated/HomeCalPrevIcon";
import { HomeCalTodayIcon } from "@/shared/icons/generated/HomeCalTodayIcon";
import touch from "@/shared/styles/touch.module.css";
import { IconButton } from "@/shared/ui";
import { CalendarMoreMenu } from "./CalendarMoreMenu";
import styles from "./ToolsRow.module.css";

interface ToolsRowProps {
  onToday: () => void;
  onShift: (days: number) => void;
  onRefresh: () => void;
}

/** `.data-tools` (PRD §7.1.6): Today pill (always enabled), previous / next day, "…" menu. */
export function ToolsRow({ onToday, onShift, onRefresh }: ToolsRowProps) {
  return (
    <div className={styles.toolsRow}>
      <div className={styles.toolsGroup}>
        <button type="button" className={clsx(styles.todayPill, touch.target)} onClick={onToday}>
          <HomeCalTodayIcon />
          Today
        </button>
        <IconButton label="Previous" size="sm" icon={<HomeCalPrevIcon />} className={clsx(styles.navButton, touch.target)} onClick={() => onShift(-1)} />
        <IconButton label="Next" size="sm" icon={<HomeCalNextIcon />} className={clsx(styles.navButton, touch.target)} onClick={() => onShift(1)} />
      </div>
      <CalendarMoreMenu onRefresh={onRefresh} />
    </div>
  );
}

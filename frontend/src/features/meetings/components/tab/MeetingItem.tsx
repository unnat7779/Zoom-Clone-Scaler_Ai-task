import type { KeyboardEvent } from "react";
import clsx from "clsx";
import type { MeetingRow } from "../../utils/rows";
import styles from "./MeetingItem.module.css";

interface MeetingItemProps {
  row: MeetingRow;
  selected: boolean;
  onSelect: (key: string) => void;
}

/** `.meetings__meeting-item` (PRD §7.4.2): 4 lines, 123px tall; click / Enter / Space selects. */
export function MeetingItem({ row, selected, onSelect }: MeetingItemProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect(row.key);
  };
  return (
    <div
      role="option"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={clsx(styles.item, { [styles.selected ?? ""]: selected })}
      onClick={() => onSelect(row.key)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.topic}>{row.topic}</div>
      <div className={styles.line}>{row.time}</div>
      <div className={clsx(styles.line, styles.ellipsis)}>Host: {row.host}</div>
      <div className={styles.line}>Meeting ID: {row.number}</div>
    </div>
  );
}

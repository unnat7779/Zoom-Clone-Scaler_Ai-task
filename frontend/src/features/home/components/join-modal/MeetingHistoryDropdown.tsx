import { type KeyboardEvent, type RefObject, useState } from "react";
import type { JoinHistoryEntry } from "../../types";
import { formatHistoryNumber } from "../../utils/joinInput";
import styles from "./MeetingHistoryDropdown.module.css";

interface MeetingHistoryDropdownProps {
  history: JoinHistoryEntry[];
  listRef: RefObject<HTMLDivElement | null>;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onChoose: (entry: JoinHistoryEntry) => void;
  onClear: () => void;
}

const activateOnKey = (action: () => void) => (event: KeyboardEvent<HTMLElement>) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  action();
};

/**
 * `.meeting-history` (PRD §7.2.6): previously joined meetings (a listbox; the focused row is the
 * selected option) + the "Clear History" button, 4px under the field; at most 8 rows tall.
 */
export function MeetingHistoryDropdown({ history, listRef, onKeyDown, onChoose, onClear }: MeetingHistoryDropdownProps) {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.history}>
      <div ref={listRef} className={styles.list} onKeyDown={onKeyDown}>
        <div role="listbox" aria-label="Meeting history list">
          {history.map((entry, index) => (
            <div
              key={entry.number}
              role="option"
              tabIndex={-1}
              aria-selected={index === active}
              aria-label={`the topic is ${entry.topic}, and ID is ${entry.number}`}
              className={styles.item}
              onFocus={() => setActive(index)}
              onClick={() => onChoose(entry)}
              onKeyDown={activateOnKey(() => onChoose(entry))}
            >
              <span className={styles.topic}>{entry.topic}</span>
              <span className={styles.number}>{formatHistoryNumber(entry.number)}</span>
            </div>
          ))}
        </div>
        <button type="button" tabIndex={-1} className={styles.item} onClick={onClear}>
          <span className={styles.clear}>Clear History</span>
        </button>
      </div>
    </div>
  );
}

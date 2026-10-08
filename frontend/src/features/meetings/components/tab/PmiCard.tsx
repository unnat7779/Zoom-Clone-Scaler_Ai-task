import clsx from "clsx";
import { formatMeetingNumber } from "@/shared/lib/format";
import styles from "./PmiCard.module.css";

interface PmiCardProps {
  number: string;
  selected: boolean;
  onSelect: () => void;
}

/** `.meetings__pmi` card (PRD §7.4.2): 328×78, hover #E7F1FD, selected #0E71EB with white text. */
export function PmiCard({ number, selected, onSelect }: PmiCardProps) {
  return (
    <>
      <button
        type="button"
        aria-pressed={selected}
        className={clsx(styles.card, { [styles.selected ?? ""]: selected })}
        onClick={onSelect}
      >
        <span className={styles.number}>{formatMeetingNumber(number)}</span>
        <span className={styles.label}>My Personal Meeting ID (PMI)</span>
      </button>
      <div className={styles.divider} />
    </>
  );
}

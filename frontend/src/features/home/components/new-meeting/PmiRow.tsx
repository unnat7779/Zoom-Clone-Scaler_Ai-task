import clsx from "clsx";
import { HomeMenuChevronRightIcon } from "@/shared/icons/generated/HomeMenuChevronRightIcon";
import { useSubmenu } from "../../hooks/useSubmenu";
import { PmiSubmenu } from "./PmiSubmenu";
import styles from "./NewMeetingPopover.module.css";

interface PmiRowProps {
  pmi: string | null;
  pmiFormatted: string | null;
  onDone: () => void;
}

/** Row 2 of the New-meeting popover: the PMI with a hover submenu (PRD §7.1.4). */
export function PmiRow({ pmi, pmiFormatted, onDone }: PmiRowProps) {
  const { open, rowRef, menuRef, hoverProps, onRowClick, onRowKeyDown, onMenuKeyDown } = useSubmenu();
  return (
    <div className={styles.pmiGroup} {...hoverProps}>
      <button
        ref={rowRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Personal Meeting ID ${pmiFormatted ?? ""}`.trim()}
        className={clsx(styles.row, styles.pmiRow)}
        onClick={onRowClick}
        onKeyDown={onRowKeyDown}
      >
        <span className={styles.pmiNumber}>{pmiFormatted}</span>
        <HomeMenuChevronRightIcon size={14} />
      </button>
      {open ? <PmiSubmenu pmi={pmi} menuRef={menuRef} onKeyDown={onMenuKeyDown} onDone={onDone} /> : null}
    </div>
  );
}

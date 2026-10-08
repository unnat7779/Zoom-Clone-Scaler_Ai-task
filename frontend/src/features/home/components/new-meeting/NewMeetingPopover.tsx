import type { RefObject } from "react";
import clsx from "clsx";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { Checkbox, Popover } from "@/shared/ui";
import { PmiRow } from "./PmiRow";
import styles from "./NewMeetingPopover.module.css";

interface NewMeetingPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  usePmi: boolean;
  onUsePmiChange: (usePmi: boolean) => void;
}

/**
 * New-meeting options (PRD §7.1.4): Prism popover centred 8px under the chevron with
 * "Use my Personal Meeting ID (PMI)" and the PMI row + submenu. Focus-trapped; Escape and
 * outside clicks close it.
 */
export function NewMeetingPopover({ open, onClose, anchorRef, usePmi, onUsePmiChange }: NewMeetingPopoverProps) {
  const { user } = useCurrentUser();
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      placement="bottom"
      offset={8}
      flip={false}
      variant="prism"
      motion="fade"
      trapFocus
      aria-label="New meeting options"
      className={styles.popover}
    >
      <div className={styles.panel}>
        <div className={clsx(styles.row, styles.checkboxRow)}>
          <Checkbox
            variant="pwa"
            checked={usePmi}
            onChange={onUsePmiChange}
            label={<span className={styles.checkboxText}>Use my Personal Meeting ID (PMI)</span>}
          />
        </div>
        <PmiRow pmi={user?.pmi ?? null} pmiFormatted={user?.pmi_formatted ?? null} onDone={onClose} />
      </div>
    </Popover>
  );
}

import { Button } from "@/shared/ui/Button";
import { StickyFooter } from "@/shared/ui/StickyFooter";
import styles from "./ScheduleActionBar.module.css";

/** `div.zoom-sticky` slot height (03-schedule.md §9): 24 + 32 + 24. */
const ACTION_BAR_HEIGHT = 80;
/** phones [D]: 12 + 44px touch-sized buttons + 12 */
const ACTION_BAR_PHONE_HEIGHT = 68;

interface ScheduleActionBarProps {
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

/** Sticky Save / Cancel bar: 80px slot, pinned to the viewport bottom until scrolled into view (PRD §7.6.7). */
export function ScheduleActionBar({ onSave, onCancel, saving }: ScheduleActionBarProps) {
  return (
    <StickyFooter height={ACTION_BAR_HEIGHT} phoneHeight={ACTION_BAR_PHONE_HEIGHT} className={styles.bar} fixedClassName={styles.fixed}>
      <Button variant="primary" loading={saving} onClick={onSave}>
        Save
      </Button>
      <Button variant="secondary" className={styles.cancel} onClick={onCancel}>
        Cancel
      </Button>
    </StickyFooter>
  );
}

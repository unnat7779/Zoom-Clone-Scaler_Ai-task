import { PortalMeetingsTabs } from "./PortalMeetingsTabs";
import { ScheduleSplitButton } from "./ScheduleSplitButton";
import styles from "./PersonalRoomHead.module.css";

/**
 * Head of `/meeting/{pmi}` (02-meetings.md §B.1–B.4, §C.1–C.2): Zoom shows the Personal Room inside
 * its "Meetings" page — h1 + "+ Schedule a Meeting", the six tabs ("Personal Room" active) and the
 * "Details" capsule. The detail form below is inset 16px (tab content padding).
 */
export function PersonalRoomHead() {
  return (
    <div className={styles.head}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meetings</h1>
        <ScheduleSplitButton />
      </header>
      <PortalMeetingsTabs />
      <div role="tablist" aria-label="Personal Room" className={styles.capsules}>
        <span role="tab" aria-selected className={styles.capsule}>
          Details
        </span>
      </div>
    </div>
  );
}

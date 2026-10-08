import type { ActivityTab } from "./ActivityCenterTabs";
import { PartyPopperArt } from "./PartyPopperArt";
import styles from "./ActivityEmptyState.module.css";

interface ActivityEmptyStateProps {
  tab: ActivityTab;
  /** "View other notifications" switches to the Other tab */
  onViewOther: () => void;
}

/**
 * Empty states (the clone has no notifications). Focus [D from `home-03`]: party popper, "You've
 * cleared your suggestions", a hint and "View other notifications". Other [D]: title and hint only.
 */
export function ActivityEmptyState({ tab, onViewOther }: ActivityEmptyStateProps) {
  if (tab === "other") {
    return (
      <div className={styles.empty}>
        <p className={styles.title}>No notifications</p>
        <p className={styles.text}>New notifications from Zoom Workplace will appear here.</p>
      </div>
    );
  }
  return (
    <div className={styles.empty}>
      <PartyPopperArt />
      <p className={styles.title}>You&apos;ve cleared your suggestions</p>
      <p className={styles.text}>Check out the rest of your notifications in the Other tab.</p>
      <button type="button" className={styles.link} onClick={onViewOther}>
        View other notifications
      </button>
    </div>
  );
}

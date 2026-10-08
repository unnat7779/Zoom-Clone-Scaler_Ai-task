import clsx from "clsx";
import type { InviteTab } from "../../hooks/useInviteWindow";
import styles from "./InviteTabs.module.css";

const TABS: [InviteTab, string][] = [
  ["contacts", "Contacts"],
  ["rooms", "Zoom Rooms"],
  ["email", "Email"],
];

export function InviteTabs({ tab, onChange }: { tab: InviteTab; onChange: (tab: InviteTab) => void }) {
  return (
    <div className={styles.track} role="tablist">
      {TABS.map(([id, label], index) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          aria-label={`${label}${tab === id ? " selected" : ""} tab ${index + 1} of ${TABS.length}`}
          className={clsx(styles.tab, tab === id && styles.selected)}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

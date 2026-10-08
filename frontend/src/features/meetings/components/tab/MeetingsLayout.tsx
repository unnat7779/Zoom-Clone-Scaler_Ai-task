import type { ReactNode } from "react";
import { JoinChevronSmallLeftIcon } from "@/shared/icons/generated/JoinChevronSmallLeftIcon";
import { Spinner } from "@/shared/ui/Spinner";
import type { MeetingsTab } from "../../types";
import { MEETINGS_TABPANEL_ID, MeetingsHeader } from "./MeetingsHeader";
import styles from "./MeetingsLayout.module.css";

interface MeetingsLayoutProps {
  tab: MeetingsTab;
  onTabChange: (tab: MeetingsTab) => void;
  onRefresh: () => void;
  /** first load or refresh: both panes show the 24px PWA spinner (PRD §7.4.9) */
  loading: boolean;
  list: ReactNode;
  detail: ReactNode;
  /** phones only (DV11): the detail is pushed over the full-width list */
  detailOpen: boolean;
  onBack: () => void;
}

/** Meetings tab frame (PRD §7.4.1): 360px list column, 2px divider, detail pane. */
export function MeetingsLayout({ tab, onTabChange, onRefresh, loading, list, detail, detailOpen, onBack }: MeetingsLayoutProps) {
  const spinner = (
    <div className={styles.loading}>
      <Spinner variant="pwa" label="Loading" />
    </div>
  );
  return (
    <div id={MEETINGS_TABPANEL_ID} className={styles.container} role="tabpanel" aria-label="Meetings" data-detail-open={detailOpen || undefined}>
      <section className={styles.left}>
        <MeetingsHeader tab={tab} onTabChange={onTabChange} onRefresh={onRefresh} />
        <div className={styles.leftBody}>{loading ? spinner : list}</div>
      </section>
      <div className={styles.vDivider} />
      <section className={styles.right}>
        <button type="button" className={styles.back} onClick={onBack}>
          <JoinChevronSmallLeftIcon className={styles.backIcon} />
          Back
        </button>
        <div className={styles.rightBody}>{loading ? spinner : detail}</div>
      </section>
    </div>
  );
}

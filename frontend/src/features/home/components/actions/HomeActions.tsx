"use client";

import { useRouter } from "next/navigation";
import { ActionJoinIcon } from "@/shared/icons/generated/ActionJoinIcon";
import { routes } from "@/shared/lib/routes";
import { ActionButton } from "./ActionButton";
import { NewMeetingAction } from "./NewMeetingAction";
import { ScheduleDayIcon } from "./ScheduleDayIcon";
import styles from "./HomeActions.module.css";

interface HomeActionsProps {
  /** day of month drawn in the Schedule icon (null before hydration) */
  dayOfMonth: number | null;
  /** true while this browser is in a meeting (PRD §7.3 step 7) */
  disabled: boolean;
  onJoin: () => void;
}

/** New meeting / Join / Schedule (PRD §7.1.3): 56px columns 60px apart. */
export function HomeActions({ dayOfMonth, disabled, onJoin }: HomeActionsProps) {
  const router = useRouter();
  return (
    <div className={styles.actions}>
      <div className={styles.row}>
        <NewMeetingAction disabled={disabled} />
        <ActionButton
          label="Join"
          tone="blue"
          icon={<ActionJoinIcon />}
          caption={<span className={styles.label}>Join</span>}
          disabled={disabled}
          onClick={onJoin}
        />
        <ActionButton
          label="Schedule"
          tone="blue"
          icon={<ScheduleDayIcon day={dayOfMonth} />}
          caption={<span className={styles.label}>Schedule</span>}
          disabled={disabled}
          onClick={() => router.push(routes.schedule())}
        />
      </div>
    </div>
  );
}

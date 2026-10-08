import { Banner } from "@/shared/ui/Banner";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";
import styles from "./MeetingLoadState.module.css";

interface MeetingLoadStateProps {
  /** the request failed for another reason than "not found" (server or network error) */
  failed: boolean;
  onRetry: () => void;
}

/** Detail / Edit page while the meeting loads: the 32px spinner, or an error banner with "Try again" [D]. */
export function MeetingLoadState({ failed, onRetry }: MeetingLoadStateProps) {
  if (!failed) {
    return (
      <div className={styles.loading}>
        <Spinner size={32} label="Loading" />
      </div>
    );
  }
  return (
    <Banner
      kind="danger"
      className={styles.error}
      actions={
        <Button family="portal" variant="plain" onClick={onRetry}>
          Try again
        </Button>
      }
    >
      Something went wrong while loading this meeting.
    </Banner>
  );
}

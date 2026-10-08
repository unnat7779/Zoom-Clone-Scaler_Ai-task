"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/lib/routes";
import touch from "@/shared/styles/touch.module.css";
import { Button, Modal } from "@/shared/ui";
import { useJoinMeetingInput } from "../../hooks/useJoinMeetingInput";
import { MeetingIdField } from "./MeetingIdField";
import styles from "./JoinMeetingModal.module.css";

/**
 * `.join-meeting-modal` (PRD §7.2.2–7.2.8): no animation, no overlay-close, Escape closes.
 * Join / Enter closes at once and opens the pre-join page inside the shell
 * (`/wc/{n}/join?pwd=…&fromPWA=1`), where the meeting's existence is checked (DV7).
 */
export function JoinMeetingDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const input = useJoinMeetingInput();
  const canJoin = input.isReady;

  // "Joining..." is never painted: the modal closes in the same tick (PRD §7.2.3)
  const join = () => {
    if (!canJoin) return;
    onClose();
    router.push(routes.preJoin(input.target, { pwd: input.params.pwd, fromPWA: true }));
  };

  return (
    <Modal open onClose={onClose} variant="join" title="Join Meeting" className={styles.dialog} overlayClassName={styles.overlay}>
      <div>
        <div className={styles.form}>
          <MeetingIdField
            value={input.value}
            onChange={input.onChange}
            onPaste={input.onPaste}
            onSubmit={join}
            onFill={input.fill}
          />
        </div>
        <footer className={styles.footer}>
          <Button variant="secondary" className={clsx(styles.button, styles.cancel, touch.target)} onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={clsx(styles.button, styles.join, touch.target)}
            aria-disabled={!canJoin}
            tabIndex={canJoin ? 0 : -1}
            onClick={join}
          >
            Join
          </Button>
        </footer>
      </div>
    </Modal>
  );
}

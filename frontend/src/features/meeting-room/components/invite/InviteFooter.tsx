import type { useInviteWindow } from "../../hooks/useInviteWindow";
import styles from "./InviteFooter.module.css";

interface InviteFooterProps {
  invite: ReturnType<typeof useInviteWindow>;
  onClose: () => void;
}

/** Copy buttons work; Invite (contacts tabs only) just closes the window — nothing is sent. */
export function InviteFooter({ invite, onClose }: InviteFooterProps) {
  return (
    <div className={styles.footer}>
      <button
        type="button"
        className={styles.copy}
        aria-label={invite.urlCopied ? "Invitation information has been copied" : "Copy URL"}
        onClick={invite.copyUrl}
      >
        {invite.urlCopied ? "Copied" : "Copy URL"}
      </button>
      <button
        type="button"
        className={styles.copy}
        aria-label={invite.invitationCopied ? "Invitation information has been copied" : "Copy Invitation"}
        onClick={invite.copyInvitation}
      >
        {invite.invitationCopied ? "Copied" : "Copy Invitation"}
      </button>
      <div className={styles.right}>
        {invite.passcode ? (
          <>
            <span className={styles.passcodeLabel}>Passcode:</span>
            <span className={styles.passcode}>{invite.passcode}</span>
          </>
        ) : null}
        {invite.tab !== "email" ? (
          <button type="button" className={styles.invite} disabled={invite.selected.size === 0} onClick={onClose}>
            Invite
          </button>
        ) : null}
        <button type="button" className={styles.cancel} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

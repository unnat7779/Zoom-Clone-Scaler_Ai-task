"use client";

import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import styles from "./DeleteMeetingModal.module.css";

interface DeleteMeetingModalProps {
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
  /**
   * pwa: Workplace confirm (PRD §7.4.8) — 560 wide, Zoom-logo header, z-button Delete · Cancel.
   * portal: zoom.us dialog (PRD §7.8.5) — zm-dialog frame, danger Delete · plain Cancel.
   */
  variant?: "pwa" | "portal";
}

/**
 * "Delete Meeting" confirm, used by the Meetings tab, the Home calendar card "…" menu and the
 * portal detail page; state: `useDeleteMeetingFlow`. "Recently Deleted" is rendered, not linked
 * (the portal's Recently Deleted page is out of scope).
 */
export function DeleteMeetingModal({ open, pending, onConfirm, onClose, variant = "pwa" }: DeleteMeetingModalProps) {
  if (variant === "portal") {
    return (
      <Modal
        open={open}
        onClose={onClose}
        variant="portal"
        size="sm"
        showClose={false}
        title="Delete Meeting"
        footer={
          <>
            <Button family="portal" variant="danger" className={styles.action} disabled={pending} onClick={onConfirm}>
              Delete
            </Button>
            <Button family="portal" variant="plain" className={styles.action} onClick={onClose}>
              Cancel
            </Button>
          </>
        }
      >
        <p className={styles.portalText}>
          You can recover this meeting within 7 days from <span className={styles.link}>Recently Deleted</span>.
        </p>
      </Modal>
    );
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="confirm"
      title="Delete Meeting"
      footer={
        <>
          <Button family="z" variant="destructive" className={styles.action} disabled={pending} onClick={onConfirm}>
            Delete
          </Button>
          <Button family="z" variant="secondary" className={styles.action} onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    >
      <p className={styles.text}>
        You can recover this meeting within 7 days from the <span className={styles.link}>Recently Deleted</span> page on
        the Zoom web portal
      </p>
    </Modal>
  );
}

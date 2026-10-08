"use client";

import { useRef } from "react";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { usePortalCopy } from "../../hooks/usePortalCopy";
import styles from "./CopyInvitationDialog.module.css";

interface CopyInvitationDialogProps {
  open: boolean;
  text: string | undefined;
  onClose: () => void;
}

/** "Copy Meeting Invitation" (PRD §7.8.4): 700 wide, readonly 650×380 textarea; copying keeps it open. */
export function CopyInvitationDialog({ open, text, onClose }: CopyInvitationDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const copy = usePortalCopy();
  const onCopy = () => {
    textareaRef.current?.select();
    if (text) void copy(text);
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="portal"
      showClose={false}
      title="Copy Meeting Invitation"
      footer={
        <>
          <Button family="portal" variant="primary" className={styles.action} disabled={!text} onClick={onCopy}>
            Copy Meeting Invitation
          </Button>
          <Button family="portal" variant="plain" className={styles.action} onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    >
      <textarea
        ref={textareaRef}
        readOnly
        aria-label="copy invitation content"
        className={styles.text}
        value={text ?? ""}
      />
    </Modal>
  );
}

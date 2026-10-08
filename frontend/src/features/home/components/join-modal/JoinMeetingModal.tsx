"use client";

import { JoinMeetingDialog } from "./JoinMeetingDialog";

interface JoinMeetingModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Join Meeting modal (PRD §7.2). The dialog (and its field state) mounts only while open,
 * so reopening starts empty with Join disabled.
 */
export function JoinMeetingModal({ open, onClose }: JoinMeetingModalProps) {
  return open ? <JoinMeetingDialog onClose={onClose} /> : null;
}

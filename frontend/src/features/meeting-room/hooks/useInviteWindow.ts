"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useClipboard } from "@/shared/hooks";
import { listUsers, queryKeys } from "@/shared/lib/api";
import { useMeetingInvitation } from "@/shared/lib/api/invitation";
import { formatMeetingNumber } from "@/shared/lib/format";
import { useMeetingRoom } from "../realtime/useMeetingRoom";

export type InviteTab = "contacts" | "rooms" | "email";

/** PRD §8.11: Copy URL / Copy Invitation read "Copied" for about a second. */
const COPIED_MS = 1000;

/** Invite window state: tab, (visual) contact selection, invitation text and the copy buttons. */
export function useInviteWindow() {
  const { number, meeting } = useMeetingRoom();
  const [tab, setTab] = useState<InviteTab>("contacts");
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());
  const urlCopy = useClipboard({ resetAfter: COPIED_MS });
  const invitationCopy = useClipboard({ resetAfter: COPIED_MS });
  const invitation = useMeetingInvitation({ number });
  const contacts = useQuery({ queryKey: queryKeys.users(), queryFn: ({ signal }) => listUsers({}, signal) });

  const inviteUrl = meeting?.invite_url ?? "";
  const invitationText =
    invitation.data?.text ?? `Join Zoom Meeting\r\n${inviteUrl}\r\n\r\nMeeting ID: ${formatMeetingNumber(number)}\r\n`;

  const toggleContact = useCallback((id: number) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return {
    title: `Invite People to join meeting ${formatMeetingNumber(meeting?.number ?? number)}`,
    tab,
    setTab,
    contacts: contacts.data ?? [],
    selected,
    toggleContact,
    passcode: meeting?.passcode ?? null,
    invitationText,
    urlCopied: urlCopy.copied,
    invitationCopied: invitationCopy.copied,
    copyUrl: () => void urlCopy.copy(inviteUrl),
    copyInvitation: () => void invitationCopy.copy(invitationText),
  };
}

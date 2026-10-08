"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { copyText } from "@/shared/hooks/useClipboard";
import { useInvitationActions } from "@/shared/lib/api/invitation";
import { routes } from "@/shared/lib/routes";
import { useToast } from "@/shared/ui";

/**
 * PMI submenu actions (PRD §7.1.4): Copy ID (digits), Copy Invitation (§10.5 text) and
 * PMI Settings (`/meeting/{pmi}/edit`, DV5). Zoom shows no toast after a successful copy; a failed
 * one shows the "Copy failed" error toast [D]. Every action then closes both popovers through `onDone`.
 */
export function usePmiActions(pmi: string | null, onDone: () => void) {
  const router = useRouter();
  const toast = useToast();
  const invitation = useInvitationActions();
  const { prefetch } = invitation;

  useEffect(() => {
    if (pmi) prefetch({ number: pmi });
  }, [pmi, prefetch]);

  const copy = (write: (number: string) => Promise<boolean>) => () => {
    if (pmi) {
      void write(pmi).then((copied) => {
        if (!copied) toast.show({ message: "Copy failed", kind: "error" });
      });
    }
    onDone();
  };

  return {
    copyId: copy(copyText),
    copyInvitation: copy((number) => invitation.copy({ number })),
    openSettings: () => {
      if (pmi) router.push(routes.meetingEdit(pmi));
      onDone();
    },
  };
}

"use client";

import { useRef } from "react";
import { useEscapeKey } from "@/shared/hooks";
import { useDragWindow } from "../../hooks/useDragWindow";
import { useInviteWindow } from "../../hooks/useInviteWindow";
import { useRoomUi } from "../../state/useRoomUi";
import { InviteContacts } from "./InviteContacts";
import { InviteEmail } from "./InviteEmail";
import { InviteFooter } from "./InviteFooter";
import { InviteTabs } from "./InviteTabs";
import styles from "./InviteWindow.module.css";

/** Invite People (dragged by its title): Contacts / Zoom Rooms (static) and Email (mail compose), Copy URL / Copy Invitation. */
export function InviteWindow() {
  const invite = useInviteWindow();
  const { setInviteOpen } = useRoomUi();
  const close = () => setInviteOpen(false);
  const windowRef = useRef<HTMLDivElement | null>(null);
  useEscapeKey(close, true);
  useDragWindow(windowRef, "h2");

  return (
    <div className={styles.layer}>
      <div ref={windowRef} className={styles.window} role="dialog" aria-label={invite.title}>
        <div className={styles.inner}>
          <h2 className={styles.title}>{invite.title}</h2>
          <InviteTabs tab={invite.tab} onChange={invite.setTab} />
          <div className={styles.body}>
            {invite.tab === "email" ? (
              <InviteEmail invitation={invite.invitationText} />
            ) : (
              <InviteContacts
                contacts={invite.tab === "contacts" ? invite.contacts : []}
                selected={invite.selected}
                onToggle={invite.toggleContact}
              />
            )}
          </div>
          <div className={styles.divider} />
          <InviteFooter invite={invite} onClose={close} />
        </div>
      </div>
    </div>
  );
}

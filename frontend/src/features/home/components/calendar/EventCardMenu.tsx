"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { DeleteMeetingModal, meetingRefOf, useDeleteMeetingFlow } from "@/features/meetings";
import { HomeCalMoreIcon } from "@/shared/icons/generated/HomeCalMoreIcon";
import touch from "@/shared/styles/touch.module.css";
import type { MeetingListItem } from "@/shared/types/api";
import { Menu, MenuItem, Popover } from "@/shared/ui";
import { useEventCardActions } from "../../hooks/useEventCardActions";
import styles from "./EventCardMenu.module.css";

/** Event-card "…" (`.more-option-button`) and its menu: Start · Copy Invitation · Edit · Delete [D]. */
export function EventCardMenu({ item }: { item: MeetingListItem }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const actions = useEventCardActions(item);
  const deletion = useDeleteMeetingFlow(meetingRefOf(item));

  const select = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        className={clsx(styles.moreButton, touch.target)}
        onClick={() => {
          if (!open) actions.prefetchInvitation();
          setOpen(!open);
        }}
      >
        <HomeCalMoreIcon />
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={buttonRef}
        placement="bottom-end"
        motion="zoom-in"
        className={styles.menu}
      >
        <Menu aria-label={`${item.topic} options`} autoFocus>
          <MenuItem onSelect={select(actions.start)}>Start</MenuItem>
          <MenuItem onSelect={select(() => void actions.copyInvitation())}>Copy Invitation</MenuItem>
          <MenuItem onSelect={select(actions.edit)}>Edit</MenuItem>
          <MenuItem danger onSelect={select(deletion.openModal)}>
            Delete
          </MenuItem>
        </Menu>
      </Popover>
      <DeleteMeetingModal open={deletion.open} pending={deletion.pending} onConfirm={deletion.confirm} onClose={deletion.close} />
    </>
  );
}

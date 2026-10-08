"use client";

import type { MouseEvent } from "react";
import { MtgMeetingsCopyIcon } from "@/shared/icons/generated/MtgMeetingsCopyIcon";
import type { Meeting } from "@/shared/types/api";
import { Button } from "@/shared/ui/Button";
import { StickyFooter } from "@/shared/ui/StickyFooter";
import { useToast } from "@/shared/ui/Toast";
import type { useDetailActions } from "../../hooks/useDetailActions";
import styles from "./DetailActionBar.module.css";

/** `div.zm-sticky` slot height (02-meetings.md §C.4): 24 + 34 (Copy Invitation) + 24. */
const ACTION_BAR_HEIGHT = 82;
/** phones [D]: 12 + 44px touch-sized buttons + 12 */
const ACTION_BAR_PHONE_HEIGHT = 68;

interface DetailActionBarProps {
  meeting: Meeting;
  actions: ReturnType<typeof useDetailActions>;
}

/** Start label (02-meetings.md §C.4): "Join" for a live PMI / instant meeting, "Join Now" for a live scheduled one. */
const startLabel = ({ is_live, type }: Meeting) => (!is_live ? "Start" : type === "scheduled" ? "Join Now" : "Join");

/**
 * Save → this page can render within a double-click, and Start sits under Save: the second click
 * (`detail` 2+) of a double-click that began on Save must not start the meeting (R3 F2).
 */
const isFirstClick = (event: MouseEvent) => event.detail <= 1;

/**
 * Sticky bar (PRD §7.8.3): Start / Join (+ End while a PMI is live) · Copy Invitation · Edit
 * (disabled while live) · Delete and Save as Template (scheduled only; the latter static).
 */
export function DetailActionBar({ meeting, actions }: DetailActionBarProps) {
  const toast = useToast();
  const scheduled = meeting.type === "scheduled";
  return (
    <StickyFooter height={ACTION_BAR_HEIGHT} phoneHeight={ACTION_BAR_PHONE_HEIGHT} className={styles.bar} fixedClassName={styles.fixed}>
      <Button family="portal" variant="primary" onClick={(event) => isFirstClick(event) && actions.start()}>
        {startLabel(meeting)}
      </Button>
      {meeting.is_live && meeting.type === "pmi" ? (
        <Button family="portal" variant="danger" onClick={actions.end}>
          End
        </Button>
      ) : null}
      <Button family="portal" variant="plain" leadingIcon={<MtgMeetingsCopyIcon />} onClick={actions.copy.show}>
        Copy Invitation
      </Button>
      <Button family="portal" variant="plain" disabled={meeting.is_live} onClick={actions.edit}>
        Edit
      </Button>
      {scheduled ? (
        <>
          <Button family="portal" variant="plain" disabled={meeting.is_live} onClick={actions.remove.openModal}>
            Delete
          </Button>
          <Button family="portal" variant="plain" onClick={toast.notAvailable}>
            Save as Template
          </Button>
        </>
      ) : null}
    </StickyFooter>
  );
}

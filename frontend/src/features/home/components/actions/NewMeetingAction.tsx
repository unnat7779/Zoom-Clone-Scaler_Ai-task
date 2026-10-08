"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/shared/lib/storage";
import { ActionNewMeetingIcon } from "@/shared/icons/generated/ActionNewMeetingIcon";
import { ChevronDownIcon } from "@/shared/icons/generated/ChevronDownIcon";
import touch from "@/shared/styles/touch.module.css";
import { useStartInstantMeeting } from "../../api/useStartInstantMeeting";
import { NewMeetingPopover } from "../new-meeting/NewMeetingPopover";
import { ActionButton } from "./ActionButton";
import styles from "./HomeActions.module.css";

/**
 * Orange New meeting action (PRD §7.1.3, §7.3): the button starts an instant meeting at once
 * (the PMI when "Use my PMI" is ticked); the chevron next to the label opens the options popover.
 */
export function NewMeetingAction({ disabled }: { disabled: boolean }) {
  const chevronRef = useRef<HTMLButtonElement | null>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [usePmi, setUsePmi] = useLocalStorage<boolean>(STORAGE_KEYS.usePmi, false);
  const { start } = useStartInstantMeeting();

  const caption = (
    <span className={styles.startLabel}>
      <span className={styles.label}>New meeting</span>
      <button
        ref={chevronRef}
        type="button"
        aria-label="New meeting options"
        aria-haspopup="true"
        aria-expanded={optionsOpen}
        className={clsx(styles.chevron, touch.target)}
        disabled={disabled}
        onClick={() => {
          // focused even where a click does not focus buttons (Safari), so closing returns focus here
          chevronRef.current?.focus();
          setOptionsOpen((open) => !open);
        }}
      >
        <ChevronDownIcon />
      </button>
    </span>
  );

  return (
    <>
      <ActionButton
        label="New meeting"
        tone="orange"
        icon={<ActionNewMeetingIcon />}
        caption={caption}
        disabled={disabled}
        onClick={() => start(usePmi)}
      />
      <NewMeetingPopover
        open={optionsOpen && !disabled}
        onClose={() => setOptionsOpen(false)}
        anchorRef={chevronRef}
        usePmi={usePmi}
        onUsePmiChange={setUsePmi}
      />
    </>
  );
}

"use client";

import { type ChangeEvent, type ClipboardEvent, useRef } from "react";
import clsx from "clsx";
import { JoinChevronSmallDownIcon } from "@/shared/icons/generated/JoinChevronSmallDownIcon";
import { JoinChevronSmallUpIcon } from "@/shared/icons/generated/JoinChevronSmallUpIcon";
import touch from "@/shared/styles/touch.module.css";
import { useHistoryDropdown } from "../../hooks/useHistoryDropdown";
import { useJoinHistory } from "../../hooks/useJoinHistory";
import { MeetingHistoryDropdown } from "./MeetingHistoryDropdown";
import styles from "./JoinMeetingModal.module.css";

const INPUT_ID = "join-meeting-modal-meeting-id";

interface MeetingIdFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
  /** Enter in the field */
  onSubmit: () => void;
  /** a meeting chosen from the history */
  onFill: (number: string) => void;
}

/**
 * "Meeting ID or Personal Link Name" (PRD §7.2.2–7.2.6): 40px field with no placeholder and,
 * when the browser has join history, the round chevron that opens the history dropdown.
 */
export function MeetingIdField({ value, onChange, onPaste, onSubmit, onFill }: MeetingIdFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { history, clear } = useJoinHistory();
  const { open, toggle, close, toggleRef, listRef, onListKeyDown } = useHistoryDropdown();
  const hasHistory = history.length > 0;
  const Chevron = open ? JoinChevronSmallUpIcon : JoinChevronSmallDownIcon;

  return (
    <div className={styles.field}>
      <label htmlFor={INPUT_ID} className={styles.label}>
        Meeting ID or Personal Link Name
      </label>
      <input
        ref={inputRef}
        id={INPUT_ID}
        type="text"
        // also covers `/wc/join`, where the modal is open on the first render (before the Portal mounts)
        autoFocus
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="go"
        className={styles.input}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSubmit();
        }}
      />
      {hasHistory ? (
        <button
          ref={toggleRef}
          type="button"
          aria-label="Meeting history list"
          aria-haspopup="listbox"
          aria-expanded={open}
          className={clsx(styles.historyToggle, touch.target)}
          onClick={toggle}
        >
          <Chevron />
        </button>
      ) : null}
      {hasHistory && open ? (
        <MeetingHistoryDropdown
          history={history}
          listRef={listRef}
          onKeyDown={onListKeyDown}
          onChoose={(entry) => {
            onFill(entry.number);
            close();
          }}
          onClear={() => {
            clear();
            close(inputRef.current);
          }}
        />
      ) : null}
    </div>
  );
}

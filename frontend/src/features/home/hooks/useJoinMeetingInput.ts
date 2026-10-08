"use client";

import { type ChangeEvent, type ClipboardEvent, useState } from "react";
import { getAppUrl } from "@/shared/lib/env";
import { isJoinReady, normalizeJoinInput, parsePastedJoin, stripSpaces } from "../utils/joinInput";

/**
 * State of the Join-modal "Meeting ID or Personal Link Name" field (PRD §7.2.4–7.2.5):
 * live formatting, rejection of disallowed characters, invite-link paste keeping its
 * query params (typing afterwards clears them).
 */
export function useJoinMeetingInput() {
  const [value, setValue] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = normalizeJoinInput(event.target.value);
    if (next === null) return; // rejected: React restores the previous value
    setValue(next);
    setParams({});
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = parsePastedJoin(event.clipboardData.getData("text"), new URL(getAppUrl()).origin);
    if (pasted.value === null) return;
    setValue(pasted.value);
    setParams(pasted.params);
  };

  /** Meeting-history choice: the formatted number, no params. */
  const fill = (number: string) => {
    setValue(normalizeJoinInput(number) ?? "");
    setParams({});
  };

  return { value, params, target: stripSpaces(value), isReady: isJoinReady(value), onChange, onPaste, fill };
}

"use client";

import { type ChangeEvent, type KeyboardEvent, useState } from "react";

export const MEETING_GROUP_CHAT = "Meeting Group Chat";

/**
 * Static chat composer (PRD §8.10): typing works and the recipient pill changes,
 * but Send / Enter sends nothing. Shift+Enter inserts a newline.
 */
export function useChatComposer() {
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState(MEETING_GROUP_CHAT);
  return {
    text,
    hasText: text.trim().length > 0,
    recipient,
    setRecipient,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value),
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) event.preventDefault();
    },
  };
}

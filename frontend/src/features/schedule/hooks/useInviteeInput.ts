"use client";

import { type KeyboardEvent, useMemo, useState } from "react";
import { useUserSuggestions } from "../api/useUserSuggestions";
import { useDebouncedValue } from "./useDebouncedValue";

/** Contacts are searched once typing pauses (F-m36). */
const SEARCH_DEBOUNCE_MS = 200;

const EMAIL_PATTERN = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;
const isValidEmail = (text: string) => EMAIL_PATTERN.test(text.trim());

export interface InviteeSuggestion {
  key: string;
  name: string;
  email: string;
  /** "Invalid email" row: shown, not selectable */
  invalid: boolean;
}

/**
 * Invitees autocomplete (PRD §7.6.4 row 6): matching contacts plus the typed text as an
 * email row; choosing a valid row (click, Enter, or comma [D]) adds it and clears the input.
 */
export function useInviteeInput(existing: string[], onAdd: (email: string) => void) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const users = useUserSuggestions(useDebouncedValue(open ? query : "", SEARCH_DEBOUNCE_MS));
  const text = query.trim();

  const suggestions = useMemo<InviteeSuggestion[]>(() => {
    if (!text) return [];
    const contacts = (users.data ?? [])
      .filter((user) => !existing.includes(user.email.toLowerCase()))
      .map((user) => ({ key: `user-${user.id}`, name: user.display_name, email: user.email, invalid: false }));
    const typedIsContact = contacts.some((contact) => contact.email.toLowerCase() === text.toLowerCase());
    const typed = { key: "typed", name: text, email: text, invalid: !isValidEmail(text) };
    return typedIsContact ? contacts : [...contacts, typed];
  }, [existing, text, users.data]);

  const add = (suggestion: InviteeSuggestion | undefined) => {
    if (!suggestion || suggestion.invalid) return;
    onAdd(suggestion.email.toLowerCase());
    setQuery("");
    setOpen(false);
  };

  const onChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
    setOpen(value.trim().length > 0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") return setOpen(false);
    const last = suggestions.length - 1;
    const actions: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((index) => Math.min(index + 1, last)),
      ArrowUp: () => setActiveIndex((index) => Math.max(index - 1, 0)),
      Enter: () => add(suggestions[activeIndex]),
      ",": () => add(suggestions.find((suggestion) => suggestion.key === "typed")),
      Escape: () => setOpen(false),
    };
    const action = open ? actions[event.key] : undefined;
    if (!action) return;
    event.preventDefault();
    action();
  };

  return { query, open: open && suggestions.length > 0, suggestions, activeIndex, onChange, onKeyDown, add, close: () => setOpen(false) };
}

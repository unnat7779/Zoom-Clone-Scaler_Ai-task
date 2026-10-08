"use client";

import { type KeyboardEvent, useMemo, useState } from "react";
import type { SelectOption } from "@/shared/ui/Select";

export interface FilterOption extends SelectOption {
  /** a row made from the typed text (time select); an empty `value` means it is rejected */
  created?: boolean;
}

export interface UseFilterSelectArgs {
  options: FilterOption[];
  value: string | null;
  onChange: (value: string) => void;
  /** default: case-insensitive substring of the label (Time Zone, 03-schedule.md §6.4) */
  filter?: (options: FilterOption[], query: string) => FilterOption[];
  /** row for typed text that is not an option (time select) */
  create?: (query: string) => FilterOption | null;
}

const substring = (options: FilterOption[], query: string) => {
  const needle = query.trim().toLowerCase();
  return needle ? options.filter((option) => option.label.toLowerCase().includes(needle)) : options;
};

/**
 * State of the Schedule page's filter selects: open menu, typed query, filtered rows (plus a
 * created row for typed text), virtual focus and keyboard (arrows, Home/End, Enter, Escape, Tab).
 * Unlike the shared `useSelect` there is no type-ahead (typing filters) and Enter falls back to an
 * exact match or the created row. Closing without choosing keeps the previous value.
 */
export function useFilterSelect({ options, value, onChange, filter = substring, create }: UseFilterSelectArgs) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const visible = useMemo(() => {
    if (!query.trim()) return options;
    const created = create?.(query.trim());
    return [...filter(options, query), ...(created ? [created] : [])];
  }, [create, filter, options, query]);
  const selectedIndex = visible.findIndex((option) => !option.created && option.value === value);

  const openMenu = () => {
    if (open) return;
    setQuery("");
    setActiveIndex(options.findIndex((option) => option.value === value));
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setQuery("");
  };
  const choose = (index: number) => {
    const option = visible[index];
    if (option?.value) onChange(option.value);
    close();
  };
  const type = (text: string) => {
    if (!open) setOpen(true);
    setQuery(text);
    // typing shows matches without a keyboard-focus row (sch-09)
    setActiveIndex(-1);
  };

  /** Enter takes the focused row, else an exact match of the typed text, else a created row (free time). */
  const enterTarget = () => {
    if (activeIndex >= 0) return activeIndex;
    const typed = query.trim().toLowerCase();
    const exact = visible.findIndex((option) => !option.created && option.label.toLowerCase() === typed);
    return exact >= 0 ? exact : visible.findIndex((option) => option.created);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    if (event.key === "Tab") return close();
    const last = visible.length - 1;
    const actions: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((index) => Math.min(index + 1, last)),
      ArrowUp: () => setActiveIndex((index) => Math.max(index - 1, 0)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(enterTarget()),
      Escape: close,
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  return { open, query, visible, activeIndex, selectedIndex, openMenu, close, choose, type, onKeyDown };
}

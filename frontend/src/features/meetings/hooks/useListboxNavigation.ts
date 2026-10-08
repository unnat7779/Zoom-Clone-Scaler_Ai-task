"use client";

import { type KeyboardEvent, type RefObject, useCallback, useEffect } from "react";

const optionsOf = (container: HTMLElement | null) =>
  Array.from(container?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

const selectedIndex = (options: HTMLElement[]) => options.findIndex((option) => option.getAttribute("aria-selected") === "true");

/**
 * Meetings list keyboard + scroll behaviour (02-meetings.md §A.3):
 * Up/Down move focus between items (selection follows Enter/Space/click) and,
 * on mount, when the selected item's index is > 1 the previous item is scrolled to the top.
 */
export function useListboxNavigation(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    const options = optionsOf(container);
    const index = selectedIndex(options);
    const previous = options[index - 1];
    if (container && index > 1 && previous) container.scrollTop = previous.offsetTop;
    // the ref object is stable: this runs on mount only, so later selections never move the list
  }, [containerRef]);

  return useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const options = optionsOf(containerRef.current);
      if (options.length === 0) return;
      event.preventDefault();
      const focused = options.indexOf(document.activeElement as HTMLElement);
      const from = focused >= 0 ? focused : Math.max(selectedIndex(options), 0);
      const step = event.key === "ArrowDown" ? 1 : -1;
      const target = focused >= 0 ? from + step : from;
      options[Math.min(Math.max(target, 0), options.length - 1)]?.focus();
    },
    [containerRef],
  );
}

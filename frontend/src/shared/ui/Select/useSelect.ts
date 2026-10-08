"use client";

import { type KeyboardEvent, useCallback, useState } from "react";

export interface SelectOption<V extends string = string> {
  value: V;
  label: string;
  description?: string;
  disabled?: boolean;
  /** group title shown above the first option of each run ("Personal templates") */
  group?: string;
}

interface UseSelectArgs<V extends string> {
  options: SelectOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  disabled?: boolean;
}

function nextEnabled<V extends string>(options: SelectOption<V>[], from: number, step: 1 | -1): number {
  for (let i = from + step; i >= 0 && i < options.length; i += step) if (!options[i]?.disabled) return i;
  return from;
}

/** Open state, keyboard navigation (arrows, Home/End, Enter/Space, Escape, Tab, type-ahead) and selection. */
export function useSelect<V extends string>({ options, value, onChange, disabled }: UseSelectArgs<V>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectedIndex = options.findIndex((option) => option.value === value);

  const openMenu = useCallback(() => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : nextEnabled(options, -1, 1));
    setOpen(true);
  }, [disabled, options, selectedIndex]);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => (open ? close() : openMenu()), [close, open, openMenu]);

  const choose = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      onChange(option.value);
      setOpen(false);
    },
    [onChange, options],
  );

  const typeAhead = (key: string) => {
    const lower = key.toLowerCase();
    const start = activeIndex + 1;
    const order = [...options.slice(start), ...options.slice(0, start)];
    const match = order.find((option) => !option.disabled && option.label.toLowerCase().startsWith(lower));
    if (match) setActiveIndex(options.indexOf(match));
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    if (event.key === "Tab") return close();
    if (event.key.length === 1 && event.key !== " ") return typeAhead(event.key);
    const actions: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((i) => nextEnabled(options, i, 1)),
      ArrowUp: () => setActiveIndex((i) => nextEnabled(options, i, -1)),
      Home: () => setActiveIndex(nextEnabled(options, -1, 1)),
      End: () => setActiveIndex(nextEnabled(options, options.length, -1)),
      Enter: () => choose(activeIndex),
      " ": () => choose(activeIndex),
      Escape: close,
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  return { open, activeIndex, setActiveIndex, selectedIndex, openMenu, close, toggle, choose, onTriggerKeyDown };
}

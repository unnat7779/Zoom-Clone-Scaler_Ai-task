"use client";

import { useId, useRef } from "react";
import clsx from "clsx";
import { SelectChevron, SelectMenu, optionId } from "@/shared/ui/Select";
import { type UseFilterSelectArgs, useFilterSelect } from "../../hooks/useFilterSelect";
import styles from "./FilterSelect.module.css";

/** While closed the input shows the value: keep only what was typed after it. */
const typedText = (inputValue: string, shownLabel: string | undefined) =>
  shownLabel && inputValue.startsWith(shownLabel) ? inputValue.slice(shownLabel.length) : inputValue;

export interface FilterSelectProps extends UseFilterSelectArgs {
  placeholder?: string;
  /** width class (490 / 173 / 150) */
  className?: string;
  /** time select: wrapper padding `5px 7px` */
  compact?: boolean;
  error?: boolean;
  "aria-label": string;
}

/**
 * zoom-ui filter select of the Schedule page (`zoom-virtual-filter-select`, PRD §5.8.5,
 * 03-schedule.md §6.2–6.4): an editable input that filters the shared `SelectMenu` (Time Zone,
 * start time, minutes, Template). Plain selects (AM/PM, hours) use the shared `Select`.
 */
export function FilterSelect({ placeholder, className, compact = false, error = false, "aria-label": ariaLabel, ...args }: FilterSelectProps) {
  const listId = useId();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const select = useFilterSelect(args);
  const current = args.options.find((option) => option.value === args.value);

  return (
    <div
      ref={anchorRef}
      className={clsx(styles.field, className, {
        [styles.focusing ?? ""]: select.open,
        [styles.error ?? ""]: error,
        [styles.compact ?? ""]: compact,
      })}
      onClick={() => {
        select.openMenu();
        inputRef.current?.focus();
      }}
    >
      <input
        ref={inputRef}
        className={styles.input}
        role="combobox"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={select.open}
        aria-controls={select.open ? listId : undefined}
        aria-activedescendant={select.open && select.activeIndex >= 0 ? optionId(listId, select.activeIndex) : undefined}
        value={select.open ? select.query : (current?.label ?? "")}
        placeholder={select.open ? (current?.label ?? placeholder) : placeholder}
        autoComplete="off"
        onChange={(event) => select.type(typedText(event.target.value, select.open ? undefined : current?.label))}
        onFocus={select.openMenu}
        onBlur={select.close}
        onKeyDown={select.onKeyDown}
      />
      <SelectChevron open={select.open} />
      <SelectMenu
        id={listId}
        open={select.open}
        anchorRef={anchorRef}
        options={select.visible}
        selectedIndex={select.selectedIndex}
        activeIndex={select.activeIndex}
        onChoose={select.choose}
        onClose={select.close}
      />
    </div>
  );
}

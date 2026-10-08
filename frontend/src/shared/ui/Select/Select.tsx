"use client";

import { useId, useRef } from "react";
import clsx from "clsx";
import type { FieldSize } from "../Input";
import { SelectChevron } from "./SelectChevron";
import { SelectMenu } from "./SelectMenu";
import { optionId } from "./optionId";
import { type SelectOption, useSelect } from "./useSelect";
import styles from "./Select.module.css";

export interface SelectProps<V extends string> {
  options: SelectOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  placeholder?: string;
  size?: FieldSize;
  disabled?: boolean;
  error?: boolean;
  /** wrapper class — set the width here (e.g. 173px time select) */
  className?: string;
  /** menu class (e.g. `--select-menu-z` for another layer) */
  menuClassName?: string;
  emptyText?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * zoom-ui select (`.zoom-select`, PRD §5.8.5): custom listbox, ✓ on the selected option,
 * keyboard navigation, chevron rotates while open, keyboard focus = blue border + inset ring.
 */
export function Select<V extends string>({
  options,
  value,
  onChange,
  placeholder,
  size = "md",
  disabled = false,
  error = false,
  className,
  menuClassName,
  emptyText,
  id,
  name,
  ...aria
}: SelectProps<V>) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const select = useSelect({ options, value, onChange, disabled });
  const selected = options[select.selectedIndex];

  return (
    <span className={clsx(styles.field, styles[size], className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={select.open}
        aria-controls={select.open ? listId : undefined}
        aria-activedescendant={select.open && select.activeIndex >= 0 ? optionId(listId, select.activeIndex) : undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
        className={clsx(styles.trigger, { [styles.error ?? ""]: error })}
        onClick={select.toggle}
        onKeyDown={select.onTriggerKeyDown}
        {...aria}
      >
        <span className={clsx(styles.value, { [styles.placeholder ?? ""]: !selected })}>
          {selected ? selected.label : placeholder}
        </span>
        <SelectChevron open={select.open} />
      </button>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <SelectMenu
        id={listId}
        open={select.open}
        anchorRef={triggerRef}
        options={options}
        selectedIndex={select.selectedIndex}
        activeIndex={select.activeIndex}
        onChoose={select.choose}
        onClose={select.close}
        emptyText={emptyText}
        className={menuClassName}
      />
    </span>
  );
}

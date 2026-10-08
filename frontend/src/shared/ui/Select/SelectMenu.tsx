"use client";

import { Fragment, type RefObject, useRef } from "react";
import clsx from "clsx";
import { useAnchoredPosition } from "@/shared/hooks/useAnchoredPosition";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { SchCheckmarkIcon } from "@/shared/icons/generated/SchCheckmarkIcon";
import { Portal } from "../Portal";
import { optionId } from "./optionId";
import { useMenuScroll } from "./useMenuScroll";
import type { SelectOption } from "./useSelect";
import styles from "./Select.module.css";

export interface SelectMenuProps<V extends string> {
  id: string;
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  options: SelectOption<V>[];
  selectedIndex: number;
  activeIndex: number;
  onChoose: (index: number) => void;
  onClose: () => void;
  emptyText?: string;
  className?: string;
}

/**
 * Floating listbox of the zoom-ui selects (PRD §5.8.5): trigger width, 4px below (flips above),
 * radius 12, 208px scroll area including the 11px list margins (n×32 + 24, max 210), ✓ on the
 * selected row, keyboard-focus row, group titles, "No matching data". Layer: `--select-menu-z`
 * (default `--z-floating`; portal pages set 105). Mouse-downs keep focus on the trigger and
 * clicks do not bubble to the trigger's React ancestors. Shared by `Select` and filter selects.
 */
export function SelectMenu<V extends string>({
  id,
  open,
  anchorRef,
  options,
  selectedIndex,
  activeIndex,
  onChoose,
  onClose,
  emptyText = "No matching data",
  className,
}: SelectMenuProps<V>) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useAnchoredPosition({ anchorRef, floatingRef: menuRef, open, placement: "bottom-start", offset: 4, matchAnchorWidth: true });
  useClickOutside([menuRef, anchorRef], onClose, open);
  useMenuScroll({ wrapRef, listId: id, open, selectedIndex, activeIndex });

  if (!open) return null;
  return (
    <Portal>
      <div
        ref={menuRef}
        className={clsx(styles.menu, className)}
        onMouseDown={(event) => event.preventDefault()}
        onClick={(event) => event.stopPropagation()}
      >
        {options.length === 0 ? (
          <div className={styles.empty}>{emptyText}</div>
        ) : (
          <div ref={wrapRef} className={styles.wrap}>
            <ul id={id} role="listbox" className={styles.list}>
              {options.map((option, index) => (
                <Fragment key={`${index}:${option.value}`}>
                  {option.group && option.group !== options[index - 1]?.group ? (
                    <li role="presentation" className={clsx(styles.groupTitle, { [styles.nextGroup ?? ""]: index > 0 })}>
                      {option.group}
                    </li>
                  ) : null}
                  <li
                    id={optionId(id, index)}
                    role="option"
                    aria-selected={index === selectedIndex}
                    aria-disabled={option.disabled || undefined}
                    className={clsx(styles.option, {
                      [styles.active ?? ""]: index === activeIndex,
                      [styles.reserveCheck ?? ""]: selectedIndex >= 0 && index !== selectedIndex,
                    })}
                    onClick={() => onChoose(index)}
                  >
                    <span className={styles.optionLabel}>
                      {option.label}
                      {option.description ? <span className={styles.description}>{option.description}</span> : null}
                    </span>
                    {index === selectedIndex ? <SchCheckmarkIcon className={styles.check} /> : null}
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Portal>
  );
}

"use client";

import { type ChangeEvent, type ComponentPropsWithRef, type ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import { useMergedRef } from "@/shared/lib/mergeRefs";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type" | "onChange" | "size"> {
  checked: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  /** 12/16 #686F79 line under the label */
  description?: ReactNode;
  indeterminate?: boolean;
  /** zoom: portal / Schedule `.zoom-checkbox` · pwa: New-meeting popover `zm-pwa-checkbox` */
  variant?: "zoom" | "pwa";
  /** label colour #232333 (Schedule rows) instead of #222325 */
  legacyLabel?: boolean;
  className?: string;
}

/** zoom-ui / PWA checkbox with hover, press, checked, indeterminate, disabled and focus-visible states. */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  indeterminate = false,
  variant = "zoom",
  legacyLabel = false,
  disabled,
  className,
  ref,
  ...inputProps
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedRef = useMergedRef(inputRef, ref);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={clsx(styles.root, styles[variant], { [styles.disabled ?? ""]: disabled }, className)}>
      <span className={styles.control}>
        <input
          ref={mergedRef}
          type="checkbox"
          className={styles.input}
          checked={checked}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : checked}
          onChange={(event) => onChange?.(event.target.checked, event)}
          {...inputProps}
        />
        <span className={clsx(styles.box, { [styles.indeterminate ?? ""]: indeterminate })} aria-hidden>
          {variant === "zoom" ? <span className={styles.knob} /> : null}
        </span>
      </span>
      {label || description ? (
        <span className={styles.text}>
          {label ? <span className={clsx(styles.label, { [styles.legacy ?? ""]: legacyLabel })}>{label}</span> : null}
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

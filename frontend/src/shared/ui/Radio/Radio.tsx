"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import clsx from "clsx";
import { useRadioGroup } from "./RadioGroup";
import styles from "./Radio.module.css";

export interface RadioProps extends Omit<ComponentPropsWithRef<"input">, "type" | "onChange" | "value"> {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  /** standalone use (outside RadioGroup) */
  checked?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

/** zoom-ui radio (PRD §5.8.7): 16px circle, 8px knob scales in (.15s ease-in). */
export function Radio({ value, label, description, checked, onChange, disabled, name, className, ...inputProps }: RadioProps) {
  const group = useRadioGroup();
  const isChecked = group ? group.value === value : Boolean(checked);
  const isDisabled = Boolean(disabled || group?.disabled);
  const handleChange = () => (group ? group.onChange(value) : onChange?.(value));

  return (
    <label className={clsx(styles.root, { [styles.disabled ?? ""]: isDisabled }, className)}>
      <span className={styles.control}>
        <input
          type="radio"
          className={styles.input}
          name={group?.name ?? name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          {...inputProps}
        />
        <span className={styles.circle} aria-hidden />
      </span>
      {label || description ? (
        <span className={styles.text}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

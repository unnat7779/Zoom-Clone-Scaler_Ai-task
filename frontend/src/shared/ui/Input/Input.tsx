import type { ComponentPropsWithRef, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

export type FieldSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<ComponentPropsWithRef<"input">, "size"> {
  /** sm 24 / md 32 / lg 40 tall */
  size?: FieldSize;
  /** red border (+ red inset ring while focused) */
  error?: boolean;
  /** absolutely positioned icon inside the field (14px #686F79 at md) */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** class for the wrapper — set the field width here (e.g. 490px) */
  className?: string;
  /** class for the native <input> */
  inputClassName?: string;
}

/**
 * zoom-ui text input (PRD §5.8.4): hover tints the background, focus draws a
 * #4B96F1 border + inset ring, error / disabled / readOnly states.
 */
export function Input({
  size = "md",
  error = false,
  leadingIcon,
  trailingIcon,
  className,
  inputClassName,
  ...inputProps
}: InputProps) {
  return (
    <span
      className={clsx(
        styles.field,
        styles[size],
        { [styles.withLeading ?? ""]: leadingIcon, [styles.withTrailing ?? ""]: trailingIcon },
        className,
      )}
    >
      {leadingIcon ? <span className={styles.leading}>{leadingIcon}</span> : null}
      <input
        className={clsx(styles.input, { [styles.error ?? ""]: error }, inputClassName)}
        aria-invalid={error || undefined}
        {...inputProps}
      />
      {trailingIcon ? <span className={styles.trailing}>{trailingIcon}</span> : null}
    </span>
  );
}

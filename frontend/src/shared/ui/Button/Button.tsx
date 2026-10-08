import type { ComponentPropsWithRef, ReactNode } from "react";
import clsx from "clsx";
import { Spinner } from "../Spinner";
import { type ButtonStyleProps, buttonClassName, loadingMaskClass } from "./buttonClasses";

export type ButtonProps = Omit<ComponentPropsWithRef<"button">, "type"> &
  ButtonStyleProps & {
    type?: "button" | "submit" | "reset";
    /** icon before the label (sized by the family: 14px md/lg, 12px sm) */
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    /** zoom family: keeps resting colours, shows the inline spinner mask, blocks clicks */
    loading?: boolean;
    fullWidth?: boolean;
  };

/**
 * One button for the three Zoom button families:
 * - `family="zoom"` (default): variant primary | secondary | secondary-neutral | tertiary | text | overlay,
 *   `danger`, size sm | md | lg, `pureText`, `loading`.
 * - `family="z"`: Meetings-tab z-button, variant normal | tertiary | tertiary-danger | secondary | destructive, size 24 | 32 | 40 | 48.
 * - `family="portal"`: zoom.us zm-button, variant default | primary | plain | danger | link, size small | large.
 * Icon-only buttons: use `IconButton`.
 */
export function Button({
  family,
  variant,
  size,
  danger,
  pureText,
  loading = false,
  fullWidth,
  leadingIcon,
  trailingIcon,
  type = "button",
  className,
  disabled,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const styleProps = { family, variant, size, danger, pureText } as ButtonStyleProps;
  return (
    <button
      type={type}
      className={clsx(buttonClassName({ ...styleProps, loading, fullWidth }), className)}
      disabled={disabled}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
      {loading ? (
        <span className={loadingMaskClass}>
          <Spinner size={16} />
        </span>
      ) : null}
    </button>
  );
}

import clsx from "clsx";
import zoom from "./Button.module.css";
import zButton from "./ZButton.module.css";
import portal from "./PortalButton.module.css";

/** zoom-ui / Prism-3 "Workplace look" (PRD §5.8.1). */
export type ZoomButtonVariant = "primary" | "secondary" | "secondary-neutral" | "tertiary" | "text" | "overlay";
export type ZoomButtonSize = "sm" | "md" | "lg";
/** PWA legacy z-button, Meetings tab (PRD §5.8.2). */
export type ZButtonVariant = "normal" | "tertiary" | "tertiary-danger" | "secondary" | "destructive";
export type ZButtonSize = 24 | 32 | 40 | 48;
/** zoom.us portal zm-button (PRD §5.8.3). */
export type PortalButtonVariant = "default" | "primary" | "plain" | "danger" | "link";
export type PortalButtonSize = "small" | "large";

export type ButtonStyleProps =
  | {
      family?: "zoom";
      variant?: ZoomButtonVariant;
      size?: ZoomButtonSize;
      /** primary → red fill, secondary/tertiary/text → red label */
      danger?: boolean;
      /** text variant without height/padding (`is-pure-text`) */
      pureText?: boolean;
    }
  | { family: "z"; variant?: ZButtonVariant; size?: ZButtonSize; danger?: never; pureText?: never }
  | { family: "portal"; variant?: PortalButtonVariant; size?: PortalButtonSize; danger?: never; pureText?: never };

const ZOOM_VARIANT: Record<ZoomButtonVariant, string | undefined> = {
  primary: zoom.primary,
  secondary: zoom.secondary,
  "secondary-neutral": zoom.secondaryNeutral,
  tertiary: zoom.tertiary,
  text: zoom.text,
  overlay: zoom.overlay,
};

const Z_VARIANT: Record<ZButtonVariant, string | undefined> = {
  normal: zButton.normal,
  tertiary: zButton.tertiary,
  "tertiary-danger": clsx(zButton.tertiary, zButton.tertiaryDanger),
  secondary: zButton.secondary,
  destructive: zButton.destructive,
};

export function buttonClassName(props: ButtonStyleProps & { iconOnly?: boolean; loading?: boolean; fullWidth?: boolean }) {
  const common = { [zoom.fullWidth ?? ""]: props.fullWidth };
  if (props.family === "z") {
    return clsx(zButton.button, zButton[`size${props.size ?? 32}`], Z_VARIANT[props.variant ?? "normal"], common);
  }
  if (props.family === "portal") {
    return clsx(portal.button, portal[props.size ?? "small"], portal[props.variant ?? "default"], common);
  }
  const variant = props.variant ?? "primary";
  return clsx(zoom.button, zoom[props.size ?? "md"], ZOOM_VARIANT[variant], common, {
    [zoom.danger ?? ""]: props.danger,
    [zoom.pureText ?? ""]: props.pureText && variant === "text",
    [zoom.iconOnly ?? ""]: props.iconOnly,
    [zoom.loading ?? ""]: props.loading,
  });
}

export const loadingMaskClass = zoom.loadingMask;

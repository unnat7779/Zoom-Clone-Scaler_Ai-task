import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import touch from "@/shared/styles/touch.module.css";
import styles from "./SearchTextButton.module.css";

/** "Clear" / "Clear all": ui-Button tertiary small (h24, padding 4px 8px, 13px/16px #686F79). */
export function SearchTextButton({ className, ...props }: Omit<ComponentPropsWithoutRef<"button">, "type">) {
  return <button type="button" className={clsx(styles.button, touch.target, className)} {...props} />;
}

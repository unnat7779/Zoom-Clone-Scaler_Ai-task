import clsx from "clsx";
import { MenuItem, type MenuItemProps } from "@/shared/ui";
import styles from "./AvMenuItem.module.css";

/** Dark menu row of the Audio / Video caret menus. */
export function AvMenuItem({ className, ...props }: MenuItemProps) {
  return <MenuItem className={clsx(styles.item, className)} {...props} />;
}

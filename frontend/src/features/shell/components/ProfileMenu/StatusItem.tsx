import clsx from "clsx";
import { PRESENCE_LABELS, PresenceGlyph, type PresenceStatus } from "@/shared/ui/Avatar";
import { MenuItem, type MenuItemProps } from "@/shared/ui/Menu";
import styles from "./StatusItem.module.css";

interface StatusItemProps extends Omit<MenuItemProps, "icon" | "children"> {
  status: PresenceStatus;
}

/** A presence row (`#pwa-status-*`): 10×10 glyph + 10px, then Zoom's status label. */
export function StatusItem({ status, className, ...rest }: StatusItemProps) {
  return (
    <MenuItem icon={<PresenceGlyph status={status} />} className={clsx(styles.statusItem, className)} {...rest}>
      {PRESENCE_LABELS[status]}
    </MenuItem>
  );
}

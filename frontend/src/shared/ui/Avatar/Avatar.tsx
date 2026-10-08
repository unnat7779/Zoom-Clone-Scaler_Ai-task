import clsx from "clsx";
import {
  type AvatarColor,
  getInitials,
  pickMeetingAvatarColor,
  pickWorkplaceAvatarColor,
} from "@/shared/lib/avatar";
import { PresenceGlyph, type PresenceStatus } from "./PresenceGlyph";
import styles from "./Avatar.module.css";

export type AvatarSize = 20 | 24 | 32 | 40 | 48 | 64 | 80 | 110;

export interface AvatarProps {
  /** full name; initials = first letter of the first two words */
  name: string;
  /** 20 / 24 / 32 (header) / 40 / 48 / 64 / 80 / 110 */
  size?: AvatarSize;
  /** workplace: 8-colour zoom-ui palette, initials 600 · meeting: web-client palette, initials 400 */
  palette?: "workplace" | "meeting";
  /** explicit palette key; otherwise picked from `seed` (or the name) */
  color?: AvatarColor;
  seed?: string | number;
  /** rounded: radius 10 (Workplace) · circle (invitee suggestions) · chat: radius 6 */
  shape?: "rounded" | "circle" | "chat";
  /** presence glyph on the top-right corner with a rounded notch */
  presence?: PresenceStatus;
  className?: string;
}

/** Initials avatar (PRD §5.8.14, §5.8.15). */
export function Avatar({
  name,
  size = 32,
  palette = "workplace",
  color,
  seed,
  shape = "rounded",
  presence,
  className,
}: AvatarProps) {
  const key = color ?? (palette === "meeting" ? pickMeetingAvatarColor(seed ?? name) : pickWorkplaceAvatarColor(seed ?? name));
  return (
    <span className={clsx(styles.avatar, styles[`size${size}`], className)} aria-hidden>
      <span
        className={clsx(styles.inner, styles[key], styles[shape], styles[palette], {
          [styles.notchDot ?? ""]: presence && presence !== "meeting",
          [styles.notchMeeting ?? ""]: presence === "meeting",
        })}
      >
        {getInitials(name)}
      </span>
      {presence ? (
        <PresenceGlyph status={presence} className={presence === "meeting" ? styles.glyphMeeting : styles.glyph} />
      ) : null}
    </span>
  );
}

import clsx from "clsx";
import { RoomNetworkGoodIcon } from "@/shared/icons/generated/RoomNetworkGoodIcon";
import styles from "./NameTag.module.css";

interface NameTagProps {
  name: string;
  audioMuted: boolean;
  videoOn: boolean;
  /** px to lift the tag above the toolbar */
  lift: number;
}

/** Bottom-left tag: red muted mic, else network bars for video, else no icon [D]; then the name. */
export function NameTag({ name, audioMuted, videoOn, lift }: NameTagProps) {
  return (
    <div className={styles.tag} style={{ bottom: lift }}>
      {audioMuted ? <span className={clsx(styles.icon, styles.muted)} role="img" aria-label="muted" /> : null}
      {!audioMuted && videoOn ? <RoomNetworkGoodIcon className={styles.icon} /> : null}
      <span className={styles.name}>{name}</span>
    </div>
  );
}

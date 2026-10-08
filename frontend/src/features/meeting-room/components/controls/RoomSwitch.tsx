import clsx from "clsx";
import touch from "@/shared/styles/touch.module.css";
import styles from "./RoomSwitch.module.css";

interface RoomSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

/** Dark toggle switch used by the video menu and the Host tools panel. */
export function RoomSwitch({ checked, onChange, label }: RoomSwitchProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={clsx(styles.switch, touch.target)} onClick={onChange}>
      <span className={styles.thumb} />
    </button>
  );
}

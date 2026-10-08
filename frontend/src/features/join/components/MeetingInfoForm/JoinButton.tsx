import clsx from "clsx";
import styles from "./MeetingInfoForm.module.css";

interface JoinButtonProps {
  /** name (and passcode) filled in and no field error showing */
  enabled: boolean;
  joining: boolean;
}

/**
 * `.preview-join-button` (a `zm-btn`): no hover change; while joining it keeps the label "Join",
 * fades to 60% (`zm-btn--disabled`) and shows the 26px rotating loading sprite after it.
 */
export function JoinButton({ enabled, joining }: JoinButtonProps) {
  return (
    <button
      type="submit"
      className={clsx(styles.join, { [styles.joinDisabled ?? ""]: !enabled, [styles.joining ?? ""]: joining })}
      disabled={!enabled || joining}
      aria-busy={joining || undefined}
    >
      Join
      {joining ? (
        // eslint-disable-next-line @next/next/no-img-element -- static Zoom loading sprite
        <img src="/zoom/mtg-z-loading.png" width={26} height={26} alt="" className={styles.joinLoading} />
      ) : null}
    </button>
  );
}

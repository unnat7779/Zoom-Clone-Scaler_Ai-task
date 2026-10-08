import type { ReactNode } from "react";
import { RoomWarningIcon } from "@/shared/icons/generated/RoomWarningIcon";
import { StaticButton } from "@/shared/ui/StaticButton";
import type { PreviewError } from "../../utils/previewError";
import styles from "./PreviewErrorBanner.module.css";

const doc = (label: string) => <StaticButton className={styles.doc}>{label}</StaticButton>;

/** Zoom's copy (preview.min.js); "Learn more" / "Learn" are `.preview-error-doc` links (Static UI). */
const MESSAGES: Record<PreviewError, ReactNode> = {
  videoForbidden: <>Enable camera access in your browser&apos;s address bar and refresh the page. {doc("Learn more")}</>,
  audioForbidden: (
    <>
      Your browser is preventing access to your microphone. {doc("Learn")} how to allow access to your microphone.
    </>
  ),
  cameraNotFound: <>Cannot detect your camera, please check the device and connection and try again.</>,
  cameraBusy: <>Your camera is being used by other apps. Close those apps and try again.</>,
};

/** `.preview-error.preview-video__error`: 8px from the card top, centred, one message at a time. */
export function PreviewErrorBanner({ error }: { error: PreviewError }) {
  return (
    <div className={styles.banner} role="alert">
      <RoomWarningIcon className={styles.icon} />
      <p>{MESSAGES[error]}</p>
    </div>
  );
}

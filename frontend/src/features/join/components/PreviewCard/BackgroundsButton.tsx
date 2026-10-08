import { StaticButton } from "@/shared/ui/StaticButton";
import styles from "./PreviewCard.module.css";

/** `.preview-video__bg-button` with Zoom's 16px white SvgImage — Static UI only (virtual backgrounds are out of scope). */
export function BackgroundsButton() {
  return (
    <StaticButton className={styles.bgButton} aria-label="Backgrounds">
      <svg className={styles.bgIcon} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          fill="currentColor"
          d="M14 2H2C.897 2 0 2.897 0 4v8c0 1.102.897 2 2 2h12c1.103 0 2-.898 2-2V4c0-1.103-.897-2-2-2m1 10c0 .551-.448 1-1 1h-2.041c.011-.064.041-.121.041-.188 0-1.311-1.714-2.374-4-2.374S4 11.5 4 12.812c0 .067.03.124.041.188H2c-.552 0-1-.449-1-1V4c0-.551.448-1 1-1h12c.552 0 1 .449 1 1zM8 4.5a2.376 2.376 0 1 0 0 4.752A2.376 2.376 0 0 0 8 4.5"
        />
      </svg>
      Backgrounds
    </StaticButton>
  );
}

import { useId } from "react";
import styles from "./RingSpinner.module.css";

/**
 * Device-initialising spinner (`.preview-video .spinner`, screenshot 18; pre-join controls and the
 * room's Video button while the camera opens): Zoom's SvgSpinner —
 * a 3px ring, the top half fading out towards 9 o'clock, the bottom half ending in a
 * round cap there — 24px, in the button colour.
 */
export function RingSpinner() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg className={styles.spinner} viewBox="0 0 16 16" fill="none" role="status" aria-label="Loading">
      <path
        fill={`url(#${id}-top)`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2a6 6 0 0 0-6 6H0a8 8 0 1 1 16 0h-2a6 6 0 0 0-6-6"
      />
      <path
        fill={`url(#${id}-bottom)`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 14a6 6 0 0 0 6-6h2A8 8 0 1 1 0 8a1 1 0 0 1 2 0 6 6 0 0 0 6 6"
      />
      <defs>
        <linearGradient id={`${id}-top`} x1="16" x2="0" y1="8" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0.062" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="0" x2="16" y1="8" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" />
          <stop offset="0.938" stopColor="currentColor" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

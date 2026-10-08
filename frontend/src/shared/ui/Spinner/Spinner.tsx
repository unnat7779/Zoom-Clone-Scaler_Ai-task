import clsx from "clsx";
import styles from "./Spinner.module.css";

export type SpinnerSize = 16 | 24 | 32 | 48;

export interface SpinnerProps {
  /** 16 / 24 / 32 / 48 (zoom-ui sizes). The PWA variant is always 24. */
  size?: SpinnerSize;
  /** spokes: zoom-ui 8-spoke spinner; pwa: rotating Zoom `.z-loading` PNG */
  variant?: "spokes" | "pwa";
  /** default `#0000008F`, light (on dark / primary), dark `rgba(0,0,0,.56)` */
  tone?: "default" | "light" | "dark";
  /** accessible label; omit when the surrounding UI already announces loading */
  label?: string;
  className?: string;
}

const SPOKES = Array.from({ length: 8 }, (_, index) => index);

export function Spinner({ size = 16, variant = "spokes", tone = "default", label, className }: SpinnerProps) {
  const a11y = label ? { role: "status", "aria-label": label } : { "aria-hidden": true };
  if (variant === "pwa") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 24px static sprite, no optimisation needed
      <img src="/zoom/mtg-z-loading.png" width={24} height={24} alt="" className={clsx(styles.pwa, className)} {...a11y} />
    );
  }
  return (
    <span className={clsx(styles.spinner, styles[`size${size}`], styles[tone], className)} {...a11y}>
      {SPOKES.map((spoke) => (
        <span key={spoke} className={styles.spoke} />
      ))}
    </span>
  );
}

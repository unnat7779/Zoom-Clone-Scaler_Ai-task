import clsx from "clsx";
import styles from "./InvalidLink.module.css";

export const INVALID_LINK_MESSAGE = "This meeting link is invalid (3,001)";

interface InvalidLinkMessageProps {
  /** pwa: inside the web-client panel (600 20px, box padding 100) · portal: top-level page (400 18px, padding 50) */
  variant: "pwa" | "portal";
  message?: string;
  /** clone-only [D]: "Try again" under the message when the backend could not be reached */
  onRetry?: () => void;
}

/**
 * Zoom's `#global-error.mini-layout > .box > span.error-message` (04-join.md §5). In the panel
 * it sits in Zoom's iframe document, which is 734px tall in the 694px panel, so it scrolls.
 */
export function InvalidLinkMessage({ variant, message = INVALID_LINK_MESSAGE, onRetry }: InvalidLinkMessageProps) {
  const error = (
    <div className={clsx(styles.globalError, styles[variant])}>
      <div className={styles.box}>
        <span className={styles.message} role="alert">
          {message}
        </span>
        {onRetry ? (
          <button type="button" className={styles.retry} onClick={onRetry}>
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
  if (variant === "portal") return error;
  return (
    <div className={styles.pwaDocument}>
      <div className={styles.pwaBody}>{error}</div>
    </div>
  );
}

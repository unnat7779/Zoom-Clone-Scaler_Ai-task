import { WidgetTextButton } from "./WidgetTextButton";
import styles from "./ListMessage.module.css";

interface ListMessageProps {
  message: string;
  onRetry: () => void;
}

/** Error state of the day list and the Recent card [D]: message + "Try again" text button. */
export function ListMessage({ message, onRetry }: ListMessageProps) {
  return (
    <div className={styles.message} role="alert">
      <div className={styles.text}>{message}</div>
      <WidgetTextButton onClick={onRetry}>Try again</WidgetTextButton>
    </div>
  );
}

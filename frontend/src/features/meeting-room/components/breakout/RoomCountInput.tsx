import { CaretUpIcon } from "@/shared/icons/generated/CaretUpIcon";
import { MAX_ROOMS, MIN_ROOMS } from "../../utils/breakoutRooms";
import styles from "./RoomCountInput.module.css";

interface RoomCountInputProps {
  value: number;
  onChange: (value: number) => void;
  onStep: (delta: number) => void;
}

/** Zoom's 60×24 number box with ▴ / ▾ steppers ("Create [1] breakout rooms", spec 05 §13.5). */
export function RoomCountInput({ value, onChange, onStep }: RoomCountInputProps) {
  return (
    <span className={styles.box}>
      <input
        className={styles.input}
        inputMode="numeric"
        aria-label="Number of breakout rooms"
        role="spinbutton"
        aria-valuemin={MIN_ROOMS}
        aria-valuemax={MAX_ROOMS}
        aria-valuenow={value}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            onStep(event.key === "ArrowUp" ? 1 : -1);
          }
        }}
      />
      <span className={styles.steppers}>
        <button type="button" className={styles.step} tabIndex={-1} aria-label="Increase" onClick={() => onStep(1)}>
          <CaretUpIcon />
        </button>
        <button type="button" className={styles.step} tabIndex={-1} aria-label="Decrease" onClick={() => onStep(-1)}>
          <CaretUpIcon className={styles.down} />
        </button>
      </span>
    </span>
  );
}

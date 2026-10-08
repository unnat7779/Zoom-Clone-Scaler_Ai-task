"use client";

import { useEffect, useId, useRef } from "react";
import clsx from "clsx";
import { useEscapeKey } from "@/shared/hooks";
import { RoomCloseIcon } from "@/shared/icons/generated/RoomCloseIcon";
import touch from "@/shared/styles/touch.module.css";
import { useBreakoutRoomsForm } from "../../hooks/useBreakoutRoomsForm";
import { useDragWindow } from "../../hooks/useDragWindow";
import { useRestoreFocus } from "../../hooks/useRestoreFocus";
import { useRoomUi } from "../../state/useRoomUi";
import { SettingsRadio } from "../settings/controls/SettingsRadio";
import { RoomCountInput } from "./RoomCountInput";
import styles from "./BreakoutRoomsWindow.module.css";

const ASSIGN_MODES = ["Assign automatically", "Assign manually", "Let participants choose room"];

/**
 * More › Breakout Rooms (PRD §8.12.6, spec 05 §13.5, room-20): the modeless 420×424
 * "Create Breakout Rooms" window, dragged by its header. Static UI — Create and Cancel just close it.
 */
export function BreakoutRoomsWindow() {
  const { setBreakoutOpen } = useRoomUi();
  const { rooms, setRooms, step, hint } = useBreakoutRoomsForm();
  const windowRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const close = () => setBreakoutOpen(false);
  useEscapeKey(close, true);
  useRestoreFocus(true, windowRef);
  useDragWindow(windowRef, "header");
  // the window itself takes focus (room-20 shows the count field unfocused); Tab reaches the field
  useEffect(() => windowRef.current?.focus({ preventScroll: true }), []);

  return (
    <div className={styles.layer}>
      <div ref={windowRef} className={styles.window} role="dialog" aria-labelledby={titleId} tabIndex={-1}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Create Breakout Rooms
          </h2>
          <button type="button" className={clsx(styles.close, touch.target)} aria-label="Close" onClick={close}>
            <RoomCloseIcon />
          </button>
        </header>
        <div className={styles.body}>
          <p className={styles.create}>
            Create
            <RoomCountInput value={rooms} onChange={setRooms} onStep={step} />
            breakout rooms
          </p>
          <div className={styles.modes} role="radiogroup" aria-label="Assign participants">
            {ASSIGN_MODES.map((mode, index) => (
              <SettingsRadio key={mode} name={`${titleId}-mode`} label={mode} defaultChecked={index === 0} variant="breakout" />
            ))}
          </div>
          <p className={styles.hint}>{hint}</p>
          <div className={styles.footer}>
            <button type="button" className={styles.cancel} onClick={close}>
              Cancel
            </button>
            <button type="button" className={styles.primary} onClick={close}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { type ComponentType, type RefObject, useRef } from "react";
import clsx from "clsx";
import type { IconProps } from "@/shared/icons/types";
import { RoomReactIconsMoreIcon } from "@/shared/icons/generated/RoomReactIconsMoreIcon";
import { RoomReactNvf270bIcon } from "@/shared/icons/generated/RoomReactNvf270bIcon";
import { RoomReactNvfFeedbackHourglassIcon } from "@/shared/icons/generated/RoomReactNvfFeedbackHourglassIcon";
import { RoomReactNvfNvfCoffeeIcon } from "@/shared/icons/generated/RoomReactNvfNvfCoffeeIcon";
import { RoomReactNvfNvfFasterIcon } from "@/shared/icons/generated/RoomReactNvfNvfFasterIcon";
import { RoomReactNvfNvfNoIcon } from "@/shared/icons/generated/RoomReactNvfNvfNoIcon";
import { RoomReactNvfNvfSlowerIcon } from "@/shared/icons/generated/RoomReactNvfNvfSlowerIcon";
import { RoomReactNvfNvfYesIcon } from "@/shared/icons/generated/RoomReactNvfNvfYesIcon";
import { RoomReactReactions1f389Icon } from "@/shared/icons/generated/RoomReactReactions1f389Icon";
import { RoomReactReactions1f44dIcon } from "@/shared/icons/generated/RoomReactReactions1f44dIcon";
import { RoomReactReactions1f44fIcon } from "@/shared/icons/generated/RoomReactReactions1f44fIcon";
import { RoomReactReactions1f602Icon } from "@/shared/icons/generated/RoomReactReactions1f602Icon";
import { RoomReactReactions1f62eIcon } from "@/shared/icons/generated/RoomReactReactions1f62eIcon";
import { RoomReactReactions2764Icon } from "@/shared/icons/generated/RoomReactReactions2764Icon";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import styles from "./ReactPicker.module.css";

type Choice = [label: string, Icon: ComponentType<IconProps>];

const REACTIONS: Choice[] = [
  ["Clap", RoomReactReactions1f44fIcon],
  ["Thumbs Up", RoomReactReactions1f44dIcon],
  ["Joy", RoomReactReactions1f602Icon],
  ["Open Mouth", RoomReactReactions1f62eIcon],
  ["Heart", RoomReactReactions2764Icon],
  ["Tada", RoomReactReactions1f389Icon],
  ["More", RoomReactIconsMoreIcon],
];

const FEEDBACK: Choice[] = [
  ["Yes", RoomReactNvfNvfYesIcon],
  ["No", RoomReactNvfNvfNoIcon],
  ["Slow down", RoomReactNvfNvfSlowerIcon],
  ["Speed up", RoomReactNvfNvfFasterIcon],
  ["I'm away", RoomReactNvfNvfCoffeeIcon],
];

interface ReactPickerProps {
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

/** Reactions / non-verbal feedback / Raise Hand — Static UI only: any choice just closes it. */
export function ReactPicker({ anchorRef, onClose }: ReactPickerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePopoverDismiss([ref, anchorRef], true, onClose);
  const choice = ([label, Icon]: Choice, kind: string) => (
    <button key={label} type="button" className={clsx(styles.block, kind)} data-tooltip={label} aria-label={label} onClick={onClose}>
      <Icon />
    </button>
  );
  return (
    <div ref={ref} className={styles.picker} role="dialog" aria-label="Reactions">
      <div className={styles.row}>{REACTIONS.map((item) => choice(item, styles.reaction ?? ""))}</div>
      <div className={styles.row}>{FEEDBACK.map((item) => choice(item, styles.feedback ?? ""))}</div>
      <div className={styles.row}>
        <button type="button" className={clsx(styles.block, styles.wide)} onClick={onClose}>
          <RoomReactNvf270bIcon />
          Raise Hand
        </button>
      </div>
      <div className={styles.row}>
        <button type="button" className={clsx(styles.block, styles.wide)} data-tooltip="Mute audio and video" onClick={onClose}>
          <RoomReactNvfFeedbackHourglassIcon />
          Be right back
        </button>
      </div>
    </div>
  );
}

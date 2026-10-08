"use client";

import type { ComponentType } from "react";
import clsx from "clsx";
import { usePhoneRoom } from "../../hooks/usePhoneRoom";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { useRoomUi } from "../../state/useRoomUi";
import { type MidItem, isCompactToolbar, splitToolbar } from "../../utils/toolbarOverflow";
import { AudioButton } from "./AudioButton";
import { ChatButton } from "./ChatButton";
import { EndButton } from "./EndButton";
import { HostToolsButton } from "./HostToolsButton";
import { MoreButton } from "./MoreButton";
import { ParticipantsButton } from "./ParticipantsButton";
import { PromotedButton } from "./PromotedButton";
import { ReactButton } from "./ReactButton";
import { ShareButton } from "./ShareButton";
import { VideoButton } from "./VideoButton";
import styles from "./Toolbar.module.css";

const MID_BUTTONS: Record<MidItem, ComponentType> = {
  participants: ParticipantsButton,
  chat: ChatButton,
  react: ReactButton,
  share: ShareButton,
  hostTools: HostToolsButton,
};

const HOST_ITEMS: MidItem[] = ["participants", "chat", "react", "share", "hostTools"];
const ATTENDEE_ITEMS: MidItem[] = ["participants", "chat", "react", "share"];

interface ToolbarProps {
  hidden: boolean;
  stageWidth: number;
  onHoverChange: (hovering: boolean) => void;
}

/**
 * Audio · Video | Participants · Chat · React · Share · (Host tools) · [| promoted] · More | End / Leave
 * (PRD §8.5, spec 05 §5.3). The compact bar (`data-compact`, phones and very narrow stages)
 * keeps Participants · Chat · More in the middle and shares the width evenly.
 */
export function Toolbar({ hidden, stageWidth, onHoverChange }: ToolbarProps) {
  const { isHost } = useMeetingRoom();
  const { promoted: picked } = useRoomUi();
  const compact = isCompactToolbar(stageWidth, usePhoneRoom());
  const items = isHost ? HOST_ITEMS : ATTENDEE_ITEMS;
  // before the first measurement (width 0) keep every button inline
  const { inline, overflow, promoted } = splitToolbar(items, stageWidth || Number.POSITIVE_INFINITY, compact, picked);
  return (
    <div
      className={clsx(styles.toolbar, hidden && styles.hidden)}
      role="toolbar"
      aria-label="Meeting controls"
      data-compact={compact || undefined}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className={styles.inner}>
        <div className={clsx(styles.section, styles.start)}>
          <AudioButton />
          <VideoButton />
        </div>
        <div className={clsx(styles.section, styles.middle)}>
          {inline.map((item) => {
            const Button = MID_BUTTONS[item];
            return <Button key={item} />;
          })}
          {promoted ? <PromotedButton item={promoted} /> : null}
          <MoreButton overflow={items.filter((item) => overflow.includes(item))} promoted={promoted} compact={compact} />
        </div>
        <div className={clsx(styles.section, styles.end)}>
          <EndButton />
        </div>
      </div>
    </div>
  );
}

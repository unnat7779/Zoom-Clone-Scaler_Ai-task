"use client";

import { useRef } from "react";
import clsx from "clsx";
import { useToggle } from "@/shared/hooks";
import { Avatar } from "@/shared/ui";
import type { ParticipantRowModel } from "../../../hooks/useParticipantRows";
import { ParticipantRowActions } from "./ParticipantRowActions";
import { ParticipantRowMenu } from "./ParticipantRowMenu";
import styles from "./ParticipantRow.module.css";

/** Avatar · "Name(Label)" · mic / video / "…" (PRD §8.8). */
export function ParticipantRow({ row }: { row: ParticipantRowModel }) {
  const { participant, label, color, audioMuted, videoOn } = row;
  const [menuOpen, toggleMenu, setMenuOpen] = useToggle(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const who = [participant.display_name, label].filter(Boolean).join(" ");
  const description = `${who},computer audio ${audioMuted ? "muted" : "unmuted"},video ${videoOn ? "on" : "off"}`;

  return (
    <div className={clsx(styles.row, menuOpen && styles.menuOpen)} role="listitem" aria-label={description}>
      <Avatar name={participant.display_name} size={32} palette="meeting" color={color} className={styles.avatar} />
      <span className={styles.name}>
        {participant.display_name}
        <span className={styles.label}>{label}</span>
      </span>
      <ParticipantRowActions row={row} moreRef={moreRef} onMore={toggleMenu} />
      <ParticipantRowMenu row={row} open={menuOpen} anchorRef={moreRef} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

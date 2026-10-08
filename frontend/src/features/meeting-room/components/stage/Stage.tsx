"use client";

import { useRef } from "react";
import clsx from "clsx";
import { useElementSize } from "@/shared/hooks";
import { useStageChrome } from "../../hooks/useStageChrome";
import { MeetingHeader } from "../header/MeetingHeader";
import { LeaveFlow } from "../leave/LeaveFlow";
import { NotificationLayer } from "../notifications/NotificationLayer";
import { Toolbar } from "../toolbar/Toolbar";
import { VideoArea } from "./VideoArea";
import styles from "./Stage.module.css";

/**
 * Left part of the room: tiles, header, notifications and toolbar (or the leave bar). The tiles
 * lay out inside the device safe area (the whole stage on desktop, where the insets are 0).
 */
export function Stage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const size = useElementSize(ref);
  const area = useElementSize(areaRef);
  const { barsVisible, onPointerMove, onPointerUp, setToolbarHovered, leaveOpen, panelOpen } = useStageChrome();

  return (
    <div
      ref={ref}
      className={clsx(styles.stage, panelOpen && styles.withPanel)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-room-stage
    >
      <div ref={areaRef} className={styles.videoArea}>
        <VideoArea stage={area} toolbarVisible={barsVisible} />
      </div>
      <MeetingHeader hidden={!barsVisible} />
      <NotificationLayer />
      {leaveOpen ? (
        <LeaveFlow />
      ) : (
        <Toolbar hidden={!barsVisible} stageWidth={size.width} onHoverChange={setToolbarHovered} />
      )}
    </div>
  );
}

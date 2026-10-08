"use client";

import { type ComponentType, useRef } from "react";
import { MtgVideoOffIcon } from "@/shared/icons/generated/MtgVideoOffIcon";
import { MtgVideoOnIcon } from "@/shared/icons/generated/MtgVideoOnIcon";
import { RoomVideoDisallowedIcon } from "@/shared/icons/generated/RoomVideoDisallowedIcon";
import { useLocalControls } from "../../realtime/useLocalControls";
import { useRoomUi } from "../../state/useRoomUi";
import { type VideoControlState, videoControlState } from "../../utils/localControlState";
import { ToolbarButton } from "./ToolbarButton";
import { VideoMenu } from "./VideoMenu";

const ICONS: Record<VideoControlState, ComponentType> = {
  starting: MtgVideoOffIcon,
  blocked: RoomVideoDisallowedIcon,
  on: MtgVideoOnIcon,
  off: MtgVideoOffIcon,
};

/**
 * Camera toggle; the label is always "Video" [M], only the icon and aria-label change. While the
 * camera opens — at entry and after Start Video — the button is disabled like Zoom's
 * `send-video-container--disabled` (opacity .5, start-video glyph, no caret).
 */
export function VideoButton() {
  const { videoOn, videoStarting, videoBlocked, toggleVideo } = useLocalControls();
  const { menu, toggleMenu, closeMenu } = useRoomUi();
  const caretRef = useRef<HTMLButtonElement | null>(null);
  const state = videoControlState({ starting: videoStarting, blocked: videoBlocked, on: videoOn });
  const Icon = ICONS[state];
  const starting = state === "starting";

  return (
    <ToolbarButton
      label="Video"
      ariaLabel={videoOn ? "stop my video" : "start my video"}
      icon={<Icon />}
      onClick={toggleVideo}
      wide
      disabled={starting}
      caretRef={caretRef}
      caret={starting ? undefined : { ariaLabel: "More video controls", open: menu === "video", onClick: () => toggleMenu("video") }}
    >
      {menu === "video" && !starting ? <VideoMenu anchorRef={caretRef} onClose={closeMenu} /> : null}
    </ToolbarButton>
  );
}

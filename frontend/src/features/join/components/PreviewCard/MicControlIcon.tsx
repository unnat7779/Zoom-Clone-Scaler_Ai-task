import { MtgMicMutedIcon } from "@/shared/icons/generated/MtgMicMutedIcon";
import { RoomAudioDisallowedIcon } from "@/shared/icons/generated/RoomAudioDisallowedIcon";
import { AudioLevelIcon, RingSpinner } from "@/shared/media";
import type { PreviewDeviceControl } from "../../hooks/usePreviewMedia";

/** Initialising → spinner · blocked → red warning triangle · live → mic + level meter · muted → slashed mic. */
export function MicControlIcon({ control, stream }: { control: PreviewDeviceControl; stream: MediaStream | null }) {
  if (control.status === "pending") return <RingSpinner />;
  if (control.status !== "granted") return <RoomAudioDisallowedIcon />;
  return control.on ? <AudioLevelIcon stream={stream} /> : <MtgMicMutedIcon />;
}

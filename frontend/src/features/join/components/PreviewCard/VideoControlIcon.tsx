import { MtgVideoOffIcon } from "@/shared/icons/generated/MtgVideoOffIcon";
import { MtgVideoOnIcon } from "@/shared/icons/generated/MtgVideoOnIcon";
import { RoomVideoDisallowedIcon } from "@/shared/icons/generated/RoomVideoDisallowedIcon";
import { RingSpinner } from "@/shared/media";
import type { PreviewDeviceControl } from "../../hooks/usePreviewMedia";

/** Initialising → spinner · blocked → red warning triangle · on / off camera glyphs. */
export function VideoControlIcon({ control }: { control: PreviewDeviceControl }) {
  if (control.status === "pending") return <RingSpinner />;
  if (control.status !== "granted") return <RoomVideoDisallowedIcon />;
  return control.on ? <MtgVideoOnIcon /> : <MtgVideoOffIcon />;
}

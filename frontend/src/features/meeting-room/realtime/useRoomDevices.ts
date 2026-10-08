"use client";

import { type MediaDeviceOption, streamDeviceId } from "@/shared/media";
import { useRoomContext } from "./roomContext";

/** The chosen id, else the device the browser opened, else the first one ("default"). */
function selectedId(options: MediaDeviceOption[], ...candidates: (string | undefined)[]) {
  const match = candidates.find((id) => id && options.some((option) => option.deviceId === id));
  return match ?? options[0]?.deviceId;
}

/** Microphones / speakers / cameras for the caret menus, with the current selection. */
export function useRoomDevices() {
  const { media, devices } = useRoomContext();
  const { microphones, speakers, cameras } = devices;
  return {
    microphones,
    speakers,
    cameras,
    microphoneId: selectedId(microphones, media.audioInputId, streamDeviceId(media.audioStream)),
    speakerId: selectedId(speakers, media.audioOutputId),
    cameraId: selectedId(cameras, media.videoInputId, streamDeviceId(media.videoStream)),
    selectMicrophone: media.selectAudioInput,
    selectSpeaker: media.selectAudioOutput,
    selectCamera: media.selectVideoInput,
  };
}

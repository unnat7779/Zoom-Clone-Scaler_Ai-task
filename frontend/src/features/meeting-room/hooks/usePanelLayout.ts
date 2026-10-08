"use client";

import { useElementSize } from "@/shared/hooks";
import { useRoomUi } from "../state/useRoomUi";
import { type PanelLayout, panelLayoutFor } from "../utils/panelLayout";
import { usePhoneRoom } from "./usePhoneRoom";

/** Side column, floating pop-out window or phone sheet for the right panels (utils/panelLayout). */
export function usePanelLayout(): PanelLayout {
  const { roomRef } = useRoomUi();
  const { width } = useElementSize(roomRef);
  return panelLayoutFor(width, usePhoneRoom());
}

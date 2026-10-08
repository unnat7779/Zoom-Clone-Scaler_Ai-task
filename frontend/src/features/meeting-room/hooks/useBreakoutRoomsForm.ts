"use client";

import { useState } from "react";
import { useParticipants } from "../realtime/useParticipants";
import { MIN_ROOMS, clampRoomCount, participantsPerRoomLabel } from "../utils/breakoutRooms";

/** Room count of the static "Create Breakout Rooms" window and the per-room hint it drives. */
export function useBreakoutRoomsForm() {
  const { count } = useParticipants();
  const [rooms, setRooms] = useState(MIN_ROOMS);
  return {
    rooms,
    setRooms: (value: number) => setRooms(clampRoomCount(value)),
    step: (delta: number) => setRooms((current) => clampRoomCount(current + delta)),
    // the host stays in the main session
    hint: participantsPerRoomLabel(count - 1, rooms),
  };
}

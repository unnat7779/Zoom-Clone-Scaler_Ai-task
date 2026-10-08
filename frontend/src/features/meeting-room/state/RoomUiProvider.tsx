"use client";

import { type Dispatch, type ReactNode, type RefObject, createContext, useContext, useMemo, useReducer, useRef } from "react";
import { useLocalStorage } from "@/shared/hooks";
import { type RoomUiAction, type RoomUiState, initialRoomUiState, roomUiReducer } from "./roomUiReducer";

export type ViewMode = "speaker" | "gallery";

/** PRD §8.3.1 [D]: the chosen view is remembered per browser. */
const VIEW_STORAGE_KEY = "zc.view";

interface RoomUiContextValue {
  ui: RoomUiState;
  dispatch: Dispatch<RoomUiAction>;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  /** the room root (#wc-content): fullscreen target and positioning context of room dialogs */
  roomRef: RefObject<HTMLDivElement | null>;
}

const RoomUiContext = createContext<RoomUiContextValue | null>(null);

export function RoomUiProvider({ children }: { children: ReactNode }) {
  const [ui, dispatch] = useReducer(roomUiReducer, initialRoomUiState);
  const [storedView, setStoredView] = useLocalStorage<ViewMode>(VIEW_STORAGE_KEY, "speaker");
  const roomRef = useRef<HTMLDivElement | null>(null);
  const view: ViewMode = storedView === "gallery" ? "gallery" : "speaker";
  const value = useMemo(() => ({ ui, dispatch, view, setView: setStoredView, roomRef }), [ui, view, setStoredView]);
  return <RoomUiContext.Provider value={value}>{children}</RoomUiContext.Provider>;
}

export function useRoomUiContext(): RoomUiContextValue {
  const value = useContext(RoomUiContext);
  if (!value) throw new Error("useRoomUi must be used inside <RoomUiProvider>");
  return value;
}

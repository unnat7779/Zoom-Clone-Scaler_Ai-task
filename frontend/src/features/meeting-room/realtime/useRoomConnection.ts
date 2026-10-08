"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { endMeeting, meetingSocketUrl } from "@/shared/lib/api";
import { logger } from "@/shared/lib/logger";
import type { HostCommand } from "@/shared/types/realtime";
import { getIceServers } from "./iceServers";
import { type MessageHandler, type RoomEvent, createMessageHandler } from "./messageHandler";
import { PeerManager } from "./peerManager";
import { type RoomState, initialRoomState, roomReducer } from "./roomReducer";
import { SignalingClient } from "./signalingClient";
import type { RoomMedia } from "./useRoomMedia";

export interface RoomConnectionOptions {
  number: string;
  token: string;
  media: RoomMedia;
  onEvent: (event: RoomEvent) => void;
}

export interface RoomConnection {
  state: RoomState;
  sendHostCommand: (command: HostCommand) => void;
  /** Leave Meeting: tell the server, close media and connections */
  leave: () => void;
  /** End Meeting for All (host): `POST /end`, then close everything; on failure the meeting goes on */
  endForAll: () => Promise<void>;
}

type DebugWindow = Window & { __zcRoom?: { peers: PeerManager; client: SignalingClient } };

/** Signalling + WebRTC mesh for one meeting (PRD §9). */
export function useRoomConnection({ number, token, media, onEvent }: RoomConnectionOptions): RoomConnection {
  const [state, dispatch] = useReducer(roomReducer, initialRoomState);
  const stateRef = useRef(state);
  const mediaRef = useRef(media);
  const leavingRef = useRef(false);
  const clientRef = useRef<SignalingClient | null>(null);
  const peersRef = useRef<PeerManager | null>(null);
  const onEventRef = useRef(onEvent);
  const emit = useCallback((event: RoomEvent) => onEventRef.current(event), []);

  useEffect(() => {
    stateRef.current = state;
    mediaRef.current = media;
    onEventRef.current = onEvent;
  });

  useEffect(() => {
    const peers = new PeerManager(getIceServers(), {
      send: (message) => clientRef.current?.send(message),
      onRemoteStream: (participantId, stream) => dispatch({ type: "stream", participantId, stream }),
      onConnectionState: (participantId, connection) => dispatch({ type: "connection", participantId, state: connection }),
    });
    let handler: MessageHandler | null = null;
    const client = new SignalingClient(meetingSocketUrl(number, token), {
      onMessage: (message) => handler?.handle(message),
      onStatus: (status) => {
        if (status !== "reconnecting") return;
        peers.closeAll();
        dispatch({ type: "phase", phase: "reconnecting" });
        emit({ type: "reconnecting" });
      },
      onGiveUp: () => {
        logger.warn("signalling: gave up reconnecting");
        peers.closeAll();
        mediaRef.current.release();
        dispatch({ type: "phase", phase: "failed" });
      },
    });
    handler = createMessageHandler({
      dispatch,
      peers,
      client,
      state: () => stateRef.current,
      isLeaving: () => leavingRef.current,
      media: {
        isAudioMuted: () => mediaRef.current.audioMuted,
        setAudioMuted: (muted) => mediaRef.current.setAudioMuted(muted),
        setVideoOn: (on) => mediaRef.current.setVideoOn(on),
        release: () => mediaRef.current.release(),
      },
      emit,
    });
    peers.setLocalTrack("audio", mediaRef.current.audioTrack);
    peers.setLocalTrack("video", mediaRef.current.videoTrack);
    clientRef.current = client;
    peersRef.current = peers;
    const debugWindow = window as DebugWindow;
    if (process.env.NODE_ENV !== "production") debugWindow.__zcRoom = { peers, client };
    // deferred so React StrictMode's mount → unmount → mount opens a single socket
    const connectTimer = setTimeout(() => client.connect(), 0);
    const onPageHide = () => client.close(true);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      clearTimeout(connectTimer);
      window.removeEventListener("pagehide", onPageHide);
      handler?.dispose();
      client.close(!leavingRef.current);
      peers.closeAll();
      clientRef.current = null;
      peersRef.current = null;
      if (debugWindow.__zcRoom?.client === client) delete debugWindow.__zcRoom;
    };
  }, [number, token, emit]);

  useEffect(() => {
    peersRef.current?.setLocalTrack("audio", media.audioTrack);
  }, [media.audioTrack]);

  useEffect(() => {
    peersRef.current?.setLocalTrack("video", media.videoTrack);
  }, [media.videoTrack]);

  useEffect(() => {
    if (state.phase !== "live") return;
    clientRef.current?.send({ type: "media_state", audio_muted: media.audioMuted, video_on: media.videoOn });
  }, [state.phase, media.audioMuted, media.videoOn]);

  const shutDown = useCallback((sendLeave: boolean) => {
    leavingRef.current = true;
    clientRef.current?.close(sendLeave);
    peersRef.current?.closeAll();
    mediaRef.current.release();
    dispatch({ type: "phase", phase: "left" });
  }, []);

  const leave = useCallback(() => shutDown(true), [shutDown]);

  const endForAll = useCallback(async () => {
    // set first: the server's `meeting_ended` may arrive before the response
    leavingRef.current = true;
    try {
      await endMeeting(number, { token });
    } catch (error) {
      leavingRef.current = false;
      logger.warn("End Meeting for All failed", error);
      emit({ type: "endFailed" });
      return;
    }
    shutDown(false);
  }, [number, token, shutDown, emit]);

  const sendHostCommand = useCallback((command: HostCommand) => {
    if (!clientRef.current?.send({ type: "host_command", ...command })) logger.warn(`host command "${command.command}" not sent: socket closed`);
  }, []);

  return useMemo(() => ({ state, sendHostCommand, leave, endForAll }), [state, sendHostCommand, leave, endForAll]);
}

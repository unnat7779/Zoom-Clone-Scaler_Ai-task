"use client";

import type { Size } from "@/shared/hooks";
import type { StageTile } from "../../hooks/useStageTiles";
import { DESKTOP_FILMSTRIP, activeTileRect, phoneFilmstrip } from "../../utils/speakerLayout";
import { Filmstrip } from "./Filmstrip";
import { VideoTile } from "./VideoTile";

/** With the toolbar up, a tag reaching the bottom sits just above it (tag bottom = stage − 55). */
const TAG_CLEARANCE = 51;

interface SpeakerViewProps {
  active: StageTile | null;
  filmstrip: StageTile[];
  stage: Size;
  toolbarVisible: boolean;
  /** phone layout [D]: smaller thumbnails, an active tile that fills a portrait screen */
  phone: boolean;
}

/** Active speaker large; everyone else in the filmstrip (PRD §8.3.2). No ring in speaker view [D]. */
export function SpeakerView({ active, filmstrip, stage, toolbarVisible, phone }: SpeakerViewProps) {
  if (!active) return null;
  const metrics = phone ? phoneFilmstrip(stage.width, stage.height) : DESKTOP_FILMSTRIP;
  const rect = activeTileRect(stage.width, stage.height, filmstrip.length > 0, metrics, phone);
  const overlap = rect.y + rect.height - (stage.height - TAG_CLEARANCE);
  const tagLift = toolbarVisible ? Math.max(0, overlap) : 0;
  return (
    <>
      {filmstrip.length > 0 ? <Filmstrip tiles={filmstrip} stageWidth={stage.width} metrics={metrics} /> : null}
      <VideoTile key={active.participant.id} tile={active} rect={rect} tagLift={tagLift} />
    </>
  );
}

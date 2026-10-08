import clsx from "clsx";
import type { StageTile } from "../../hooks/useStageTiles";
import type { TileRect } from "../../utils/galleryLayout";
import { NameTag } from "./NameTag";
import { TileVideo } from "./TileVideo";
import styles from "./VideoTile.module.css";

/** Avatar-mode name: tile width / 15, at least 16px (PRD §8.3.4 [M]). */
const nameSize = (tileWidth: number) => Math.max(16, tileWidth / 15);

interface VideoTileProps {
  tile: StageTile;
  rect: TileRect;
  /** green active-speaker ring */
  active?: boolean;
  /** px the name tag rises to clear the toolbar */
  tagLift?: number;
}

export function VideoTile({ tile, rect, active = false, tagLift = 0 }: VideoTileProps) {
  const { participant, isSelf, stream, showVideo, audioMuted } = tile;
  return (
    <div
      className={clsx(styles.tile, active && styles.active)}
      style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
      data-participant-id={participant.id}
    >
      {showVideo && stream ? (
        <TileVideo stream={stream} mirrored={isSelf} />
      ) : (
        <span className={styles.name} style={{ fontSize: nameSize(rect.width) }}>
          {participant.display_name}
        </span>
      )}
      <NameTag name={participant.display_name} audioMuted={audioMuted} videoOn={showVideo} lift={tagLift} />
    </div>
  );
}

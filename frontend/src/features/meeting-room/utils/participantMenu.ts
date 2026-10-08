/**
 * Row "More options" menu model (PRD §8.8): self → Start/Stop Video │ Add Pin │ Rename;
 * host about others → Chat · Ask to Start Video / Stop Video │ Add Pin │ Make Host · Rename │
 * Allow to Multi-pin │ Put in Waiting Room · Remove · Report; attendee about others →
 * Chat │ Add Pin. Only the self video toggle and Remove do something.
 */
export type ParticipantMenuAction = "toggleSelfVideo" | "remove";

export type ParticipantMenuEntry = { label: string; action?: ParticipantMenuAction } | "divider";

interface RowState {
  isSelf: boolean;
  videoOn: boolean;
}

export function participantMenuEntries({ isSelf, videoOn }: RowState, viewerIsHost: boolean): ParticipantMenuEntry[] {
  if (isSelf) {
    return [{ label: videoOn ? "Stop Video" : "Start Video", action: "toggleSelfVideo" }, "divider", { label: "Add Pin" }, "divider", { label: "Rename" }];
  }
  if (!viewerIsHost) return [{ label: "Chat" }, "divider", { label: "Add Pin" }];
  return [
    { label: "Chat" },
    // the video action follows that participant's camera (static)
    { label: videoOn ? "Stop Video" : "Ask to Start Video" },
    "divider",
    { label: "Add Pin" },
    "divider",
    { label: "Make Host" },
    { label: "Rename" },
    "divider",
    { label: "Allow to Multi-pin" },
    "divider",
    { label: "Put in Waiting Room" },
    { label: "Remove", action: "remove" },
    { label: "Report" },
  ];
}

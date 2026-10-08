import type { ScheduleFormApi } from "../../hooks/useScheduleForm";
import type { EncryptionMode } from "../../types";
import { EncryptionRow } from "../rows/EncryptionRow";
import { MeetingChatRow } from "../rows/MeetingChatRow";
import { MyNotesRow } from "../rows/MyNotesRow";
import { OptionsRow } from "../rows/OptionsRow";
import { VideoRow } from "../rows/VideoRow";
import { WorkflowRow } from "../rows/WorkflowRow";
import { ZoomAiRow } from "../rows/ZoomAiRow";
import styles from "./AdvancedOptions.module.css";

interface AdvancedOptionsProps {
  form: ScheduleFormApi;
  /** Edit PMI has no Meeting chat row */
  showMeetingChat: boolean;
  encryption: EncryptionMode;
  onEncryptionChange: (mode: EncryptionMode) => void;
}

/** Everything after the divider: Encryption … Options. End-to-end hides Zoom AI, Workflow, My Notes and Meeting chat. */
export function AdvancedOptions({ form, showMeetingChat, encryption, onEncryptionChange }: AdvancedOptionsProps) {
  const enhanced = encryption === "enhanced";
  return (
    <>
      <div className={styles.divider} />
      <EncryptionRow mode={encryption} onChange={onEncryptionChange} />
      {enhanced ? (
        <>
          <ZoomAiRow />
          <WorkflowRow />
          <MyNotesRow />
          {showMeetingChat ? <MeetingChatRow /> : null}
        </>
      ) : null}
      <VideoRow form={form} />
      <OptionsRow form={form} />
    </>
  );
}

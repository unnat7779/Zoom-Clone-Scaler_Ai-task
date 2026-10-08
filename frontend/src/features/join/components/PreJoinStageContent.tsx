"use client";

import type { MeetingValidation } from "@/shared/types/api";
import { usePreJoinParams } from "../hooks/usePreJoinParams";
import { JOIN_ERROR_COPY } from "../utils/joinErrors";
import type { PreJoinStage } from "../utils/preJoinStage";
import { InvalidLinkMessage } from "./InvalidLink/InvalidLinkMessage";
import { InvalidLinkPage } from "./InvalidLink/InvalidLinkPage";
import { PreJoinScreen } from "./PreJoinScreen";
import { FullViewportLoading } from "./WebClientPanel/FullViewportLoading";
import { WebClientLoading } from "./WebClientPanel/WebClientLoading";

interface PreJoinStageContentProps {
  number: string;
  stage: PreJoinStage;
  validation: MeetingValidation | undefined;
  revalidate: () => void;
}

/** What the pre-join route shows for each stage, in the panel (`fromPWA`) or full viewport. */
export function PreJoinStageContent({ number, stage, validation, revalidate }: PreJoinStageContentProps) {
  const { inShell } = usePreJoinParams();
  if (stage === "loading") return inShell ? <WebClientLoading /> : <FullViewportLoading />;
  if (stage === "invalid") return inShell ? <InvalidLinkMessage variant="pwa" /> : <InvalidLinkPage />;
  if (stage === "unreachable") {
    const message = JOIN_ERROR_COPY.network;
    return inShell ? (
      <InvalidLinkMessage variant="pwa" message={message} onRetry={revalidate} />
    ) : (
      <InvalidLinkPage message={message} onRetry={revalidate} />
    );
  }
  if (!validation) return null;
  return <PreJoinScreen number={number} validation={validation} revalidate={revalidate} />;
}

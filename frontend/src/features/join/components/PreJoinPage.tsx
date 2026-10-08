"use client";

import { useMeetingValidation } from "../api/useMeetingValidation";
import { usePreJoinParams } from "../hooks/usePreJoinParams";
import { getPreJoinStage } from "../utils/preJoinStage";
import { PreJoinStageContent } from "./PreJoinStageContent";
import { WebClientPanel } from "./WebClientPanel/WebClientPanel";

/**
 * `/wc/{number}/join` (PRD §7.2.8, §7.10): validates the number, then shows Zoom's invalid
 * page or the dark pre-join page (which also holds the guest until the host starts). With
 * `?fromPWA=1` everything renders in the web-client panel inside the Workplace shell.
 */
export function PreJoinPage({ number }: { number: string }) {
  const { pwd, inShell } = usePreJoinParams();
  const validation = useMeetingValidation(number, pwd);
  const content = (
    <PreJoinStageContent
      number={number}
      stage={getPreJoinStage(validation.data, validation.isError)}
      validation={validation.data}
      revalidate={() => void validation.refetch()}
    />
  );
  return inShell ? <WebClientPanel>{content}</WebClientPanel> : content;
}

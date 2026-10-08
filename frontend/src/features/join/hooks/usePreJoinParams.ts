"use client";

import { useSearchParams } from "next/navigation";
import { FROM_PWA_PARAM } from "@/shared/lib/routes";

export interface PreJoinParams {
  /** invite token from the link (`?pwd=`) */
  pwd: string | null;
  /** `?fromPWA=1`: inside the Workplace shell (web-client panel), else full viewport */
  inShell: boolean;
}

export function usePreJoinParams(): PreJoinParams {
  const searchParams = useSearchParams();
  return {
    pwd: searchParams.get("pwd") || null,
    inShell: searchParams.get(FROM_PWA_PARAM) === "1",
  };
}

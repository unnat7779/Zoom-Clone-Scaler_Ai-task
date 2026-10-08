import { env } from "@/shared/lib/env";

/**
 * Duration rules per plan (PRD §7.6.4 row 3): `pro` (default) = hours 0–24,
 * minutes 0/15/30/45, 1 hr 0 min; `basic` = Zoom's captured Basic account:
 * hour select disabled at 0, minutes 0/15/30/40, 0 hr 40 min, 40-minute banner,
 * passcode forced on.
 */
export const isBasicPlan = env.plan === "basic";

export const DURATION_HOURS: readonly string[] = isBasicPlan ? ["0"] : Array.from({ length: 25 }, (_, hour) => String(hour));

export const DURATION_MINUTES: readonly string[] = isBasicPlan ? ["0", "15", "30", "40"] : ["0", "15", "30", "45"];

export const DEFAULT_DURATION = isBasicPlan ? { hours: "0", minutes: "40" } : { hours: "1", minutes: "0" };

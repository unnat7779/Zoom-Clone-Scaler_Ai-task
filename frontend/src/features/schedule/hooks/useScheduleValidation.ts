"use client";

import { useState } from "react";
import type { ScheduleFormValues } from "../types";
import { startInstant } from "../utils/formValues";
import { isPasscodeInvalid } from "../utils/passcode";

const TOPIC_REQUIRED = "Topic is required";
const START_PASSED = "The start time has already passed";
const PAST_TOLERANCE_MS = 5 * 60_000;

const startKeyOf = (values: ScheduleFormValues) => `${values.date}|${values.time}|${values.meridiem}|${values.timezone}`;

/**
 * Schedule validation (PRD §7.6.4): Topic on blur and on Save ("Topic is required",
 * cleared on the next blur), passcode must not be empty (red border only), and on Save
 * a start more than 5 minutes in the past — checked only when the start changed (Edit).
 */
export function useScheduleValidation(values: ScheduleFormValues, editedFrom: ScheduleFormValues | null) {
  const [topicError, setTopicError] = useState<string | null>(null);
  const [failedStartKey, setFailedStartKey] = useState<string | null>(null);
  const startKey = startKeyOf(values);
  /** creating: always checked; editing: only when the start was changed */
  const startChanged = editedFrom === null || startKey !== startKeyOf(editedFrom);

  const passcodeInvalid = isPasscodeInvalid(values);
  /** the error row disappears as soon as date, time or zone change */
  const startError = failedStartKey === startKey ? START_PASSED : null;

  const checkTopic = () => setTopicError(values.topic.trim() ? null : TOPIC_REQUIRED);

  const validateAll = (now: Date): boolean => {
    const topicOk = values.topic.trim().length > 0;
    const startOk = !startChanged || startInstant(values).getTime() >= now.getTime() - PAST_TOLERANCE_MS;
    setTopicError(topicOk ? null : TOPIC_REQUIRED);
    setFailedStartKey(startOk ? null : startKey);
    return topicOk && startOk && !passcodeInvalid;
  };

  /** the backend rejected the start (clock skew) — show the same row */
  const flagStartPassed = () => setFailedStartKey(startKey);

  return { topicError, startError, passcodeInvalid, checkTopic, validateAll, flagStartPassed };
}

export type ScheduleValidation = ReturnType<typeof useScheduleValidation>;

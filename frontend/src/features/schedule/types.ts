import type { Meridiem } from "./utils/time";

/** Functional Schedule / Edit fields (PRD §7.6.3 "F" rows). Static rows keep their own visual state. */
export interface ScheduleFormValues {
  topic: string;
  description: string;
  /** "+ Add Description" was clicked (or the meeting already has one) */
  descriptionOpen: boolean;
  /** local calendar day, `YYYY-MM-DD` */
  date: string;
  /** 12-hour label: `11:00`, or a typed free time `09:10` */
  time: string;
  meridiem: Meridiem;
  /** accepted free times, inserted into the time list */
  customTimes: string[];
  durationHours: string;
  durationMinutes: string;
  timezone: string;
  recurring: boolean;
  invitees: string[];
  meetingIdMode: "auto" | "pmi";
  passcodeEnabled: boolean;
  passcode: string;
  waitingRoom: boolean;
  hostVideo: "on" | "off";
  participantVideo: "on" | "off";
  joinBeforeHost: boolean;
  muteUponEntry: boolean;
}

export type SetField = <K extends keyof ScheduleFormValues>(key: K, value: ScheduleFormValues[K]) => void;

/** Encryption radios (static): End-to-end hides the rows it disables (03-schedule.md §5.13). */
export type EncryptionMode = "enhanced" | "e2e";

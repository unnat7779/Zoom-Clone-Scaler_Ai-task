/** zoom.us/j only launches 9–11 digit meeting numbers; anything else gets the portal error. */
const MEETING_NUMBER = /^\d{9,11}$/;

export const isLaunchableMeetingNumber = (number: string): boolean => MEETING_NUMBER.test(number);

/** `zoom.us/j/abc` [M live] */
export const INVALID_MEETING_ID_MESSAGE = "Invalid meeting ID. (3,000)";

/** document title of `/j/{n}` before the launch fires (set server-side, so the first paint is right) */
export const inviteLinkTitle = (number: string): string =>
  isLaunchableMeetingNumber(number) ? "Launch Meeting - Zoom" : "Error - Zoom";

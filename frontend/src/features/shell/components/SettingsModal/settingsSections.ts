import type { SettingsGlyphName } from "./settingsGlyphs";

export type SettingsSectionId = "general" | "audio" | "video" | "chat" | "account";

/** Left-nav entries (PRD §6.9): `.settings-icon` 12px / padding 3, but 14px / padding 2 for General, Audio, Video. */
export const SETTINGS_SECTIONS: Array<{ id: SettingsSectionId; label: string; glyph: SettingsGlyphName; glyphSize: number }> = [
  { id: "general", label: "General", glyph: "general", glyphSize: 14 },
  { id: "audio", label: "Audio", glyph: "audio", glyphSize: 14 },
  { id: "video", label: "Video", glyph: "video", glyphSize: 14 },
  { id: "chat", label: "Chat", glyph: "chat", glyphSize: 12 },
  { id: "account", label: "My account", glyph: "account", glyphSize: 12 },
];

/** A static settings row: a device select (one "Same as System" choice) or a checkbox. */
export type SettingsRow = { kind: "device"; label: string } | { kind: "checkbox"; label: string; checked: boolean };

export interface SettingsGroup {
  title: string;
  rows: SettingsRow[];
}

/**
 * Static contents of the Audio, Video and Chat panes [D] — Zoom's captures only show General, so
 * these follow the Workplace app's settings wording in the General pane's style.
 */
export const STATIC_PANES: Record<"audio" | "video" | "chat", SettingsGroup[]> = {
  audio: [
    { title: "Speaker", rows: [{ kind: "device", label: "Speaker" }] },
    {
      title: "Microphone",
      rows: [
        { kind: "device", label: "Microphone" },
        { kind: "checkbox", label: "Automatically adjust microphone volume", checked: true },
      ],
    },
    {
      title: "Meetings",
      rows: [
        { kind: "checkbox", label: "Mute my microphone when joining a meeting", checked: false },
        { kind: "checkbox", label: "Press and hold Space key to temporarily unmute myself", checked: true },
      ],
    },
  ],
  video: [
    {
      title: "Camera",
      rows: [
        { kind: "device", label: "Camera" },
        { kind: "checkbox", label: "HD", checked: true },
      ],
    },
    {
      title: "My video",
      rows: [
        { kind: "checkbox", label: "Mirror my video", checked: true },
        { kind: "checkbox", label: "Turn off my video when joining a meeting", checked: false },
        { kind: "checkbox", label: "Always display participant names on their video", checked: true },
      ],
    },
  ],
  chat: [
    {
      title: "Notifications",
      rows: [
        { kind: "checkbox", label: "Show unread message badge", checked: true },
        { kind: "checkbox", label: "Play sound for new messages", checked: true },
      ],
    },
    {
      title: "Messages",
      rows: [
        { kind: "checkbox", label: "Show link previews", checked: true },
        { kind: "checkbox", label: "Show typing indicator", checked: true },
      ],
    },
  ],
};

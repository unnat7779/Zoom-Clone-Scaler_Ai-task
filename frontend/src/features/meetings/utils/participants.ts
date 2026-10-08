import type { ParticipantRecord } from "@/shared/types/api";

/** `Alex Morgan (Host), Priya Sharma, …` — one entry per name, host first, in join order. */
export function participantNames(records: ParticipantRecord[]): string {
  const ordered = [...records].sort((a, b) => Number(b.role === "host") - Number(a.role === "host") || a.joined_at.localeCompare(b.joined_at));
  const seen = new Set<string>();
  const names: string[] = [];
  for (const record of ordered) {
    if (seen.has(record.display_name)) continue;
    seen.add(record.display_name);
    names.push(record.role === "host" ? `${record.display_name} (Host)` : record.display_name);
  }
  return names.join(", ");
}

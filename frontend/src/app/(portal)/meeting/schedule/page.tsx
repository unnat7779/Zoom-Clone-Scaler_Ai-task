import type { Metadata } from "next";
import { SchedulePage } from "@/features/schedule";

export const metadata: Metadata = { title: "Schedule a Meeting - Zoom" };

export default function Page() {
  return <SchedulePage />;
}

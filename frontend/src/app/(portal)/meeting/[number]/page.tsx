import type { Metadata } from "next";
import { MeetingDetailPage } from "@/features/meetings";

/** PRD §7.8 [D]; the invalid-ID state switches to "Error - Zoom". */
export const metadata: Metadata = { title: "Meeting Details - Zoom" };

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  return <MeetingDetailPage number={number} />;
}

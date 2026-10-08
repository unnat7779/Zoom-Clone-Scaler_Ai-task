import type { Metadata } from "next";
import { EditMeetingPage } from "@/features/schedule";

export const metadata: Metadata = { title: "Edit Meeting - Zoom" };

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  return <EditMeetingPage number={number} />;
}

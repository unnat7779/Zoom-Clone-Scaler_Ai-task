import { LeftMeetingPage } from "@/features/meeting-room";

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  return <LeftMeetingPage number={number} />;
}

import { PreJoinPage } from "@/features/join";

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  return <PreJoinPage number={number} />;
}

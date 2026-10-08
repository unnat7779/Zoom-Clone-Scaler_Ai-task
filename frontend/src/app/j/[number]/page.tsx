import type { Metadata } from "next";
import { InviteLaunchPage, inviteLinkTitle } from "@/features/join";

interface InviteLinkPageProps {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ pwd?: string | string[] }>;
}

export async function generateMetadata({ params }: Pick<InviteLinkPageProps, "params">): Promise<Metadata> {
  return { title: inviteLinkTitle((await params).number) };
}

/** Invite link `/j/{number}?pwd=…` → Zoom's launch page (PRD §7.9, P1), or its error page for a bad number. */
export default async function Page({ params, searchParams }: InviteLinkPageProps) {
  const [{ number }, { pwd }] = await Promise.all([params, searchParams]);
  return <InviteLaunchPage number={number} pwd={(Array.isArray(pwd) ? pwd[0] : pwd) || null} />;
}

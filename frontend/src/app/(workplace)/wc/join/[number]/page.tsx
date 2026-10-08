import { redirect } from "next/navigation";
import { routes } from "@/shared/lib/routes";

interface JoinNumberPageProps {
  params: Promise<{ number: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** `/wc/join/{n}` → `/wc/{n}/join`, keeping the query (`pwd`, `fromPWA`…) like Zoom's redirect (04-join.md §5). */
export default async function Page({ params, searchParams }: JoinNumberPageProps) {
  const [{ number }, query] = await Promise.all([params, searchParams]);
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    for (const item of Array.isArray(value) ? value : [value]) if (item !== undefined) search.append(key, item);
  }
  const target = routes.preJoin(number);
  redirect(search.size > 0 ? `${target}?${search}` : target);
}

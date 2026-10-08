import type { NextConfig } from "next";

/**
 * The clone is a client-rendered SPA (TanStack Query talks to the FastAPI
 * backend from the browser), so Cache Components / Partial Prefetching stay
 * off: routes unmount on navigation (no hidden <Activity> trees keeping media
 * or dialogs alive) and `params` / `useSearchParams` work without a Suspense
 * boundary in every page.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The floating dev badge sits on top of the rail's Settings tab; keep screens comparable to Zoom.
  devIndicators: false,
};

export default nextConfig;

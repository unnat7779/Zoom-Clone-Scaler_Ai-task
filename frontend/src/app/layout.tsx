import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "@/shared/styles/tokens.css";
import "@/shared/styles/globals.css";
import { Providers } from "./providers";

/** `viewport-fit=cover` on every page: the shell, portal, pre-join and room pad themselves with the safe-area insets. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Zoom",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

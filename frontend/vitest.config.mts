import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Every test runs in one fixed zone with DST so local-day and wall-clock logic is
 * deterministic on any machine (CI runs in UTC, laptops anywhere). Set before the
 * worker processes are forked so they inherit it.
 */
process.env.TZ = "America/New_York";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
});

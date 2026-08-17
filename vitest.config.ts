import { defineConfig } from "vitest/config";

// Single root config runs every *.test.ts(x) across packages. DOM tests opt
// into jsdom per-file via `// @vitest-environment jsdom`.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.{ts,tsx}", "scripts/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});

import { defineConfig } from "vitest/config";

// Single root config runs every *.test.ts(x) across packages. DOM tests opt
// into jsdom per-file via `// @vitest-environment jsdom`.
export default defineConfig({
  // Real class names in test assertions: styles.foo === "foo".
  css: { modules: { classNameStrategy: "non-scoped" } },
  test: {
    css: true,
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});

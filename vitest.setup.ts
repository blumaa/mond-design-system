// jest-dom matchers (toBeInTheDocument, toHaveAccessibleName, …).
import "@testing-library/jest-dom/vitest";

// jest-axe matcher for a11y assertions in component tests. jest-axe's types
// target Jest's ExpectationResult (message may be undefined); Vitest's is
// stricter, so the registration crosses the boundary with a cast. The runtime
// shape is compatible. Vitest-side typing lives in vitest.d.ts.
import { expect, afterEach } from "vitest";
import { toHaveNoViolations } from "jest-axe";
import { cleanup } from "@testing-library/react";

expect.extend(toHaveNoViolations as unknown as Parameters<typeof expect.extend>[0]);

// Unmount every React tree after each test so role/text queries never match
// stale duplicates from a previous test's document.
afterEach(() => {
  cleanup();
});

// jsdom performs no layout, so it ships no ResizeObserver. Floating UI's
// autoUpdate watches the anchor and the surface with one, and would throw on
// import of any anchored component. The stub observes nothing, which is the
// truthful answer in an environment where nothing has a size.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

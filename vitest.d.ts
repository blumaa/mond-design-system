// jest-axe's toHaveNoViolations matcher, typed for Vitest's expect.
// @types/jest-axe augments Jest's Matchers only, so Vitest gets its own.
import "vitest";

declare module "vitest" {
  interface Matchers<T> {
    toHaveNoViolations(): T;
  }
}

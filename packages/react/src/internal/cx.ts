import type { CSSProperties } from "react";

/**
 * Join class names, dropping anything falsy.
 *
 * Every component takes a `className` from the call site and owns one of its
 * own from a CSS Module, so the merge happens in one place rather than in
 * forty slightly different inline expressions.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * A style object that may also carry CSS custom properties.
 *
 * `React.CSSProperties` has no index signature, so `{ '--mds-x': 1 }` is a
 * type error against it. Values that genuinely vary per render (a slider's
 * percent, an avatar's pixel size) belong in a custom property the stylesheet
 * reads — this types that without an assertion.
 */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

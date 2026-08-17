import type { HTMLAttributes, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Heading.module.css";

export type HeadingVariant = "display" | "title" | "subtitle";
export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingTone = "primary" | "secondary" | "inverse" | "accent" | "on-media";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Document outline level → h1–h4, with a matching default type role. Default 2. */
  level?: HeadingLevel;
  /** Type role override — outline level and visual size are separate concerns. */
  variant?: HeadingVariant;
  tone?: HeadingTone;
}

const LEVEL_VARIANT: Record<HeadingLevel, HeadingVariant> = {
  1: "display",
  2: "title",
  3: "subtitle",
  4: "subtitle",
};

/**
 * Brand headings on the core roles. `level` = semantics, `variant` = size.
 *
 * ```tsx
 * <Heading level={1}>Sessions</Heading>
 * <Heading level={2} variant="subtitle" tone="secondary">This week</Heading>
 * ```
 */
export function Heading({
  level = 2,
  variant,
  tone = "primary",
  className,
  ...rest
}: HeadingProps): ReactElement {
  return createElement(`h${level}`, {
    className: cx(
      styles.heading,
      styles[`variant-${variant ?? LEVEL_VARIANT[level]}`],
      styles[`tone-${tone}`],
      className,
    ),
    ...rest,
  });
}

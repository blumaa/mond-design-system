import type { HTMLAttributes, JSX, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Text.module.css";

export type TextVariant = "body" | "label" | "note" | "meta" | "eyebrow";

export type TextTone =
  | "primary"
  | "secondary"
  | "muted"
  | "inverse"
  | "accent"
  | "on-media"
  | "danger"
  | "warning"
  | "success";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Type role from the core scale. Default "body". */
  variant?: TextVariant;
  /** Element override when the default doesn't fit the markup. */
  as?: keyof JSX.IntrinsicElements;
  /** Semantic color. Variants carry sensible defaults. */
  tone?: TextTone;
  align?: "left" | "center" | "right";
  /** Single-line ellipsis. */
  truncate?: boolean;
}

const ELEMENT: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  body: "p",
  label: "span",
  note: "p",
  meta: "span",
  eyebrow: "span",
};

const DEFAULT_TONE: Partial<Record<TextVariant, TextTone>> = {
  note: "secondary",
  meta: "muted",
  eyebrow: "muted",
};

/**
 * Body-copy primitive. One class per type role — screens never hand-roll styled tags.
 *
 * ```tsx
 * <Text>Body copy.</Text>
 * <Text variant="label" as="span">Field label</Text>
 * <Text variant="meta" tone="muted">Updated 2h ago</Text>
 * <Text truncate>Very long single line…</Text>
 * ```
 */
export function Text({
  variant = "body",
  as,
  tone,
  align,
  truncate = false,
  className,
  ...rest
}: TextProps): ReactElement {
  const element = as ?? ELEMENT[variant];
  const resolvedTone = tone ?? DEFAULT_TONE[variant] ?? "primary";
  return createElement(element, {
    className: cx(
      styles.text,
      styles[`variant-${variant}`],
      styles[`tone-${resolvedTone}`],
      align && styles[`align-${align}`],
      truncate && styles.truncate,
      className,
    ),
    ...rest,
  });
}

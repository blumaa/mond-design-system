import type { HTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "accent" | "danger" | "warning" | "success" | "highlight";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Small status marker — counts, "new", state words. Soft fill, strong text.
 *
 * ```tsx
 * <Badge tone="success">Paid</Badge>
 * <Badge tone="danger">3</Badge>
 * ```
 */
export function Badge({ tone = "neutral", className, ...rest }: BadgeProps): ReactElement {
  return <span className={cx(styles.badge, styles[`tone-${tone}`], className)} {...rest} />;
}

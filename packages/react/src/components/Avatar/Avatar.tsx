import type { HTMLAttributes, ReactElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Person's display name — accessible name and initials source. */
  name: string;
  /** Image URL; initials render when absent or empty. */
  src?: string;
  size?: AvatarSize;
}

/* First + last word: "Ada Byron King Lovelace" → AL. Middle names add noise
   at 24px. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * Person marker. Image when available, initials otherwise — never an empty circle.
 *
 * ```tsx
 * <Avatar name="Ada Lovelace" src="/ada.jpg" />
 * <Avatar name="Grace Hopper" size="lg" />
 * ```
 */
export function Avatar({ name, src, size = "md", className, ...rest }: AvatarProps): ReactElement {
  return (
    <span className={cx(styles.avatar, styles[`size-${size}`], className)} {...rest}>
      {src ? (
        <img className={styles.image} src={src} alt={name} />
      ) : (
        <span role="img" aria-label={name} className={styles.initials}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}

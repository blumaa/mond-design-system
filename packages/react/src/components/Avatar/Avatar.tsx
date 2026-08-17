import type { HTMLAttributes, ReactElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

/** One of the five brand identity tints (`--mds-avatar-tone-1..5`). */
export type AvatarTone = 1 | 2 | 3 | 4 | 5;

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Person's display name — accessible name and initials source. */
  name: string;
  /** Image URL; initials render when absent or empty. */
  src?: string;
  size?: AvatarSize;
  /** Identity tint behind the initials. Pick per person (e.g. hash the name)
      so the same person keeps the same color. */
  tone?: AvatarTone;
  /** Hide from assistive tech — for avatars that repeat a name already in
      the row's text. The name prop still drives the initials. */
  decorative?: boolean;
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
 * <Avatar name="Grace Hopper" size="lg" tone={2} />
 * ```
 */
export function Avatar({
  name,
  src,
  size = "md",
  tone,
  decorative = false,
  className,
  ...rest
}: AvatarProps): ReactElement {
  return (
    <span
      className={cx(
        styles.avatar,
        styles[`size-${size}`],
        tone !== undefined && styles[`tone-${tone}`],
        className,
      )}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      {src ? (
        <img className={styles.image} src={src} alt={decorative ? "" : name} />
      ) : (
        <span
          role={decorative ? undefined : "img"}
          aria-label={decorative ? undefined : name}
          className={styles.initials}
        >
          {initials(name)}
        </span>
      )}
    </span>
  );
}

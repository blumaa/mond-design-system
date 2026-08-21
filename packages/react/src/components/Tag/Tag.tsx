import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Tag.module.css";

export type TagTone = "neutral" | "accent";

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: TagTone;
  ref?: Ref<HTMLSpanElement>;
} & (
    | {
        /** Renders a ✕ button after the content. */
        onRemove: () => void;
        /** Names that button, e.g. "Remove Beginner". Required alongside
            `onRemove`: the glyph says nothing, and only the app knows how its
            language builds the sentence. */
        removeLabel: string;
      }
    | { onRemove?: undefined; removeLabel?: undefined }
  );

/**
 * Content label chip — categories, filters, topics.
 *
 * ```tsx
 * <Tag>Design</Tag>
 * <Tag tone="accent" onRemove={() => remove(id)} removeLabel="Remove Beginner">Beginner</Tag>
 * ```
 */
export function Tag({
  children,
  tone = "neutral",
  onRemove,
  removeLabel,
  className,
  ...rest
}: TagProps): ReactElement {
  return (
    <span className={cx(styles.tag, styles[`tone-${tone}`], className)} {...rest}>
      {children}
      {onRemove !== undefined && (
        <button
          type="button"
          className={styles.remove}
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.removeGlyph}>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

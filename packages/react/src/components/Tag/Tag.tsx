import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import styles from "./Tag.module.css";

export type TagTone = "neutral" | "accent";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: TagTone;
  /** Renders a labelled ✕ button. Label reads "Remove <content>" when content is text. */
  onRemove?: () => void;
}

/** Content label chip — categories, filters, topics. */
export function Tag({ children, tone = "neutral", onRemove, className, ...rest }: TagProps): ReactElement {
  const text = typeof children === "string" ? children : undefined;
  return (
    <span className={cx(styles.tag, styles[`tone-${tone}`], className)} {...rest}>
      {children}
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          aria-label={text ? `Remove ${text}` : "Remove"}
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

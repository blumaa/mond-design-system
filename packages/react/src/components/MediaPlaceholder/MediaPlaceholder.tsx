import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { useState } from "react";
import { cx } from "../../internal/cx";
import type { CSSVars } from "../../internal/cx";
import { Text } from "../Text/Text";
import styles from "./MediaPlaceholder.module.css";

export interface MediaPlaceholderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** CSS aspect-ratio for the box, e.g. "4 / 5". Default 16 / 9. */
  aspect?: string;
  /** Picture to draw. Absent, or broken, leaves the empty surface showing. */
  src?: string;
  /** Describes the picture. Empty = decorative, which is the honest default:
      a file name is not a description. */
  alt?: string;
  /** Glyph for the empty surface — an <Icon> or any node. */
  glyph?: ReactNode;
  /** A few words under the glyph, or over the picture. */
  caption?: string;
  /** Obscures the media without hiding that there is media. */
  blurred?: boolean;
  /** Drawn over the surface, outside the blur — a reveal prompt, a badge, a
      play button. The consent vocabulary that usually goes here belongs to the
      app, so the system takes it as a node and asks no questions about it. */
  cover?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The box a picture goes in, whether or not there is one yet.
 *
 * ```tsx
 * <MediaPlaceholder
 *   aspect="4 / 5"
 *   src={post.media.src}
 *   alt={post.media.alt}
 *   blurred={!revealed}
 *   cover={post.sensitive && <SensitiveMediaOverlay onReveal={reveal} />}
 * />
 * ```
 */
export function MediaPlaceholder({
  aspect,
  src,
  alt = "",
  glyph,
  caption,
  blurred = false,
  cover,
  className,
  style,
  ...rest
}: MediaPlaceholderProps): ReactElement {
  /* The source that failed, not a flag: a flag stays true after the caller
     hands over a different picture, and the second one never gets drawn. */
  const [failed, setFailed] = useState<string>();
  const picture = src !== undefined && failed !== src;
  const vars = (aspect === undefined ? {} : { "--media-aspect": aspect }) as CSSVars;

  return (
    <div
      className={cx(styles.media, blurred && styles.blurred, className)}
      style={{ ...vars, ...style }}
      {...rest}
    >
      {picture ? (
        <img
          className={styles.image}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(src)}
        />
      ) : (
        <div className={styles.fill} aria-hidden="true">
          {glyph}
          {caption !== undefined && <Text variant="meta">{caption}</Text>}
        </div>
      )}
      {picture && caption !== undefined && (
        <Text variant="meta" tone="on-media" className={styles.caption}>
          {caption}
        </Text>
      )}
      {cover !== undefined && <div className={styles.cover}>{cover}</div>}
    </div>
  );
}

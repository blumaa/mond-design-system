import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { Children } from "react";
import { cx } from "../../internal/cx";
import type { AvatarSize } from "../Avatar/Avatar";
import styles from "./AvatarGroup.module.css";

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatar children. */
  children: ReactNode;
  /** Visible cap; the rest collapse into "+N". Default 4. */
  max?: number;
  /** Sizes the overflow chip to match the avatars. Default "md". */
  size?: AvatarSize;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Overlapping stack of avatars with a "+N" chip past `max`.
 *
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar name="Ada Lovelace" />
 *   <Avatar name="Grace Hopper" />
 *   <Avatar name="Margaret Hamilton" />
 *   <Avatar name="Katherine Johnson" />
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({
  children,
  max = 4,
  size = "md",
  className,
  ...rest
}: AvatarGroupProps): ReactElement {
  const all = Children.toArray(children);
  const visible = all.slice(0, max);
  const hidden = all.length - visible.length;

  return (
    <div className={cx(styles.group, className)} {...rest}>
      {visible.map((child, i) => (
        <span key={i} className={styles.item}>
          {child}
        </span>
      ))}
      {hidden > 0 && (
        <span
          className={cx(styles.item, styles.overflow, styles[`size-${size}`])}
          aria-label={`${hidden} more`}
        >
          +{hidden}
        </span>
      )}
    </div>
  );
}

import type { ElementType, HTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import { ChevronRightGlyph } from "../../internal/glyphs";
import { Link } from "../Link/Link";
import { Text } from "../Text/Text";
import styles from "./Breadcrumb.module.css";

export interface Crumb {
  label: string;
  /** Absent = not a link. The last step never links, wherever it points. */
  href?: string;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The trail, root first. The last item is where the reader is. */
  items: Crumb[];
  /** Names the landmark, e.g. "Breadcrumb". Required: a page can hold several
      navigation landmarks, and the words are the app's. */
  label: string;
  /** Element the links render as, e.g. a router's Link. */
  linkAs?: ElementType;
  ref?: Ref<HTMLElement>;
}

/**
 * The trail back up. A navigation landmark holding an ordered list, with the
 * current page as its last, unlinked step.
 *
 * ```tsx
 * <Breadcrumb
 *   label={t("nav.breadcrumb")}
 *   linkAs={RouterLink}
 *   items={[{ label: "Library", href: "/library" }, { label: "Kihon" }]}
 * />
 * ```
 */
export function Breadcrumb({
  items,
  label,
  linkAs = "a",
  className,
  ...rest
}: BreadcrumbProps): ReactElement | null {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={cx(styles.crumbs, className)} {...rest}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {index > 0 && <ChevronRightGlyph className={styles.separator} />}
              {last || item.href === undefined ? (
                <Text variant="meta" tone={last ? "primary" : "muted"} aria-current={last ? "page" : undefined}>
                  {item.label}
                </Text>
              ) : (
                <Link variant="plain" size="xs" as={linkAs} href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

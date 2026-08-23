import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cx } from "../../internal/cx";
import { ChevronLeftGlyph, ChevronRightGlyph } from "../../internal/glyphs";
import { Button } from "../Button/Button";
import { Heading, type HeadingLevel } from "../Heading/Heading";
import styles from "./Scroller.module.css";

export interface ScrollerLabels {
  previous: string;
  next: string;
}

export interface ScrollerProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Words over the row. They name the scrolling group too. */
  title: string;
  /** The arrows are glyphs, so the words are the app's. */
  labels: ScrollerLabels;
  /** Where the title sits in the document outline. Default 2. */
  level?: HeadingLevel;
  /** Beside the title, before the arrows — a link to the rest. */
  action?: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

/* Not a whole screenful: the item at the edge stays half in view, so the
   reader keeps their place in the row. */
const STEP = 0.8;

/**
 * A titled row that scrolls sideways — featured posts, a shelf of covers.
 * The row scrolls with the finger; the arrows do the same for a pointer or a
 * key, and shut themselves at each end.
 *
 * ```tsx
 * <Scroller title={t("home.featured")} labels={t.scroller}>
 *   {slots.map((slot) => (
 *     <PostCard key={slot.id} post={slot.post} variant="grid" />
 *   ))}
 * </Scroller>
 * ```
 */
export function Scroller({
  title,
  labels,
  level = 2,
  action,
  children,
  className,
  ...rest
}: ScrollerProps): ReactElement {
  const track = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const measure = useCallback(() => {
    const row = track.current;
    if (row === null) return;

    setAtStart(row.scrollLeft <= 0);
    setAtEnd(row.scrollLeft + row.clientWidth >= row.scrollWidth - 1);
  }, []);

  /* The children are the app's and can change width under us, so the ends are
     read after every render rather than only on scroll. */
  useEffect(measure);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const step = (direction: 1 | -1) => {
    const row = track.current;
    if (row === null) return;

    row.scrollBy({ left: direction * Math.round(row.clientWidth * STEP) });
  };

  return (
    <section className={cx(styles.scroller, className)} {...rest}>
      <div className={styles.header}>
        <Heading level={level} variant="label" id={titleId}>
          {title}
        </Heading>

        <div className={styles.trailing}>
          {action}

          <div className={styles.arrows}>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={labels.previous}
              disabled={atStart}
              onClick={() => step(-1)}
            >
              <ChevronLeftGlyph />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={labels.next}
              disabled={atEnd}
              onClick={() => step(1)}
            >
              <ChevronRightGlyph />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={styles.track}
        ref={track}
        role="group"
        aria-labelledby={titleId}
        onScroll={measure}
      >
        {children}
      </div>
    </section>
  );
}

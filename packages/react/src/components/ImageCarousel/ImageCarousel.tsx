import type { HTMLAttributes, KeyboardEvent, PointerEvent, ReactElement, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import { cx } from "../../internal/cx";
import { ChevronLeftGlyph, ChevronRightGlyph } from "../../internal/glyphs";
import { Button } from "../Button/Button";
import { MediaPlaceholder } from "../MediaPlaceholder/MediaPlaceholder";
import { Text } from "../Text/Text";
import styles from "./ImageCarousel.module.css";

export interface CarouselSlide {
  id: string;
  src?: string;
  alt?: string;
  /** CSS aspect-ratio for this frame. Default 4 / 3. */
  aspect?: string;
  caption?: string;
  /** Obscures the frame and takes away the way into it: a covered frame does
      not open larger, however it is tapped. */
  covered?: boolean;
  /** Drawn over the frame, outside the blur — whatever the app asks consent
      with. */
  cover?: ReactNode;
}

export type CarouselPager = "thumbnails" | "dots" | "none";

export interface ImageCarouselLabels {
  /** Names the carousel landmark, e.g. "Images". */
  region: string;
  /** Read out in place of "region", e.g. "carousel". A screen reader says it
      aloud, so it is the app's word in the app's language. */
  carouselRole: string;
  /** The same for one frame, e.g. "slide". */
  slideRole: string;
  previous: string;
  next: string;
  /** "3 of 8" — a function, because only the app knows how its language counts. */
  counter: (current: number, total: number) => string;
  /** Names one frame's thumbnail or dot, e.g. "Image 3". */
  slide: (position: number) => string;
  /** Names the button standing for the frames no thumbnail fits. */
  more: (hidden: number) => string;
}

export type ImageCarouselProps = Omit<HTMLAttributes<HTMLElement>, "children" | "onChange"> & {
  slides: CarouselSlide[];
  labels: ImageCarouselLabels;
  /** Held index. Unset, the carousel keeps its own. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  pager?: CarouselPager;
  maxThumbnails?: number;
  ref?: Ref<HTMLElement>;
} & (
    | {
        /** Called with the frame to open larger — by the control, or by a tap
            on the frame itself. */
        onZoom: (index: number) => void;
        /** Glyph for that control, from the app's icon set. */
        zoomIcon: ReactNode;
        zoomLabel: string;
      }
    | { onZoom?: undefined; zoomIcon?: undefined; zoomLabel?: undefined }
  );

/* Below this a drag is a tap: a finger never lands and lifts on the same
   pixel, and a photograph that only opens for a perfectly still hand reads as
   broken. */
const SWIPE_THRESHOLD = 40;

/**
 * A gallery of frames, one on show.
 *
 * ```tsx
 * <ImageCarousel
 *   slides={post.images.map((image) => ({ ...image, covered: !revealed }))}
 *   labels={t.gallery}
 *   onZoom={openLightbox}
 *   zoomIcon={<Icon name="zoom-in" />}
 *   zoomLabel={t.viewLarger}
 * />
 * ```
 */
export function ImageCarousel({
  slides,
  labels,
  index,
  defaultIndex = 0,
  onIndexChange,
  pager = "thumbnails",
  maxThumbnails = 4,
  onZoom,
  zoomIcon,
  zoomLabel,
  className,
  ...rest
}: ImageCarouselProps): ReactElement | null {
  const [ownIndex, setOwnIndex] = useState(defaultIndex);
  const swipeStart = useRef<number | null>(null);

  const held = index !== undefined;
  const last = slides.length - 1;
  const current = Math.min(Math.max(held ? index : ownIndex, 0), last);
  const many = slides.length > 1;
  const slide = slides[current];
  if (slide === undefined) return null;

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), last);
    if (clamped === current) return;
    if (!held) setOwnIndex(clamped);
    onIndexChange?.(clamped);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!many) return;
    const step: Record<string, number> = {
      ArrowLeft: current - 1,
      ArrowRight: current + 1,
      Home: 0,
      End: last,
    };
    const next = step[event.key];
    if (next === undefined) return;
    event.preventDefault();
    goTo(next);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;
    const travelled = event.clientX - start;

    if (Math.abs(travelled) < SWIPE_THRESHOLD) {
      /* A tap that landed on a control was the control's, not the frame's. */
      const onControl = (event.target as HTMLElement).closest("button") !== null;
      if (onZoom !== undefined && !onControl && slide.covered !== true) onZoom(current);
      return;
    }
    if (many) goTo(travelled < 0 ? current + 1 : current - 1);
  };

  const shown = pager === "thumbnails" ? slides.slice(0, maxThumbnails) : [];
  const hidden = slides.length - shown.length;
  const counted = labels.counter(current + 1, slides.length);

  return (
    <section
      className={cx(styles.carousel, className)}
      aria-roledescription={labels.carouselRole}
      aria-label={labels.region}
      tabIndex={0}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <div
        className={styles.viewport}
        onPointerDown={(event) => {
          swipeStart.current = event.clientX;
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        <div className={styles.slide} role="group" aria-roledescription={labels.slideRole} aria-label={counted}>
          <MediaPlaceholder
            aspect={slide.aspect ?? "4 / 3"}
            {...(slide.src === undefined ? {} : { src: slide.src })}
            {...(slide.alt === undefined ? {} : { alt: slide.alt })}
            {...(slide.caption === undefined ? {} : { caption: slide.caption })}
            blurred={slide.covered === true}
            {...(slide.cover === undefined ? {} : { cover: slide.cover })}
          />
        </div>

        {onZoom !== undefined && slide.covered !== true && (
          <Button
            className={styles.zoom}
            variant="secondary"
            size="sm"
            iconOnly
            aria-label={zoomLabel}
            onClick={() => onZoom(current)}
          >
            {zoomIcon}
          </Button>
        )}

        {many && (
          <>
            <Button
              className={cx(styles.step, styles.prev)}
              variant="secondary"
              size="sm"
              iconOnly
              aria-label={labels.previous}
              disabled={current === 0}
              onClick={() => goTo(current - 1)}
            >
              <ChevronLeftGlyph />
            </Button>
            <Button
              className={cx(styles.step, styles.next)}
              variant="secondary"
              size="sm"
              iconOnly
              aria-label={labels.next}
              disabled={current === last}
              onClick={() => goTo(current + 1)}
            >
              <ChevronRightGlyph />
            </Button>
            <Text variant="meta" className={styles.counter} aria-live="polite">
              {counted}
            </Text>
          </>
        )}
      </div>

      {many && pager === "thumbnails" && (
        <div className={styles.thumbs}>
          {shown.map((frame, position) => (
            <button
              key={frame.id}
              type="button"
              className={styles.thumb}
              aria-label={labels.slide(position + 1)}
              aria-current={position === current ? "true" : undefined}
              onClick={() => goTo(position)}
            >
              <MediaPlaceholder
                aspect="1 / 1"
                {...(frame.src === undefined ? {} : { src: frame.src })}
                blurred={frame.covered === true}
              />
            </button>
          ))}
          {hidden > 0 && (
            <button
              type="button"
              className={cx(styles.thumb, styles.more)}
              aria-label={labels.more(hidden)}
              onClick={() => goTo(shown.length)}
            >
              <Text variant="meta">+{hidden}</Text>
            </button>
          )}
        </div>
      )}

      {many && pager === "dots" && (
        <div className={styles.dots}>
          {slides.map((frame, position) => (
            <button
              key={frame.id}
              type="button"
              className={styles.dot}
              aria-label={labels.slide(position + 1)}
              aria-current={position === current ? "true" : undefined}
              onClick={() => goTo(position)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

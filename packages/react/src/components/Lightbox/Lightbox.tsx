import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { CSSVars } from "../../internal/cx";
import { Overlay } from "../../internal/Overlay";
import { CloseGlyph, ZoomInGlyph, ZoomOutGlyph } from "../../internal/glyphs";
import { Button } from "../Button/Button";
import { Text } from "../Text/Text";
import styles from "./Lightbox.module.css";

export interface LightboxLabels {
  /** Names the dialog itself, e.g. "Image". */
  dialog: string;
  close: string;
  zoomIn: string;
  zoomOut: string;
}

export interface LightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  /** Empty says the picture is decoration — rare here, where it is the point. */
  alt?: string;
  caption?: string;
  labels: LightboxLabels;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
/** One press of a zoom control. */
const STEP = 1;
/** Where a double tap lands: in far enough to be worth the tap, short of the end. */
const DOUBLE = 2.5;
/** Trackpad pinches arrive as wheel deltas; this turns one into a factor. */
const WHEEL = 0.01;

/** One arrow press of pan. */
const KEY_PAN_PX = 48;

/* An arrow looks that way: ArrowRight brings the right-hand part of the
   picture into the frame, so the picture itself goes left. */
const ARROWS: Record<string, { x: number; y: number }> = {
  ArrowLeft: { x: 1, y: 0 },
  ArrowRight: { x: -1, y: 0 },
  ArrowUp: { x: 0, y: 1 },
  ArrowDown: { x: 0, y: -1 },
};

const ORIGIN = { x: 0, y: 0 };

const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high);

const round = (value: number) => Math.round(value * 1000) / 1000;

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * One picture, full screen, zoomable and pannable. Escape and the focus trap
 * come from the overlay shell; the gestures are the component's own.
 *
 * ```tsx
 * <Lightbox
 *   open={shown !== null}
 *   onClose={() => setShown(null)}
 *   src={shown?.src ?? ""}
 *   alt={shown?.alt ?? ""}
 *   labels={{ dialog: t("image"), close: t("close"), zoomIn: t("zoomIn"), zoomOut: t("zoomOut") }}
 * />
 * ```
 */
export function Lightbox({ open, onClose, src, alt = "", caption, labels }: LightboxProps) {
  /* State, not a ref: the portal mounts a commit late, so a ref reads null and
     the wheel listener would never find anything to attach to. */
  const [surface, setSurface] = useState<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState(ORIGIN);

  const points = useRef(new Map<number, { x: number; y: number }>());
  const from = useRef({ spread: 0, scale: MIN_SCALE, x: 0, y: 0, offset: ORIGIN });

  const [shown, setShown] = useState({ src, open });
  if (shown.src !== src || shown.open !== open) {
    setShown({ src, open });
    setScale(MIN_SCALE);
    setOffset(ORIGIN);
  }

  /* Fingers on the last picture are not on this one. The map is a ref, so it
     is emptied after the commit rather than during the render — and a pointer
     event cannot arrive in between. */
  useEffect(() => {
    points.current.clear();
  }, [src, open]);

  const hold = useCallback(
    (next: { x: number; y: number }, at: number) => {
      const box = surface?.getBoundingClientRect();
      if (!box) return ORIGIN;

      /* Half the overhang on each side: past that the frame shows through. */
      const room = { x: (box.width * (at - 1)) / 2, y: (box.height * (at - 1)) / 2 };
      return { x: clamp(next.x, -room.x, room.x), y: clamp(next.y, -room.y, room.y) };
    },
    [surface],
  );

  const zoom = useCallback(
    (to: number) => {
      const next = clamp(round(to), MIN_SCALE, MAX_SCALE);
      setScale(next);
      setOffset((current) => hold(current, next));
    },
    [hold],
  );

  const at = useRef(scale);
  useEffect(() => {
    at.current = scale;
  }, [scale]);

  /* Native and non-passive: React's root `wheel` is passive, so `onWheel`
     cannot preventDefault, and the browser zooms the page instead. */
  useEffect(() => {
    if (!surface) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      zoom(at.current * Math.exp(-event.deltaY * WHEEL));
    };

    surface.addEventListener("wheel", onWheel, { passive: false });
    return () => surface.removeEventListener("wheel", onWheel);
  }, [surface, zoom]);

  /* WCAG 2.1.1: the drag needs a keyboard equal. Zoom has its buttons; the
     pan gets the arrows. On the document because the overlay panel holds
     focus, and nothing else in a lightbox answers to an arrow. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const step = ARROWS[event.key];
      if (step === undefined || at.current <= MIN_SCALE) return;
      event.preventDefault();
      setOffset((current) =>
        hold({ x: current.x + step.x * KEY_PAN_PX, y: current.y + step.y * KEY_PAN_PX }, at.current),
      );
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, hold]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const [first, second] = [...points.current.values()];

    if (first && second) {
      from.current = { ...from.current, spread: distance(first, second), scale };
      return;
    }

    if (first) from.current = { ...from.current, x: first.x, y: first.y, offset };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!points.current.has(event.pointerId)) return;
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const [first, second] = [...points.current.values()];
    if (!first) return;

    if (second) {
      const spread = distance(first, second);
      if (from.current.spread === 0) return;
      zoom(from.current.scale * (spread / from.current.spread));
      return;
    }

    if (scale <= MIN_SCALE) return;

    setOffset(
      hold(
        {
          x: from.current.offset.x + (first.x - from.current.x),
          y: from.current.offset.y + (first.y - from.current.y),
        },
        scale,
      ),
    );
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    points.current.delete(event.pointerId);

    /* A finger lifted off a pinch leaves the other one panning from where it is. */
    const [rest] = [...points.current.values()];
    if (rest) from.current = { ...from.current, x: rest.x, y: rest.y, offset };
  }

  const vars = {
    "--zoom": String(round(scale)),
    "--pan-x": `${round(offset.x)}px`,
    "--pan-y": `${round(offset.y)}px`,
  } as CSSVars;

  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={labels.dialog}
      variant="lightbox"
      closeOnScrimClick={false}
      panelClassName={styles.panel}
    >
      <div className={styles.bar}>
        <Button
          iconOnly
          aria-label={labels.zoomOut}
          variant="ghost"
          onMedia
          disabled={scale <= MIN_SCALE}
          onClick={() => zoom(scale - STEP)}
        >
          <ZoomOutGlyph />
        </Button>
        <Button
          iconOnly
          aria-label={labels.zoomIn}
          variant="ghost"
          onMedia
          disabled={scale >= MAX_SCALE}
          onClick={() => zoom(scale + STEP)}
        >
          <ZoomInGlyph />
        </Button>
        <Button iconOnly aria-label={labels.close} variant="ghost" onMedia onClick={onClose}>
          <CloseGlyph />
        </Button>
      </div>

      <div
        ref={setSurface}
        className={styles.surface}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => zoom(scale > MIN_SCALE ? MIN_SCALE : DOUBLE)}
      >
        <img className={styles.image} src={src} alt={alt} draggable={false} style={vars} />
      </div>

      {caption !== undefined && (
        <Text variant="meta" tone="on-media" className={styles.caption}>
          {caption}
        </Text>
      )}
    </Overlay>
  );
}

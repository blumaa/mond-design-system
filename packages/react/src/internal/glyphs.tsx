/* Marks a control cannot work without.
 *
 * Iconography belongs to the app — that is what IconProvider is for — but the
 * ✕ that closes a sheet and the chevron that pages a calendar are part of the
 * control, not of the app's icon set: a component whose close button waits for
 * a registry is a component that ships broken until one arrives.
 *
 * They live together because the same ✕ was written out in four components,
 * which is four places for one of them to drift a half-pixel.
 */
import type { ReactElement } from "react";

interface GlyphProps {
  /** The class of the slot the glyph sits in — it takes its size from there. */
  className?: string | undefined;
}

export function CloseGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronLeftGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        d="M10 3l-5 5 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        d="M6 3l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

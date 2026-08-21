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

function Magnifier({ className, children }: GlyphProps & { children: ReactElement }): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <circle cx="7" cy="7" r="4.25" />
        <path d="M10.2 10.2L14 14" />
        {children}
      </g>
    </svg>
  );
}

export function ZoomInGlyph({ className }: GlyphProps): ReactElement {
  return (
    <Magnifier className={className}>
      <path d="M4.75 7h4.5M7 4.75v4.5" />
    </Magnifier>
  );
}

export function ZoomOutGlyph({ className }: GlyphProps): ReactElement {
  return (
    <Magnifier className={className}>
      <path d="M4.75 7h4.5" />
    </Magnifier>
  );
}

export function PlayGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M5 3.2l7.5 4.8L5 12.8z" fill="currentColor" />
    </svg>
  );
}

export function PauseGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M4.5 3h2.25v10H4.5zM9.25 3h2.25v10H9.25z" fill="currentColor" />
    </svg>
  );
}

/** The speaker cone the two sound marks share. */
function Speaker(): ReactElement {
  return <path d="M2.5 6.25h2.25L8 3.4v9.2L4.75 9.75H2.5z" fill="currentColor" stroke="none" />;
}

export function VolumeGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <Speaker />
        <path d="M10.5 5.75a3.25 3.25 0 010 4.5" />
        <path d="M12.5 3.9a5.75 5.75 0 010 8.2" />
      </g>
    </svg>
  );
}

export function VolumeOffGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <Speaker />
        <path d="M10.75 6.25l3.5 3.5M14.25 6.25l-3.5 3.5" />
      </g>
    </svg>
  );
}

export function CaptionsGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="2" />
        <path d="M6.25 6.75a2 2 0 100 2.5M11.25 6.75a2 2 0 100 2.5" />
      </g>
    </svg>
  );
}

export function FullscreenGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        d="M6 2.5H2.5V6M10 2.5h3.5V6M6 13.5H2.5V10M10 13.5h3.5V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FullscreenExitGlyph({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        d="M2.5 6H6V2.5M13.5 6H10V2.5M2.5 10H6v3.5M13.5 10H10v3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

---
"@mond-design-system/react": patch
---

Accessibility audit fixes across the library.

Critical/serious: VideoPlayer keyboard access; Popover is properly non-modal
(no Tab trap, no focus theft on outside dismissal); Tooltip stays hoverable
(WCAG 1.4.13); Toast pauses its timers under pointer or focus and hands focus
to a neighbour on dismiss (WCAG 2.2.1); Lightbox pans with the arrow keys once
zoomed (WCAG 2.1.1); modal surfaces make the page behind them inert; Menu
follows the APG menu-button pattern (ArrowUp enters at the bottom, Tab closes
and moves on, aria-controls, type-ahead).

Moderate/minor: ConfirmDialog's consequence is its accessible description;
TabPanel is a tab stop; Field's required reaches controls as aria-required;
the Textarea count reads out as part of the description; the DateTimePicker
calendar is a real grid with weekday headers, aria-selected and
aria-current="date"; MediaPlaceholder's caption is no longer hidden;
interactive Cards warn about nested controls and keep the tap minimum;
ListGroup keeps list semantics in Safari; decorative glyphs in FileDrop and
UploadProgress are aria-hidden.

Additive API: Popover `id`, Modal/Overlay `describedBy`, EmptyState `level`,
Link `externalLabel`, useOverlay `modal`.

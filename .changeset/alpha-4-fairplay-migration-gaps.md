---
"@mond-design-system/react": minor
"@mond-design-system/tokens": minor
---

Close the gaps the fairplay migration surfaced.

React:

- Screen fills its host's height instead of claiming 100dvh; ScreenContent
  passes main-element attributes, a caller className, and a ref through.
- ListItem `pressed` renders aria-pressed on the row button.
- ListGroup takes a `label` for its accessible name.
- Tabs only claim `aria-controls` over a panel that exists, so a tab strip
  used as a filter (no panels) stays ARIA-valid.
- SheetHeader close affordance: optional `onClose` + `closeLabel` pair renders
  a close button after the title.
- ToastProvider `regionLabel`/`dismissLabel` make the built-in strings
  localizable, and each dismiss button is named after its toast.
- Overlay scrim sizes to `--mds-vvh`, keeping Sheet/Modal/ConfirmDialog above
  the software keyboard where the host mirrors visualViewport.height.
- DateTimePicker picks up Field wiring (control id, aria-describedby) from
  context, the same way Input/Select/Textarea already did.
- Every emitted class and keyframe is namespaced (`mds-Sheet__panel`), so the
  stylesheet is collision-proof beside any other library in any cascade order.
  esbuild's local-css loader only produced `Sheet_panel`, and another library
  built the same way silently restyled our components.

Tokens:

- Safe-area insets (`--mds-safe-*`).
- `--mds-vvh` visual-viewport height (default 100dvh).

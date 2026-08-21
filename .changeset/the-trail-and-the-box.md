---
"@mond-design-system/react": minor
"@mond-design-system/tokens": minor
---

Two components an app that shows other people's things needs: `Breadcrumb` and
`MediaPlaceholder`.

`Breadcrumb` renders a labelled `nav` around an ordered list. The last step
never links, wherever it points, and carries `aria-current="page"`; a step with
no `href` renders as text wherever it sits. `linkAs` takes a router's link. An
empty trail renders nothing rather than an empty landmark.

`MediaPlaceholder` is the box a picture goes in, whether or not there is one
yet. Without a `src`, or after one fails to load, it draws a hatched surface
carrying a `glyph` slot and a caption; with one, the picture fills the box and
the caption moves onto a scrim over it. `blurred` obscures the media far enough
that a photo reads as shape and colour only. What asks for consent belongs to
the app, so it comes in through `cover` — a node drawn over the surface and
outside the blur, so the prompt stays readable while what it covers does not.

The broken-image state keys off the source rather than a flag, so handing the
component a different picture tries again instead of leaving the box empty for
as long as it stays mounted.

New tokens: `--mds-blur-media` (how far a covered picture is blurred) and
`--mds-media-hatch` (the pitch of the hatch on an empty media surface).

---
"@mond-design-system/react": minor
"@mond-design-system/tokens": minor
---

`UploadProgress`: one file on its way up — a thumbnail, its name, how far it
has got, and the way out. It composes `ProgressBar` rather than drawing a
second bar, and the bar stops counting while the server processes, which
reports no percentage.

`ProgressBar` takes `valueText`: the progress in the caller's words ("2.1 MB of
5 MB"), read out instead of a percentage that is not always what the number
means.

The status glyph comes in through `mark`, from the app's icon set, and the
system tints it by the state it is standing for. New token
`--mds-upload-thumb`.

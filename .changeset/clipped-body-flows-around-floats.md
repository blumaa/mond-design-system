---
"@mond-design-system/react": minor
---

`CardBody` takes `clip`. The `lines` budget still ends on an ellipsis, which `-webkit-box` draws — a formatting context, so a budgeted body stands beside floated media instead of wrapping under it, leaving dead space below the picture. `clip="flow"` cuts on the line instead, unmarked, and the text wraps around the float.

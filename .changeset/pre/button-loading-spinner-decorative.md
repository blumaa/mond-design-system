---
"@mond-design-system/react": patch
---

Button: make the loading spinner decorative. The spinner rendered with its
default live label, so a busy button's accessible name became "Loading Save"
and name-based queries and screen readers lost the button. aria-busy on the
button already announces the state; the spinner now renders with an empty
label and aria-hidden, matching CountButton.

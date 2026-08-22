---
"@mond-design-system/react": minor
---

Four roles the first migrating app asked for, all of them chrome that the system could name but did not.

`TabBarItem` takes `hideLabel`. The caption goes into a `VisuallyHidden` rather than being dropped: the word is still the item's accessible name. For a bottom bar whose glyphs carry the meaning, four captions wrap on the narrowest phone, and a translation twice the length of the English wraps everywhere.

`AppBar` takes `className` and passes the rest of its attributes to the `<header>` it renders. Every other component in the system already did; the omission meant a screen that shows its bar only at one breakpoint had to wrap it in a div to say so.

`toast()` takes `action` and `onDismiss`. A message that asks for something — "Update ready", "Add to home screen" — needs the doing beside the saying, and taking the action closes the toast because the message has been answered. `onDismiss` fires however the toast leaves — timeout, close button, or action — exactly once, so a nudge that has been turned down has one place to write that down instead of three that can disagree.

`SegmentedControl` takes `size` (`sm` | `md`, default `md`) and `bare`. A language switch sharing a header bar with an avatar and a menu is chrome, and the tray is what makes the group read as a form field. `bare` drops the tray; the chosen segment keeps its own surface, which is the answer.

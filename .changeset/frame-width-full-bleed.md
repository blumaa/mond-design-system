---
"@mond-design-system/tokens": patch
---

Stop `--mds-frame-width` capping the app column on a phone.

The token's contract is that a phone-shaped app is full-bleed on a phone and framed on a desktop viewport, but it only ever framed: `430px` was declared unconditionally at `:root`. A phone whose CSS viewport is wider than the framed measure — 462px is real hardware — got the desktop treatment, leaving a strip of the sunken surface down each edge of the app.

The measure is now uncapped by default and set to `430px` only above `--mds-bp-md`. Consumers reading the token as a `max-width` (`Sheet`, and an app's own frame element) need no change.

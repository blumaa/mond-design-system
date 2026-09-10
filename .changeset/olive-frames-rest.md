---
"@mond-design-system/react": patch
"@mond-design-system/tokens": minor
---

A MediaPlaceholder frame is capped, not sized by the column alone

Height came from `aspect-ratio` against whatever width the container gave: a 3:4 photograph in an 887px reading column drew 1183px tall, a 9:16 phone photo 1577px — twice the screen. `--mds-media-max-block` (`min(70svh, 640px)`) caps it, and the box narrows to the width its aspect asks for at that height, so the whole picture still shows rather than sitting between two bands of the sunken surface. A picture shorter than the cap is unchanged.

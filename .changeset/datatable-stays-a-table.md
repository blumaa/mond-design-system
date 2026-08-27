---
"@mond-design-system/react": major
---

DataTable no longer folds into cards on a narrow screen.

A table exists so a row can be read across and a column compared down, and
cards give up both. Below 1024px the component used to stop being a table:
`display` was changed on the table, its rows and its cells, which strips their
implicit ARIA roles in every major browser, so on the screens where the cards
appeared there was no table left for a screen reader to read. Each cell also
repeated its column header beside the value to stand in for the header row
that had been hidden.

The table now keeps its shape at every width. Where the columns need more room
than the screen has, it pans sideways inside a box that scrolls; the box takes
focus and carries the table's name, so it can be panned with the arrow keys
rather than only by dragging. Nothing changes `display`, so the roles are
never lost, and no breakpoint decides when to scroll — the columns' own widths
do.

Nothing in the public API changed. What changes is what a narrow viewport
draws: a scrolling table rather than a stack of cards. An app that wants cards
on a phone should render cards, which is a different component rather than a
second layout for this one.

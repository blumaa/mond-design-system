---
"@mond-design-system/react": minor
"@mond-design-system/tokens": minor
---

Add the three anchored surfaces: `Popover`, `Menu` and `Tooltip`.

An anchored surface hangs off a control rather than off the viewport, and the
hard parts are the ones an app should never write twice: which side it opens on
when that side runs out of room, how far it may grow before it slides off its
anchor, what closes it, and where focus goes afterwards. All three share one
positioning layer built on `@floating-ui/dom` — flip, then cap the height to the
room that side has, then slide along the cross axis.

**`Popover`** is the non-modal dialog. The caller holds `open` and passes an
`anchorRef`; the page behind stays live and keeps scrolling, and the panel travels
with its trigger. It takes focus and gives it back, closes on Escape, on a press
outside and on a second press of its trigger, and it never claims `aria-modal`.
`PopoverHeader`, `PopoverBody` and `PopoverFooter` are the same three slots Modal
and Sheet have; the body scrolls and the header and footer stay put.

**`Menu`** is APG's menu button: a short list of actions and nothing else. It owns
its own open state, because a list of actions has no meaning apart from the button
that opened it. Arrows move and wrap, skipping disabled items; Enter chooses;
Escape and Tab close and hand focus back to the trigger. `MenuItem` takes `onSelect`,
`disabled` and `tone="danger"`.

**`Tooltip`** names a control that shows only its glyph. Hover dwells, keyboard
focus does not, touch gets nothing, and Escape dismisses it without moving the
pointer or the focus (WCAG 1.4.13). It is a description, not a name — a glyph-only
control still needs its own `aria-label`.

```tsx
<Tooltip content="Star this heat">
  <Button variant="ghost" aria-label="Star this heat" iconOnly>
    <Icon name="star" />
  </Button>
</Tooltip>

<Menu label="Heat actions" trigger={<Button variant="secondary">Actions</Button>}>
  <MenuItem onSelect={edit}>Edit heat</MenuItem>
  <MenuItem onSelect={remove} tone="danger">Delete</MenuItem>
</Menu>
```

New tokens: `--mds-popover-w` and `--mds-tooltip-w` cap the two new surfaces,
`--mds-z-popover` and `--mds-z-tooltip` place them above the modal step and above
everything respectively, and `--mds-bp-2xl: 1920px` names the screen nobody sits in
front of — a scoreboard on a wall, a projector, a display in a room, where the
layout question is bigger type rather than more columns.

`useOverlay` gains `lockScroll`, defaulting to true. Anchored surfaces pass false:
a popover is pinned to a trigger that scrolls with the page, so freezing the page
would strand it over content the reader can no longer reach.

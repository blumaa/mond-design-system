---
"@mond-design-system/react": major
"@mond-design-system/tokens": patch
---

Fold SearchField into Input.

SearchField was an Input with a magnifying glass and a clear button. The glass
was already `Input`'s `iconLeft`, and the sizes it lacked were already `Input`'s
`size` — only the clear button was its own. So the button moves to `Input` and
the component goes.

`Input` gains `onClear` and `clearLabel`. They arrive together and they refuse
`iconRight`, because the clear button is the trailing slot and a glyph button
without a name is nothing to a screen reader. It works controlled or
uncontrolled, hides itself when there is no text to clear, and returns focus to
the input afterwards — the button deletes itself on the click that fires it, so
without that the focus ring lands on `document.body`.

Migration:

```tsx
// before
<SearchField label="Search sessions" clearLabel="Clear search" value={q} onChange={setQ} />

// after
<Input
  type="search"
  aria-label="Search sessions"
  iconLeft={<Icon name="search" />}
  value={q}
  onChange={(event) => setQ(event.target.value)}
  clearLabel="Clear search"
  onClear={() => setQ("")}
/>
```

Two differences worth naming: `onChange` is the native event rather than the
bare string, and the field takes `Input`'s control radius instead of
SearchField's pill. The glyph now comes from your `IconProvider` rather than
being hardcoded in the component.

Also fixes `Input`'s icon geometry, which named the `md` step from every size —
an `sm` input with an icon wore an `md` glyph and `md` padding. Slot and gutter
now step with the control, and so does the clear cross: it was pinned at the
`sm` icon step, which left an 8px mark in a 32px field.

With `type="search"`, `onClear` also hides the browser's own clear cross, so the
field shows one clear affordance rather than two. Used without `onClear`, the
native cross is left alone — there it is the only way to empty the field.

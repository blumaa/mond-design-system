---
"@mond-design-system/react": major
"@mond-design-system/tokens": major
---

**A tab bar owns the size of its glyph and its caption.**

`TabBar` took its glyph from the generic `md` step on the icon scale and its
label from the `meta` text role. Both are wrong for a tab: the glyph is read as
a picture and stands above the icon scale, the caption below the reading scale.
The bar kept its 66px while its contents shrank to 35, and the surplus showed
as empty bar.

New tokens: `--mds-tabbar-icon`, `--mds-tabbar-pad-x`, `--mds-tabbar-seat`,
`--mds-text-2xs`, `--mds-type-tab`.

**An `Icon` with no size stated takes the slot around it.**

`Icon` defaulted to the `md` step, so a control publishing `--mds-icon-slot`
could size an app's own icon set but never the system's own `Icon`. Left
unset, the size now resolves to `var(--mds-icon-slot, var(--mds-icon-md))` —
the slot's step inside a control, the `md` step outside one.

Breaking: `IconRenderProps.size` is `number | undefined`. A render function
that needs a number states its own fallback:
`(name, { size }) => <Glyph name={name} width={size ?? 20} />`.

**A sheet is the width of the app column.**

`Sheet` portals to `<body>`, where nothing in the app tree constrains it, and
carried no maximum — on a desktop window it spanned the whole viewport beside
a phone-width app. It now reads `--mds-frame-width` and the sheet scrim
centres it.

**A tab bar adds the home-bar inset to its height.**

The box is border-box, so `padding-bottom: var(--mds-safe-bottom)` alone took
the inset out of the height the items stood in.

**`CountButton` sizes the glyph in its slot.**

Same defect the buttons had: the spinner that replaces the glyph while a count
is in flight stated a step the glyph did not, so a row of them reflowed on a
tap.

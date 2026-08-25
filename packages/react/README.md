# @mond-design-system/react

Brand-agnostic React components. Self-styled, WCAG 2.2 AA, no theme object and
no product vocabulary.

Every component reads CSS custom properties from
[`@mond-design-system/tokens`](https://www.npmjs.com/package/@mond-design-system/tokens),
so restyling the whole library is one CSS file in your app.

```sh
pnpm add @mond-design-system/react @mond-design-system/tokens
```

React 19 or newer, as a peer dependency.

## Setup

Load the tokens, then the components, then your brand. The order is the
mechanism: your brand file re-declares the same properties and wins by coming
last.

```ts
import "@mond-design-system/tokens/styles.css";
import "@mond-design-system/react/styles.css";
import "./tokens/brand-acme.css";
```

```tsx
import { Button, Card, Field, Input, Stack } from "@mond-design-system/react";

export function SignIn() {
  return (
    <Card>
      <Stack gap="loose">
        <Field label="Email">
          <Input type="email" />
        </Field>
        <Button variant="primary">Continue</Button>
      </Stack>
    </Card>
  );
}
```

Dark mode is `data-theme="dark"` on `<html>`. Nothing else changes.

## Components

**Typography** — `Text`, `Heading`, `Link`, `Icon` (with `IconProvider`)

**Actions** — `Button`, `CountButton`

**Forms** — `Field`, `Input`, `PasswordInput`, `Textarea`, `Select`, `Checkbox`,
`Radio`, `Switch`, `SegmentedControl`, `DateTimePicker`,
`FileDrop`

**Content** — `Card`, `Avatar`, `AvatarGroup`, `Badge`, `Tag`, `Chip`,
`ChipGroup`, `ChipBar`, `Divider`, `ListGroup`, `ListItem`, `EmptyState`

**Feedback** — `Spinner`, `Skeleton`, `ProgressBar`, `ToastProvider` / `useToast`

**Layout** — `Stack`, `Inline`, `Container`, `Screen`, `ScreenContent`

**Navigation** — `Tabs`, `TabList`, `Tab`, `TabPanel`, `AppBar`, `TabBar`, `SideNav`

**Overlays** — `Modal`, `Sheet`, `ConfirmDialog`

**Hooks** — `useOverlay`, `usePresence`, `useRovingGroup`, `useFieldContext`,
`cx`

## Overlays and browser history

`Sheet` and `Modal` claim a history entry through `useOverlay`, so the back
gesture on a phone dismisses the overlay instead of leaving the screen behind
it. The library owns _when_, not _how_ — it has no router, and reaching for
`history.pushState` behind one corrupts the router's own index.

Supply the mechanism through `OverlayHistoryContext`. It is optional and null by
default, which is the right value in Storybook and unit tests.

```tsx
import { OverlayHistoryContext } from "@mond-design-system/react";
```

## Icons

`Icon` renders whatever you give it. `IconProvider` sets the renderer once, so
components that draw an icon internally use your icon set rather than one the
library chose for you.

## Accessibility

Focus is one treatment, declared once in the tokens package; components do not
restyle it. Disabled states are a color change, not opacity — compositing an
opacity over an arbitrary brand surface has no predictable contrast. Motion
collapses under `prefers-reduced-motion`, including the literal-duration
animations.

## License

MIT

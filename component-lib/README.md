# Mond Design System

A modern design system with React components and design tokens, inspired by portfolio-2023 aesthetics.

## Installation

```bash
npm install @mond-design-system/theme
# or
yarn add @mond-design-system/theme
```

## Usage

### Components

```tsx
import { Button } from '@mond-design-system/theme';

function App() {
  return (
    <div>
      <Button variant="primary" size="md">
        Primary Button
      </Button>
      
      <Button variant="outline" corners="rounded">
        Rounded Outline
      </Button>
      
      <Button variant="ghost" iconOnly>
        ⚙
      </Button>
    </div>
  );
}
```

### Design Tokens

```tsx
import { colors, fontFamilies, spacing } from '@mond-design-system/theme';

const styles = {
  backgroundColor: colors.background.dark,
  color: colors.foreground.dark,
  fontFamily: fontFamilies.sans,
  padding: spacing[4],
};
```

## Available Tokens

### Colors
- `colors.primary` - Blue palette (50-900)
- `colors.neutral` - Gray palette (50-900)
- `colors.background` - Theme backgrounds (`.light`, `.dark`)
- `colors.foreground` - Theme text colors (`.light`, `.dark`)
- `colors.accent` - Accent colors (`.yellow`, `.gray`)
- `colors.success`, `colors.warning`, `colors.error` - Status colors

### Typography
- `fontFamilies` - Font stacks (`.sans`, `.serif`, `.mono`)
- `fontSizes` - Size scale (`.xs` to `.6xl`)
- `fontWeights` - Weight scale (`.thin` to `.black`)
- `lineHeights` - Line height scale
- `letterSpacings` - Letter spacing scale

### Layout
- `spacing` - Spacing scale (0-64)
- `radii` - Border radius scale
- `shadows` - Box shadow scale

## Button Component API

### Props
- `variant?: 'primary' | 'outline' | 'ghost'` - Visual style
- `size?: 'sm' | 'md' | 'lg'` - Size preset
- `corners?: 'default' | 'rounded'` - Corner style
- `iconOnly?: boolean` - Icon-only mode
- `isDarkMode?: boolean` - Theme variant
- `disabled?: boolean` - Disabled state

### Examples

```tsx
// Primary button with dark theme
<Button variant="primary" isDarkMode={true}>
  Save Changes
</Button>

// Small rounded outline button
<Button variant="outline" size="sm" corners="rounded">
  Cancel
</Button>

// Icon-only ghost button
<Button variant="ghost" iconOnly>
  ❤️
</Button>
```

## Theme Integration

The design system supports light and dark themes using the portfolio-2023 color palette:

```tsx
const theme = {
  light: {
    background: colors.background.light, // #F2F3F4
    text: colors.foreground.light,       // #414A4C
  },
  dark: {
    background: colors.background.dark,  // #27374D
    text: colors.foreground.dark,        // #DDE6ED
  }
};
```

## Development

Built with TypeScript, includes full type definitions for all components and tokens.

## License

MIT
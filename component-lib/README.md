# @mond-design-system/theme

A modern, accessible React component library with TypeScript support and built-in design tokens.

## Installation

```bash
npm install @mond-design-system/theme
# or
yarn add @mond-design-system/theme
# or
pnpm add @mond-design-system/theme
```

## Quick Start

```tsx
import { Text, Heading, Icon, Button } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <div>
      <Heading level={1}>Welcome to Mond Design System</Heading>
      <Text variant="body-lg" semantic="secondary">
        Modern, accessible components with TypeScript support
      </Text>
      
      <Icon size="md" label="Heart icon">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0..." fill="currentColor" />
      </Icon>
      
      <Button variant="primary">Get Started</Button>
    </div>
  );
}
```

## Components

### Typography
- **Heading** - Semantic heading elements (h1-h6) with flexible sizing
- **Text** - Flexible text component with semantic variants and styling options

### Icons & Graphics  
- **Icon** - SVG icon wrapper with consistent sizing and accessibility features

### Layout & Containers
- **Box** - Foundational layout primitive with design system props
- **Stack** - Vertical layout container for consistent spacing
- **Grid** - CSS Grid layout wrapper with responsive features
- **Card** - Content container with elevation and padding

### Form Controls
- **Button** - Primary, secondary, and ghost variants with multiple sizes
- **Input** - Text input with validation states and icons
- **Textarea** - Multi-line text input with resizing options
- **Checkbox** - Checkbox input with custom styling and labels
- **Radio** - Radio button input with consistent styling
- **Select** - Dropdown selection with custom styling
- **Switch** - Toggle switch control for boolean states
- **FormField** - Form field wrapper with labels and validation
- **FormGroup** - Form section grouping with consistent spacing

### Interactive Components
- **Badge** - Status indicators and labels with semantic colors
- **Avatar** - User profile images with fallbacks and sizing options
- **Tooltip** - Contextual information overlays with positioning
- **Modal** - Dialog overlays with backdrop and focus management
- **Tabs** - Tab navigation interface with keyboard support
- **Link** - Styled anchor elements with hover states

## Key Features

- ✅ **TypeScript First** - Full type safety and IntelliSense support
- ✅ **Accessibility** - WCAG 2.1 AA compliant components
- ✅ **Design Tokens** - Semantic color system with light/dark themes
- ✅ **Consistent API** - Similar props across all components
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **Zero Runtime Dependencies** - No external dependencies
- ✅ **Responsive Design** - Mobile-first responsive components

## Typography Examples

```tsx
// Heading with semantic levels
<Heading level={1} size="4xl">Main Title</Heading>
<Heading level={2} semantic="secondary">Section Title</Heading>

// Text with variants and semantic colors
<Text variant="body-lg" semantic="primary">Main content text</Text>
<Text variant="caption" semantic="tertiary">Helper text</Text>
<Text weight="bold" underline>Important information</Text>
```

## Icon Examples

```tsx
// Basic icon usage
<Icon size="md" label="Settings">
  <path d="M12 2C6.48..." />
</Icon>

// Decorative icons (hidden from screen readers)
<Icon size="lg" decorative>
  <circle cx="12" cy="12" r="10" />
</Icon>

// Custom colors and sizing
<Icon size="2xl" color="blue.500">
  <path d="M20.84..." />
</Icon>
```

## Design Tokens

### Semantic Colors
```tsx
// Semantic colors that adapt to light/dark themes
color="text.primary"           // Main text
color="text.secondary"         // Supporting text
color="surface.background"     // Background
color="interactive.primary.background" // Primary buttons
```

### Typography Scale
```tsx
fontSize="lg"          // 1.125rem
fontWeight="semibold"  // 600
lineHeight="relaxed"   // 1.625
fontFamily="sans"      // DM Sans font stack
```

### Spacing System
```tsx
padding="4"    // 1rem
margin="8"     // 2rem
gap="2"        // 0.5rem
```

## Theme Support

All components support light and dark themes:

```tsx
<Text isDarkMode={true} semantic="primary">
  Dark theme text
</Text>

<Heading isDarkMode={darkMode} semantic="secondary">
  Responsive theme heading
</Heading>

<Button isDarkMode={isDark} variant="primary">
  Themed button
</Button>
```

## Requirements

- React >= 16.8.0
- TypeScript >= 4.0 (optional but recommended)

## TypeScript Support

Full TypeScript definitions included with autocomplete support:

```tsx
import type { HeadingProps, TextProps, IconProps } from '@mond-design-system/theme';

const MyHeading: HeadingProps = {
  level: 1,
  size: '4xl',
  semantic: 'primary'
};
```

## Development

This package is part of the Mond Design System monorepo. For development setup:

```bash
git clone https://github.com/yourusername/mond-design-system.git
cd mond-design-system
yarn install
yarn storybook  # View components in Storybook
```

## License

MIT License - see LICENSE file for details.
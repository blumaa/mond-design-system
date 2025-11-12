# @mond-design-system/theme

A modern, accessible React component library with TypeScript support, design tokens, and polymorphic component rendering.

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
import { ThemeProvider } from '@mond-design-system/theme';

import { Text, Heading, Icon, Button, Box } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <ThemeProvider colorScheme="light">
      <Box p={4}>
        <Heading level={1}>Welcome to Mond Design System</Heading>
        <Text variant="body-lg" semantic="secondary">
          Modern, accessible components with TypeScript support
        </Text>

        <Icon size="md" label="Heart icon">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0..." fill="currentColor" />
        </Icon>

        <Button variant="primary">Get Started</Button>

        {/* Button as a link */}
        <Button as="a" href="/docs" variant="outline">
          View Documentation
        </Button>
      </Box>
    </ThemeProvider>
  );
}
```

## Next.js App Router Support

The Mond Design System fully supports Next.js 13+ App Router with both Server Components and Client Components.

### Server Components (SSR)

Server-safe components (without React hooks) can be imported from the main entry point:

```tsx
// app/page.tsx - Server Component (no 'use client')
import { Button, Text, Heading, Badge, Avatar, Link } from '@mond-design-system/theme';

export default function HomePage() {
  return (
    <main>
      <Heading level={1} size="4xl">
        Server-Rendered Page
      </Heading>
      <Text variant="body">
        This page is rendered on the server for optimal performance and SEO.
      </Text>
      <Button variant="primary">Server-rendered Button</Button>
    </main>
  );
}
```

**Server-Safe Components:**
- Button, Text, Heading, Link
- Badge, Avatar, Icon, Image
- Box, Divider, Label, Tag, Spinner

### Client Components (CSR)

Interactive components that use React hooks must be imported from `/client`:

```tsx
// app/components/toast-demo.tsx
'use client';

import { useState } from 'react';
import { Button, Text, Heading } from '@mond-design-system/theme';
import { ToastContainer, ToastData } from '@mond-design-system/theme/client';

export function ToastDemo() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = () => {
    setToasts([...toasts, {
      id: Date.now().toString(),
      type: 'success',
      title: 'Success!',
      message: 'Action completed'
    }]);
  };

  return (
    <>
      <Button onClick={showToast}>Show Toast</Button>
      <ToastContainer toasts={toasts} onDismiss={(id) =>
        setToasts(toasts.filter(t => t.id !== id))
      } />
    </>
  );
}
```

**Client Components (from `/client`):**
- Form components: Input, Textarea, Checkbox, Radio, Select, Switch
- Interactive components: ToastContainer, Modal, Tooltip, Popover, Tabs, Accordion, Dropdown, Carousel, Pagination

### Theme Provider in Next.js

Wrap your app with ThemeProvider in a Client Component:

```tsx
// app/providers/theme-provider.tsx
'use client';

import { ThemeProvider } from '@mond-design-system/theme';
import { violetBrand } from './violet-brand';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider brandTheme={violetBrand} colorScheme="light">
      {children}
    </ThemeProvider>
  );
}
```

```tsx
// app/layout.tsx - Server Component
import { Providers } from './providers/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Components

### Typography
- **Heading** - Semantic heading elements (h1-h6) with flexible sizing and polymorphic rendering
- **Text** - Flexible text component with semantic variants, styling options, and polymorphic rendering

### Icons & Graphics
- **Icon** - SVG icon wrapper with consistent sizing and accessibility features
- **Avatar** - User profile images with fallbacks and sizing options
- **Image** - Image component with loading states and error handling

### Layout & Containers
- **Box** - Foundational layout primitive with design system props and polymorphic rendering
- **Divider** - Visual separator with horizontal and vertical orientations
- **Card** - Content container with elevation and padding

### Form Controls
- **Button** - Five variants (primary, outline, ghost, destructive, warning) with polymorphic rendering
- **Input** - Text input with validation states and icons
- **Textarea** - Multi-line text input with resizing options
- **Checkbox** - Checkbox input with custom styling and labels
- **Radio** - Radio button input with consistent styling
- **Select** - Dropdown selection with custom styling
- **Switch** - Toggle switch control for boolean states
- **Label** - Form label with consistent styling

### Navigation & Interaction
- **Link** - Styled anchor elements with hover states
- **Tabs** - Tab navigation interface with keyboard support
- **Dropdown** - Dropdown menu with nested items and keyboard navigation
- **DropdownItem** - Individual dropdown menu item component
- **Pagination** - Page navigation with customizable ranges

### Overlays & Feedback
- **Modal** - Dialog overlays with backdrop and focus management
- **Popover** - Contextual overlays with click and hover triggers
- **Tooltip** - Contextual information overlays with positioning
- **ToastContainer** - Toast notification system

### Display & Status
- **Badge** - Status indicators and labels with semantic colors
- **Tag** - Removable labels with custom styling
- **Spinner** - Loading indicator with multiple sizes

### Complex Components
- **Accordion** - Collapsible content sections with keyboard support
- **AccordionItem** - Individual accordion section component
- **Carousel** - Image and content carousel with navigation

## Key Features

- ✅ **TypeScript First** - Full type safety and IntelliSense support
- ✅ **Polymorphic Components** - Render components as different elements (Button, Box, Text as links, divs, etc.)
- ✅ **Accessibility** - WCAG 2.1 AA compliant components with full keyboard support
- ✅ **CSS Variables** - Modern theming with CSS custom properties
- ✅ **Design Tokens** - Semantic color system with light/dark themes via ThemeProvider
- ✅ **Consistent API** - Similar props across all components
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **Zero Runtime Dependencies** - No external dependencies
- ✅ **Responsive Design** - Mobile-first responsive components

## Polymorphic Rendering

Many components support polymorphic rendering via the `as` prop, allowing you to render them as different HTML elements while maintaining their styling:

### Button as Link

```tsx
// Render button as an anchor tag
<Button as="a" href="https://example.com" variant="primary">
  Visit Example
</Button>

// External link with proper attributes
<Button
  as="a"
  href="https://github.com"
  target="_blank"
  rel="noopener noreferrer"
  variant="outline"
>
  View on GitHub
</Button>

// Icon-only link button
<Button
  as="a"
  href="/profile"
  variant="ghost"
  iconOnly
  aria-label="View Profile"
>
  <UserIcon />
</Button>
```

### Box as Different Elements

```tsx
// Render Box as a section
<Box as="section" p={4} bg="surface.elevated">
  <Heading level={2}>Section Title</Heading>
</Box>

// Render Box as a nav
<Box as="nav" display="flex" gap={4}>
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
</Box>

// Render Box as an article
<Box as="article" maxWidth="800px" mx="auto">
  <Text>Article content...</Text>
</Box>
```

### Text as Different Elements

```tsx
// Render Text as a span
<Text as="span" weight="bold" color="brand.primary.600">
  Inline text
</Text>

// Render Text as a label
<Text as="label" htmlFor="email" variant="body-sm">
  Email Address
</Text>
```

## Typography Examples

```tsx
// Heading with semantic levels
<Heading level={1} size="4xl">Main Title</Heading>
<Heading level={2} semantic="secondary">Section Title</Heading>
<Heading as="h1" level={2}>Visual h2 as semantic h1</Heading>

// Text with variants and semantic colors
<Text variant="body-lg" semantic="primary">Main content text</Text>
<Text variant="caption" semantic="tertiary">Helper text</Text>
<Text weight="bold" underline>Important information</Text>
```

## Button Variants

```tsx
// All button variants
<Button variant="primary">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="warning">Warning Action</Button>

// Sizes and states
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>
<Button disabled>Disabled Button</Button>

// With icons
<Button variant="primary">
  <PlusIcon />
  Add Item
</Button>

<Button iconOnly aria-label="Settings">
  <SettingsIcon />
</Button>
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
// Semantic colors that adapt to light/dark themes automatically
color="text.primary"                    // Main text
color="text.secondary"                  // Supporting text
color="surface.background"              // Background
color="surface.elevated"                // Elevated surfaces
color="interactive.primary.background"  // Primary buttons
color="brand.primary.600"               // Brand colors
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
p={4}          // Shorthand padding
mx="auto"      // Horizontal margin auto
```

### CSS Variables
All design tokens are available as CSS variables:
```css
.custom-component {
  color: var(--mond-color-text-primary);
  background: var(--mond-color-surface-background);
  padding: var(--mond-spacing-4);
  font-size: var(--mond-fontSize-lg);
}
```

## Theme Support

Wrap your application with ThemeProvider to enable automatic theme switching:

```tsx
import { ThemeProvider } from '@mond-design-system/theme';


function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider colorScheme={colorScheme}>
      {/* All components automatically adapt to the theme */}
      <Text semantic="primary">
        This text adapts to the current theme
      </Text>

      <Heading semantic="secondary">
        This heading also adapts automatically
      </Heading>

      <Button variant="primary">
        Themed button
      </Button>

      <Box bg="surface.elevated" p={4}>
        Themed container
      </Box>

      {/* Toggle theme */}
      <button onClick={() => setColorScheme(prev => prev === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </ThemeProvider>
  );
}
```

### How Theming Works
- ThemeProvider sets a `data-theme` attribute on the root element
- CSS variables automatically update based on the `colorScheme` prop
- Components use CSS variables internally for all themed values
- No prop drilling or manual theme management needed

## Form Examples

```tsx
// Input with validation
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error="Invalid email address"
/>

// Checkbox and Radio
<Checkbox label="Accept terms" checked onChange={handleChange} />
<Radio label="Option 1" name="choice" value="1" />

// Select dropdown
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
/>

// Switch toggle
<Switch label="Enable notifications" checked={enabled} onChange={setEnabled} />
```

## Requirements

- React >= 18.0.0
- React DOM >= 18.0.0
- TypeScript >= 4.0 (optional but recommended)

## TypeScript Support

Full TypeScript definitions included with autocomplete support:

```tsx
import type {
  HeadingProps,
  TextProps,
  IconProps,
  ButtonProps,
  BoxProps
} from '@mond-design-system/theme';

const MyHeading: HeadingProps = {
  level: 1,
  size: '4xl',
  semantic: 'primary'
};

// Polymorphic component types
<Button as="a" href="/link" /> // TypeScript knows this is valid
<Box as="section" p={4} />     // Full type safety
```

## Development

This package is part of the Mond Design System monorepo. For development setup:

```bash
git clone https://github.com/blumaa/mond-design-system.git
cd mond-design-system/component-lib
yarn install
yarn storybook  # View components in Storybook
yarn test       # Run tests
yarn build      # Build the library
```

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a pull request.

## License

MIT License - see LICENSE file for details.

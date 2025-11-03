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
import { Text, Heading, Icon, Button, Box } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Box padding={4}>
      <Heading level={1}>Welcome to Mond Design System</Heading>
      <Text variant="body" semantic="secondary">
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
  );
}
```

## Components

### Typography
- **Heading** - Semantic heading elements (h1-h6) with flexible sizing
- **Text** - Flexible text component with semantic variants, styling options, and polymorphic rendering

### Icons & Graphics
- **Icon** - SVG icon wrapper with consistent sizing and accessibility features
- **Avatar** - User profile images with fallbacks and sizing options
- **Image** - Image component with loading states and error handling

### Layout & Containers
- **Box** - Foundational layout primitive with design system props and polymorphic rendering
- **Divider** - Visual separator with horizontal and vertical orientations

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
- ✅ **Polymorphic Components** - Render components as different elements (Button, Box, Text)
- ✅ **Accessibility** - WCAG 2.1 AA compliant components with full keyboard support
- ✅ **Design Tokens** - Semantic color system with light/dark themes and multi-brand support
- ✅ **Consistent API** - Similar props across all components
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **SSR Compatible** - Works with Next.js, Remix, and other SSR frameworks
- ✅ **Responsive Design** - Mobile-first responsive components

## Theming & Design Tokens

The Mond Design System uses a sophisticated token system built with Style Dictionary, offering:

- **Light/Dark Mode** - Automatic theme switching via CSS variables
- **Multi-Brand Support** - Switch between brand themes (default with blue, BSF with green)
- **Type-Safe Tokens** - TypeScript types for all design tokens
- **Semantic Tokens** - Context-aware tokens that adapt to themes
- **CSS Variable Based** - No JavaScript runtime overhead

### Theme Provider

Use the `ThemeProvider` to enable theming in your app:

```tsx
import { ThemeProvider } from '@mond-design-system/theme';

// Static theming (SSR-safe)
function App() {
  return (
    <ThemeProvider colorScheme="light" brand="default">
      <YourApp />
    </ThemeProvider>
  );
}

// Dynamic theming with hooks (client-side)
function App() {
  return (
    <ThemeProvider enableHooks colorScheme="light" brand="default">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Runtime Theme Switching

When `enableHooks` is enabled, use the `useTheme` hook for runtime theme switching:

```tsx
import { useTheme } from '@mond-design-system/theme';

function ThemeSwitcher() {
  const { mode, brand, setMode, setBrand, toggleMode } = useTheme();

  return (
    <div>
      <button onClick={toggleMode}>
        Switch to {mode === 'light' ? 'dark' : 'light'} mode
      </button>

      <select value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="default">Default Brand (Blue)</option>
        <option value="bsf">BSF Brand (Green)</option>
      </select>

      <p>Current: {mode} mode, {brand} brand</p>
    </div>
  );
}
```

### Using Design Tokens

#### Option 1: CSS Variables (Recommended)

CSS variables automatically adapt to theme changes:

```css
.my-component {
  color: var(--color-text-primary);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--color-border-default);
}

.my-button {
  background-color: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
}
```

#### Option 2: TypeScript Tokens

For component props that accept token values:

```tsx
import * as tokens from '@mond-design-system/theme';
import type { ColorToken } from '@mond-design-system/theme';

// Type-safe color token
const primaryColor: ColorToken = 'ColorBrandPrimary500';

// Resolve token to value
const colorValue = tokens[primaryColor]; // "#0ea5e9" or "#22c55e" depending on brand
```

### Available Token Categories

**Color Tokens:**
- `ColorBlue*`, `ColorGray*`, `ColorGreen*`, `ColorRed*`, `ColorAmber*` - Primitive colors
- `ColorBrandPrimary*`, `ColorBrandSecondary*`, etc. - Brand colors (change per brand)
- `ColorText*`, `ColorSurface*`, `ColorBorder*` - Semantic colors (change per theme)

**Spacing Tokens:**
- `Spacing0` to `Spacing64` - Consistent spacing scale

**Typography Tokens:**
- `FontSizeXs` to `FontSize6xl` - Font sizes
- `FontWeightThin` to `FontWeightBlack` - Font weights
- `LineHeight*`, `LetterSpacing*` - Typography modifiers

**Border Radius Tokens:**
- `RadiiNone` to `RadiiFull` - Border radius values

**Shadow Tokens:**
- `ShadowSm` to `Shadow3xl` - Box shadows
- `ShadowGlow*`, `ShadowElevated`, `ShadowFloating` - Special effects

### Theme-Aware Component Example

```tsx
function ThemedCard() {
  return (
    <Box
      padding={6}
      backgroundColor="surfaceElevated"
      borderColor="borderDefault"
      style={{
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 'var(--radii-lg)',
      }}
    >
      <Heading variant="h2" color="textPrimary">
        Card Title
      </Heading>
      <Text semantic="secondary">
        This card automatically adapts to light/dark mode and brand changes!
      </Text>
      <Button variant="primary">
        Primary button uses brand colors
      </Button>
    </Box>
  );
}
```

### Brand-Specific Tokens

The system supports multiple brand themes. Use the ThemeProvider to switch brands dynamically:

```tsx
<ThemeProvider brand="default">  {/* Default theme (blue primary) */}
<ThemeProvider brand="bsf">      {/* BSF theme (green primary) */}
```

### Dark Mode Implementation

Dark mode works automatically when you set the theme:

```tsx
// Static dark mode
<ThemeProvider colorScheme="dark">

// Dynamic dark mode
const { mode, setMode } = useTheme();
setMode('dark');

// Toggle between modes
const { toggleMode } = useTheme();
toggleMode();
```

The theme provider sets `data-theme="dark"` or `data-theme="light"` on the root element, and CSS variables update automatically.

### localStorage Persistence

Theme preferences are automatically saved to localStorage when using `enableHooks`:

```tsx
<ThemeProvider
  enableHooks
  enablePersistence={true}  // default
  storageKeyMode="my-theme-mode"
  storageKeyBrand="my-brand"
>
```

## Polymorphic Rendering

Some components (Button, Box, Text) support polymorphic rendering via the `as` prop, allowing you to render them as different HTML elements while maintaining their styling:

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
<Box as="section" padding={4}>
  <Heading level={2}>Section Title</Heading>
</Box>

// Render Box as a nav
<Box as="nav" display="flex" gap={4}>
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
</Box>

// Render Box as an article
<Box as="article" maxWidth="800px" marginLeft="auto" marginRight="auto">
  <Text>Article content...</Text>
</Box>
```

### Text as Different Elements

```tsx
// Render Text as a span
<Text as="span" weight="bold">
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
<Heading level={1} size="3xl">Custom sized h1</Heading>

// Text with variants and semantic colors
<Text variant="body" semantic="primary">Main content text</Text>
<Text variant="caption" semantic="tertiary">Helper text</Text>
<Text variant="body" weight="bold" underline>Important information</Text>
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

// Custom sizing
<Icon size="2xl" label="Large icon">
  <path d="M20.84..." />
</Icon>
```

## Design Tokens

The design system uses CSS variables for all styling, ensuring consistent theming across components.

**Available semantic token categories:**
- `text*` - Text colors (textPrimary, textSecondary, textTertiary, textError, textSuccess, textWarning, textLink, textInverse, textDisabled, textAccent)
- `surface*` - Background surfaces (surfaceBackground, surfaceElevated, surfaceCard, surfaceInput, surfacePrimary, surfaceSecondary)
- `border*` - Border colors (borderDefault, borderSubtle, borderStrong, borderFocused, borderError, borderSuccess, borderWarning)
- `interactive*` - Interactive elements (used internally by components)
- `icon*` - Icon colors (iconPrimary, iconSecondary, iconTertiary, iconDisabled)

### Using Design Tokens in Custom CSS

For custom styles, use CSS variables directly:

```css
.my-custom-class {
  color: var(--mond-text-primary);
  background-color: var(--mond-surface-background);
  border-color: var(--mond-border-default);
}
```

### TypeScript Token Imports

Tokens can be imported for type reference but are NOT needed for styling:

```tsx
import { colors, spacing, fontSizes } from '@mond-design-system/theme';
// Only use for documentation or type references, not for styling
```

### Typography Scale

Typography props can be used on Box, Text, and Heading components:

```tsx
<Box fontSize="1.125rem" fontWeight={600}>Custom typography</Box>
<Text weight="semibold">Semibold text</Text>
<Heading weight="bold" level={1}>Bold heading</Heading>
```

### Spacing System

Spacing props accept numbers (converted to pixels) or strings. Use full property names:

```tsx
<Box padding={4}>                              {/* Padding: 1rem */}
<Box margin={8}>                               {/* Margin: 2rem */}
<Box gap={2}>                                  {/* Gap: 0.5rem */}
<Box marginLeft="auto" marginRight="auto">     {/* Horizontal margin: auto */}
<Box paddingLeft={6} paddingRight={6}>         {/* Horizontal padding: 1.5rem */}
```

## Theme Support

All components support light and dark themes via the `ThemeProvider`. Themes are controlled globally at the provider level.

```tsx
import { ThemeProvider } from '@mond-design-system/theme';

function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider brand="default" colorScheme={colorScheme}>
      {/* All components automatically use the theme */}
      <Text semantic="primary">Automatically themed text</Text>
      <Heading level={1} semantic="secondary">Automatically themed heading</Heading>
      <Button variant="primary">Automatically themed button</Button>
    </ThemeProvider>
  );
}
```

### Brand Theme Support

The design system supports multiple brand themes. Available brands are **'default'** (blue primary) and **'bsf'** (green primary):

```tsx
import { ThemeProvider } from '@mond-design-system/theme';

// Default brand theme (blue)
<ThemeProvider brand="default" colorScheme="light">
  <Button variant="primary">Default Brand Button</Button>
</ThemeProvider>

// BSF brand theme (green)
<ThemeProvider brand="bsf" colorScheme="dark">
  <Button variant="primary">BSF Brand Button</Button>
</ThemeProvider>
```

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

// Type-safe component usage
const MyHeading = (props: HeadingProps) => <Heading {...props} />;

// Polymorphic component types are fully supported
<Button as="a" href="/link" />              // TypeScript validates anchor props
<Box as="section" padding={4} />            // Full type safety with Box props
<Text as="label" htmlFor="id">Label</Text>  // Label props are available
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

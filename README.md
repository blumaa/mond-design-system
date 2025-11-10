# Mond Design System

[![npm version](https://badge.fury.io/js/@mond-design-system%2Ftheme.svg)](https://www.npmjs.com/package/@mond-design-system/theme)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern, accessible design system built with React, TypeScript, and design tokens following Atomic Design principles. Built for scale, consistency, and developer experience.

## ✨ Features

- 🎨 **Design Tokens** - Semantic color system with light/dark theme support
- ⚛️ **React Components** - Type-safe, accessible components with consistent API
- 🎯 **TypeScript First** - Full type safety and IntelliSense support  
- 📖 **Storybook Documentation** - Interactive component playground
- ♿ **Accessibility** - WCAG 2.1 AA compliant components
- 🌙 **Theme Support** - Built-in light and dark mode
- 🔧 **Developer Experience** - Simple APIs with sensible defaults

## 📦 Installation

```bash
npm install @mond-design-system/theme
# or
yarn add @mond-design-system/theme
# or
pnpm add @mond-design-system/theme
```

## 🚀 Quick Start

```tsx
import { Text, Heading, Icon, Button } from '@mond-design-system/theme';

function App() {
  return (
    <div>
      <Heading level={1}>Welcome to Mond Design System</Heading>
      <Text variant="body-lg" semantic="secondary">
        A modern design system for building consistent user interfaces.
      </Text>
      <Button variant="primary">Get Started</Button>
    </div>
  );
}
```

## 📚 Components

### Typography

#### Heading Component
Semantic heading elements (h1-h6) with flexible sizing and styling.

```tsx
import { Heading } from '@mond-design-system/theme';

// Semantic levels with default sizes
<Heading level={1}>Main Title</Heading>        // h1, 4xl size
<Heading level={2}>Section Title</Heading>     // h2, 3xl size
<Heading level={3}>Subsection</Heading>        // h3, 2xl size

// Custom size override
<Heading level={1} size="6xl">Hero Title</Heading>

// Semantic colors
<Heading semantic="primary">Default heading</Heading>
<Heading semantic="secondary">Subtle heading</Heading>

// Additional options
<Heading 
  level={2}
  weight="medium"
  align="center"
  truncate
  isDarkMode={false}
>
  Customized Heading
</Heading>
```

#### Text Component
Flexible text component with semantic variants and typography control.

```tsx
import { Text } from '@mond-design-system/theme';

// Variants for different content types
<Text variant="body-lg">Large body text</Text>
<Text variant="body-md">Default body text</Text>
<Text variant="body-sm">Small body text</Text>
<Text variant="caption">Caption text</Text>
<Text variant="overline">SECTION HEADER</Text>

// Semantic colors
<Text semantic="primary">Main content</Text>
<Text semantic="secondary">Supporting text</Text>
<Text semantic="success">Success message</Text>
<Text semantic="error">Error message</Text>

// Text styling
<Text weight="bold" italic underline>
  Styled text content
</Text>

// HTML elements
<Text as="p">Paragraph element</Text>
<Text as="strong">Strong emphasis</Text>
<Text as="label">Form label</Text>
```

### Icons

#### Icon Component
SVG icon wrapper with consistent sizing and accessibility features.

```tsx
import { Icon } from '@mond-design-system/theme';

// Basic usage
<Icon size="md" label="Heart icon">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" />
</Icon>

// Sizes: xs, sm, md, lg, xl, 2xl
<Icon size="xs">...</Icon>    // 12px
<Icon size="md">...</Icon>    // 20px (default)
<Icon size="2xl">...</Icon>   // 40px

// Colors
<Icon color="red">...</Icon>
<Icon color="blue.500">...</Icon>  // Design token

// Decorative icons (hidden from screen readers)
<Icon decorative>
  <path d="..." />
</Icon>

// Accessible icons
<Icon label="Delete item">
  <path d="..." />
</Icon>
```

### Layout & Forms

#### Box Component
Foundational layout primitive with design system props.

```tsx
import { Box } from '@mond-design-system/theme';

<Box
  p="4"              // padding from spacing scale
  m="2"              // margin from spacing scale
  bg="blue.50"       // background from color tokens
  color="text.primary" // semantic color
  borderRadius="md"   // border radius token
  display="flex"
  alignItems="center"
  isDarkMode={false}
>
  Content
</Box>
```

#### Other Available Components
- **Button** - Primary, secondary, and ghost variants
- **Input** - Text input with validation states
- **Textarea** - Multi-line text input
- **Checkbox** - Checkbox input with labels
- **Radio** - Radio button input
- **Select** - Dropdown selection
- **Switch** - Toggle switch control
- **Stack** - Vertical layout container
- **Grid** - CSS Grid layout wrapper
- **Card** - Content container with elevation
- **Badge** - Status indicators and labels
- **Avatar** - User profile images with fallbacks
- **Tooltip** - Contextual information overlays
- **Modal** - Dialog overlays
- **Tabs** - Tab navigation interface
- **Link** - Styled anchor elements
- **FormField** - Form field wrapper with labels
- **FormGroup** - Form section grouping

## 🎨 Design Tokens

### Colors
```tsx
// Semantic colors (automatically adapt to theme)
color="text.primary"        // Main text color
color="text.secondary"      // Supporting text
color="surface.background"  // Background surfaces
color="interactive.primary.background" // Button backgrounds

// Direct color tokens
color="blue.500"   // Specific blue shade
color="gray.100"   // Light gray
color="red.600"    // Error red
```

### Typography
```tsx
fontSize="lg"        // 1.125rem
fontWeight="bold"    // 700
lineHeight="normal"  // 1.5
fontFamily="sans"    // DM Sans font stack
```

### Spacing
```tsx
padding="4"    // 1rem
margin="8"     // 2rem
gap="2"        // 0.5rem
```

## 🌙 Theme Support

All components support light and dark themes through the `isDarkMode` prop:

```tsx
<Text isDarkMode={true} semantic="primary">
  Dark theme text
</Text>

<Heading isDarkMode={darkMode} semantic="secondary">
  Responsive theme heading
</Heading>
```

## 📖 Documentation

Explore the full component library in our Storybook documentation:

```bash
git clone https://github.com/yourusername/mond-design-system.git
cd mond-design-system
yarn install
yarn storybook
```

Visit `http://localhost:6006` to browse components, view examples, and experiment with different configurations.

## 🏗️ Development

### Project Structure
```
├── component-lib/          # Main package
│   ├── components/         # React components
│   ├── tokens/            # Design tokens
│   └── utils/             # Utility functions
├── apps/
│   └── web/              # Demo application
└── docs/                 # Documentation
```

### Scripts
```bash
yarn build          # Build all packages
yarn dev           # Development mode
yarn test          # Run tests
yarn storybook     # Start Storybook
yarn lint          # Run linting
```

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';
import { Text } from '../Text/Text';
import { Heading } from '../Heading/Heading';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Box',
  component: Box,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Minimal Box Component

A primitive layout component focused exclusively on **spacing** (margin and padding). Box uses strict TypeScript typing with \`SpacingToken\` and generates pure CSS utility classes for optimal performance and SSR/RSC compatibility.

### Quick Start

\`\`\`tsx
import { Box } from '@mond-design-system/theme/Box';
import '@mond-design-system/theme/box.css';

function MyComponent() {
  return (
    <Box padding="4">
      <span>Hello, World!</span>
    </Box>
  );
}
\`\`\`

### Key Features

- **Spacing Only**: Margin and padding props with full names (no abbreviations)
- **Strict TypeScript**: \`SpacingToken\` type ensures only valid tokens ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24" | "32" | "40" | "48" | "56" | "64")
- **Pure CSS Classes**: Props map to CSS utility classes (Pattern 1)
- **SSR/RSC Compatible**: No runtime theme resolution, works with Server Components
- **Theme-Aware**: Automatically responds to \`data-theme\` attribute changes
- **Light/Dark Mode**: Supports theme switching via CSS variables
- **Polymorphic**: Render as any HTML element via \`as\` prop

### Design Philosophy

Box is **minimal by design**. It does one thing well: spacing.

**For layout** (flexbox, grid, positioning):
- Use native HTML elements with \`className\` and CSS
- Or create dedicated layout components

**For colors and typography**:
- Use semantic components (Text, Heading, Button, etc.)
- Or apply styles via \`className\`

**For additional styling**:
- Use the \`className\` prop to add custom CSS classes
- Box works seamlessly with utility CSS frameworks

### IDE Autocomplete

TypeScript provides autocomplete for spacing tokens:
- Type \`padding="\` and see all valid tokens
- Invalid tokens are caught at compile time
- Token values: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64

### Available Spacing Props

All props use **full names** (not abbreviations) and accept \`SpacingToken\`:

- \`margin\` - All sides
- \`marginTop\` - Top side
- \`marginRight\` - Right side
- \`marginBottom\` - Bottom side
- \`marginLeft\` - Left side
- \`padding\` - All sides
- \`paddingTop\` - Top side
- \`paddingRight\` - Right side
- \`paddingBottom\` - Bottom side
- \`paddingLeft\` - Left side

### Token Scale Reference

| Token | Value | Pixels (16px base) |
|-------|-------|--------------------|
| "0"   | 0     | 0px               |
| "1"   | 0.25rem | 4px             |
| "2"   | 0.5rem  | 8px             |
| "3"   | 0.75rem | 12px            |
| "4"   | 1rem    | 16px            |
| "5"   | 1.25rem | 20px            |
| "6"   | 1.5rem  | 24px            |
| "8"   | 2rem    | 32px            |
| "10"  | 2.5rem  | 40px            |
| "12"  | 3rem    | 48px            |
| "16"  | 4rem    | 64px            |
| "20"  | 5rem    | 80px            |
| "24"  | 6rem    | 96px            |
| "32"  | 8rem    | 128px           |
| "40"  | 10rem   | 160px           |
| "48"  | 12rem   | 192px           |
| "56"  | 14rem   | 224px           |
| "64"  | 16rem   | 256px           |
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav', 'span'],
      description: 'The HTML element to render (polymorphic)',
      table: {
        type: { summary: 'React.ElementType' },
        defaultValue: { summary: 'div' },
      },
    },
    margin: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Margin on all sides',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    marginTop: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Margin on top side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    marginRight: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Margin on right side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    marginBottom: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Margin on bottom side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    marginLeft: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Margin on left side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    padding: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Padding on all sides',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    paddingTop: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Padding on top side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    paddingRight: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Padding on right side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    paddingBottom: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Padding on bottom side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    paddingLeft: {
      control: { type: 'select' },
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      description: 'Padding on left side',
      table: {
        type: { summary: 'SpacingToken' },
      },
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for visual examples with theme-aware styling
const VisualBox: React.FC<{ children: React.ReactNode; label?: string }> = ({ children, label }) => (
  <Box display="inline-block" style={{ position: 'relative' }}>
    {label && (
      <Box marginBottom="1" style={{ fontFamily: 'monospace' }}>
        <Text variant="caption" semantic="secondary">
          {label}
        </Text>
      </Box>
    )}
    <Box display="inline-block" style={{ border: '2px dashed var(--mond-border-default)' }}>
      {children}
    </Box>
  </Box>
);

export const Default: Story = {
  args: {
    padding: '4',
  },
  render: (args) => (
    <Box {...args} style={{ border: '1px solid var(--mond-border-default)', backgroundColor: 'var(--mond-surface-background)' }}>
      <Text>Box with padding</Text>
    </Box>
  ),
};

export const AllSpacingProps: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Margin Props</Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="md">
          <VisualBox label='margin="4"'>
            <Box margin="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>All sides</Text>
            </Box>
          </VisualBox>

          <VisualBox label='marginTop="6"'>
            <Box marginTop="6" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Top only</Text>
            </Box>
          </VisualBox>

          <VisualBox label='marginRight="8"'>
            <Box marginRight="8" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Right only</Text>
            </Box>
          </VisualBox>

          <VisualBox label='marginBottom="4"'>
            <Box marginBottom="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Bottom only</Text>
            </Box>
          </VisualBox>

          <VisualBox label='marginLeft="10"'>
            <Box marginLeft="10" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Left only</Text>
            </Box>
          </VisualBox>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Padding Props</Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="md">
          <VisualBox label='padding="4"'>
            <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>All sides</Text>
            </Box>
          </VisualBox>

          <VisualBox label='paddingTop="6"'>
            <Box paddingTop="6" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Top only</Text>
            </Box>
          </VisualBox>

          <VisualBox label='paddingRight="8"'>
            <Box paddingRight="8" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Right only</Text>
            </Box>
          </VisualBox>

          <VisualBox label='paddingBottom="4"'>
            <Box paddingBottom="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Bottom only</Text>
            </Box>
          </VisualBox>

          <VisualBox label='paddingLeft="10"'>
            <Box paddingLeft="10" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <Text>Left only</Text>
            </Box>
          </VisualBox>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Combined Props</Heading>
        </Box>
        <VisualBox label='margin="4" padding="6"'>
          <Box
            margin="4"
            padding="6"
            style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}
          >
            <Text>Margin and padding together</Text>
          </Box>
        </VisualBox>
      </Box>
    </Box>
  ),
};

export const SpacingTokens: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="lg">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Small Scale (0-6)</Heading>
        </Box>
        <Box display="flex" gap="md" style={{ flexWrap: 'wrap' }}>
          {(['0', '1', '2', '3', '4', '5', '6'] as const).map((token) => (
            <Box key={token} display="flex" flexDirection="column" alignItems="center" gap="xs">
              <Text variant="body-sm" semantic="secondary" as="code">"{token}"</Text>
              <Box
                padding={token}
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Medium Scale (8-16)</Heading>
        </Box>
        <Box display="flex" gap="md" style={{ flexWrap: 'wrap' }}>
          {(['8', '10', '12', '16'] as const).map((token) => (
            <Box key={token} display="flex" flexDirection="column" alignItems="center" gap="xs">
              <Text variant="body-sm" semantic="secondary" as="code">"{token}"</Text>
              <Box
                padding={token}
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Large Scale (20-64)</Heading>
        </Box>
        <Box display="flex" gap="md" style={{ flexWrap: 'wrap' }}>
          {(['20', '24', '32', '40', '48', '56', '64'] as const).map((token) => (
            <Box key={token} display="flex" flexDirection="column" alignItems="center" gap="xs">
              <Text variant="body-sm" semantic="secondary" as="code">"{token}"</Text>
              <Box
                padding={token}
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  ),
};

export const PolymorphicElements: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="md">
      <Box as="div" padding="4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <Text variant="code" semantic="secondary">as="div"</Text> <Text>(default element)</Text>
      </Box>

      <Box as="section" padding="4" style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b' }}>
        <Text variant="code" semantic="secondary">as="section"</Text> <Text>(semantic sectioning)</Text>
      </Box>

      <Box as="article" padding="4" style={{ backgroundColor: '#dbeafe', border: '1px solid #3b82f6' }}>
        <Text variant="code" semantic="secondary">as="article"</Text> <Text>(article content)</Text>
      </Box>

      <Box as="header" padding="4" style={{ backgroundColor: '#dcfce7', border: '1px solid #22c55e' }}>
        <Text variant="code" semantic="secondary">as="header"</Text> <Text>(header element)</Text>
      </Box>

      <Box as="footer" padding="4" style={{ backgroundColor: '#fce7f3', border: '1px solid #ec4899' }}>
        <Text variant="code" semantic="secondary">as="footer"</Text> <Text>(footer element)</Text>
      </Box>

      <Box as="span" padding="2" style={{ backgroundColor: '#f3e8ff', border: '1px solid #a855f7', display: 'inline-block' }}>
        <Text variant="code" semantic="secondary">as="span"</Text> <Text>(inline element)</Text>
      </Box>
    </Box>
  ),
};

export const NestedBoxes: Story = {
  render: () => (
    <Box
      padding="8"
      style={{
        backgroundColor: '#1e293b',
        border: '2px solid #334155',
        borderRadius: '8px',
      }}
    >
      <Box marginBottom="4" style={{ fontFamily: 'monospace' }}>
        <Text variant="body-sm" semantic="inverse">
          Outer Box: padding="8"
        </Text>
      </Box>

      <Box
        padding="6"
        margin="4"
        style={{
          backgroundColor: '#334155',
          border: '2px solid #475569',
          borderRadius: '6px',
        }}
      >
        <Box marginBottom="4" style={{ fontFamily: 'monospace' }}>
          <Text variant="body-sm" semantic="inverse">
            Middle Box: padding="6" margin="4"
          </Text>
        </Box>

        <Box
          padding="4"
          margin="3"
          style={{
            backgroundColor: '#475569',
            border: '2px solid #64748b',
            borderRadius: '4px',
          }}
        >
          <Box style={{ fontFamily: 'monospace' }}>
            <Text variant="body-sm" semantic="inverse">
              Inner Box: padding="4" margin="3"
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

export const WithClassName: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="md">
      <Box
        padding="4"
        className="custom-hover-effect"
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e2e8f0';
          e.currentTarget.style.borderColor = '#94a3b8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        <Text>Box with custom className and hover effect</Text>
      </Box>

      <Box
        padding="6"
        marginTop="4"
        className="animated-gradient"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
        }}
      >
        <Text weight="semibold" semantic="inverse">Box with gradient background via inline style</Text>
      </Box>

      <Box
        padding="4"
        display="flex"
        alignItems="center"
        justifyContent="center"
        className="flex-center"
        style={{
          backgroundColor: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '4px',
          minHeight: '100px',
        }}
      >
        <Text>Box with flexbox layout using Box props</Text>
      </Box>
    </Box>
  ),
};

export const AccessibilityExample: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="md">
      <Box
        as="nav"
        padding="4"
        aria-label="Main navigation"
        role="navigation"
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
        }}
      >
        <Text>Navigation with ARIA label</Text>
      </Box>

      <Box
        as="article"
        padding="6"
        aria-labelledby="article-title"
        style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '4px',
        }}
      >
        <Box marginBottom="2" id="article-title">
          <Heading level={4} size="md">
            Article Title
          </Heading>
        </Box>
        <Text>Article content with aria-labelledby reference</Text>
      </Box>

      <Box
        as="section"
        padding="4"
        role="region"
        aria-label="Alert section"
        style={{
          backgroundColor: '#fecaca',
          border: '1px solid #ef4444',
          borderRadius: '4px',
        }}
      >
        <Text>Alert region with role and label</Text>
      </Box>

      <Box
        as="button"
        padding="4"
        aria-pressed="false"
        tabIndex={0}
        style={{
          backgroundColor: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => {}}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
      >
        <Text weight="medium">Accessible button with aria-pressed</Text>
      </Box>
    </Box>
  ),
};

export const RealWorldExample: Story = {
  render: () => (
    <Box style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Box
        as="article"
        padding="8"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box as="header" marginBottom="6">
          <Box marginBottom="2">
            <Heading level={2} size="xl">
              Card Header
            </Heading>
          </Box>
          <Text variant="body-sm" semantic="secondary">
            Subtitle text goes here
          </Text>
        </Box>

        <Box as="section" marginBottom="6">
          <Text as="p">
            This example shows how Box is used for spacing only. All other styling
            (colors, typography, borders, shadows) is applied via inline styles or className.
            This keeps Box minimal and focused on its core purpose.
          </Text>
        </Box>

        <Box
          as="footer"
          paddingTop="4"
          display="flex"
          gap="sm"
          style={{
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <Button variant="primary">
            Primary Action
          </Button>
          <Button variant="outline">
            Secondary Action
          </Button>
        </Box>
      </Box>
    </Box>
  ),
};

export const FlexboxLayouts: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Flex Row with Gap
          </Heading>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap="md"
          padding="4"
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
            <Text>Item 1</Text>
          </Box>
          <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
            <Text>Item 2</Text>
          </Box>
          <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
            <Text>Item 3</Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Flex Column with Gap
          </Heading>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="sm"
          padding="4"
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
            <Text>Item 1</Text>
          </Box>
          <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
            <Text>Item 2</Text>
          </Box>
          <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
            <Text>Item 3</Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Center Aligned
          </Heading>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="8"
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
            minHeight: '150px',
          }}
        >
          <Text>Centered Content</Text>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Space Between
          </Heading>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="4"
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Text>Left</Text>
          <Text>Center</Text>
          <Text>Right</Text>
        </Box>
      </Box>
    </Box>
  ),
};

export const GapSizes: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((size) => (
        <Box key={size}>
          <Box marginBottom="2" style={{ fontFamily: 'monospace' }}>
            <Text variant="body-sm" weight="semibold" semantic="secondary">
              gap="{size}"
            </Text>
          </Box>
          <Box
            display="flex"
            gap={size}
            padding="4"
            style={{
              backgroundColor: 'var(--mond-surface-elevated)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '8px',
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                padding="3"
                style={{
                  backgroundColor: 'var(--mond-surface-background)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '4px',
                }}
              >
                <Text variant="body-sm">{i}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const FlexProp: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Flex Grow Example
          </Heading>
        </Box>
        <Box
          display="flex"
          gap="md"
          padding="4"
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            flex="1"
            padding="4"
            style={{
              backgroundColor: 'var(--mond-surface-background)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '4px',
            }}
          >
            <Text>flex="1" (grows to fill space)</Text>
          </Box>
          <Box
            padding="4"
            style={{
              backgroundColor: 'var(--mond-surface-background)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '4px',
            }}
          >
            <Text>No flex (auto width)</Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Multiple Flex Ratios
          </Heading>
        </Box>
        <Box
          display="flex"
          gap="md"
          padding="4"
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            flex="1"
            padding="4"
            style={{
              backgroundColor: 'var(--mond-surface-background)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '4px',
            }}
          >
            <Text>flex="1"</Text>
          </Box>
          <Box
            flex="2"
            padding="4"
            style={{
              backgroundColor: 'var(--mond-surface-background)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '4px',
            }}
          >
            <Text>flex="2" (2x wider)</Text>
          </Box>
          <Box
            flex="1"
            padding="4"
            style={{
              backgroundColor: 'var(--mond-surface-background)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '4px',
            }}
          >
            <Text>flex="1"</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

export const ResponsiveCardExample: Story = {
  render: () => (
    <Box
      display="flex"
      flexDirection="column"
      gap="md"
      padding="6"
      style={{
        backgroundColor: 'var(--mond-surface-background)',
        border: '1px solid var(--mond-border-default)',
        borderRadius: '12px',
        maxWidth: '600px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading level={3} size="xl">
          Card Title
        </Heading>
        <Button variant="primary">
          Action
        </Button>
      </Box>

      <Box display="flex" gap="sm" flexDirection="column">
        <Text as="p" semantic="secondary">
          This card demonstrates using Box with layout props (display, flexDirection, gap, justifyContent, alignItems)
          combined with spacing props (padding) to create clean, maintainable layouts without custom CSS.
        </Text>
      </Box>

      <Box
        display="flex"
        gap="sm"
        paddingTop="4"
        style={{
          borderTop: '1px solid var(--mond-border-default)',
        }}
      >
        {['Tag 1', 'Tag 2', 'Tag 3'].map((tag) => (
          <Box
            key={tag}
            padding="1"
            paddingLeft="3"
            paddingRight="3"
            style={{
              backgroundColor: 'var(--mond-surface-elevated)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '9999px',
            }}
          >
            <Text variant="body-sm">{tag}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  ),
};

export const AlignmentOptions: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Align Items
          </Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="md">
          {(['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] as const).map((align) => (
            <Box key={align}>
              <Box marginBottom="1" style={{ fontFamily: 'monospace' }}>
                <Text variant="caption" semantic="secondary">
                  alignItems="{align}"
                </Text>
              </Box>
              <Box
                display="flex"
                alignItems={align}
                gap="sm"
                padding="4"
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '8px',
                  minHeight: '100px',
                }}
              >
                <Box padding="2" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
                  <Text>Short</Text>
                </Box>
                <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
                  <Text>Taller Item</Text>
                </Box>
                <Box padding="2" style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
                  <Text>Short</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Justify Content
          </Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="md">
          {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const).map((justify) => (
            <Box key={justify}>
              <Box marginBottom="1" style={{ fontFamily: 'monospace' }}>
                <Text variant="caption" semantic="secondary">
                  justifyContent="{justify}"
                </Text>
              </Box>
              <Box
                display="flex"
                justifyContent={justify}
                padding="4"
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '8px',
                }}
              >
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    padding="2"
                    style={{
                      backgroundColor: 'var(--mond-surface-background)',
                      border: '1px solid var(--mond-border-default)',
                      borderRadius: '4px',
                    }}
                  >
                    <Text>{i}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  ),
};

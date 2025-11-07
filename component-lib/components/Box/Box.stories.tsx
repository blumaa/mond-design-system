import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

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
  <div style={{ display: 'inline-block', position: 'relative' }}>
    {label && (
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--mond-text-secondary)',
        marginBottom: '0.25rem',
        fontFamily: 'monospace',
      }}>
        {label}
      </div>
    )}
    <div style={{
      border: '2px dashed var(--mond-border-default)',
      display: 'inline-block',
    }}>
      {children}
    </div>
  </div>
);

// Helper to add theme-aware text color
const ThemedText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: 'var(--mond-text-primary)' }}>{children}</span>
);

export const Default: Story = {
  args: {
    padding: '4',
  },
  render: (args) => (
    <Box {...args} style={{ border: '1px solid var(--mond-border-default)', backgroundColor: 'var(--mond-surface-background)' }}>
      <ThemedText>Box with padding</ThemedText>
    </Box>
  ),
};

export const AllSpacingProps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--mond-text-primary)' }}>Margin Props</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <VisualBox label='margin="4"'>
            <Box margin="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>All sides</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='marginTop="6"'>
            <Box marginTop="6" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Top only</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='marginRight="8"'>
            <Box marginRight="8" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Right only</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='marginBottom="4"'>
            <Box marginBottom="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Bottom only</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='marginLeft="10"'>
            <Box marginLeft="10" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Left only</ThemedText>
            </Box>
          </VisualBox>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--mond-text-primary)' }}>Padding Props</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <VisualBox label='padding="4"'>
            <Box padding="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>All sides</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='paddingTop="6"'>
            <Box paddingTop="6" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Top only</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='paddingRight="8"'>
            <Box paddingRight="8" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Right only</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='paddingBottom="4"'>
            <Box paddingBottom="4" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Bottom only</ThemedText>
            </Box>
          </VisualBox>

          <VisualBox label='paddingLeft="10"'>
            <Box paddingLeft="10" style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}>
              <ThemedText>Left only</ThemedText>
            </Box>
          </VisualBox>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--mond-text-primary)' }}>Combined Props</h3>
        <VisualBox label='margin="4" padding="6"'>
          <Box
            margin="4"
            padding="6"
            style={{ backgroundColor: 'var(--mond-surface-elevated)', border: '1px solid var(--mond-border-default)' }}
          >
            <ThemedText>Margin and padding together</ThemedText>
          </Box>
        </VisualBox>
      </div>
    </div>
  ),
};

export const SpacingTokens: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--mond-text-primary)' }}>Small Scale (0-6)</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {(['0', '1', '2', '3', '4', '5', '6'] as const).map((token) => (
            <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{ fontSize: '0.875rem', color: 'var(--mond-text-secondary)' }}>"{token}"</code>
              <Box
                padding={token}
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--mond-text-primary)' }}>Medium Scale (8-16)</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {(['8', '10', '12', '16'] as const).map((token) => (
            <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{ fontSize: '0.875rem', color: 'var(--mond-text-secondary)' }}>"{token}"</code>
              <Box
                padding={token}
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--mond-text-primary)' }}>Large Scale (20-64)</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {(['20', '24', '32', '40', '48', '56', '64'] as const).map((token) => (
            <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{ fontSize: '0.875rem', color: 'var(--mond-text-secondary)' }}>"{token}"</code>
              <Box
                padding={token}
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const PolymorphicElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box as="div" padding="4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <code style={{ color: '#64748b' }}>as="div"</code> (default element)
      </Box>

      <Box as="section" padding="4" style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b' }}>
        <code style={{ color: '#64748b' }}>as="section"</code> (semantic sectioning)
      </Box>

      <Box as="article" padding="4" style={{ backgroundColor: '#dbeafe', border: '1px solid #3b82f6' }}>
        <code style={{ color: '#64748b' }}>as="article"</code> (article content)
      </Box>

      <Box as="header" padding="4" style={{ backgroundColor: '#dcfce7', border: '1px solid #22c55e' }}>
        <code style={{ color: '#64748b' }}>as="header"</code> (header element)
      </Box>

      <Box as="footer" padding="4" style={{ backgroundColor: '#fce7f3', border: '1px solid #ec4899' }}>
        <code style={{ color: '#64748b' }}>as="footer"</code> (footer element)
      </Box>

      <Box as="span" padding="2" style={{ backgroundColor: '#f3e8ff', border: '1px solid #a855f7', display: 'inline-block' }}>
        <code style={{ color: '#64748b' }}>as="span"</code> (inline element)
      </Box>
    </div>
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
      <div style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
        Outer Box: padding="8"
      </div>

      <Box
        padding="6"
        margin="4"
        style={{
          backgroundColor: '#334155',
          border: '2px solid #475569',
          borderRadius: '6px',
        }}
      >
        <div style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
          Middle Box: padding="6" margin="4"
        </div>

        <Box
          padding="4"
          margin="3"
          style={{
            backgroundColor: '#475569',
            border: '2px solid #64748b',
            borderRadius: '4px',
          }}
        >
          <div style={{ color: '#e2e8f0', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            Inner Box: padding="4" margin="3"
          </div>
        </Box>
      </Box>
    </Box>
  ),
};

export const WithClassName: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        Box with custom className and hover effect
      </Box>

      <Box
        padding="6"
        marginTop="4"
        className="animated-gradient"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '8px',
          fontWeight: '600',
        }}
      >
        Box with gradient background via inline style
      </Box>

      <Box
        padding="4"
        className="flex-center"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '4px',
          minHeight: '100px',
        }}
      >
        Box with flexbox layout via inline style
      </Box>
    </div>
  ),
};

export const AccessibilityExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        Navigation with ARIA label
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
        <h4 id="article-title" style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
          Article Title
        </h4>
        Article content with aria-labelledby reference
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
        Alert region with role and label
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
          fontWeight: '500',
        }}
        onClick={() => {}}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
      >
        Accessible button with aria-pressed
      </Box>
    </div>
  ),
};

export const RealWorldExample: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
            Card Header
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
            Subtitle text goes here
          </p>
        </Box>

        <Box as="section" marginBottom="6">
          <p style={{ margin: 0, lineHeight: '1.6', color: '#334155' }}>
            This example shows how Box is used for spacing only. All other styling
            (colors, typography, borders, shadows) is applied via inline styles or className.
            This keeps Box minimal and focused on its core purpose.
          </p>
        </Box>

        <Box
          as="footer"
          paddingTop="4"
          style={{
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Primary Action
          </button>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Secondary Action
          </button>
        </Box>
      </Box>
    </div>
  ),
};

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

A primitive component. Box uses strict TypeScript typing.

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

- **SSR/RSC Compatible**: No runtime theme resolution, works with Server Components
- **Theme-Aware**: Automatically responds to \`data-theme\` attribute changes
- **Light/Dark Mode**: Supports theme switching via CSS variables
- **Polymorphic**: Render as any HTML element via \`as\` prop
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
    border: {
      control: { type: 'select' },
      options: ['subtle', 'default', 'strong'],
      description: 'Border weight variant',
      table: {
        type: { summary: "'subtle' | 'default' | 'strong'" },
        defaultValue: { summary: 'undefined' },
      },
    },
    corners: {
      control: { type: 'select' },
      options: ['none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'],
      description: 'Border radius variant',
      table: {
        type: { summary: "'none' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full'" },
        defaultValue: { summary: "'rounded-lg'" },
      },
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    padding: '4',
    border: 'default',
  },
  render: (args) => (
    <Box {...args}>
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
          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">margin="4"</Text>
            </Box>
            <Box margin="4" border="default" padding="2">
              <Text>All sides</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">marginTop="6"</Text>
            </Box>
            <Box marginTop="6" border="default" padding="2">
              <Text>Top only</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">marginRight="8"</Text>
            </Box>
            <Box marginRight="8" border="default" padding="2">
              <Text>Right only</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">marginBottom="4"</Text>
            </Box>
            <Box marginBottom="4" border="default" padding="2">
              <Text>Bottom only</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">marginLeft="10"</Text>
            </Box>
            <Box marginLeft="10" border="default" padding="2">
              <Text>Left only</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Padding Props</Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="md">
          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">padding="4"</Text>
            </Box>
            <Box padding="4" border="default">
              <Text>All sides</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">paddingTop="6"</Text>
            </Box>
            <Box paddingTop="6" border="default">
              <Text>Top only</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">paddingRight="8"</Text>
            </Box>
            <Box paddingRight="8" border="default">
              <Text>Right only</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">paddingBottom="4"</Text>
            </Box>
            <Box paddingBottom="4" border="default">
              <Text>Bottom only</Text>
            </Box>
          </Box>

          <Box>
            <Box marginBottom="1">
              <Text variant="caption" semantic="secondary">paddingLeft="10"</Text>
            </Box>
            <Box paddingLeft="10" border="default">
              <Text>Left only</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Combined Props</Heading>
        </Box>
        <Box>
          <Box marginBottom="1">
            <Text variant="caption" semantic="secondary">margin="4" padding="6"</Text>
          </Box>
          <Box margin="4" padding="6" border="default">
            <Text>Margin and padding together</Text>
          </Box>
        </Box>
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
        <Box display="flex" gap="md" flexWrap="wrap">
          {(['0', '1', '2', '3', '4', '5', '6'] as const).map((token) => (
            <Box key={token} display="flex" flexDirection="column" alignItems="center" gap="xs">
              <Text variant="body-sm" semantic="secondary" as="code">"{token}"</Text>
              <div
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              >
                <Box padding={token} />
              </div>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Medium Scale (8-16)</Heading>
        </Box>
        <Box display="flex" gap="md" flexWrap="wrap">
          {(['8', '10', '12', '16'] as const).map((token) => (
            <Box key={token} display="flex" flexDirection="column" alignItems="center" gap="xs">
              <Text variant="body-sm" semantic="secondary" as="code">"{token}"</Text>
              <div
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              >
                <Box padding={token} />
              </div>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Large Scale (20-64)</Heading>
        </Box>
        <Box display="flex" gap="md" flexWrap="wrap">
          {(['20', '24', '32', '40', '48', '56', '64'] as const).map((token) => (
            <Box key={token} display="flex" flexDirection="column" alignItems="center" gap="xs">
              <Text variant="body-sm" semantic="secondary" as="code">"{token}"</Text>
              <div
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '2px solid var(--mond-border-default)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              >
                <Box padding={token} />
              </div>
            </Box>
          ))}
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
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            gap="md"
            padding="4"
          >
            <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
              <Box padding="4">
                <Text>Item 1</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
              <Box padding="4">
                <Text>Item 2</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
              <Box padding="4">
                <Text>Item 3</Text>
              </Box>
            </div>
          </Box>
        </div>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Flex Column with Gap
          </Heading>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="sm"
            padding="4"
          >
            <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
              <Box padding="4">
                <Text>Item 1</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
              <Box padding="4">
                <Text>Item 2</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
              <Box padding="4">
                <Text>Item 3</Text>
              </Box>
            </div>
          </Box>
        </div>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Center Aligned
          </Heading>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
            minHeight: '150px',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="8"
          >
            <Text>Centered Content</Text>
          </Box>
        </div>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Space Between
          </Heading>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="4"
          >
            <Text>Left</Text>
            <Text>Center</Text>
            <Text>Right</Text>
          </Box>
        </div>
      </Box>
    </Box>
  ),
};

export const GapSizes: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((size) => (
        <Box key={size}>
          <div style={{ fontFamily: 'monospace' }}>
            <Box marginBottom="2">
              <Text variant="body-sm" weight="semibold" semantic="secondary">
                gap="{size}"
              </Text>
            </Box>
          </div>
          <div
            style={{
              backgroundColor: 'var(--mond-surface-elevated)',
              border: '1px solid var(--mond-border-default)',
              borderRadius: '8px',
            }}
          >
            <Box
              display="flex"
              gap={size}
              padding="4"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--mond-surface-background)',
                    border: '1px solid var(--mond-border-default)',
                    borderRadius: '4px',
                  }}
                >
                  <Box padding="3">
                    <Text variant="body-sm">{i}</Text>
                  </Box>
                </div>
              ))}
            </Box>
          </div>
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
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            gap="md"
            padding="4"
          >
            <div
              style={{
                backgroundColor: 'var(--mond-surface-background)',
                border: '1px solid var(--mond-border-default)',
                borderRadius: '4px',
              }}
            >
              <Box
                flex="1"
                padding="4"
              >
                <Text>flex="1" (grows to fill space)</Text>
              </Box>
            </div>
            <div
              style={{
                backgroundColor: 'var(--mond-surface-background)',
                border: '1px solid var(--mond-border-default)',
                borderRadius: '4px',
              }}
            >
              <Box padding="4">
                <Text>No flex (auto width)</Text>
              </Box>
            </div>
          </Box>
        </div>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Multiple Flex Ratios
          </Heading>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            gap="md"
            padding="4"
          >
            <div
              style={{
                backgroundColor: 'var(--mond-surface-background)',
                border: '1px solid var(--mond-border-default)',
                borderRadius: '4px',
              }}
            >
              <Box
                flex="1"
                padding="4"
              >
                <Text>flex="1"</Text>
              </Box>
            </div>
            <div
              style={{
                backgroundColor: 'var(--mond-surface-background)',
                border: '1px solid var(--mond-border-default)',
                borderRadius: '4px',
              }}
            >
              <Box
                flex="2"
                padding="4"
              >
                <Text>flex="2" (2x wider)</Text>
              </Box>
            </div>
            <div
              style={{
                backgroundColor: 'var(--mond-surface-background)',
                border: '1px solid var(--mond-border-default)',
                borderRadius: '4px',
              }}
            >
              <Box
                flex="1"
                padding="4"
              >
                <Text>flex="1"</Text>
              </Box>
            </div>
          </Box>
        </div>
      </Box>
    </Box>
  ),
};

export const FlexWrap: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Flex Wrap - No Wrap (Default)
          </Heading>
          <Text variant="body-sm" semantic="secondary">
            Items overflow the container when they don't fit
          </Text>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            flexWrap="nowrap"
            gap="md"
            padding="4"
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                style={{
                  backgroundColor: 'var(--mond-surface-background)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '4px',
                  minWidth: '100px',
                }}
              >
                <Box padding="4">
                  <Text>Item {num}</Text>
                </Box>
              </div>
            ))}
          </Box>
        </div>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Flex Wrap - Wrap
          </Heading>
          <Text variant="body-sm" semantic="secondary">
            Items wrap to next line when they don't fit
          </Text>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            flexWrap="wrap"
            gap="md"
            padding="4"
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                style={{
                  backgroundColor: 'var(--mond-surface-background)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '4px',
                  width: '150px',
                }}
              >
                <Box padding="4">
                  <Text>Item {num}</Text>
                </Box>
              </div>
            ))}
          </Box>
        </div>
      </Box>
    </Box>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Grid: Two Columns
          </Heading>
          <Text variant="body-sm" semantic="secondary">
            Using CSS Grid with repeat(2, 1fr) for exactly 2 items per row
          </Text>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap="md"
            padding="4"
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
              <Box
                key={num}
                padding="4"
                border="default"
                corners="rounded-md"
              >
                <Text>Item {num}</Text>
              </Box>
            ))}
          </Box>
        </div>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Grid: Three Columns
          </Heading>
          <Text variant="body-sm" semantic="secondary">
            Using CSS Grid with repeat(3, 1fr) for exactly 3 items per row
          </Text>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="md"
            padding="4"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
              <Box
                key={num}
                padding="4"
                border="default"
                corners="rounded-md"
              >
                <Text>Item {num}</Text>
              </Box>
            ))}
          </Box>
        </div>
      </Box>

      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">
            Grid: Four Columns
          </Heading>
          <Text variant="body-sm" semantic="secondary">
            Using CSS Grid with repeat(4, 1fr) for exactly 4 items per row
          </Text>
        </Box>
        <div
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            border: '1px solid var(--mond-border-default)',
            borderRadius: '8px',
          }}
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gap="md"
            padding="4"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
              <Box
                key={num}
                padding="4"
                border="default"
                corners="rounded-md"
              >
                <Text>Item {num}</Text>
              </Box>
            ))}
          </Box>
        </div>
      </Box>
    </Box>
  ),
};

export const ResponsiveCardExample: Story = {
  render: () => (
    <div
      style={{
        backgroundColor: 'var(--mond-surface-background)',
        border: '1px solid var(--mond-border-default)',
        borderRadius: '12px',
        maxWidth: '600px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap="md"
        padding="6"
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

        <div
          style={{
            borderTop: '1px solid var(--mond-border-default)',
          }}
        >
          <Box
            display="flex"
            gap="sm"
            paddingTop="4"
          >
            {['Tag 1', 'Tag 2', 'Tag 3'].map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '9999px',
                }}
              >
                <Box
                  padding="1"
                  paddingLeft="3"
                  paddingRight="3"
                >
                  <Text variant="body-sm">{tag}</Text>
                </Box>
              </div>
            ))}
          </Box>
        </div>
      </Box>
    </div>
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
              <div style={{ fontFamily: 'monospace' }}>
                <Box marginBottom="1">
                  <Text variant="caption" semantic="secondary">
                    alignItems="{align}"
                  </Text>
                </Box>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '8px',
                  minHeight: '100px',
                }}
              >
                <Box
                  display="flex"
                  alignItems={align}
                  gap="sm"
                  padding="4"
                >
                  <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
                    <Box padding="2">
                      <Text>Short</Text>
                    </Box>
                  </div>
                  <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
                    <Box padding="4">
                      <Text>Taller Item</Text>
                    </Box>
                  </div>
                  <div style={{ backgroundColor: 'var(--mond-surface-background)', border: '1px solid var(--mond-border-default)', borderRadius: '4px' }}>
                    <Box padding="2">
                      <Text>Short</Text>
                    </Box>
                  </div>
                </Box>
              </div>
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
              <div style={{ fontFamily: 'monospace' }}>
                <Box marginBottom="1">
                  <Text variant="caption" semantic="secondary">
                    justifyContent="{justify}"
                  </Text>
                </Box>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--mond-surface-elevated)',
                  border: '1px solid var(--mond-border-default)',
                  borderRadius: '8px',
                }}
              >
                <Box
                  display="flex"
                  justifyContent={justify}
                  padding="4"
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'var(--mond-surface-background)',
                        border: '1px solid var(--mond-border-default)',
                        borderRadius: '4px',
                      }}
                    >
                      <Box padding="2">
                        <Text>{i}</Text>
                      </Box>
                    </div>
                  ))}
                </Box>
              </div>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  ),
};

/**
 * Border Variants
 *
 * Demonstrates the three border weight options: subtle, default, and strong.
 */
export const BorderVariants: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Border Variants</Heading>
        </Box>
        <Box display="flex" gap="lg">
          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">Subtle Border</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="subtle"
                padding="6"
              >
                <Text>border="subtle"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">Default Border</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                padding="6"
              >
                <Text>border="default"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">Strong Border</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="strong"
                padding="6"
              >
                <Text>border="strong"</Text>
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

/**
 * Corner Variants
 *
 * Demonstrates all seven corner radius options. Default is rounded-lg.
 */
export const CornerVariants: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Corner Variants</Heading>
          <Text variant="body-sm" semantic="secondary">
            All corner radius options - Default is rounded-lg (0.5rem)
          </Text>
        </Box>
        <Box display="flex" flexWrap="wrap" gap="lg">
          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">None (0)</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                corners="none"
                padding="6"
              >
                <Text>corners="none"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">SM (0.125rem)</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                corners="rounded-sm"
                padding="6"
              >
                <Text>corners="rounded-sm"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">MD (0.25rem)</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                corners="rounded-md"
                padding="6"
              >
                <Text>corners="rounded-md"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">LG (0.5rem) - DEFAULT</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                corners="rounded-lg"
                padding="6"
              >
                <Text>corners="rounded-lg"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">XL (0.75rem)</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                corners="rounded-xl"
                padding="6"
              >
                <Text>corners="rounded-xl"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">2XL (1rem)</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                corners="rounded-2xl"
                padding="6"
              >
                <Text>corners="rounded-2xl"</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text variant="body-sm" semantic="secondary">Full (9999px)</Text>
            <div style={{ backgroundColor: 'var(--mond-surface-background)' }}>
              <Box
                border="default"
                corners="rounded-full"
                padding="6"
              >
                <Text>corners="rounded-full"</Text>
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

/**
 * Border and Corner Combinations
 *
 * Shows various combinations of border weights and corner styles.
 */
export const BorderCornerCombinations: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      <Box>
        <Box marginBottom="4">
          <Heading level={3} size="lg">Border & Corner Combinations</Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="lg">
          <Box display="flex" flexWrap="wrap" gap="md">
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="subtle"
                corners="rounded-sm"
                padding="4"
              >
                <Text variant="body-sm">Subtle + SM</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="subtle"
                corners="rounded-md"
                padding="4"
              >
                <Text variant="body-sm">Subtle + MD</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="subtle"
                corners="rounded-full"
                padding="4"
              >
                <Text variant="body-sm">Subtle + Full</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexWrap="wrap" gap="md">
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="default"
                corners="rounded-sm"
                padding="4"
              >
                <Text variant="body-sm">Default + SM</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="default"
                corners="rounded-md"
                padding="4"
              >
                <Text variant="body-sm">Default + MD</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="default"
                corners="rounded-full"
                padding="4"
              >
                <Text variant="body-sm">Default + Full</Text>
              </Box>
            </div>
          </Box>

          <Box display="flex" flexWrap="wrap" gap="md">
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="strong"
                corners="rounded-sm"
                padding="4"
              >
                <Text variant="body-sm">Strong + SM</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="strong"
                corners="rounded-md"
                padding="4"
              >
                <Text variant="body-sm">Strong + MD</Text>
              </Box>
            </div>
            <div style={{ backgroundColor: 'var(--mond-surface-background)', minWidth: '150px' }}>
              <Box
                border="strong"
                corners="rounded-full"
                padding="4"
              >
                <Text variant="body-sm">Strong + Full</Text>
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

/**
 * Responsive sizing with viewport-width calculations
 * - responsive: Both width and height (square grid)
 * - responsiveWidth: Only width (height auto)
 * - responsiveHeight: Only height (width auto)
 */
export const ResponsiveSizing: Story = {
  args: { children: "" },
  render: () => (
    <Box display="flex" flexDirection="column" gap="xl">
      {/* Both width and height - square grid */}
      <Box>
        <Box marginBottom="3">
          <Text variant="title" weight="semibold">
            responsive (both width & height)
          </Text>
          <Text variant="body-sm" semantic="secondary">
            For square grids like 4x4 tiles. Width and height scale together.
          </Text>
        </Box>
        <Box
          responsive
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap="xs"
          border="default"
          corners="rounded-md"
          padding="2"
        >
          {Array.from({ length: 16 }, (_, i) => (
            <Box
              key={i}
              border="default"
              corners="rounded-sm"
              padding="2"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text variant="body-xs">{i + 1}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Only width - height auto */}
      <Box>
        <Box marginBottom="3">
          <Text variant="title" weight="semibold">
            responsiveWidth (width only)
          </Text>
          <Text variant="body-sm" semantic="secondary">
            For containers where height should grow with content. Width scales, height auto.
          </Text>
        </Box>
        <Box
          responsiveWidth
          display="flex"
          flexDirection="column"
          gap="sm"
          border="default"
          corners="rounded-md"
          padding="4"
        >
          <Text variant="body-sm" weight="semibold">
            Found Groups Container
          </Text>
          <Box border="subtle" corners="rounded-sm" padding="3">
            <Text variant="body-sm">Group 1: Movies</Text>
          </Box>
          <Box border="subtle" corners="rounded-sm" padding="3">
            <Text variant="body-sm">Group 2: Colors</Text>
          </Box>
          <Box border="subtle" corners="rounded-sm" padding="3">
            <Text variant="body-sm">Group 3: Animals</Text>
          </Box>
        </Box>
      </Box>

      {/* Only height - width auto */}
      <Box>
        <Box marginBottom="3">
          <Text variant="title" weight="semibold">
            responsiveHeight (height only)
          </Text>
          <Text variant="body-sm" semantic="secondary">
            For vertical layouts where width should be flexible. Height scales, width auto.
          </Text>
        </Box>
        <Box display="flex" gap="sm">
          <Box
            responsiveHeight
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            border="default"
            corners="rounded-md"
            padding="4"
            width="md"
          >
            <Text variant="body-sm" weight="semibold">
              Sidebar
            </Text>
            <Box display="flex" flexDirection="column" gap="xs">
              <Box border="subtle" corners="rounded-sm" padding="2">
                <Text variant="body-xs">Item 1</Text>
              </Box>
              <Box border="subtle" corners="rounded-sm" padding="2">
                <Text variant="body-xs">Item 2</Text>
              </Box>
              <Box border="subtle" corners="rounded-sm" padding="2">
                <Text variant="body-xs">Item 3</Text>
              </Box>
            </Box>
          </Box>
          <Box padding="4">
            <Text variant="body-sm" semantic="secondary">
              Main content area (not responsive)
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the three responsive sizing options: `responsive` (both), `responsiveWidth` (width only), and `responsiveHeight` (height only). Resize the browser to see how each behaves at different breakpoints.'
      }
    }
  }
};


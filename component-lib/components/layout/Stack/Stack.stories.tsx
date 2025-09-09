import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Box } from '../Box/Box';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Stack } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Stack direction="vertical" spacing={16}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </Stack>
  );
}
\`\`\`

Stack is a layout component that arranges children in a vertical or horizontal line with consistent spacing. Built on top of the Box component, it provides powerful alignment and justification options.

**Key Features:**
- 📐 Vertical and horizontal layout directions
- 📏 Consistent spacing between items (pixel-based)
- 🎯 Flexible alignment options (start, center, end, stretch)
- ⚖️ Justification control (start, center, end, between, around, evenly)
- 🔄 Perfect for responsive layouts
- 🎨 Inherits all Box component styling capabilities
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Direction of the stack',
    },
    spacing: {
      control: { type: 'number' },
      description: 'Spacing between items in pixels',
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment of items',
    },
    justify: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Justification of items',
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoItem = ({ children, bg = '#e3f2fd' }: { children: React.ReactNode; bg?: string }) => (
  <Box 
    p={16} 
    bg={bg} 
    borderRadius={4} 
    textAlign="center" 
    fontWeight="500"
    border="1px solid #bbdefb"
  >
    {children}
  </Box>
);

export const Default: Story = {
  args: {
    spacing: 16,
  },
  render: (args) => (
    <Stack {...args}>
      <DemoItem>Item 1</DemoItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    spacing: 12,
  },
  render: (args) => (
    <Stack {...args}>
      <DemoItem>Item 1</DemoItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
    </Stack>
  ),
};

export const WithAlignment: Story = {
  render: () => (
    <Stack spacing={24}>
      <Box fontSize={18} fontWeight="600" mb={8}>Vertical Stack with Center Alignment</Box>
      <Stack align="center" spacing={12} bg="#f8f9fa" p={24} borderRadius={8}>
        <DemoItem>Short</DemoItem>
        <DemoItem>Medium Length Item</DemoItem>
        <DemoItem>Very Long Item with More Content</DemoItem>
      </Stack>
      
      <Box fontSize={18} fontWeight="600" mb={8} mt={24}>Horizontal Stack with Space Between</Box>
      <Stack direction="horizontal" justify="between" bg="#f8f9fa" p={24} borderRadius={8}>
        <DemoItem bg="#ffecb3">Left</DemoItem>
        <DemoItem bg="#c8e6c9">Center</DemoItem>
        <DemoItem bg="#ffcdd2">Right</DemoItem>
      </Stack>
    </Stack>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Stack spacing={20}>
      <Box fontSize={20} fontWeight="bold">Responsive Card Layout</Box>
      <Stack 
        direction="horizontal" 
        spacing={16} 
        style={{ flexWrap: 'wrap' }}
      >
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Box
            key={num}
            minWidth={200}
            flex="1"
            bg="#ffffff"
            border="1px solid #e0e0e0"
            borderRadius={8}
            p={20}
            boxShadow="0 2px 4px rgba(0,0,0,0.1)"
          >
            <Box fontSize={16} fontWeight="600" mb={8}>Card {num}</Box>
            <Box color="#666" fontSize={14}>
              This is card content that demonstrates responsive layout with Stack.
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  ),
};

export const NestedStacks: Story = {
  render: () => (
    <Stack spacing={20} bg="#fafafa" p={24} borderRadius={8}>
      <Box fontSize={18} fontWeight="600">Nested Stack Example</Box>
      
      <Stack direction="horizontal" spacing={20}>
        {/* Left Column */}
        <Stack spacing={12} flex="1" bg="#ffffff" p={16} borderRadius={8}>
          <Box fontWeight="600" color="#1976d2">Left Column</Box>
          <DemoItem bg="#e3f2fd">Item A</DemoItem>
          <DemoItem bg="#e3f2fd">Item B</DemoItem>
          <DemoItem bg="#e3f2fd">Item C</DemoItem>
        </Stack>
        
        {/* Right Column */}
        <Stack spacing={8} flex="1" bg="#ffffff" p={16} borderRadius={8}>
          <Box fontWeight="600" color="#388e3c">Right Column</Box>
          <Stack direction="horizontal" spacing={8}>
            <DemoItem bg="#e8f5e8">1</DemoItem>
            <DemoItem bg="#e8f5e8">2</DemoItem>
          </Stack>
          <DemoItem bg="#e8f5e8">Full Width</DemoItem>
          <Stack direction="horizontal" spacing={8}>
            <DemoItem bg="#e8f5e8">3</DemoItem>
            <DemoItem bg="#e8f5e8">4</DemoItem>
            <DemoItem bg="#e8f5e8">5</DemoItem>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  ),
};
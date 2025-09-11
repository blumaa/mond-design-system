import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta = {
  title: 'Layout/Box',
  component: Box,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Box } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Box 
      p={16} 
      bg="surface.primary" 
      borderRadius={8}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <span>Hello, World!</span>
    </Box>
  );
}
\`\`\`

A flexible layout primitive that accepts style props and can render as any HTML element. Perfect for creating layouts without writing custom CSS - the foundation of your design system.

**Key Features:**
- 🎨 Style props for all CSS properties (margin, padding, colors, typography)
- 🏷️ Renders as any HTML element (div, section, article, span, etc.)
- 📐 Full flexbox and grid layout support
- 🎯 Positioning utilities (absolute, relative, fixed, sticky)
- 🌙 Semantic color tokens with dark mode support
- ♿ Maintains semantic HTML for accessibility
- 🚀 Zero CSS files needed - all styling via props
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav', 'span'],
      description: 'The HTML element to render',
    },
    isDarkMode: {
      control: { type: 'boolean' },
      description: 'Enable dark mode theme',
    },
    // Spacing
    p: { control: { type: 'text' }, description: 'Padding (all sides)' },
    px: { control: { type: 'text' }, description: 'Padding horizontal (left & right)' },
    py: { control: { type: 'text' }, description: 'Padding vertical (top & bottom)' },
    m: { control: { type: 'text' }, description: 'Margin (all sides)' },
    mx: { control: { type: 'text' }, description: 'Margin horizontal (left & right)' },
    my: { control: { type: 'text' }, description: 'Margin vertical (top & bottom)' },
    // Colors
    bg: { control: { type: 'color' }, description: 'Background color' },
    color: { control: { type: 'color' }, description: 'Text color' },
    borderColor: { control: { type: 'color' }, description: 'Border color' },
    // Layout
    display: {
      control: { type: 'select' },
      options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'],
      description: 'CSS display property',
    },
    position: {
      control: { type: 'select' },
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      description: 'CSS position property',
    },
    // Flexbox
    flexDirection: {
      control: { type: 'select' },
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
      description: 'Flex direction',
    },
    alignItems: {
      control: { type: 'select' },
      options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
      description: 'Align items',
    },
    justifyContent: {
      control: { type: 'select' },
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      description: 'Justify content',
    },
    // Size
    width: { control: { type: 'text' }, description: 'Width' },
    height: { control: { type: 'text' }, description: 'Height' },
    // Border
    border: { control: { type: 'text' }, description: 'Border (shorthand)' },
    borderRadius: { control: { type: 'text' }, description: 'Border radius' },
    // Typography
    fontSize: { control: { type: 'text' }, description: 'Font size' },
    fontWeight: { control: { type: 'text' }, description: 'Font weight' },
    textAlign: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    // Effects
    boxShadow: { control: { type: 'text' }, description: 'Box shadow' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 }, description: 'Opacity' },
    cursor: {
      control: { type: 'select' },
      options: ['auto', 'pointer', 'default', 'text', 'move', 'not-allowed'],
      description: 'Cursor style',
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a Box component',
    p: 16,
    bg: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: 4,
  },
};

export const DifferentElements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <Box as="div" p={12} bg="#e3f2fd" borderRadius={4}>
        Div element (default)
      </Box>
      <Box as="section" p={12} bg="#f3e5f5" borderRadius={4}>
        Section element
      </Box>
      <Box as="article" p={12} bg="#e8f5e8" borderRadius={4}>
        Article element
      </Box>
      <Box as="span" p={8} bg="#fff3e0" borderRadius={4} display="inline-block">
        Span element (inline-block)
      </Box>
    </div>
  ),
};

export const FlexboxLayout: Story = {
  render: () => (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      p={24}
      bg="#f5f5f5"
      borderRadius={8}
      minHeight={120}
    >
      <Box
        bg="#2196f3"
        color="white"
        p={16}
        borderRadius={4}
        fontWeight="bold"
      >
        Item 1
      </Box>
      <Box
        bg="#4caf50"
        color="white"
        p={16}
        borderRadius={4}
        fontWeight="bold"
      >
        Item 2
      </Box>
      <Box
        bg="#ff9800"
        color="white"
        p={16}
        borderRadius={4}
        fontWeight="bold"
      >
        Item 3
      </Box>
    </Box>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <Box
      display="grid"
      gridTemplateColumns="1fr 1fr"
      gap={16}
      p={24}
      bg="#fafafa"
      borderRadius={8}
    >
      <Box bg="#e91e63" color="white" p={20} borderRadius={4} textAlign="center">
        Grid Item 1
      </Box>
      <Box bg="#9c27b0" color="white" p={20} borderRadius={4} textAlign="center">
        Grid Item 2
      </Box>
      <Box bg="#673ab7" color="white" p={20} borderRadius={4} textAlign="center">
        Grid Item 3
      </Box>
      <Box bg="#3f51b5" color="white" p={20} borderRadius={4} textAlign="center">
        Grid Item 4
      </Box>
    </Box>
  ),
};

export const SpacingShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <Box p={8} bg="#ffebee" borderRadius={4}>
        Padding: 8px
      </Box>
      <Box px={24} py={12} bg="#f3e5f5" borderRadius={4}>
        Padding X: 24px, Y: 12px
      </Box>
      <Box pt={20} pr={16} pb={12} pl={8} bg="#e8f5e8" borderRadius={4}>
        Individual padding sides
      </Box>
      <Box m={16} p={12} bg="#e3f2fd" borderRadius={4}>
        Margin: 16px, Padding: 12px
      </Box>
    </div>
  ),
};

export const SemanticTokens: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <Box
        p={16}
        bg="surface.primary"
        color="text.primary"
        border="1px solid"
        borderColor="border.default"
        borderRadius={4}
        
      >
        Light Mode - Using semantic tokens
      </Box>
      <Box
        p={16}
        bg="surface.primary"
        color="text.primary"
        border="1px solid"
        borderColor="border.default"
        borderRadius={4}
        
      >
        Dark Mode - Using semantic tokens
      </Box>
    </div>
  ),
};

export const ResponsiveCard: Story = {
  render: () => (
    <Box
      maxWidth={400}
      mx="auto"
      bg="white"
      borderRadius={8}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      overflow="hidden"
    >
      <Box
        height={200}
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontSize={20}
        fontWeight="bold"
      >
        Header Image Area
      </Box>
      <Box p={20}>
        <Box fontSize={24} fontWeight="bold" mb={8} color="#333">
          Card Title
        </Box>
        <Box color="#666" lineHeight="1.6" mb={16}>
          This is a card built entirely with the Box component. It demonstrates
          how you can create complex layouts using just style props.
        </Box>
        <Box display="flex" gap={12}>
          <Box
            px={16}
            py={8}
            bg="#2196f3"
            color="white"
            borderRadius={4}
            cursor="pointer"
            fontSize={14}
            fontWeight="500"
          >
            Primary
          </Box>
          <Box
            px={16}
            py={8}
            border="1px solid #2196f3"
            color="#2196f3"
            borderRadius={4}
            cursor="pointer"
            fontSize={14}
            fontWeight="500"
          >
            Secondary
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

export const PositionedElements: Story = {
  render: () => (
    <Box
      position="relative"
      width={300}
      height={200}
      bg="#f0f0f0"
      border="2px dashed #ccc"
      borderRadius={8}
    >
      <Box
        position="absolute"
        top={10}
        left={10}
        bg="#f44336"
        color="white"
        p={8}
        borderRadius={4}
        fontSize={12}
      >
        Top Left
      </Box>
      <Box
        position="absolute"
        top={10}
        right={10}
        bg="#4caf50"
        color="white"
        p={8}
        borderRadius={4}
        fontSize={12}
      >
        Top Right
      </Box>
      <Box
        position="absolute"
        bottom={10}
        left={10}
        bg="#2196f3"
        color="white"
        p={8}
        borderRadius={4}
        fontSize={12}
      >
        Bottom Left
      </Box>
      <Box
        position="absolute"
        bottom={10}
        right={10}
        bg="#ff9800"
        color="white"
        p={8}
        borderRadius={4}
        fontSize={12}
      >
        Bottom Right
      </Box>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        style={{ transform: 'translate(-50%, -50%)' }}
        bg="#9c27b0"
        color="white"
        p={12}
        borderRadius={4}
        fontSize={14}
        fontWeight="bold"
      >
        Center
      </Box>
    </Box>
  ),
};

export const Typography: Story = {
  render: () => (
    <Box p={24} bg="#fafafa" borderRadius={8}>
      <Box fontSize={32} fontWeight="bold" mb={16} color="#2c3e50">
        Typography with Box
      </Box>
      <Box fontSize={18} mb={12} color="#34495e" lineHeight="1.6">
        This is a paragraph created with Box component. You can control all
        typography properties through props.
      </Box>
      <Box fontSize={14} color="#7f8c8d" textAlign="center" fontStyle="italic">
        Centered italic text
      </Box>
      <Box
        fontSize={16}
        fontWeight="500"
        textTransform="uppercase"
        letterSpacing="0.5px"
        mt={16}
        color="#e74c3c"
      >
        Transformed Text
      </Box>
    </Box>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [clicked, setClicked] = React.useState(false);
    
    return (
      <Box
        p={20}
        bg={clicked ? '#4caf50' : '#2196f3'}
        color="white"
        borderRadius={8}
        cursor="pointer"
        textAlign="center"
        fontWeight="bold"
        transition="background-color 0.2s"
        onClick={() => setClicked(!clicked)}
        style={{
          transition: 'background-color 0.2s ease',
          userSelect: 'none',
        }}
      >
        {clicked ? 'Clicked!' : 'Click me!'}
      </Box>
    );
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';
import { Box } from '../../layout/Box/Box';

const meta = {
  title: 'Organisms/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Breadcrumb } from '@mond-design-system/theme';

function MyComponent() {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops', href: '/products/electronics/laptops' },
    { label: 'MacBook Pro' }, // Current page (no href)
  ];

  return (
    <Breadcrumb
      items={items}
      separator="/"
      maxItems={4}
      showHomeIcon={true}
      size="md"
    />
  );
}
\`\`\`

A breadcrumb navigation component that shows the current page location within a navigational hierarchy.

**Key Features:**
- 🗂️ Hierarchical navigation display
- 🏠 Optional home icon for first item
- 🎯 Customizable separators between items
- 📐 Collapsible with max items limit
- 🖱️ Click handlers for navigation
- 🎨 Icon support for breadcrumb items
- 🚫 Disabled state support
- 🌑 Dark mode compatibility
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of breadcrumb items',
      control: 'object',
    },
    separator: {
      description: 'Custom separator between items',
      control: 'text',
    },
    maxItems: {
      description: 'Maximum number of items to show before collapsing',
      control: 'number',
    },
    showHomeIcon: {
      description: 'Show home icon on first item',
      control: 'boolean',
    },
    size: {
      description: 'Size variant',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    isDarkMode: {
      description: 'Dark mode',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Laptops', href: '/products/electronics/laptops' },
  { label: 'MacBook Pro' },
];

const longItems = [
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Subcategory', href: '/category/subcategory' },
  { label: 'Sub-subcategory', href: '/category/subcategory/sub' },
  { label: 'Products', href: '/category/subcategory/sub/products' },
  { label: 'Electronics', href: '/category/subcategory/sub/products/electronics' },
  { label: 'Laptops', href: '/category/subcategory/sub/products/electronics/laptops' },
  { label: 'Gaming Laptops', href: '/category/subcategory/sub/products/electronics/laptops/gaming' },
  { label: 'High-end Gaming Laptops' },
];

export const Default: Story = {
  args: {
    items: basicItems,
  },
};

export const WithCustomSeparator: Story = {
  args: {
    items: basicItems,
    separator: '>',
  },
};

export const WithArrowSeparator: Story = {
  args: {
    items: basicItems,
    separator: '→',
  },
};

export const WithHomeIcon: Story = {
  args: {
    items: basicItems,
    showHomeIcon: true,
  },
};

export const Collapsed: Story = {
  args: {
    items: longItems,
    maxItems: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'When there are many items, you can collapse the middle items to show only the first and last few.',
      },
    },
  },
};

export const WithClickHandlers: Story = {
  args: {
    items: [
      { 
        label: 'Home', 
        onClick: () => alert('Home clicked!') 
      },
      { 
        label: 'Products', 
        onClick: () => alert('Products clicked!') 
      },
      { 
        label: 'Current Product'
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { 
        label: 'Dashboard', 
        href: '/dashboard',
        icon: <span>📊</span>
      },
      { 
        label: 'Analytics', 
        href: '/analytics',
        icon: <span>📈</span>
      },
      { 
        label: 'Reports', 
        href: '/reports',
        icon: <span>📋</span>
      },
      { 
        label: 'Monthly Report',
        icon: <span>📄</span>
      },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Restricted Area', disabled: true },
      { label: 'Accessible Page', href: '/accessible' },
      { label: 'Current Page' },
    ],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box>
        <h4>Small</h4>
        <Breadcrumb {...args} size="sm" />
      </Box>
      <Box>
        <h4>Medium (Default)</h4>
        <Breadcrumb {...args} size="md" />
      </Box>
      <Box>
        <h4>Large</h4>
        <Breadcrumb {...args} size="lg" />
      </Box>
    </Box>
  ),
  args: {
    items: basicItems,
  },
};

export const DarkMode: Story = {
  args: {
    items: basicItems,
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const InteractiveExample: Story = {
  render: (_args) => (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box>
        <h4>E-commerce Navigation</h4>
        <Breadcrumb 
          items={[
            { label: 'Store', href: '/', icon: <span>🏪</span> },
            { label: 'Electronics', href: '/electronics', icon: <span>⚡</span> },
            { label: 'Computers', href: '/electronics/computers', icon: <span>💻</span> },
            { label: 'Laptops', href: '/electronics/computers/laptops' },
            { label: 'Gaming Laptops', href: '/electronics/computers/laptops/gaming' },
            { label: 'ASUS ROG Strix' },
          ]}
          maxItems={4}
          showHomeIcon
        />
      </Box>
      
      <Box>
        <h4>Documentation Navigation</h4>
        <Breadcrumb 
          items={[
            { label: 'Docs', href: '/docs' },
            { label: 'Components', href: '/docs/components' },
            { label: 'Navigation', href: '/docs/components/navigation' },
            { label: 'Breadcrumb' },
          ]}
          separator="/"
        />
      </Box>
      
      <Box>
        <h4>File System Path</h4>
        <Breadcrumb 
          items={[
            { label: 'Users', href: '/users' },
            { label: 'john.doe', href: '/users/john.doe' },
            { label: 'Documents', href: '/users/john.doe/documents' },
            { label: 'Projects', href: '/users/john.doe/documents/projects' },
            { label: 'my-app' },
          ]}
          separator="/"
          size="sm"
        />
      </Box>
    </Box>
  ),
  args: {
    items: []
  },
};
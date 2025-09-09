import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useGlobals } from 'storybook/internal/preview-api';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Organisms/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Pagination } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  return (
    <Pagination
      currentPage={currentPage}
      totalItems={500}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      onItemsPerPageChange={(items) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page
      }}
      itemsPerPageOptions={[10, 25, 50, 100]}
      showItemsPerPage={true}
      showTotalInfo={true}
      maxVisiblePages={7}
      size="md"
    />
  );
}
\`\`\`

Pagination component for navigating through large datasets. Built following atomic design principles using Button, Select, and Text atoms.

**Key Features:**
- 🔢 Smart page number display with ellipsis for large datasets
- 📊 Items per page selector with customizable options
- 📈 Total items information display
- ⌨️ Keyboard navigation support (arrow keys, home/end)
- 📏 Multiple size variants (sm, md, lg)
- 📱 Responsive behavior for mobile devices
- 🌑 Dark mode compatibility
- ♿ Full accessibility with ARIA labels and roles
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page (1-indexed)',
    },
    totalItems: {
      control: { type: 'number', min: 0 },
      description: 'Total number of items',
    },
    itemsPerPage: {
      control: { type: 'number', min: 1 },
      description: 'Items shown per page',
    },
    onPageChange: {
      action: 'page-changed',
      description: 'Callback fired when page changes',
    },
    onItemsPerPageChange: {
      action: 'items-per-page-changed',
      description: 'Callback fired when items per page changes',
    },
    itemsPerPageOptions: {
      control: { type: 'object' },
      description: 'Available options for items per page',
    },
    maxVisiblePages: {
      control: { type: 'number', min: 3, max: 15 },
      description: 'Maximum number of page buttons to show',
    },
    showItemsPerPage: {
      control: { type: 'boolean' },
      description: 'Whether to show items per page selector',
    },
    showTotalInfo: {
      control: { type: 'boolean' },
      description: 'Whether to show total items info',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    className: {
      control: { type: 'text' },
      description: 'Custom CSS class name',
    },
  },
  decorators: [
    (Story, context) => {
      const [globals] = useGlobals();
      const isDark = globals.backgrounds?.value === '#333333' || globals.theme === 'dark';
      
      const storyArgs = {
        ...context.args,
        isDarkMode: isDark,
      };
      
      return (
        <div
          style={{
            padding: '2rem',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            borderRadius: '8px',
            minWidth: '800px',
          }}
        >
          <Story args={storyArgs} />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Interactive wrapper component for stories
const PaginationWrapper = (args: {
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  itemsPerPageOptions?: number[];
  maxVisiblePages?: number;
  showItemsPerPage?: boolean;
  showTotalInfo?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  [key: string]: unknown;
}) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(args.itemsPerPage || 10);

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={args.totalItems || 0}
      onPageChange={(page) => {
        setCurrentPage(page);
        args.onPageChange?.(page);
      }}
      onItemsPerPageChange={(items) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page when changing items per page
        args.onItemsPerPageChange?.(items);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
    itemsPerPageOptions: [10, 25, 50, 100],
    maxVisiblePages: 7,
    showItemsPerPage: true,
    showTotalInfo: true,
    size: 'md',
  },
};

export const SmallSize: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    size: 'lg',
  },
};

export const ManyPages: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    totalItems: 1000,
    itemsPerPage: 10,
    currentPage: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with many pages showing ellipsis behavior.',
      },
    },
  },
};

export const FewPages: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    totalItems: 30,
    itemsPerPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with few pages - all page numbers are shown without ellipsis.',
      },
    },
  },
};

export const SinglePage: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    totalItems: 8,
    itemsPerPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Single page scenario - navigation controls are hidden.',
      },
    },
  },
};

export const EmptyData: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    totalItems: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty dataset - shows "No items" message.',
      },
    },
  },
};

export const CustomItemsPerPageOptions: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    itemsPerPageOptions: [5, 15, 30, 60],
    itemsPerPage: 15,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom options for items per page selector.',
      },
    },
  },
};

export const NoItemsPerPageSelector: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    showItemsPerPage: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination without the items per page selector.',
      },
    },
  },
};

export const NoTotalInfo: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    showTotalInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination without total items information.',
      },
    },
  },
};

export const MinimalPagination: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    showItemsPerPage: false,
    showTotalInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal pagination with only navigation controls.',
      },
    },
  },
};

export const CompactVisiblePages: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    totalItems: 500,
    currentPage: 25,
    maxVisiblePages: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Fewer visible page numbers with more aggressive ellipsis.',
      },
    },
  },
};

export const LargeDataset: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    totalItems: 10000,
    itemsPerPage: 50,
    currentPage: 100,
    itemsPerPageOptions: [25, 50, 100, 250],
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination for large datasets with higher items per page options.',
      },
    },
  },
};

export const LastPagePartial: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    ...Default.args,
    totalItems: 95,
    itemsPerPage: 10,
    currentPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Last page with partial items (91-95 of 95 items).',
      },
    },
  },
};

// Responsive behavior story
export const ResponsiveDemo: Story = {
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <PaginationWrapper {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    totalItems: 200,
    currentPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive behavior in narrow containers (mobile-like).',
      },
    },
  },
};

// Keyboard navigation demo
export const KeyboardNavigation: Story = {
  render: (args) => (
    <div>
      <p style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
        Focus the pagination and use keyboard navigation:
        <br />
        • Arrow Left/Right: Previous/Next page
        <br />
        • Home/End: First/Last page
      </p>
      <PaginationWrapper {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    currentPage: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation capabilities.',
      },
    },
  },
};

// Accessibility showcase
export const AccessibilityShowcase: Story = {
  render: (args) => (
    <div>
      <p style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
        This pagination includes proper ARIA labels, keyboard navigation, and semantic markup for screen readers.
      </p>
      <PaginationWrapper {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    currentPage: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including ARIA labels and keyboard navigation.',
      },
    },
  },
};
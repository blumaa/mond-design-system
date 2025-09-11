import type { Meta, StoryObj } from '@storybook/react';
import { DetailTemplate } from './DetailTemplate';

const meta: Meta<typeof DetailTemplate> = {
  title: 'Templates/DetailTemplate',
  component: DetailTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive detail view template for displaying content with metadata, actions, and related items.',
      },
    },
  },
  argTypes: {
    isDarkMode: {
      control: 'boolean',
    },
    layout: {
      control: { type: 'select' },
      options: ['default', 'wide', 'centered'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMetadata = [
  { id: 'created', label: 'Created', value: '2024-01-15' },
  { id: 'author', label: 'Author', value: 'John Doe' },
  { id: 'category', label: 'Category', value: 'Technology' },
  { id: 'tags', label: 'Tags', value: ['React', 'TypeScript', 'Design System'] },
  { id: 'status', label: 'Status', value: 'Published', badge: { variant: 'success' as const } },
];

const sampleActions = [
  { id: 'edit', label: 'Edit', variant: 'primary' as const, icon: 'edit', onClick: () => console.log('Edit clicked') },
  { id: 'share', label: 'Share', variant: 'outline' as const, icon: 'share', onClick: () => console.log('Share clicked') },
  { id: 'delete', label: 'Delete', variant: 'outline' as const, icon: 'trash', isDangerous: true, onClick: () => console.log('Delete clicked') },
];

const sampleTabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <div>
        <p>This is the overview content section. It contains detailed information about the item being displayed.</p>
        <p>The content can be rich text with multiple paragraphs, lists, and other elements.</p>
        <ul>
          <li>Feature 1: Advanced functionality</li>
          <li>Feature 2: User-friendly interface</li>
          <li>Feature 3: Responsive design</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'details',
    label: 'Technical Details',
    content: (
      <div>
        <h3>Technical Specifications</h3>
        <p>This tab contains more detailed technical information.</p>
        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
          <code>npm install @mond/design-system</code>
        </div>
      </div>
    ),
  },
  {
    id: 'history',
    label: 'History',
    content: (
      <div>
        <h3>Version History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ borderLeft: '2px solid #e5e5e5', paddingLeft: '16px' }}>
            <strong>v2.0.0</strong> - January 15, 2024
            <p>Major release with breaking changes</p>
          </div>
          <div style={{ borderLeft: '2px solid #e5e5e5', paddingLeft: '16px' }}>
            <strong>v1.5.0</strong> - December 10, 2023
            <p>Added new components and improved accessibility</p>
          </div>
        </div>
      </div>
    ),
  },
];

const sampleRelatedItems = [
  {
    id: '1',
    title: 'Getting Started Guide',
    description: 'Learn how to set up and use the design system',
    href: '#',
    metadata: 'Documentation',
  },
  {
    id: '2',
    title: 'Component Library',
    description: 'Browse all available components',
    href: '#',
    metadata: 'Reference',
  },
  {
    id: '3',
    title: 'Design Tokens',
    description: 'Understand the design token system',
    href: '#',
    metadata: 'Tokens',
  },
];

export const Default: Story = {
  args: {
    title: 'Design System Documentation',
    subtitle: 'Complete guide to using the Mond Design System',
    metadata: sampleMetadata,
    actions: sampleActions,
    tabs: sampleTabs,
    relatedItems: sampleRelatedItems,
  },
};

export const WithHeroImage: Story = {
  args: {
    ...Default.args,
    heroImage: 'https://via.placeholder.com/1200x400/4f46e5/ffffff?text=Hero+Image',
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    ...Default.args,
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Design System' },
    ],
  },
};

export const WithAuthor: Story = {
  args: {
    ...Default.args,
    author: {
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/40x40/6366f1/ffffff?text=JS',
      role: 'Senior Designer',
    },
    date: new Date('2024-01-15T10:30:00Z'),
  },
};

export const WideLayout: Story = {
  args: {
    ...Default.args,
    layout: 'wide',
  },
};

export const CenteredLayout: Story = {
  args: {
    ...Default.args,
    layout: 'centered',
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Loading Content',
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    title: 'Error Loading Content',
    error: {
      title: 'Error Loading Content',
      message: 'Failed to load the requested content. Please try again later.',
      action: {
        label: 'Retry',
        onClick: () => console.log('Retry clicked'),
      },
    },
  },
};

export const WithCollapsibleSections: Story = {
  args: {
    ...Default.args,
    sections: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        content: (
          <div>
            <p>This section covers the basics of getting started with our design system.</p>
            <ol>
              <li>Install the package</li>
              <li>Import the components</li>
              <li>Start building</li>
            </ol>
          </div>
        ),
        collapsible: true,
        defaultCollapsed: false,
      },
      {
        id: 'advanced-usage',
        title: 'Advanced Usage',
        content: (
          <div>
            <p>Learn about advanced patterns and customization options.</p>
            <p>This section includes complex examples and best practices.</p>
          </div>
        ),
        collapsible: true,
        defaultCollapsed: true,
      },
    ],
  },
};

export const MinimalContent: Story = {
  args: {
    title: 'Simple Page',
    subtitle: 'A minimal example with just basic content.',
  },
};

export const DarkMode: Story = {
  args: {
    ...Default.args,
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const MobileResponsive: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithCustomActions: Story = {
  args: {
    ...Default.args,
    actions: [
      { id: 'bookmark', label: 'Bookmark', variant: 'outline', icon: 'bookmark', onClick: () => console.log('Bookmark clicked') },
      { id: 'download', label: 'Download PDF', variant: 'primary', icon: 'download', onClick: () => console.log('Download clicked') },
      { id: 'print', label: 'Print', variant: 'ghost', icon: 'printer', onClick: () => console.log('Print clicked') },
    ],
  },
};
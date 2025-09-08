import type { Meta, StoryObj } from '@storybook/react';
import { BreadcrumbItem } from './BreadcrumbItem';

const meta: Meta<typeof BreadcrumbItem> = {
  title: 'Components/BreadcrumbItem',
  component: BreadcrumbItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A single breadcrumb navigation item that can be used independently or within breadcrumb trails. Supports links, buttons, icons, and various states.',
      },
    },
  },
  argTypes: {
    children: {
      description: 'The text content of the breadcrumb item',
      control: 'text',
    },
    href: {
      description: 'URL to navigate to when clicked',
      control: 'text',
    },
    current: {
      description: 'Whether this is the current/active item',
      control: 'boolean',
    },
    disabled: {
      description: 'Whether the item is disabled',
      control: 'boolean',
    },
    size: {
      description: 'Size variant',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showSeparator: {
      description: 'Whether to show the separator after this item',
      control: 'boolean',
    },
    separator: {
      description: 'Custom separator content',
      control: 'text',
    },
    isDarkMode: {
      description: 'Dark mode styling',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbItem>;

export const Default: Story = {
  args: {
    children: 'Page',
  },
};

export const WithLink: Story = {
  args: {
    children: 'Home',
    href: '/home',
  },
};

export const WithButton: Story = {
  args: {
    children: 'Clickable',
    onClick: () => console.log('Clicked!'),
  },
};

export const Current: Story = {
  args: {
    children: 'Current Page',
    current: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Home',
    href: '/home',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
};

export const WithSeparator: Story = {
  args: {
    children: 'Page',
    showSeparator: true,
  },
};

export const WithCustomSeparator: Story = {
  args: {
    children: 'Page',
    showSeparator: true,
    separator: ' > ',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4>Small</h4>
        <BreadcrumbItem size="sm" href="/home">Home</BreadcrumbItem>
      </div>
      <div>
        <h4>Medium (Default)</h4>
        <BreadcrumbItem size="md" href="/home">Home</BreadcrumbItem>
      </div>
      <div>
        <h4>Large</h4>
        <BreadcrumbItem size="lg" href="/home">Home</BreadcrumbItem>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4>Normal Link</h4>
        <BreadcrumbItem href="/page">Normal Page</BreadcrumbItem>
      </div>
      <div>
        <h4>Current Page</h4>
        <BreadcrumbItem current>Current Page</BreadcrumbItem>
      </div>
      <div>
        <h4>Disabled</h4>
        <BreadcrumbItem disabled>Disabled Page</BreadcrumbItem>
      </div>
      <div>
        <h4>Clickable Button</h4>
        <BreadcrumbItem onClick={() => console.log('Clicked!')}>Button Page</BreadcrumbItem>
      </div>
    </div>
  ),
};

export const BreadcrumbTrail: Story = {
  render: () => (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center' }}>
      <BreadcrumbItem 
        href="/home" 
        showSeparator
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        }
      >
        Home
      </BreadcrumbItem>
      <BreadcrumbItem href="/products" showSeparator>Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics" showSeparator>Electronics</BreadcrumbItem>
      <BreadcrumbItem current>Smartphones</BreadcrumbItem>
    </nav>
  ),
};

export const WithVariousSeparators: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4>Default Separator (/)</h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BreadcrumbItem href="/home" showSeparator>Home</BreadcrumbItem>
          <BreadcrumbItem current>Page</BreadcrumbItem>
        </div>
      </div>
      <div>
        <h4>Arrow Separator (&gt;)</h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BreadcrumbItem href="/home" showSeparator separator=" > ">Home</BreadcrumbItem>
          <BreadcrumbItem current>Page</BreadcrumbItem>
        </div>
      </div>
      <div>
        <h4>Dot Separator (•)</h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BreadcrumbItem href="/home" showSeparator separator=" • ">Home</BreadcrumbItem>
          <BreadcrumbItem current>Page</BreadcrumbItem>
        </div>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    children: 'Home',
    href: '/home',
    isDarkMode: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const LongContent: Story = {
  args: {
    children: 'This is a very long breadcrumb item that might wrap or truncate',
    href: '/long-page',
  },
};

export const Playground: Story = {
  args: {
    children: 'Playground Item',
    href: '/playground',
    size: 'md',
    showSeparator: true,
    separator: '/',
    disabled: false,
    current: false,
    isDarkMode: false,
    onClick: () => console.log('Clicked!'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
};
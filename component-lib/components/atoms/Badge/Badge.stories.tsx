import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Badge } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Badge variant="primary" size="md">
      New
    </Badge>
  );
}
\`\`\`

A versatile badge component for labels, status indicators, and notifications. Perfect for highlighting important information, showing counts, or indicating states.

**Key Features:**
- 🎨 Six variants (default, primary, secondary, success, warning, error)
- 📏 Three sizes (sm, md, lg)
- 🔢 Ideal for notification counts and status indicators
- ✨ Icon support for enhanced visual meaning
- ♿ Full accessibility support
- 🌙 Dark mode support
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDarkMode: {
      control: 'boolean',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: (args, context) => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args, context) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const WithNumbers: Story = {
  render: (args, context) => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="error" size="sm">9</Badge>
      <Badge variant="error" size="md">99</Badge>
      <Badge variant="error" size="lg">99+</Badge>
      <Badge variant="primary">1,234</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args, context) => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="success">
        <span style={{ marginRight: '4px' }}>✓</span>
        Verified
      </Badge>
      <Badge variant="warning">
        <span style={{ marginRight: '4px' }}>⚠</span>
        Warning
      </Badge>
      <Badge variant="error">
        <span style={{ marginRight: '4px' }}>✕</span>
        Error
      </Badge>
      <Badge variant="primary">
        <span style={{ marginRight: '4px' }}>🚀</span>
        New
      </Badge>
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: (args, context) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span>Online</span>
        <Badge variant="success" size="sm">Active</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span>Processing</span>
        <Badge variant="warning" size="sm">Pending</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span>Failed</span>
        <Badge variant="error" size="sm">Error</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span>Draft</span>
        <Badge variant="secondary" size="sm">Draft</Badge>
      </div>
    </div>
  ),
};

export const Notification: Story = {
  render: (args, context) => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        style={{ 
          padding: '12px 24px', 
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
        }}
      >
        Messages
      </button>
      <Badge 
        variant="error" 
        size="sm"
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          minWidth: '20px',
        }}
      >
        3
      </Badge>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    children: 'Dark Badge',
    variant: 'primary',
  },
  parameters: {
    theme: 'dark',
  },
};

export const AllVariantsSizes: Story = {
  render: (args, context) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(['default', 'primary', 'secondary', 'success', 'warning', 'error'] as const).map(variant => (
        <div key={variant} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ width: '80px', textTransform: 'capitalize' }}>{variant}:</span>
          <Badge variant={variant} size="sm">{variant}</Badge>
          <Badge variant={variant} size="md">{variant}</Badge>
          <Badge variant={variant} size="lg">{variant}</Badge>
        </div>
      ))}
    </div>
  ),
};
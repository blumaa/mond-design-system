import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Button } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Button
      variant="primary"
      onClick={() => console.log('clicked')}
    >
      Click me
    </Button>
  );
}
\`\`\`

A versatile button component following atomic design principles with multiple variants, sizes, and styling options. Supports icons and full accessibility.

**Key Features:**
- 🎨 Five variants (primary, outline, ghost, destructive, warning)
- 📏 Three sizes (sm, md, lg)
- 🔘 Rounded and default corner styles
- ♿ Full keyboard navigation and ARIA support
- ⚡ Click handlers and form integration
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'outline', 'ghost', 'destructive', 'warning'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    corners: {
      control: { type: 'select' },
      options: ['default', 'rounded'],
    },
    alignContent: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
    },
    iconOnly: {
      control: { type: 'boolean' },
      description: 'Icon-only button with no text',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Button expands to fill container width',
    },
    disabled: {
      control: { type: 'boolean' },
    },
    children: {
      control: { type: 'text' },
      description: 'Button content (text or icon)',
    },
    onClick: { action: 'clicked' },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            padding: '3rem',
            borderRadius: '8px',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    children: 'Button',
    disabled: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="warning">Warning</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Primary</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Outline</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="outline" size="sm">Small</Button>
          <Button variant="outline" size="md">Medium</Button>
          <Button variant="outline" size="lg">Large</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Ghost</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="ghost" size="sm">Small</Button>
          <Button variant="ghost" size="md">Medium</Button>
          <Button variant="ghost" size="lg">Large</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Destructive</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="destructive" size="sm">Small</Button>
          <Button variant="destructive" size="md">Medium</Button>
          <Button variant="destructive" size="lg">Large</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Warning</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="warning" size="sm">Small</Button>
          <Button variant="warning" size="md">Medium</Button>
          <Button variant="warning" size="lg">Large</Button>
        </div>
      </div>
    </div>
  ),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    corners: 'default',
    children: 'Outline Button',
    disabled: false,
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    corners: 'default',
    children: 'Ghost Button',
    disabled: false,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'md',
    corners: 'default',
    children: 'Delete',
    disabled: false,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'md',
    corners: 'default',
    children: 'Warning',
    disabled: false,
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    children: (
      <>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        Button with Icon
      </>
    ),
    disabled: false,
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>Primary Disabled</Button>
      <Button variant="outline" disabled>Outline Disabled</Button>
      <Button variant="ghost" disabled>Ghost Disabled</Button>
      <Button variant="destructive" disabled>Destructive Disabled</Button>
      <Button variant="warning" disabled>Warning Disabled</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    iconOnly: true,
    children: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
    disabled: false,
  },
};

export const AlignmentLeft: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Button variant="primary" alignContent="left" fullWidth>
        Left Aligned
      </Button>
    </div>
  ),
};

export const AlignmentCenter: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Button variant="primary" alignContent="center" fullWidth>
        Center Aligned
      </Button>
    </div>
  ),
};

export const AlignmentRight: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Button variant="primary" alignContent="right" fullWidth>
        Right Aligned
      </Button>
    </div>
  ),
};

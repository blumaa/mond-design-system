import React from 'react';
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

A versatile button component with multiple variants, sizes, and styling options. Supports icons, loading states, and full accessibility.

**Key Features:**
- 🎨 Multiple variants (primary, outline, ghost)
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
      options: ['primary', 'outline', 'ghost'],
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
    alignContent: 'center',
    children: <span>Button</span>,
    iconOnly: false,
    disabled: false,
  },
};


export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    alignContent: 'center',
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
          style={{ marginRight: '8px' }}
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        Button with Icon
      </>
    ),
    iconOnly: false,
    disabled: false,
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    alignContent: 'center',
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
    iconOnly: true,
    disabled: false,
  },
};

export const AlignmentDemo: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    alignContent: 'left',
    children: <span>Left Aligned</span>,
    iconOnly: false,
    disabled: false,
    style: { width: '300px', minWidth: '300px' },
  },
};

export const AlignmentCenter: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    alignContent: 'center',
    children: <span>Center Aligned</span>,
    iconOnly: false,
    disabled: false,
    style: { width: '300px', minWidth: '300px' },
  },
};

export const AlignmentRight: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    alignContent: 'right',
    children: <span>Right Aligned</span>,
    iconOnly: false,
    disabled: false,
    style: { width: '300px', minWidth: '300px' },
  },
};

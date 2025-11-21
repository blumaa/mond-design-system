import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
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

A versatile button component with multiple variants, sizes, and styling options. Supports icons, polymorphic rendering, and full accessibility.

**Key Features:**
- 🎨 Five variants (primary, outline, ghost, destructive, warning)
- 📏 Three sizes (sm, md, lg)
- 🔘 Rounded and default corner styles
- 🔗 Polymorphic rendering (as button, link, or custom element)
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
      options: ['none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'],
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
    loading: {
      control: { type: 'boolean' },
      description: 'Button in loading state with spinner',
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
    corners: 'rounded-md',
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
    corners: 'rounded-md',
    children: 'Outline Button',
    disabled: false,
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    corners: 'rounded-md',
    children: 'Ghost Button',
    disabled: false,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'md',
    corners: 'rounded-md',
    children: 'Delete',
    disabled: false,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'md',
    corners: 'rounded-md',
    children: 'Warning',
    disabled: false,
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'rounded-md',
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
    corners: 'rounded-md',
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

export const AsLink: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>
          Button styled as link
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          Renders as an anchor tag with button styling
        </p>
        <Button
          as="a"
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
        >
          Visit Example.com
        </Button>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>
          Multiple variants
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button as="a" href="#" variant="primary">Primary Link</Button>
          <Button as="a" href="#" variant="outline">Outline Link</Button>
          <Button as="a" href="#" variant="ghost">Ghost Link</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>
          With icon
        </h3>
        <Button
          as="a"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </Button>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>
          Icon-only link
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          Icon-only buttons work as links too
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button
            as="a"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            iconOnly
            aria-label="View on GitHub"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Button>
          <Button
            as="a"
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            iconOnly
            aria-label="View on Twitter"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </Button>
          <Button
            as="a"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            iconOnly
            aria-label="View on LinkedIn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Loading Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" loading>Primary Loading</Button>
          <Button variant="outline" loading>Outline Loading</Button>
          <Button variant="ghost" loading>Ghost Loading</Button>
          <Button variant="destructive" loading>Destructive Loading</Button>
          <Button variant="warning" loading>Warning Loading</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Loading Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm" loading>Small Loading</Button>
          <Button variant="primary" size="md" loading>Medium Loading</Button>
          <Button variant="primary" size="lg" loading>Large Loading</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Loading Icon-Only Buttons</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm" iconOnly loading aria-label="Loading">
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
          </Button>
          <Button variant="primary" size="md" iconOnly loading aria-label="Loading">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </Button>
          <Button variant="primary" size="lg" iconOnly loading aria-label="Loading">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Loading with Full Width</h3>
        <div style={{ width: '300px' }}>
          <Button variant="primary" fullWidth loading>Full Width Loading</Button>
        </div>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
    children: 'Loading Button',
  },
};

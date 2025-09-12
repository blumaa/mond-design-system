import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Spinner } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Spinner 
      size="md" 
      label="Loading content..." 
    />
  );
}
\`\`\`

A loading indicator component with customizable size and color options. Provides accessible loading states with proper ARIA attributes.

**Key Features:**
- 🎯 Five sizes (xs, sm, md, lg, xl) for different contexts
- 🎨 Custom color support with theme-aware defaults
- ♿ Built-in accessibility with screen reader labels
- 🌙 Automatic dark mode support
- ⚡ Smooth spinning animation
- 🔄 Perfect for loading states and async operations
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the spinner',
    },
    color: {
      control: 'color',
      description: 'Custom color for the spinner. If not provided, uses theme-based color.',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="xs" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>XS</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="sm" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>SM</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="md" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>MD</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="lg" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>LG</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="xl" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>XL</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners available in five different sizes: xs (1rem), sm (1.25rem), md (1.5rem), lg (2rem), and xl (2.5rem).',
      },
    },
  },
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner color="#ef4444" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Red</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner color="#22c55e" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Green</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner color="#f59e0b" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Amber</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner color="#8b5cf6" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Purple</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners can use any custom color value.',
      },
    },
  },
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#ffffff', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <Spinner  />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#374151' }}>
          Light Theme
        </div>
      </div>
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#1f2937', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <Spinner  />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#d1d5db' }}>
          Dark Theme
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners automatically adapt to light and dark themes with appropriate color values.',
      },
    },
  },
};

export const WithCustomLabel: Story = {
  args: {
    label: 'Processing your request...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Spinners include accessible labels for screen readers. The label is visually hidden but announced by assistive technologies.',
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <div style={{ 
        padding: '16px', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Spinner size="sm" />
        <span>Loading your data...</span>
      </div>
      
      <div style={{ 
        padding: '24px', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <Spinner size="lg" label="Uploading file..." />
        <div style={{ marginTop: '16px', color: '#6b7280' }}>
          Uploading file...
        </div>
      </div>
      
      <button 
        style={{
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'not-allowed',
          opacity: 0.7
        }}
        disabled
      >
        <Spinner size="sm" color="white" />
        Processing...
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of how spinners can be used in different contexts: inline with text, centered in containers, and within buttons.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    size: 'md',
    isDarkMode: false,
    label: 'Loading...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different spinner configurations.',
      },
    },
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Tooltip } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Tooltip content="This explains what the button does" placement="top">
      <button>Hover me</button>
    </Tooltip>
  );
}
\`\`\`

A flexible tooltip component that provides contextual information on hover, focus, or click. Perfect for explaining UI elements, showing additional details, or providing helpful hints.

**Key Features:**
- 🎯 Four placement options (top, bottom, left, right)
- 🖱️ Multiple triggers (hover, focus, click)
- ⏱️ Configurable show/hide delays
- 📝 Rich content support (text, HTML, React components)  
- ♿ Full keyboard navigation and ARIA support
- 🚫 Disable functionality when needed
- 🌙 Dark mode support with proper contrast
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    trigger: {
      control: 'select',
      options: ['hover', 'focus', 'click'],
    },
    isDarkMode: {
      control: 'boolean',
    },
    delay: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
    content: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <button style={{ padding: '8px 16px' }}>Hover me</button>,
  },
};

export const Placements: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '60px',
      padding: '60px',
      alignItems: 'center',
      justifyItems: 'center'
    }}>
      <div></div>
      <Tooltip content="Top tooltip" placement="top">
        <button style={{ padding: '8px 16px' }}>Top</button>
      </Tooltip>
      <div></div>
      
      <Tooltip content="Left tooltip" placement="left">
        <button style={{ padding: '8px 16px' }}>Left</button>
      </Tooltip>
      <div></div>
      <Tooltip content="Right tooltip" placement="right">
        <button style={{ padding: '8px 16px' }}>Right</button>
      </Tooltip>
      
      <div></div>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <button style={{ padding: '8px 16px' }}>Bottom</button>
      </Tooltip>
      <div></div>
    </div>
  ),
};

export const Triggers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}>
      <Tooltip content="Hover to see this tooltip" trigger="hover">
        <button style={{ padding: '8px 16px' }}>Hover</button>
      </Tooltip>
      
      <Tooltip content="Focus to see this tooltip" trigger="focus">
        <button style={{ padding: '8px 16px' }}>Focus</button>
      </Tooltip>
      
      <Tooltip content="Click to toggle this tooltip" trigger="click">
        <button style={{ padding: '8px 16px' }}>Click</button>
      </Tooltip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '2rem' }}>
      <Tooltip content="This is helpful information">
        <button style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          border: '1px solid #cbd5e1',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          ℹ️
        </button>
      </Tooltip>
      
      <Tooltip content="Warning: This action cannot be undone">
        <button style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          border: '1px solid #fbbf24',
          backgroundColor: '#fef3c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          ⚠️
        </button>
      </Tooltip>
      
      <Tooltip content="Error: Something went wrong">
        <button style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          border: '1px solid #f87171',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          ❌
        </button>
      </Tooltip>
    </div>
  ),
};

export const WithComplexContent: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <Tooltip 
        content={
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>User Profile</div>
            <div style={{ fontSize: '0.75rem', color: 'inherit', opacity: 0.8 }}>
              Click to view details
            </div>
          </div>
        }
        trigger="hover"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            JD
          </div>
          <span>John Doe</span>
        </div>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}>
      <Tooltip content="This tooltip works" disabled={false}>
        <button style={{ padding: '8px 16px' }}>Enabled</button>
      </Tooltip>
      
      <Tooltip content="This tooltip is disabled" disabled={true}>
        <button style={{ padding: '8px 16px', opacity: 0.5 }}>Disabled</button>
      </Tooltip>
    </div>
  ),
};

export const DelayDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}>
      <Tooltip content="No delay" delay={0}>
        <button style={{ padding: '8px 16px' }}>No delay</button>
      </Tooltip>
      
      <Tooltip content="Short delay (300ms)" delay={300}>
        <button style={{ padding: '8px 16px' }}>300ms delay</button>
      </Tooltip>
      
      <Tooltip content="Long delay (800ms)" delay={800}>
        <button style={{ padding: '8px 16px' }}>800ms delay</button>
      </Tooltip>
    </div>
  ),
};

export const WithFormElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label htmlFor="username">Username</label>
        <Tooltip content="Username must be at least 3 characters long" trigger="focus">
          <input 
            id="username"
            type="text" 
            placeholder="Enter username"
            style={{
              padding: '8px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
            }}
          />
        </Tooltip>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label htmlFor="email">Email</label>
        <Tooltip content="We'll never share your email address" trigger="hover">
          <input 
            id="email"
            type="email" 
            placeholder="Enter email"
            style={{
              padding: '8px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
            }}
          />
        </Tooltip>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Tooltip content="Password must contain at least 8 characters, one uppercase letter, and one number">
          <label htmlFor="password">Password ℹ️</label>
        </Tooltip>
        <input 
          id="password"
          type="password" 
          placeholder="Enter password"
          style={{
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    content: 'Dark mode tooltip',
    children: <button style={{ padding: '8px 16px' }}>Hover me</button>,
  },
  parameters: {
    theme: 'dark',
  },
};
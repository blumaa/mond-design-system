import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

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
import { Tooltip, Button } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Tooltip content="This explains what the button does" placement="top">
      <Button>Hover me</Button>
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
    children: <Button>Hover me</Button>,
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
        <Button>Top</Button>
      </Tooltip>
      <div></div>
      
      <Tooltip content="Left tooltip" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <div></div>
      <Tooltip content="Right tooltip" placement="right">
        <Button>Right</Button>
      </Tooltip>
      
      <div></div>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <div></div>
    </div>
  ),
};

export const Triggers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}>
      <Tooltip content="Hover to see this tooltip" trigger="hover">
        <Button>Hover</Button>
      </Tooltip>
      
      <Tooltip content="Focus to see this tooltip" trigger="focus">
        <Button>Focus</Button>
      </Tooltip>
      
      <Tooltip content="Click to toggle this tooltip" trigger="click">
        <Button>Click</Button>
      </Tooltip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '2rem' }}>
      <Tooltip content="This is helpful information">
        <Button variant="outline" size="sm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: '4px' }}>
          ℹ️
        </Button>
      </Tooltip>
      
      <Tooltip content="Warning: This action cannot be undone">
        <Button variant="outline" size="sm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: '4px' }}>
          ⚠️
        </Button>
      </Tooltip>
      
      <Tooltip content="Error: Something went wrong">
        <Button variant="outline" size="sm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: '4px' }}>
          ❌
        </Button>
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
        <Button>Enabled</Button>
      </Tooltip>
      
      <Tooltip content="This tooltip is disabled" disabled={true}>
        <Button disabled>Disabled</Button>
      </Tooltip>
    </div>
  ),
};

export const DelayDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}>
      <Tooltip content="No delay" delay={0}>
        <Button>No delay</Button>
      </Tooltip>
      
      <Tooltip content="Short delay (300ms)" delay={300}>
        <Button>300ms delay</Button>
      </Tooltip>
      
      <Tooltip content="Long delay (800ms)" delay={800}>
        <Button>800ms delay</Button>
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
    children: <Button>Hover me</Button>,
  },
  parameters: {
    theme: 'dark',
  },
};
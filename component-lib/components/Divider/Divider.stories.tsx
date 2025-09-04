import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A visual separator component that can be horizontal or vertical, with optional text content. Supports different visual variants and automatic theme adaptation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the divider',
    },
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'strong'],
      description: 'Visual variant affecting border color intensity',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Thickness of the divider line',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    children: {
      control: 'text',
      description: 'Optional text content to display in the center',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Orientations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Horizontal</h4>
        <p style={{ margin: '0 0 8px 0' }}>Content above divider</p>
        <Divider />
        <p style={{ margin: '8px 0 0 0' }}>Content below divider</p>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Vertical</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          <span>Left content</span>
          <Divider orientation="vertical" style={{ height: '40px' }} />
          <span>Right content</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dividers can be oriented horizontally (default) or vertically for different layout needs.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Subtle</h4>
        <Divider variant="subtle" />
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Default</h4>
        <Divider variant="default" />
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Strong</h4>
        <Divider variant="strong" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Three visual variants provide different levels of visual emphasis: subtle, default, and strong.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Small (1px)</h4>
        <Divider size="sm" />
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Medium (1px)</h4>
        <Divider size="md" />
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Large (2px)</h4>
        <Divider size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes control the thickness of the divider line.',
      },
    },
  },
};

export const WithText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '400px' }}>
      <div>
        <p style={{ margin: '0 0 16px 0', textAlign: 'center' }}>Create your account</p>
        <Divider>OR</Divider>
        <p style={{ margin: '16px 0 0 0', textAlign: 'center' }}>Sign in with existing account</p>
      </div>
      
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Section A</h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
          Content for the first section
        </p>
        
        <Divider variant="subtle" my="6">Section B</Divider>
        
        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
          Content for the second section
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dividers can include text content, commonly used for "OR" separators or section labels.',
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
        border: '1px solid #e5e7eb',
        minWidth: '200px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>Light Theme</h4>
        <Divider variant="subtle" isDarkMode={false} />
        <div style={{ margin: '16px 0' }}>
          <Divider isDarkMode={false}>OR</Divider>
        </div>
        <Divider variant="strong" isDarkMode={false} />
      </div>
      
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#1f2937', 
        borderRadius: '8px',
        color: '#f9fafb',
        minWidth: '200px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#f9fafb' }}>Dark Theme</h4>
        <Divider variant="subtle" isDarkMode={true} />
        <div style={{ margin: '16px 0' }}>
          <Divider isDarkMode={true}>OR</Divider>
        </div>
        <Divider variant="strong" isDarkMode={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dividers automatically adapt to light and dark themes with appropriate color adjustments.',
      },
    },
  },
};

export const VerticalInForms: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0',
      padding: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      maxWidth: '400px'
    }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Sign In
        </button>
      </div>
      
      <Divider 
        orientation="vertical" 
        mx="4" 
        style={{ height: '48px' }} 
      />
      
      <div style={{ flex: 1, textAlign: 'center' }}>
        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'transparent',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Register
        </button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical dividers are useful for separating related actions or content side-by-side.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'default',
    size: 'md',
    isDarkMode: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different divider configurations.',
      },
    },
  },
};
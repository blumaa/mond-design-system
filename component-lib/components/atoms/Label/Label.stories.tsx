import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Label } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <>
      <Label htmlFor="email" required>
        Email Address
      </Label>
      <input 
        id="email" 
        type="email" 
        placeholder="Enter your email" 
      />
    </>
  );
}
\`\`\`

A form label component with support for required indicators, semantic variants, and accessibility features. Commonly used with form inputs and controls.

**Key Features:**
- 📝 Semantic HTML label elements with proper association
- ⭐ Required indicator support with customization
- 📏 Three sizes (sm, md, lg) to match form controls
- 🎨 Semantic variants (default, error, success)
- 🔤 Font weight options (normal, medium, semibold)
- ♿ Full accessibility with proper focus management
- 🌙 Dark mode support
- 🚫 Disabled state styling
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The label content',
    },
    htmlFor: {
      control: 'text',
      description: 'The ID of the form control this label is associated with',
    },
    required: {
      control: 'boolean',
      description: 'Whether to show a required indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the label should appear disabled',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting font size and line height',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold'],
      description: 'Font weight variant',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    semantic: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Semantic variant affecting text color',
    },
    requiredIndicator: {
      control: 'text',
      description: 'Custom required indicator text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Username',
  },
};

export const Required: Story = {
  args: {
    children: 'Email Address',
    required: true,
    htmlFor: 'email',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <Label size="sm">Small Label</Label>
        <input 
          type="text" 
          placeholder="Small input"
          style={{ 
            padding: '6px 8px', 
            fontSize: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            width: '200px'
          }}
        />
      </div>
      
      <div>
        <Label size="md">Medium Label</Label>
        <input 
          type="text" 
          placeholder="Medium input"
          style={{ 
            padding: '8px 12px', 
            fontSize: '0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            width: '200px'
          }}
        />
      </div>
      
      <div>
        <Label size="lg">Large Label</Label>
        <input 
          type="text" 
          placeholder="Large input"
          style={{ 
            padding: '12px 16px', 
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            width: '200px'
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels come in three sizes: small, medium (default), and large, to match different input sizes.',
      },
    },
  },
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Label weight="normal">Normal Weight</Label>
      <Label weight="medium">Medium Weight (default)</Label>
      <Label weight="semibold">Semibold Weight</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different font weights can be used to adjust the visual hierarchy of labels.',
      },
    },
  },
};

export const SemanticVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '300px' }}>
      <div>
        <Label semantic="default" htmlFor="default-input">Default Label</Label>
        <input 
          id="default-input"
          type="text" 
          placeholder="Enter text"
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            width: '100%',
            marginTop: '4px'
          }}
        />
      </div>
      
      <div>
        <Label semantic="error" htmlFor="error-input" required>Email with Error</Label>
        <input 
          id="error-input"
          type="email" 
          placeholder="Enter email"
          style={{ 
            padding: '8px 12px', 
            border: '2px solid #ef4444',
            borderRadius: '6px',
            width: '100%',
            marginTop: '4px'
          }}
        />
        <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
          Please enter a valid email address
        </div>
      </div>
      
      <div>
        <Label semantic="success" htmlFor="success-input">Verified Email</Label>
        <input 
          id="success-input"
          type="email" 
          value="user@example.com"
          readOnly
          style={{ 
            padding: '8px 12px', 
            border: '2px solid #22c55e',
            borderRadius: '6px',
            width: '100%',
            marginTop: '4px',
            backgroundColor: '#f0fdf4'
          }}
        />
        <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px' }}>
          Email verified successfully
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic variants provide visual feedback: default (neutral), error (red), and success (green).',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
      <div>
        <Label disabled htmlFor="disabled-input">Disabled Field</Label>
        <input 
          id="disabled-input"
          type="text" 
          placeholder="Cannot edit"
          disabled
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            width: '100%',
            marginTop: '4px',
            opacity: 0.6,
            cursor: 'not-allowed'
          }}
        />
      </div>
      
      <div>
        <Label disabled required htmlFor="disabled-required">Required but Disabled</Label>
        <input 
          id="disabled-required"
          type="text" 
          placeholder="Cannot edit"
          disabled
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            width: '100%',
            marginTop: '4px',
            opacity: 0.6,
            cursor: 'not-allowed'
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels can be disabled to match the state of their associated form controls.',
      },
    },
  },
};

export const CustomRequiredIndicator: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Label required requiredIndicator="*">Default Asterisk</Label>
      <Label required requiredIndicator="(required)">Text Indicator</Label>
      <Label required requiredIndicator="•">Bullet Point</Label>
      <Label required requiredIndicator="">No Indicator</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The required indicator can be customized or removed entirely.',
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
        minWidth: '250px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>Light Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Label isDarkMode={false}>Default Label</Label>
          <Label isDarkMode={false} semantic="error" required>Error Label</Label>
          <Label isDarkMode={false} semantic="success">Success Label</Label>
          <Label isDarkMode={false} disabled>Disabled Label</Label>
        </div>
      </div>
      
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#1f2937', 
        borderRadius: '8px',
        color: '#f9fafb',
        minWidth: '250px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#f9fafb' }}>Dark Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Label isDarkMode={true}>Default Label</Label>
          <Label isDarkMode={true} semantic="error" required>Error Label</Label>
          <Label isDarkMode={true} semantic="success">Success Label</Label>
          <Label isDarkMode={true} disabled>Disabled Label</Label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels automatically adapt to light and dark themes with appropriate color adjustments.',
      },
    },
  },
};

export const FormExamples: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <Label htmlFor="username" required>Username</Label>
          <input 
            id="username"
            type="text" 
            placeholder="Enter your username"
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              width: '100%'
            }}
          />
        </div>
        
        <div>
          <Label htmlFor="email" required semantic="error">Email Address</Label>
          <input 
            id="email"
            type="email" 
            placeholder="Enter your email"
            style={{ 
              padding: '8px 12px', 
              border: '2px solid #ef4444',
              borderRadius: '6px',
              width: '100%'
            }}
          />
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
            This field is required
          </div>
        </div>
        
        <div>
          <Label htmlFor="bio" size="sm">Bio (optional)</Label>
          <textarea 
            id="bio"
            placeholder="Tell us about yourself"
            rows={3}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              width: '100%',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" id="terms" />
          <Label htmlFor="terms" size="sm" style={{ marginBottom: 0 }}>
            I agree to the terms and conditions
          </Label>
        </div>
      </form>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples showing labels used in various form contexts.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Form Label',
    required: false,
    disabled: false,
    size: 'md',
    weight: 'medium',
    isDarkMode: false,
    semantic: 'default',
    requiredIndicator: '*',
    htmlFor: 'playground-input',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different label configurations.',
      },
    },
  },
};
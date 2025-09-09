import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { useState } from 'react';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { FormField } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <FormField
      label="Email Address"
      required
      helpText="We'll never share your email with anyone else"
    >
      <input
        type="email"
        placeholder="Enter your email"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px'
        }}
      />
    </FormField>
  );
}
\`\`\`

A comprehensive form field wrapper that provides labels, validation, help text, and accessibility features for any form control. Automatically manages ARIA attributes and field associations.

**Key Features:**
- 📝 Automatic label association with form controls
- ⭐ Required field indicators with proper ARIA labels
- ⚠️ Error message display with alert role
- 💡 Help text support for additional context
- ♿ Full accessibility with proper ARIA attributes
- 🔗 Automatic field ID generation and linking
- 🌙 Dark mode support
- 🎯 Works with any form control (input, select, textarea, etc.)
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label text',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helpText: {
      control: 'text',
      description: 'Help text to display below the field',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    children: {
      control: false,
      description: 'Form control element (input, select, textarea, etc.)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    children: (
      <input
        type="email"
        placeholder="Enter your email"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
    ),
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    required: true,
    children: (
      <input
        type="password"
        placeholder="Enter your password"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
    ),
  },
};

export const WithHelpText: Story = {
  args: {
    label: 'Username',
    helpText: 'Must be at least 3 characters long and contain only letters, numbers, and underscores',
    children: (
      <input
        type="text"
        placeholder="Enter username"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
    ),
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    required: true,
    error: 'Please enter a valid email address',
    children: (
      <input
        type="email"
        value="invalid-email"
        placeholder="Enter your email"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '2px solid #ef4444',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: '#fef2f2',
        }}
      />
    ),
  },
};

export const WithSelectField: Story = {
  args: {
    label: 'Country',
    required: true,
    helpText: 'Select your country of residence',
    children: (
      <select
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: 'white',
        }}
      >
        <option value="">Select a country</option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
        <option value="au">Australia</option>
      </select>
    ),
  },
};

export const WithTextarea: Story = {
  args: {
    label: 'Message',
    helpText: 'Please provide as much detail as possible',
    children: (
      <textarea
        placeholder="Enter your message"
        rows={4}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
    ),
  },
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      newsletter: false,
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.country) {
        newErrors.country = 'Please select your country';
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length === 0) {
        alert('Form submitted successfully!');
      }
    };
    
    const handleChange = (field: string, value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
    
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormField
          label="Email Address"
          required
          error={errors.email}
          helpText={!errors.email ? "We'll never share your email with anyone else" : undefined}
        >
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: errors.email ? '#fef2f2' : 'white',
            }}
          />
        </FormField>
        
        <FormField
          label="Password"
          required
          error={errors.password}
          helpText={!errors.password ? "Must be at least 8 characters long" : undefined}
        >
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: errors.password ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: errors.password ? '#fef2f2' : 'white',
            }}
          />
        </FormField>
        
        <FormField
          label="Confirm Password"
          required
          error={errors.confirmPassword}
        >
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: errors.confirmPassword ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: errors.confirmPassword ? '#fef2f2' : 'white',
            }}
          />
        </FormField>
        
        <FormField
          label="Country"
          required
          error={errors.country}
          helpText={!errors.country ? "Select your country of residence" : undefined}
        >
          <select
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: errors.country ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: errors.country ? '#fef2f2' : 'white',
            }}
          >
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="au">Australia</option>
          </select>
        </FormField>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="newsletter"
            checked={formData.newsletter}
            onChange={(e) => handleChange('newsletter', e.target.checked)}
          />
          <label htmlFor="newsletter" style={{ fontSize: '14px' }}>
            Subscribe to newsletter
          </label>
        </div>
        
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Create Account
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete form example showing FormField used with validation, error handling, and different input types.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Dark Mode Field',
    required: true,
    helpText: 'This is how the field looks in dark mode',
    isDarkMode: true,
    children: (
      <input
        type="text"
        placeholder="Enter some text"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #4b5563',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: '#1f2937',
          color: '#f9fafb',
        }}
      />
    ),
  },
  parameters: {
    theme: 'dark',
  },
};

export const AccessibilityExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        This example shows the accessibility features of FormField:
      </p>
      <ul style={{ fontSize: '14px', color: '#6b7280', paddingLeft: '20px' }}>
        <li>Automatic label association with form controls</li>
        <li>ARIA attributes for screen readers</li>
        <li>Error messages announced as alerts</li>
        <li>Help text linked via aria-describedby</li>
        <li>Required field indicators with proper labels</li>
      </ul>
      
      <FormField
        label="Accessible Email Field"
        required
        helpText="Your email will be used to send you important updates"
        error="This field demonstrates error announcement"
      >
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '2px solid #ef4444',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#fef2f2',
          }}
        />
      </FormField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the accessibility features built into FormField component.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    label: 'Form Field',
    required: false,
    helpText: 'This is help text',
    isDarkMode: false,
    children: (
      <input
        type="text"
        placeholder="Enter text"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different FormField configurations.',
      },
    },
  },
};
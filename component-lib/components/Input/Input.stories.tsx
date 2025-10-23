import type { Meta, StoryObj } from '@storybook/react';
import { useGlobals } from 'storybook/internal/preview-api';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Input } from '@mond-design-system/theme';

function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      label="Email"
      placeholder="Enter your email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
\`\`\`

A flexible input component with built-in validation states, helper text, and full accessibility support. Perfect for forms, search fields, and data entry.

**Key Features:**
- 🎯 Multiple variants (default, error, success)
- 📏 Three sizes (sm, md, lg)
- 📝 Built-in label and helper text support
- ⚠️ Error and success state handling
- ♿ Full keyboard navigation and ARIA support
- 🔒 Password field support with type="password"
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    inputSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
    },
    label: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    error: {
      control: { type: 'text' },
    },
    success: {
      control: { type: 'text' },
    },
    helperText: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  decorators: [
    (Story) => {
      const [globals] = useGlobals();
      const isDark = globals.backgrounds?.value === '#333333' || globals.theme === 'dark';

      return (
        <div
          data-theme={isDark ? 'dark' : 'light'}
          style={{
            padding: '3rem',
            backgroundColor: isDark ? '#27374D' : '#F2F3F4',
            borderRadius: '8px',
            minWidth: '300px',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    inputSize: 'md',
    variant: 'default',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helperText: 'Must be at least 3 characters long',
    inputSize: 'md',
    variant: 'default',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    variant: 'error',
    error: 'Please enter a valid email address',
    inputSize: 'md',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    value: 'john_doe',
    variant: 'success',
    success: 'Username is available!',
    inputSize: 'md',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input {...args} inputSize="sm" label="Small" placeholder="Small input" />
      <Input {...args} inputSize="md" label="Medium" placeholder="Medium input" />
      <Input {...args} inputSize="lg" label="Large" placeholder="Large input" />
    </div>
  ),
  args: {
    variant: 'default',
  },
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input {...args} label="Default" placeholder="Default state" variant="default" />
      <Input {...args} label="Error" placeholder="Error state" variant="error" error="This field is required" />
      <Input {...args} label="Success" placeholder="Success state" variant="success" success="Looks good!" />
      <Input {...args} label="Disabled" placeholder="Disabled state" disabled />
    </div>
  ),
  args: {
    inputSize: 'md',
  },
};

export const PasswordField: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters',
    inputSize: 'md',
    variant: 'default',
  },
};


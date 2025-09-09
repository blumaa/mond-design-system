import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Textarea } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <Textarea
      label="Message"
      placeholder="Enter your message..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rows={4}
    />
  );
}
\`\`\`

A flexible textarea component for multi-line text input. Perfect for comments, descriptions, feedback forms, and any content that requires multiple lines.

**Key Features:**
- 📝 Multi-line text input with auto-resize capabilities
- 📏 Three sizes (sm, md, lg) for different contexts
- 📐 Customizable rows for height control
- 📋 Built-in label, helper text, and placeholder support
- ⚠️ Success and error state handling for validation
- ♿ Full keyboard navigation and accessibility
- 🎨 Consistent styling with other form components
- 🌙 Dark mode support
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    textareaSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    isDarkMode: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    label: 'Message',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    helperText: 'Provide a detailed description',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Textarea textareaSize="sm" label="Small" placeholder="Small textarea..." />
      <Textarea textareaSize="md" label="Medium" placeholder="Medium textarea..." />
      <Textarea textareaSize="lg" label="Large" placeholder="Large textarea..." />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Textarea variant="default" label="Default" placeholder="Default textarea..." />
      <Textarea variant="success" label="Success" placeholder="Success textarea..." success="Looks good!" />
      <Textarea variant="error" label="Error" placeholder="Error textarea..." error="This field is required" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    label: 'Dark Mode Textarea',
    placeholder: 'Enter text in dark mode...',
    helperText: 'This is how it looks in dark mode',
  },
  parameters: {
    theme: 'dark',
  },
};

export const CustomRows: Story = {
  args: {
    label: 'Custom Height',
    placeholder: 'This textarea has 8 rows...',
    rows: 8,
    helperText: 'Adjusted to 8 rows for more content',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Textarea',
    placeholder: 'This is disabled...',
    disabled: true,
    helperText: 'This textarea is disabled',
  },
};
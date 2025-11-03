import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';
import { useState } from 'react';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Radio } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [selected, setSelected] = useState('option1');
  
  return (
    <div>
      <Radio 
        label="Option 1"
        name="choice"
        value="option1"
        checked={selected === 'option1'}
        onChange={(e) => setSelected(e.target.value)}
      />
      <Radio 
        label="Option 2"
        name="choice"
        value="option2"
        checked={selected === 'option2'}
        onChange={(e) => setSelected(e.target.value)}
      />
    </div>
  );
}
\`\`\`

A radio button component for single-choice selections within a group. Essential for forms, surveys, and any interface requiring mutually exclusive options.

**Key Features:**
- ⚪ Classic radio button styling with smooth transitions
- 📏 Three sizes (sm, md, lg) for different contexts
- 📝 Built-in label and helper text support
- ⚠️ Error state handling for validation
- ♿ Full keyboard navigation and ARIA support
- 👥 Proper grouping behavior with name attribute
- 🌙 Dark mode support
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Option 1',
    name: 'default-radio',
  },
};

export const Checked: Story = {
  args: {
    label: 'Selected option',
    checked: true,
    name: 'checked-radio',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Radio size="sm" label="Small radio" name="size-demo" />
      <Radio size="md" label="Medium radio" name="size-demo" />
      <Radio size="lg" label="Large radio" name="size-demo" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Radio label="Unchecked" name="states-demo" />
      <Radio label="Checked" name="states-demo" checked />
      <Radio label="Disabled" name="states-demo" disabled />
      <Radio label="Disabled checked" name="states-demo" disabled checked />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Required selection',
    error: 'Please select an option',
    name: 'error-radio',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email notifications',
    helperText: 'Receive updates via email',
    name: 'helper-radio',
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Dark mode radio',
    helperText: 'This is how it looks in dark mode',
    name: 'dark-radio',
  },
  parameters: {
    theme: 'dark',
  },
};

export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('option1');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Choose a plan:</div>
        <Radio 
          label="Basic Plan - $10/month" 
          name="plan"
          value="basic"
          checked={selected === 'basic'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio 
          label="Pro Plan - $25/month" 
          name="plan"
          value="pro"
          checked={selected === 'pro'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio 
          label="Enterprise Plan - $50/month" 
          name="plan"
          value="enterprise"
          checked={selected === 'enterprise'}
          onChange={(e) => setSelected(e.target.value)}
        />
      </div>
    );
  },
};

export const CompactGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('medium');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Size:</div>
        <Radio 
          size="sm"
          label="Small" 
          name="size"
          value="small"
          checked={selected === 'small'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio 
          size="sm"
          label="Medium" 
          name="size"
          value="medium"
          checked={selected === 'medium'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio 
          size="sm"
          label="Large" 
          name="size"
          value="large"
          checked={selected === 'large'}
          onChange={(e) => setSelected(e.target.value)}
        />
      </div>
    );
  },
};
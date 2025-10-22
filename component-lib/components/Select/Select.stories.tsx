import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectOption } from './Select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Select } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState('');
  
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
  
  return (
    <Select
      label="Choose an option"
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Select..."
    />
  );
}
\`\`\`

A dropdown select component for choosing from predefined options. Perfect for forms, filters, and any interface requiring selection from a list of choices.

**Key Features:**
- 📋 Clean dropdown interface with search/filter capability
- 📏 Three sizes (sm, md, lg) for different contexts
- 📝 Built-in label, helper text, and placeholder support
- ⚠️ Success and error state handling
- 🚫 Individual option disable support
- ♿ Full keyboard navigation and ARIA support
- 🎨 Custom styling for options and states
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
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const countryOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
];

const optionsWithDisabled: SelectOption[] = [
  { value: 'available', label: 'Available Option' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
  { value: 'another', label: 'Another Available' },
  { value: 'also-disabled', label: 'Also Disabled', disabled: true },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select 
        options={basicOptions}
        value={value}
        onChange={setValue}
        placeholder="Choose an option"
      />
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select 
        label="Country"
        options={countryOptions}
        value={value}
        onChange={setValue}
        placeholder="Select your country"
        helperText="This will be used for shipping"
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [small, setSmall] = useState('');
    const [medium, setMedium] = useState('option2');
    const [large, setLarge] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <Select 
          size="sm" 
          label="Small" 
          options={basicOptions}
          value={small}
          onChange={setSmall}
        />
        <Select 
          size="md" 
          label="Medium" 
          options={basicOptions}
          value={medium}
          onChange={setMedium}
        />
        <Select 
          size="lg" 
          label="Large" 
          options={basicOptions}
          value={large}
          onChange={setLarge}
        />
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => {
    const [defaultVal, setDefaultVal] = useState('');
    const [successVal, setSuccessVal] = useState('option1');
    const [errorVal, setErrorVal] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <Select 
          variant="default"
          label="Default"
          options={basicOptions}
          value={defaultVal}
          onChange={setDefaultVal}
        />
        <Select 
          variant="success"
          label="Success"
          options={basicOptions}
          value={successVal}
          onChange={setSuccessVal}
          success="Great choice!"
        />
        <Select 
          variant="error"
          label="Error"
          options={basicOptions}
          value={errorVal}
          onChange={setErrorVal}
          error="Please select an option"
        />
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select 
        label="Status"
        options={optionsWithDisabled}
        value={value}
        onChange={setValue}
        placeholder="Select status"
        helperText="Some options may be unavailable"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Select 
        label="Disabled Select"
        options={basicOptions}
        value="option1"
        disabled
        helperText="This select is disabled"
      />
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    const [value, setValue] = useState('ca');
    return (
      <Select 
        label="Country"
        options={countryOptions}
        value={value}
        onChange={setValue}
        helperText="Select your country"
      />
    );
  },
  parameters: {
    theme: 'dark',
  },
};

export const LongList: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const longOptions: SelectOption[] = Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `Option ${i + 1} - This is a longer label to test overflow`,
    }));

    return (
      <Select 
        label="Long List"
        options={longOptions}
        value={value}
        onChange={setValue}
        placeholder="Select from many options"
        helperText="This list has many options with a scrollable dropdown"
      />
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [selectedCountry, setSelectedCountry] = useState('us');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <Select 
          label="Select Country"
          options={countryOptions}
          value={selectedCountry}
          onChange={setSelectedCountry}
        />
        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Selected:</strong> {selectedCountry || 'None'}
        </div>
        <button onClick={() => setSelectedCountry('')}>
          Clear Selection
        </button>
      </div>
    );
  },
};
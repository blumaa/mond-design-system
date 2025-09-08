import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDarkMode: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
    indeterminate: {
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
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox 
        label="This is checked" 
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
      setIndeterminate(false);
    };
    
    return (
      <Checkbox 
        label="Partially selected" 
        checked={checked}
        indeterminate={indeterminate}
        onChange={handleChange}
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [states, setStates] = useState({ sm: false, md: false, lg: false });
    
    const handleChange = (size: 'sm' | 'md' | 'lg') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setStates(prev => ({ ...prev, [size]: e.target.checked }));
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox size="sm" label="Small checkbox" checked={states.sm} onChange={handleChange('sm')} />
        <Checkbox size="md" label="Medium checkbox" checked={states.md} onChange={handleChange('md')} />
        <Checkbox size="lg" label="Large checkbox" checked={states.lg} onChange={handleChange('lg')} />
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    const [states, setStates] = useState({
      unchecked: false,
      checked: true,
      indeterminate: false,
    });
    
    const handleChange = (key: keyof typeof states) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setStates(prev => ({ ...prev, [key]: e.target.checked }));
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox label="Unchecked" checked={states.unchecked} onChange={handleChange('unchecked')} />
        <Checkbox label="Checked" checked={states.checked} onChange={handleChange('checked')} />
        <Checkbox label="Indeterminate" checked={states.indeterminate} indeterminate onChange={handleChange('indeterminate')} />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled checked readOnly />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: 'You must agree to continue',
    error: 'This field is required',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Subscribe to newsletter',
    helperText: 'Get weekly updates about new features',
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Dark mode checkbox',
    helperText: 'This is how it looks in dark mode',
  },
  parameters: {
    theme: 'dark',
  },
};

export const Group: Story = {
  render: () => {
    const [interests, setInterests] = useState({
      technology: false,
      design: true,
      business: false,
      science: false,
      sports: false,
    });
    
    const handleChange = (key: keyof typeof interests) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setInterests(prev => ({ ...prev, [key]: e.target.checked }));
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Select your interests:</div>
        <Checkbox label="Technology" checked={interests.technology} onChange={handleChange('technology')} />
        <Checkbox label="Design" checked={interests.design} onChange={handleChange('design')} />
        <Checkbox label="Business" checked={interests.business} onChange={handleChange('business')} />
        <Checkbox label="Science" checked={interests.science} onChange={handleChange('science')} />
        <Checkbox label="Sports" checked={interests.sports} onChange={handleChange('sports')} />
      </div>
    );
  },
};
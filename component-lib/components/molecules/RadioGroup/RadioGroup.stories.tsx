import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Molecules/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    isDarkMode: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const paymentOptions = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank', label: 'Bank Transfer' },
];

const planOptions = [
  { value: 'free', label: 'Free Plan' },
  { value: 'pro', label: 'Pro Plan' },
  { value: 'enterprise', label: 'Enterprise Plan' },
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'critical', label: 'Critical Priority' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    
    return (
      <RadioGroup
        label="Choose your preference"
        options={basicOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <RadioGroup
      label="Uncontrolled radio group"
      defaultValue="option2"
      options={basicOptions}
      onChange={(value) => console.log('Selected:', value)}
    />
  ),
};

export const Orientations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', minWidth: '500px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Vertical (Default)</h3>
        <RadioGroup
          label="Payment Method"
          options={paymentOptions}
          orientation="vertical"
          defaultValue="credit"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Horizontal</h3>
        <RadioGroup
          label="Plan Type"
          options={planOptions}
          orientation="horizontal"
          defaultValue="pro"
        />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '300px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small</h3>
        <RadioGroup
          label="Small radios"
          size="sm"
          options={basicOptions}
          defaultValue="option1"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Medium (Default)</h3>
        <RadioGroup
          label="Medium radios"
          size="md"
          options={basicOptions}
          defaultValue="option2"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large</h3>
        <RadioGroup
          label="Large radios"
          size="lg"
          options={basicOptions}
          defaultValue="option3"
        />
      </div>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <RadioGroup
      label="Subscription Plan"
      helperText="You can upgrade or downgrade at any time"
      options={[
        { value: 'starter', label: 'Starter - $9/month' },
        { value: 'professional', label: 'Professional - $29/month' },
        { value: 'enterprise', label: 'Enterprise - $99/month' },
      ]}
      defaultValue="professional"
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <RadioGroup
      label="Required selection"
      error="Please select an option to continue"
      options={basicOptions}
    />
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '300px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>All Disabled</h3>
        <RadioGroup
          label="Disabled group"
          disabled
          options={basicOptions}
          defaultValue="option1"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Individual Options Disabled</h3>
        <RadioGroup
          label="Mixed availability"
          options={[
            { value: 'available1', label: 'Available option' },
            { value: 'disabled', label: 'Unavailable option', disabled: true },
            { value: 'available2', label: 'Another available' },
          ]}
          defaultValue="available1"
        />
      </div>
    </div>
  ),
};

export const ControlledExample: Story = {
  render: () => {
    const [selectedPlan, setSelectedPlan] = useState<string>('pro');
    
    const handleChange = (newValue: string) => {
      setSelectedPlan(newValue);
    };
    
    const planDetails = {
      free: 'Perfect for getting started',
      pro: 'Best for small teams and professionals',
      enterprise: 'Advanced features for large organizations',
    };
    
    return (
      <div style={{ minWidth: '400px' }}>
        <RadioGroup
          label="Choose your plan"
          value={selectedPlan}
          onChange={handleChange}
          options={[
            { value: 'free', label: 'Free Plan - $0/month' },
            { value: 'pro', label: 'Pro Plan - $29/month' },
            { value: 'enterprise', label: 'Enterprise Plan - $99/month' },
          ]}
        />
        
        {selectedPlan && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Selected:</strong> {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
            <br />
            <span style={{ color: '#666' }}>
              {planDetails[selectedPlan as keyof typeof planDetails]}
            </span>
          </div>
        )}
      </div>
    );
  },
};

export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      priority: 'medium',
      notification: 'email',
      privacy: 'public',
    });
    
    return (
      <form 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          minWidth: '400px',
          padding: '2rem',
          border: '1px solid #e0e0e0',
          borderRadius: '8px'
        }}
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Form submitted:', formData);
          alert('Check console for form data');
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Project Settings</h2>
        
        <RadioGroup
          name="priority"
          label="Task Priority"
          helperText="This affects how tasks are sorted and displayed"
          value={formData.priority}
          onChange={(priority) => setFormData(prev => ({ ...prev, priority }))}
          options={priorityOptions}
        />
        
        <RadioGroup
          name="notification"
          label="Notification Method"
          helperText="How should we notify you about updates?"
          value={formData.notification}
          onChange={(notification) => setFormData(prev => ({ ...prev, notification }))}
          options={[
            { value: 'email', label: 'Email notifications' },
            { value: 'sms', label: 'SMS notifications' },
            { value: 'push', label: 'Push notifications' },
            { value: 'none', label: 'No notifications' },
          ]}
          orientation="horizontal"
          size="sm"
        />
        
        <RadioGroup
          name="privacy"
          label="Project Visibility"
          value={formData.privacy}
          onChange={(privacy) => setFormData(prev => ({ ...prev, privacy }))}
          options={[
            { value: 'private', label: 'Private (Only you)' },
            { value: 'team', label: 'Team (Team members only)' },
            { value: 'public', label: 'Public (Anyone can view)' },
          ]}
        />
        
        <button 
          type="submit" 
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          Save Settings
        </button>
      </form>
    );
  },
};

export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', minWidth: '400px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>Survey Question</h3>
        <RadioGroup
          label="How would you rate your experience with our service?"
          options={[
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'average', label: 'Average' },
            { value: 'poor', label: 'Poor' },
            { value: 'terrible', label: 'Terrible' },
          ]}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>Payment Method</h3>
        <RadioGroup
          label="How would you like to pay?"
          orientation="horizontal"
          size="sm"
          options={paymentOptions}
          defaultValue="credit"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>Shipping Options</h3>
        <RadioGroup
          label="Delivery Speed"
          helperText="Estimated delivery times may vary based on location"
          options={[
            { value: 'standard', label: 'Standard Shipping (5-7 business days) - Free' },
            { value: 'express', label: 'Express Shipping (2-3 business days) - $9.99' },
            { value: 'overnight', label: 'Overnight Shipping (Next business day) - $19.99' },
          ]}
          defaultValue="standard"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>File Format</h3>
        <RadioGroup
          label="Export Format"
          orientation="horizontal"
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'docx', label: 'Word' },
            { value: 'xlsx', label: 'Excel' },
            { value: 'csv', label: 'CSV' },
          ]}
          defaultValue="pdf"
        />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div style={{
      backgroundColor: '#1a1a1a',
      padding: '2rem',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      minWidth: '400px'
    }}>
      <div>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '16px',
          fontWeight: 600,
          color: 'white'
        }}>
          Theme Preference
        </h3>
        <RadioGroup
          isDarkMode
          label="Choose your theme"
          helperText="This will be applied across your entire dashboard"
          options={[
            { value: 'light', label: 'Light Theme' },
            { value: 'dark', label: 'Dark Theme' },
            { value: 'system', label: 'System Default' },
          ]}
          defaultValue="dark"
        />
      </div>
      
      <div>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '16px',
          fontWeight: 600,
          color: 'white'
        }}>
          Notification Settings
        </h3>
        <RadioGroup
          isDarkMode
          label="Update Frequency"
          orientation="horizontal"
          size="sm"
          options={[
            { value: 'realtime', label: 'Real-time' },
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
          defaultValue="daily"
        />
      </div>
      
      <div>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '16px',
          fontWeight: 600,
          color: 'white'
        }}>
          Error State Example
        </h3>
        <RadioGroup
          isDarkMode
          label="Required Selection"
          error="Please select a deployment environment"
          options={[
            { value: 'development', label: 'Development' },
            { value: 'staging', label: 'Staging' },
            { value: 'production', label: 'Production' },
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export const Playground: Story = {
  args: {
    label: 'Select an option',
    options: planOptions,
    size: 'md',
    orientation: 'vertical',
    isDarkMode: false,
    disabled: false,
    helperText: '',
    error: '',
  },
  render: (args) => {
    const [value, setValue] = useState<string>('pro');
    
    return (
      <RadioGroup
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CheckboxGroup } from './CheckboxGroup';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Molecules/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { CheckboxGroup } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [selected, setSelected] = useState(['option1']);
  
  return (
    <CheckboxGroup
      label="Select your preferences"
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
      value={selected}
      onChange={setSelected}
    />
  );
}
\`\`\`

CheckboxGroup is a molecule component that displays a group of checkbox options, allowing users to select multiple choices from a list of alternatives. It provides comprehensive state management, validation, and accessibility features.

**Key Features:**
- ☑️ Multiple selection from options list
- 📏 Multiple size variants (sm, md, lg)
- 🔄 Horizontal and vertical orientations
- ✅ Built-in validation and error states
- ♿ Full accessibility support with ARIA attributes
- 🎨 Dark mode compatibility
- 🔧 Controlled and uncontrolled modes
- 💡 Helper text and error messaging
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

const skillOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

const featureOptions = [
  { value: 'notifications', label: 'Email notifications' },
  { value: 'analytics', label: 'Analytics tracking' },
  { value: 'newsletter', label: 'Newsletter subscription' },
  { value: 'updates', label: 'Product updates' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    
    return (
      <CheckboxGroup
        label="Select your preferences"
        options={basicOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <CheckboxGroup
      label="Uncontrolled checkbox group"
      defaultValue={['option2']}
      options={basicOptions}
      onChange={(values) => console.log('Selected:', values)}
    />
  ),
};

export const Orientations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', minWidth: '500px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Vertical (Default)</h3>
        <CheckboxGroup
          label="Choose your skills"
          options={skillOptions.slice(0, 4)}
          orientation="vertical"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Horizontal</h3>
        <CheckboxGroup
          label="Quick preferences"
          options={basicOptions}
          orientation="horizontal"
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
        <CheckboxGroup
          label="Small checkboxes"
          size="sm"
          options={basicOptions}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Medium (Default)</h3>
        <CheckboxGroup
          label="Medium checkboxes"
          size="md"
          options={basicOptions}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large</h3>
        <CheckboxGroup
          label="Large checkboxes"
          size="lg"
          options={basicOptions}
        />
      </div>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <CheckboxGroup
      label="Account preferences"
      helperText="You can change these settings later in your account"
      options={featureOptions}
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <CheckboxGroup
      label="Required selection"
      error="Please select at least one option"
      options={basicOptions}
    />
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '300px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>All Disabled</h3>
        <CheckboxGroup
          label="Disabled group"
          disabled
          options={basicOptions}
          defaultValue={['option1']}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Individual Options Disabled</h3>
        <CheckboxGroup
          label="Mixed state"
          options={[
            { value: 'available', label: 'Available option' },
            { value: 'disabled', label: 'Disabled option', disabled: true },
            { value: 'another', label: 'Another available' },
          ]}
        />
      </div>
    </div>
  ),
};

export const ControlledExample: Story = {
  render: () => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['javascript', 'react']);
    
    const handleChange = (newValues: string[]) => {
      setSelectedSkills(newValues);
    };
    
    return (
      <div style={{ minWidth: '300px' }}>
        <CheckboxGroup
          label="Technical skills"
          value={selectedSkills}
          onChange={handleChange}
          options={skillOptions}
        />
        
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Selected:</strong> {selectedSkills.length > 0 ? selectedSkills.join(', ') : 'None'}
        </div>
      </div>
    );
  },
};

export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      skills: [] as string[],
      preferences: [] as string[],
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
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>User Profile</h2>
        
        <CheckboxGroup
          name="skills"
          label="Programming Skills"
          helperText="Select all technologies you're proficient in"
          value={formData.skills}
          onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
          options={skillOptions}
        />
        
        <CheckboxGroup
          name="preferences"
          label="Communication Preferences"
          helperText="How would you like to hear from us?"
          value={formData.preferences}
          onChange={(preferences) => setFormData(prev => ({ ...prev, preferences }))}
          options={featureOptions}
          orientation="horizontal"
          size="sm"
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
          Save Profile
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
        <CheckboxGroup
          label="Which of the following best describes your role? (Select all that apply)"
          options={[
            { value: 'developer', label: 'Software Developer' },
            { value: 'designer', label: 'UI/UX Designer' },
            { value: 'manager', label: 'Product Manager' },
            { value: 'analyst', label: 'Business Analyst' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>E-commerce Filters</h3>
        <CheckboxGroup
          label="Product Categories"
          orientation="horizontal"
          size="sm"
          options={[
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' },
            { value: 'home', label: 'Home & Garden' },
            { value: 'sports', label: 'Sports' },
          ]}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>Account Settings</h3>
        <CheckboxGroup
          label="Privacy Settings"
          helperText="Control what information is visible to other users"
          options={[
            { value: 'profile', label: 'Show profile publicly' },
            { value: 'activity', label: 'Show activity status' },
            { value: 'email', label: 'Allow others to find me by email' },
            { value: 'recommendations', label: 'Receive personalized recommendations' },
          ]}
          defaultValue={['profile']}
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
          Dark Mode Preferences
        </h3>
        <CheckboxGroup
          isDarkMode
          label="Developer Tools"
          helperText="Select the tools you use regularly"
          options={[
            { value: 'vscode', label: 'VS Code' },
            { value: 'git', label: 'Git' },
            { value: 'docker', label: 'Docker' },
            { value: 'kubernetes', label: 'Kubernetes' },
          ]}
          defaultValue={['vscode', 'git']}
        />
      </div>
      
      <div>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '16px',
          fontWeight: 600,
          color: 'white'
        }}>
          Horizontal Layout
        </h3>
        <CheckboxGroup
          isDarkMode
          label="Notification Types"
          orientation="horizontal"
          size="sm"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'push', label: 'Push' },
            { value: 'slack', label: 'Slack' },
          ]}
        />
      </div>
      
      <div>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '16px',
          fontWeight: 600,
          color: 'white'
        }}>
          With Error State
        </h3>
        <CheckboxGroup
          isDarkMode
          label="Required Selection"
          error="Please select at least one programming language"
          options={skillOptions.slice(0, 4)}
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
    label: 'Select options',
    options: skillOptions.slice(0, 4),
    size: 'md',
    orientation: 'vertical',
    isDarkMode: false,
    disabled: false,
    helperText: '',
    error: '',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['javascript']);
    
    return (
      <CheckboxGroup
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
};
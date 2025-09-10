import type { Meta, StoryObj } from '@storybook/react';
import { FormGroup } from './FormGroup';
import { FormField } from '../FormField/FormField';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { Textarea } from '../../atoms/Textarea/Textarea';
import { useState } from 'react';

const meta: Meta<typeof FormGroup> = {
  title: 'Molecules/FormGroup',
  component: FormGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { FormGroup, FormField, Input } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <FormGroup
      title="Personal Information"
      description="Please provide your basic contact details"
    >
      <FormField label="First Name" required>
        <Input type="text" placeholder="Enter first name" />
      </FormField>
      
      <FormField label="Last Name" required>
        <Input type="text" placeholder="Enter last name" />
      </FormField>
      
      <FormField label="Email" required>
        <Input type="email" placeholder="Enter email" />
      </FormField>
    </FormGroup>
  );
}
\`\`\`

A form organization component that groups related form fields together with optional titles and descriptions. Perfect for creating logical sections in forms and improving user experience through clear information hierarchy.

**Key Features:**
- 📝 Optional group title and description
- 📏 Configurable spacing between form fields
- 📋 Semantic grouping for better form organization
- ♿ Improved accessibility through logical field grouping
- 🎨 Consistent styling with design system
- 🌙 Dark mode support
- 📱 Responsive design
- 🧩 Works seamlessly with FormField components
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Group title/legend',
    },
    description: {
      control: 'text',
      description: 'Group description',
    },
    spacing: {
      control: 'number',
      description: 'Spacing between form fields in pixels',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    children: {
      control: false,
      description: 'Form fields to group together',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Personal Information',
    children: (
      <>
        <FormField label="First Name" required>
          <Input type="text" placeholder="Enter first name" />
        </FormField>
        
        <FormField label="Last Name" required>
          <Input type="text" placeholder="Enter last name" />
        </FormField>
        
        <FormField label="Email" required>
          <Input type="email" placeholder="Enter email" />
        </FormField>
      </>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Account Settings',
    description: 'Configure your account preferences and security settings',
    children: (
      <>
        <FormField label="Username" required helpText="Must be unique and at least 3 characters">
          <Input type="text" placeholder="Choose username" />
        </FormField>
        
        <FormField label="Password" required helpText="Must be at least 8 characters">
          <Input type="password" placeholder="Create password" />
        </FormField>
        
        <FormField label="Confirm Password" required>
          <Input type="password" placeholder="Confirm password" />
        </FormField>
      </>
    ),
  },
};

export const CustomSpacing: Story = {
  args: {
    title: 'Compact Form',
    description: 'This form uses tighter spacing between fields',
    spacing: 12,
    children: (
      <>
        <FormField label="Name">
          <Input type="text" placeholder="Enter name" />
        </FormField>
        
        <FormField label="Email">
          <Input type="email" placeholder="Enter email" />
        </FormField>
        
        <FormField label="Phone">
          <Input type="tel" placeholder="Enter phone" />
        </FormField>
      </>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    children: (
      <>
        <FormField label="Search Query">
          <Input type="search" placeholder="Search..." />
        </FormField>
        
        <FormField label="Category">
          <Select
            placeholder="All Categories"
            options={[
              { value: '', label: 'All Categories' },
              { value: 'tech', label: 'Technology' },
              { value: 'design', label: 'Design' },
              { value: 'business', label: 'Business' },
            ]}
          />
        </FormField>
        
        <FormField label="Date Range">
          <Input type="date" />
        </FormField>
      </>
    ),
  },
};

export const MultipleGroups: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '500px' }}>
      <FormGroup
        title="Personal Information"
        description="Basic details about yourself"
      >
        <FormField label="First Name" required>
          <Input type="text" placeholder="Enter first name" />
        </FormField>
        
        <FormField label="Last Name" required>
          <Input type="text" placeholder="Enter last name" />
        </FormField>
        
        <FormField label="Date of Birth">
          <Input type="date" />
        </FormField>
      </FormGroup>
      
      <FormGroup
        title="Contact Information"
        description="How can we reach you?"
      >
        <FormField label="Email Address" required>
          <Input type="email" placeholder="Enter email" />
        </FormField>
        
        <FormField label="Phone Number">
          <Input type="tel" placeholder="Enter phone" />
        </FormField>
        
        <FormField label="Address">
          <Textarea 
            placeholder="Enter address" 
            rows={3}
          />
        </FormField>
      </FormGroup>
      
      <FormGroup
        title="Preferences"
        description="Customize your experience"
      >
        <FormField label="Language">
          <Select
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
          />
        </FormField>
        
        <FormField label="Timezone">
          <Select
            options={[
              { value: 'est', label: 'Eastern Time' },
              { value: 'pst', label: 'Pacific Time' },
              { value: 'cst', label: 'Central Time' },
            ]}
          />
        </FormField>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <input type="checkbox" id="newsletter" />
          <label htmlFor="newsletter" style={{ fontSize: '14px' }}>
            Subscribe to newsletter
          </label>
        </div>
      </FormGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing multiple FormGroup components used together to create a comprehensive form with logical sections.',
      },
    },
  },
};

export const WithValidation: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      company: '',
      website: '',
      employees: '',
      industry: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const handleChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
    
    const validateField = (field: string, value: string) => {
      let error = '';
      
      if (!value.trim()) {
        error = 'This field is required';
      } else if (field === 'website' && !value.startsWith('http')) {
        error = 'Website must start with http:// or https://';
      } else if (field === 'employees' && isNaN(Number(value))) {
        error = 'Please enter a valid number';
      }
      
      setErrors(prev => ({ ...prev, [field]: error }));
    };
    
    return (
      <div style={{ maxWidth: '500px' }}>
        <FormGroup
          title="Company Information"
          description="Tell us about your organization"
        >
          <FormField 
            label="Company Name" 
            required 
            error={errors.company}
            helpText={!errors.company ? "Official name of your company" : undefined}
          >
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              onBlur={(e) => validateField('company', e.target.value)}
              placeholder="Enter company name"
            />
          </FormField>
          
          <FormField 
            label="Website" 
            error={errors.website}
            helpText={!errors.website ? "Your company's website URL" : undefined}
          >
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              onBlur={(e) => validateField('website', e.target.value)}
              placeholder="https://example.com"
            />
          </FormField>
          
          <FormField 
            label="Number of Employees" 
            required 
            error={errors.employees}
          >
            <Input
              type="number"
              value={formData.employees}
              onChange={(e) => handleChange('employees', e.target.value)}
              onBlur={(e) => validateField('employees', e.target.value)}
              placeholder="Enter number"
            />
          </FormField>
          
          <FormField 
            label="Industry" 
            required 
            error={errors.industry}
          >
            <Select
              value={formData.industry}
              onChange={(value) => {
                handleChange('industry', value);
                validateField('industry', value);
              }}
              placeholder="Select industry"
              options={[
                { value: '', label: 'Select industry' },
                { value: 'tech', label: 'Technology' },
                { value: 'finance', label: 'Finance' },
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'education', label: 'Education' },
                { value: 'retail', label: 'Retail' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </FormField>
        </FormGroup>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'FormGroup with real-time validation showing error states and help text.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    title: 'Dark Mode Form Group',
    description: 'This form group is displayed in dark mode with appropriate theming',
    isDarkMode: true,
    children: (
      <>
        <FormField label="Username" required isDarkMode>
          <Input 
            type="text" 
            placeholder="Enter username" 
            isDarkMode
          />
        </FormField>
        
        <FormField label="Email" required isDarkMode>
          <Input 
            type="email" 
            placeholder="Enter email" 
            isDarkMode
          />
        </FormField>
        
        <FormField label="Role" isDarkMode>
          <Select 
            placeholder="Select role"
            isDarkMode
            options={[
              { value: '', label: 'Select role' },
              { value: 'admin', label: 'Administrator' },
              { value: 'user', label: 'User' },
              { value: 'guest', label: 'Guest' },
            ]}
          />
        </FormField>
      </>
    ),
  },
  parameters: {
    theme: 'dark',
  },
};

export const Playground: Story = {
  args: {
    title: 'Form Group Title',
    description: 'This is a description for the form group',
    spacing: 20,
    isDarkMode: false,
    children: (
      <>
        <FormField label="Field 1" required>
          <Input type="text" placeholder="Enter value" />
        </FormField>
        
        <FormField label="Field 2" helpText="This is help text">
          <Input type="text" placeholder="Enter value" />
        </FormField>
        
        <FormField label="Field 3">
          <Select
            placeholder="Select option"
            options={[
              { value: '', label: 'Select option' },
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' },
            ]}
          />
        </FormField>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different FormGroup configurations.',
      },
    },
  },
};
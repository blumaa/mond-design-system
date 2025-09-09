import type { Meta, StoryObj } from '@storybook/react';
import { FormGroup } from './FormGroup';
import { FormField } from '../FormField/FormField';
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
import { FormGroup, FormField } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <FormGroup
      title="Personal Information"
      description="Please provide your basic contact details"
    >
      <FormField label="First Name" required>
        <input type="text" placeholder="Enter first name" />
      </FormField>
      
      <FormField label="Last Name" required>
        <input type="text" placeholder="Enter last name" />
      </FormField>
      
      <FormField label="Email" required>
        <input type="email" placeholder="Enter email" />
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

const sampleInputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
};

const sampleSelectStyle = {
  ...sampleInputStyle,
  backgroundColor: 'white',
};

export const Default: Story = {
  args: {
    title: 'Personal Information',
    children: (
      <>
        <FormField label="First Name" required>
          <input type="text" placeholder="Enter first name" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Last Name" required>
          <input type="text" placeholder="Enter last name" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Email" required>
          <input type="email" placeholder="Enter email" style={sampleInputStyle} />
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
          <input type="text" placeholder="Choose username" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Password" required helpText="Must be at least 8 characters">
          <input type="password" placeholder="Create password" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Confirm Password" required>
          <input type="password" placeholder="Confirm password" style={sampleInputStyle} />
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
          <input type="text" placeholder="Enter name" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Email">
          <input type="email" placeholder="Enter email" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Phone">
          <input type="tel" placeholder="Enter phone" style={sampleInputStyle} />
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
          <input type="search" placeholder="Search..." style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Category">
          <select style={sampleSelectStyle}>
            <option value="">All Categories</option>
            <option value="tech">Technology</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        </FormField>
        
        <FormField label="Date Range">
          <input type="date" style={sampleInputStyle} />
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
          <input type="text" placeholder="Enter first name" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Last Name" required>
          <input type="text" placeholder="Enter last name" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Date of Birth">
          <input type="date" style={sampleInputStyle} />
        </FormField>
      </FormGroup>
      
      <FormGroup
        title="Contact Information"
        description="How can we reach you?"
      >
        <FormField label="Email Address" required>
          <input type="email" placeholder="Enter email" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Phone Number">
          <input type="tel" placeholder="Enter phone" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Address">
          <textarea 
            placeholder="Enter address" 
            rows={3}
            style={{
              ...sampleInputStyle,
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </FormField>
      </FormGroup>
      
      <FormGroup
        title="Preferences"
        description="Customize your experience"
      >
        <FormField label="Language">
          <select style={sampleSelectStyle}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </FormField>
        
        <FormField label="Timezone">
          <select style={sampleSelectStyle}>
            <option value="est">Eastern Time</option>
            <option value="pst">Pacific Time</option>
            <option value="cst">Central Time</option>
          </select>
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
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              onBlur={(e) => validateField('company', e.target.value)}
              placeholder="Enter company name"
              style={{
                ...sampleInputStyle,
                border: errors.company ? '2px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: errors.company ? '#fef2f2' : 'white',
              }}
            />
          </FormField>
          
          <FormField 
            label="Website" 
            error={errors.website}
            helpText={!errors.website ? "Your company's website URL" : undefined}
          >
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              onBlur={(e) => validateField('website', e.target.value)}
              placeholder="https://example.com"
              style={{
                ...sampleInputStyle,
                border: errors.website ? '2px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: errors.website ? '#fef2f2' : 'white',
              }}
            />
          </FormField>
          
          <FormField 
            label="Number of Employees" 
            required 
            error={errors.employees}
          >
            <input
              type="number"
              value={formData.employees}
              onChange={(e) => handleChange('employees', e.target.value)}
              onBlur={(e) => validateField('employees', e.target.value)}
              placeholder="Enter number"
              style={{
                ...sampleInputStyle,
                border: errors.employees ? '2px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: errors.employees ? '#fef2f2' : 'white',
              }}
            />
          </FormField>
          
          <FormField 
            label="Industry" 
            required 
            error={errors.industry}
          >
            <select
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              onBlur={(e) => validateField('industry', e.target.value)}
              style={{
                ...sampleSelectStyle,
                border: errors.industry ? '2px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: errors.industry ? '#fef2f2' : 'white',
              }}
            >
              <option value="">Select industry</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </select>
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
          <input 
            type="text" 
            placeholder="Enter username" 
            style={{
              ...sampleInputStyle,
              backgroundColor: '#1f2937',
              border: '1px solid #4b5563',
              color: '#f9fafb',
            }} 
          />
        </FormField>
        
        <FormField label="Email" required isDarkMode>
          <input 
            type="email" 
            placeholder="Enter email" 
            style={{
              ...sampleInputStyle,
              backgroundColor: '#1f2937',
              border: '1px solid #4b5563',
              color: '#f9fafb',
            }} 
          />
        </FormField>
        
        <FormField label="Role" isDarkMode>
          <select 
            style={{
              ...sampleSelectStyle,
              backgroundColor: '#1f2937',
              border: '1px solid #4b5563',
              color: '#f9fafb',
            }}
          >
            <option value="">Select role</option>
            <option value="admin">Administrator</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
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
          <input type="text" placeholder="Enter value" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Field 2" helpText="This is help text">
          <input type="text" placeholder="Enter value" style={sampleInputStyle} />
        </FormField>
        
        <FormField label="Field 3">
          <select style={sampleSelectStyle}>
            <option value="">Select option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </select>
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
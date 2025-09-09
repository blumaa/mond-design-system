import type { Meta, StoryObj } from '@storybook/react';
import { FormContainer, FormField } from './FormContainer';
// Actions simplified for Storybook 9.x compatibility

const meta = {
  title: 'Organisms/FormContainer',
  component: FormContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { FormContainer, FormField } from '@mond-design-system/theme';

function MyComponent() {
  const fields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      required: true,
      validation: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'your@email.com',
      required: true,
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Your message...',
      required: true,
      validation: [
        { type: 'required', message: 'Message is required' },
      ],
    },
  ];

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
  };

  return (
    <FormContainer
      fields={fields}
      title="Contact Us"
      description="Send us a message and we'll get back to you"
      onSubmit={handleSubmit}
      validationMode="onChange"
      layout="vertical"
      variant="card"
    />
  );
}
\`\`\`

A comprehensive form container organism that orchestrates form atoms and molecules with built-in validation, state management, and submission handling.

**Key Features:**
- 🏗️ Complete form orchestration with field management
- ✅ Built-in validation with multiple validation types
- 📱 Multiple layout options (vertical, horizontal, grid)
- 🎨 Visual variants (default, bordered, card)
- 📏 Size variants (sm, md, lg)
- 🔄 Multiple validation modes (onChange, onBlur, onSubmit)
- 🎯 Progress tracking for multi-step forms
- 🌑 Dark mode compatibility
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    fields: {
      description: 'Array of form field configurations',
      control: 'object',
    },
    onSubmit: {
      description: 'Form submission handler',
      action: 'submitted',
    },
    onFieldChange: {
      description: 'Field change handler',
      action: 'field-changed',
    },
    validationMode: {
      description: 'When to validate fields',
      control: 'select',
      options: ['onChange', 'onBlur', 'onSubmit'],
    },
    layout: {
      description: 'Form layout style',
      control: 'select',
      options: ['vertical', 'horizontal', 'grid'],
    },
    variant: {
      description: 'Form visual variant',
      control: 'select',
      options: ['default', 'bordered', 'card'],
    },
    size: {
      description: 'Form component size',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    columns: {
      description: 'Number of columns for grid layout',
      control: 'select',
      options: [1, 2, 3],
    },
    isDarkMode: {
      description: 'Dark mode theme',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FormContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic contact form
const contactFields: FormField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    validation: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
    ],
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your.email@example.com',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' },
    ],
  },
  {
    name: 'subject',
    type: 'select',
    label: 'Subject',
    required: true,
    validation: [
      { type: 'required', message: 'Please select a subject' },
    ],
    options: [
      { value: 'general', label: 'General Inquiry' },
      { value: 'support', label: 'Technical Support' },
      { value: 'billing', label: 'Billing Question' },
      { value: 'feedback', label: 'Feedback' },
    ],
  },
  {
    name: 'message',
    type: 'textarea',
    label: 'Message',
    placeholder: 'Tell us how we can help you...',
    required: true,
    validation: [
      { type: 'required', message: 'Message is required' },
      { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' },
    ],
    description: 'Please provide as much detail as possible',
  },
];

export const Basic: Story = {
  args: {
    fields: contactFields,
    title: 'Contact Us',
    description: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    onSubmit: () => {},
    onFieldChange: () => {},
  },
};

// Registration form with complex validation
const registrationFields: FormField[] = [
  {
    name: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'John',
    required: true,
    validation: [
      { type: 'required', message: 'First name is required' },
      { type: 'minLength', value: 2, message: 'First name must be at least 2 characters' },
    ],
  },
  {
    name: 'lastName',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Doe',
    required: true,
    validation: [
      { type: 'required', message: 'Last name is required' },
      { type: 'minLength', value: 2, message: 'Last name must be at least 2 characters' },
    ],
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'john.doe@example.com',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' },
    ],
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter a secure password',
    required: true,
    validation: [
      { type: 'required', message: 'Password is required' },
      { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
      { 
        type: 'pattern', 
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        message: 'Password must contain uppercase, lowercase, and number' 
      },
    ],
    description: 'Must be at least 8 characters with uppercase, lowercase, and number',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
    required: true,
    validation: [
      { type: 'required', message: 'Please confirm your password' },
      {
        type: 'custom',
        message: 'Passwords do not match',
        validator: (_value) => {
          // Note: In real usage, you'd get the password value from form state
          return true; // Simplified for story
        },
      },
    ],
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone Number',
    placeholder: '123-456-7890',
    validation: [
      { 
        type: 'pattern', 
        value: /^\d{3}-\d{3}-\d{4}$/, 
        message: 'Phone must be in format 123-456-7890' 
      },
    ],
    description: 'Optional - Format: 123-456-7890',
  },
  {
    name: 'birthDate',
    type: 'text',
    label: 'Date of Birth',
    placeholder: 'MM/DD/YYYY',
    required: true,
    validation: [
      { type: 'required', message: 'Date of birth is required' },
      { 
        type: 'custom', 
        message: 'You must be 18 or older',
        validator: (value) => {
          const date = new Date(String(value));
          const eighteenYearsAgo = new Date();
          eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
          return date <= eighteenYearsAgo;
        },
      },
    ],
  },
  {
    name: 'gender',
    type: 'radio',
    label: 'Gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    ],
  },
  {
    name: 'terms',
    type: 'checkbox',
    label: 'I agree to the Terms of Service and Privacy Policy',
    required: true,
    validation: [
      { 
        type: 'custom', 
        message: 'You must accept the terms to continue',
        validator: (value) => value === true,
      },
    ],
  },
  {
    name: 'newsletter',
    type: 'checkbox',
    label: 'Subscribe to our newsletter for updates and offers',
    defaultValue: false,
  },
];

export const RegistrationForm: Story = {
  args: {
    fields: registrationFields,
    title: 'Create Your Account',
    description: 'Join thousands of users who trust our platform',
    layout: 'grid',
    columns: 2,
    variant: 'card',
    validationMode: 'onChange',
    showReset: true,
    submitText: 'Create Account',
    resetText: 'Clear Form',
    onSubmit: () => {},
    onFieldChange: () => {},
  },
};

// Feedback form with different field types
const feedbackFields: FormField[] = [
  {
    name: 'rating',
    type: 'radio',
    label: 'How would you rate your experience?',
    required: true,
    validation: [
      { type: 'required', message: 'Please provide a rating' },
    ],
    options: [
      { value: '5', label: 'Excellent' },
      { value: '4', label: 'Good' },
      { value: '3', label: 'Average' },
      { value: '2', label: 'Poor' },
      { value: '1', label: 'Terrible' },
    ],
  },
  {
    name: 'categories',
    type: 'select',
    label: 'What aspect would you like to comment on?',
    options: [
      { value: 'usability', label: 'Usability' },
      { value: 'performance', label: 'Performance' },
      { value: 'design', label: 'Design' },
      { value: 'features', label: 'Features' },
      { value: 'support', label: 'Customer Support' },
    ],
  },
  {
    name: 'improvements',
    type: 'textarea',
    label: 'What could we improve?',
    placeholder: 'Tell us what you think could be better...',
    validation: [
      { type: 'maxLength', value: 500, message: 'Please keep feedback under 500 characters' },
    ],
    description: 'Optional - Help us make our product better',
  },
  {
    name: 'recommend',
    type: 'radio',
    label: 'Would you recommend us to a friend?',
    required: true,
    validation: [
      { type: 'required', message: 'Please let us know if you would recommend us' },
    ],
    options: [
      { value: 'definitely', label: 'Definitely' },
      { value: 'probably', label: 'Probably' },
      { value: 'not-sure', label: 'Not sure' },
      { value: 'probably-not', label: 'Probably not' },
      { value: 'definitely-not', label: 'Definitely not' },
    ],
  },
  {
    name: 'contact',
    type: 'checkbox',
    label: 'You can contact me about this feedback',
    defaultValue: false,
  },
];

export const FeedbackForm: Story = {
  args: {
    fields: feedbackFields,
    title: 'We Value Your Feedback',
    description: 'Help us improve by sharing your thoughts',
    variant: 'bordered',
    validationMode: 'onBlur',
    submitText: 'Submit Feedback',
    onSubmit: () => {},
  },
};

// Multi-step form with progress
export const MultiStepForm: Story = {
  args: {
    fields: contactFields.slice(0, 2), // Show only first 2 fields for demo
    title: 'Multi-Step Registration',
    description: 'Complete your profile step by step',
    showProgress: true,
    currentStep: 2,
    totalSteps: 4,
    layout: 'vertical',
    size: 'lg',
    submitText: 'Continue',
    showReset: false,
    onSubmit: () => {},
  },
};

// Compact form
const compactFields: FormField[] = [
  {
    name: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Enter search term...',
  },
  {
    name: 'category',
    type: 'select',
    label: 'Category',
    options: [
      { value: 'all', label: 'All Categories' },
      { value: 'products', label: 'Products' },
      { value: 'services', label: 'Services' },
      { value: 'support', label: 'Support' },
    ],
    defaultValue: 'all',
  },
];

export const CompactForm: Story = {
  args: {
    fields: compactFields,
    layout: 'horizontal',
    size: 'sm',
    submitText: 'Search',
    showReset: false,
    validationMode: 'onSubmit',
    onSubmit: () => {},
  },
};

// Error state demonstration
export const WithErrors: Story = {
  args: {
    fields: contactFields,
    title: 'Form with Validation Errors',
    description: 'This form demonstrates validation error states',
    validationMode: 'onChange',
    onSubmit: async () => {
      throw new Error('Network connection failed. Please try again.');
    },
    onFieldChange: () => {},
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    fields: contactFields,
    title: 'Submitting Form...',
    loading: true,
    onSubmit: () => {},
  },
};

// Disabled form
export const DisabledForm: Story = {
  args: {
    fields: contactFields,
    title: 'Disabled Form',
    description: 'All form fields are disabled',
    disabled: true,
    initialValues: {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'general',
      message: 'This is a pre-filled message',
    },
    onSubmit: () => {},
  },
};

// Dark mode
export const DarkMode: Story = {
  args: {
    fields: registrationFields.slice(0, 6), // Subset for cleaner demo
    title: 'Dark Mode Form',
    description: 'Registration form in dark theme',
    layout: 'grid',
    columns: 2,
    variant: 'card',
    isDarkMode: true,
    submitText: 'Sign Up',
    showReset: true,
    onSubmit: () => {},
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Survey form with all field types
const surveyFields: FormField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Your Name',
    required: true,
    validation: [{ type: 'required', message: 'Name is required' }],
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' },
    ],
  },
  {
    name: 'age',
    type: 'number',
    label: 'Age',
    validation: [
      { 
        type: 'custom', 
        message: 'Age must be between 13 and 120',
        validator: (value) => {
          const age = parseInt(String(value));
          return age >= 13 && age <= 120;
        },
      },
    ],
  },
  {
    name: 'country',
    type: 'select',
    label: 'Country',
    required: true,
    validation: [{ type: 'required', message: 'Please select your country' }],
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    name: 'experience',
    type: 'radio',
    label: 'How long have you been using our product?',
    required: true,
    validation: [{ type: 'required', message: 'Please select your experience level' }],
    options: [
      { value: 'new', label: 'Just started' },
      { value: '1-3months', label: '1-3 months' },
      { value: '3-6months', label: '3-6 months' },
      { value: '6-12months', label: '6-12 months' },
      { value: '1year+', label: 'More than a year' },
    ],
  },
  {
    name: 'features',
    type: 'textarea',
    label: 'Which features do you use most?',
    placeholder: 'Tell us about your favorite features...',
    validation: [
      { type: 'maxLength', value: 300, message: 'Please keep under 300 characters' },
    ],
  },
  {
    name: 'satisfaction',
    type: 'radio',
    label: 'Overall satisfaction',
    required: true,
    validation: [{ type: 'required', message: 'Please rate your satisfaction' }],
    options: [
      { value: 'very-satisfied', label: 'Very satisfied' },
      { value: 'satisfied', label: 'Satisfied' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'dissatisfied', label: 'Dissatisfied' },
      { value: 'very-dissatisfied', label: 'Very dissatisfied' },
    ],
  },
  {
    name: 'newsletter',
    type: 'checkbox',
    label: 'Subscribe to product updates',
    defaultValue: true,
  },
  {
    name: 'contact',
    type: 'checkbox',
    label: 'Allow us to contact you for follow-up questions',
    defaultValue: false,
  },
];

export const ComprehensiveSurvey: Story = {
  args: {
    fields: surveyFields,
    title: 'Product Experience Survey',
    description: 'Help us improve by sharing your experience with our product',
    layout: 'vertical',
    variant: 'card',
    size: 'md',
    validationMode: 'onBlur',
    submitText: 'Submit Survey',
    showReset: true,
    resetText: 'Clear All',
    onSubmit: () => {},
    onFieldChange: () => {},
  },
};

// Playground story for testing
export const Playground: Story = {
  args: {
    fields: contactFields,
    title: 'Form Playground',
    description: 'Use the controls below to customize the form',
    onSubmit: () => {},
    onFieldChange: () => {},
  },
};
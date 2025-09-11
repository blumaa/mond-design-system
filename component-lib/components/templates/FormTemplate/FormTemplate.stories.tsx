import type { Meta, StoryObj } from '@storybook/react';
import { FormTemplate, type FormSection } from './FormTemplate';
import { Box } from '../../layout/Box/Box';
import { Text } from '../../atoms/Text/Text';
import { Heading } from '../../atoms/Heading/Heading';
import { Stack } from '../../layout/Stack/Stack';

const meta = {
  title: 'Templates/FormTemplate',
  component: FormTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive form template that supports multi-step forms with progress tracking, validation, and various layout options. Built on top of FormContainer and ProgressStepper organisms.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Form title',
    },
    description: {
      control: 'text',
      description: 'Form description',
    },
    variant: {
      control: 'select',
      options: ['default', 'card', 'split'],
      description: 'Form layout variant',
    },
    showSidebar: {
      control: 'boolean',
      description: 'Whether to show the sidebar',
    },
    allowStepNavigation: {
      control: 'boolean',
      description: 'Allow navigation between steps',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Dark mode',
    },
  },
} satisfies Meta<typeof FormTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample form sections
const contactFormSections: FormSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    fields: [
      {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: true,
        validation: [
          { type: 'required', message: 'First name is required' },
          { type: 'minLength', value: 2, message: 'First name must be at least 2 characters' }
        ]
      },
      {
        name: 'lastName',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Enter your last name',
        required: true,
        validation: [
          { type: 'required', message: 'Last name is required' },
          { type: 'minLength', value: 2, message: 'Last name must be at least 2 characters' }
        ]
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        validation: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]
      },
      {
        name: 'phone',
        type: 'text',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        description: 'Include country code if outside US'
      }
    ]
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Customize your experience',
    fields: [
      {
        name: 'interests',
        type: 'select',
        label: 'Primary Interest',
        placeholder: 'Select your main interest',
        required: true,
        options: [
          { value: 'technology', label: 'Technology' },
          { value: 'design', label: 'Design' },
          { value: 'business', label: 'Business' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'other', label: 'Other' }
        ],
        validation: [
          { type: 'required', message: 'Please select an interest' }
        ]
      },
      {
        name: 'experience',
        type: 'radio',
        label: 'Experience Level',
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner (0-2 years)' },
          { value: 'intermediate', label: 'Intermediate (2-5 years)' },
          { value: 'advanced', label: 'Advanced (5+ years)' }
        ],
        validation: [
          { type: 'required', message: 'Please select your experience level' }
        ]
      },
      {
        name: 'newsletter',
        type: 'checkbox',
        label: 'Subscribe to newsletter',
        defaultValue: true
      }
    ]
  },
  {
    id: 'additional',
    title: 'Additional Information',
    description: 'Optional details to help us serve you better',
    optional: true,
    fields: [
      {
        name: 'company',
        type: 'text',
        label: 'Company Name',
        placeholder: 'Enter your company name'
      },
      {
        name: 'role',
        type: 'text',
        label: 'Job Title',
        placeholder: 'Enter your job title'
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Tell us more about your goals or ask any questions',
        description: 'Optional: Share any additional information or questions'
      }
    ]
  }
];

const profileFormSections: FormSection[] = [
  {
    id: 'basic',
    title: 'Basic Profile',
    description: 'Your basic profile information',
    fields: [
      {
        name: 'username',
        type: 'text',
        label: 'Username',
        placeholder: 'Choose a unique username',
        required: true,
        validation: [
          { type: 'required', message: 'Username is required' },
          { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
          { type: 'pattern', value: /^[a-zA-Z0-9_-]+$/, message: 'Username can only contain letters, numbers, hyphens, and underscores' }
        ]
      },
      {
        name: 'displayName',
        type: 'text',
        label: 'Display Name',
        placeholder: 'How should we display your name?',
        required: true
      },
      {
        name: 'bio',
        type: 'textarea',
        label: 'Bio',
        placeholder: 'Tell us about yourself...',
        description: 'A short bio that will appear on your profile'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Control who can see your information',
    fields: [
      {
        name: 'profileVisibility',
        type: 'radio',
        label: 'Profile Visibility',
        required: true,
        options: [
          { value: 'public', label: 'Public - Anyone can see your profile' },
          { value: 'friends', label: 'Friends Only - Only your connections can see your profile' },
          { value: 'private', label: 'Private - Only you can see your profile' }
        ]
      },
      {
        name: 'showEmail',
        type: 'checkbox',
        label: 'Show email address on profile'
      },
      {
        name: 'allowMessages',
        type: 'checkbox',
        label: 'Allow others to send you messages',
        defaultValue: true
      }
    ]
  }
];

export const Default: Story = {
  args: {
    title: 'Contact Information',
    description: 'Please fill out this form to get in touch with us.',
    sections: contactFormSections,
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    variant: 'card',
    allowStepNavigation: true,
    isDarkMode: false,
  },
};

export const ProfileForm: Story = {
  args: {
    title: 'Profile Setup',
    description: 'Complete your profile to get started.',
    sections: profileFormSections,
    onSubmit: async (data) => {
      console.log('Profile form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    variant: 'default',
    allowStepNavigation: true,
    isDarkMode: false,
  },
};

export const WithSidebar: Story = {
  args: {
    title: 'Account Setup',
    sections: contactFormSections,
    showSidebar: true,
    navigationItems: [
      {
        id: 'main',
        title: 'Main',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
          { id: 'forms', label: 'Forms', icon: '📝', active: true },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ],
      },
    ],
    onSubmit: async (data) => {
      console.log('Form with sidebar submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    variant: 'card',
    isDarkMode: false,
  },
};

export const SplitLayout: Story = {
  args: {
    title: 'Registration Form',
    description: 'Create your account to get started.',
    sections: contactFormSections,
    variant: 'split',
    sideContent: (
      <Stack spacing={24}>
        <Box>
          <Heading level={3} style={{ marginBottom: '12px' }}>
            Why Join Us? 🚀
          </Heading>
          <Stack spacing={16}>
            <Box style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Text style={{ fontSize: '20px' }}>✨</Text>
              <Box>
                <Text variant="body-md" style={{ fontWeight: 'semibold', marginBottom: '4px' }}>
                  Premium Features
                </Text>
                <Text variant="body-sm" semantic="secondary">
                  Access advanced tools and features
                </Text>
              </Box>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Text style={{ fontSize: '20px' }}>🤝</Text>
              <Box>
                <Text variant="body-md" style={{ fontWeight: 'semibold', marginBottom: '4px' }}>
                  Community
                </Text>
                <Text variant="body-sm" semantic="secondary">
                  Connect with like-minded professionals
                </Text>
              </Box>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Text style={{ fontSize: '20px' }}>📚</Text>
              <Box>
                <Text variant="body-md" style={{ fontWeight: 'semibold', marginBottom: '4px' }}>
                  Learning Resources
                </Text>
                <Text variant="body-sm" semantic="secondary">
                  Access our library of tutorials and guides
                </Text>
              </Box>
            </Box>
          </Stack>
        </Box>
        
        <Box style={{ 
          padding: '20px', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #e0f2fe'
        }}>
          <Text variant="body-sm" style={{ fontStyle: 'italic' }}>
            "This platform has transformed how we work. The tools are intuitive and the community is amazing!"
          </Text>
          <Text variant="caption" semantic="secondary" style={{ marginTop: '8px' }}>
            - Sarah, Product Manager
          </Text>
        </Box>
      </Stack>
    ),
    onSubmit: async (data) => {
      console.log('Split layout form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    isDarkMode: false,
  },
};

export const DarkMode: Story = {
  args: {
    title: 'Dark Mode Form',
    description: 'Experience our form template in dark mode.',
    sections: profileFormSections,
    onSubmit: async (data) => {
      console.log('Dark mode form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    variant: 'card',
    allowStepNavigation: true,
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const RestrictedNavigation: Story = {
  args: {
    title: 'Sequential Form',
    description: 'This form must be completed in order.',
    sections: contactFormSections,
    onSubmit: async (data) => {
      console.log('Sequential form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    variant: 'card',
    allowStepNavigation: false,
    isDarkMode: false,
  },
};

export const WithInitialValues: Story = {
  args: {
    title: 'Edit Profile',
    description: 'Update your profile information.',
    sections: profileFormSections,
    initialValues: {
      username: 'johndoe',
      displayName: 'John Doe',
      bio: 'Software developer with a passion for user experience.',
      profileVisibility: 'friends',
      showEmail: false,
      allowMessages: true
    },
    onSubmit: async (data) => {
      console.log('Edit form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    variant: 'card',
    allowStepNavigation: true,
    isDarkMode: false,
  },
};
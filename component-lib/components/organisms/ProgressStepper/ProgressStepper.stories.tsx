import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ProgressStepper, StepConfig } from './ProgressStepper';
import { Box } from '../../layout/Box/Box';
import { Button } from '../../atoms/Button/Button';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../atoms/Text/Text';

const meta: Meta<typeof ProgressStepper> = {
  title: 'Organisms/ProgressStepper',
  component: ProgressStepper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { ProgressStepper, StepConfig } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: StepConfig[] = [
    { label: 'Personal Info', description: 'Enter your basic details' },
    { label: 'Account Setup', description: 'Create your credentials' },
    { label: 'Preferences', description: 'Configure your settings' },
    { label: 'Review', description: 'Confirm your information' },
  ];
  
  return (
    <ProgressStepper
      steps={steps}
      currentStep={currentStep}
      orientation="horizontal"
      size="medium"
      allowStepNavigation={true}
      onStepClick={setCurrentStep}
    />
  );
}
\`\`\`

ProgressStepper is an organism-level component that displays progress through a multi-step process with interactive navigation and status management.

**Key Features:**
- 📋 Multi-step process visualization
- 🗄 Horizontal and vertical orientations  
- 📏 Multiple size variants (small, medium, large)
- ✅ Status management (completed, active, disabled, error)
- 🔗 Interactive step navigation with click handlers
- 🎨 Custom icon support for each step
- ♿ Full accessibility with ARIA support
- 📱 Responsive design for all screen sizes
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    steps: {
      description: 'Array of step configurations',
      control: { type: 'object' },
    },
    currentStep: {
      description: 'Current active step index (0-based)',
      control: { type: 'number', min: 0 },
    },
    orientation: {
      description: 'Stepper orientation',
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    size: {
      description: 'Stepper size variant',
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      description: 'Display variant',
      control: { type: 'radio' },
      options: ['default', 'compact'],
    },
    allowStepNavigation: {
      description: 'Whether steps can be navigated by clicking',
      control: { type: 'boolean' },
    },
    isDarkMode: {
      description: 'Dark mode theme',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressStepper>;

// Basic step configurations for stories
const basicSteps: StepConfig[] = [
  { label: 'Personal Information', description: 'Enter your basic details' },
  { label: 'Account Setup', description: 'Create your account credentials' },
  { label: 'Preferences', description: 'Configure your preferences' },
  { label: 'Review & Confirm', description: 'Review and confirm your settings' },
];

const formSteps: StepConfig[] = [
  { label: 'Contact Details', description: 'Name, email, and phone number' },
  { label: 'Address Information', description: 'Shipping and billing addresses' },
  { label: 'Payment Method', description: 'Credit card or payment details' },
  { label: 'Order Summary', description: 'Review your order before checkout' },
  { label: 'Confirmation', description: 'Order placed successfully' },
];

const iconSteps: StepConfig[] = [
  { label: 'Getting Started', description: 'Welcome to our platform', icon: '🚀' },
  { label: 'Setup Profile', description: 'Complete your profile', icon: '👤' },
  { label: 'Choose Plan', description: 'Select your subscription', icon: '💎' },
  { label: 'Payment', description: 'Add payment method', icon: '💳' },
  { label: 'All Done', description: 'You\'re ready to go!', icon: '🎉' },
];

const statusSteps: StepConfig[] = [
  { label: 'Validation', description: 'Data validation complete', status: 'completed' },
  { label: 'Processing', description: 'Currently processing data', status: 'active' },
  { label: 'Review', description: 'Pending review', status: 'disabled' },
  { label: 'Failed Step', description: 'This step encountered an error', status: 'error' },
  { label: 'Final Step', description: 'Final confirmation', status: 'disabled' },
];

// Default story
export const Default: Story = {
  args: {
    steps: basicSteps,
    currentStep: 1,
    orientation: 'horizontal',
    size: 'medium',
    variant: 'default',
    allowStepNavigation: false,
    isDarkMode: false,
  },
};

// Interactive story with navigation
export const Interactive: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(args.currentStep || 0);
    
    const handleStepClick = (stepIndex: number) => {
      setCurrentStep(stepIndex);
    };
    
    const handleNext = () => {
      setCurrentStep(Math.min(currentStep + 1, args.steps.length - 1));
    };
    
    const handlePrev = () => {
      setCurrentStep(Math.max(currentStep - 1, 0));
    };
    
    const handleReset = () => {
      setCurrentStep(0);
    };
    
    return (
      <Stack spacing={24}>
        <ProgressStepper
          {...args}
          currentStep={currentStep}
          allowStepNavigation={true}
          onStepClick={handleStepClick}
        />
        
        <Box display="flex" gap={12} justifyContent="center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleNext}
            disabled={currentStep === args.steps.length - 1}
          >
            Next
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
        
        <Box textAlign="center">
          <Text fontSize="sm" color="#64748b">
            Current Step: {currentStep + 1} of {args.steps.length}
          </Text>
        </Box>
      </Stack>
    );
  },
  args: {
    steps: basicSteps,
    currentStep: 1,
  },
};

// Vertical orientation
export const Vertical: Story = {
  args: {
    steps: basicSteps,
    currentStep: 2,
    orientation: 'vertical',
  },
  parameters: {
    layout: 'padded',
  },
};

// Compact variant
export const Compact: Story = {
  args: {
    steps: basicSteps,
    currentStep: 2,
    variant: 'compact',
  },
};

// Different sizes
export const Sizes: Story = {
  render: (args) => (
    <Stack spacing={32}>
      <Box>
        <Text fontWeight="medium" mb={16}>Small</Text>
        <ProgressStepper {...args} size="small" />
      </Box>
      
      <Box>
        <Text fontWeight="medium" mb={16}>Medium</Text>
        <ProgressStepper {...args} size="medium" />
      </Box>
      
      <Box>
        <Text fontWeight="medium" mb={16}>Large</Text>
        <ProgressStepper {...args} size="large" />
      </Box>
    </Stack>
  ),
  args: {
    steps: basicSteps,
    currentStep: 1,
  },
};

// With custom icons
export const WithIcons: Story = {
  args: {
    steps: iconSteps,
    currentStep: 2,
  },
};

// Complex form example
export const FormWizard: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const handleNext = () => {
      setCurrentStep(Math.min(currentStep + 1, args.steps.length - 1));
    };
    
    const handlePrev = () => {
      setCurrentStep(Math.max(currentStep - 1, 0));
    };
    
    return (
      <Stack spacing={32}>
        <ProgressStepper
          {...args}
          currentStep={currentStep}
          allowStepNavigation={true}
          onStepClick={setCurrentStep}
        />
        
        <Box 
          border="1px solid #e2e8f0" 
          borderRadius="8px" 
          p={24} 
          minHeight="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="#f8fafc"
        >
          <Text fontSize="lg" fontWeight="medium" color="#64748b">
            {args.steps[currentStep]?.label} Content
          </Text>
        </Box>
        
        <Box display="flex" justifyContent="space-between">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={currentStep === args.steps.length - 1}
          >
            {currentStep === args.steps.length - 1 ? 'Complete' : 'Continue'}
          </Button>
        </Box>
      </Stack>
    );
  },
  args: {
    steps: formSteps,
  },
  parameters: {
    layout: 'padded',
  },
};

// Vertical with icons
export const VerticalWithIcons: Story = {
  args: {
    steps: iconSteps,
    currentStep: 2,
    orientation: 'vertical',
  },
  parameters: {
    layout: 'padded',
  },
};

// Error states and status
export const WithStatus: Story = {
  args: {
    steps: statusSteps,
    currentStep: 1, // This will be overridden by explicit status
  },
};

// Long labels test
export const LongLabels: Story = {
  args: {
    steps: [
      { 
        label: 'Very Long Step Label That Might Wrap', 
        description: 'This is a very long description that tests how the component handles longer text content and ensures proper wrapping behavior'
      },
      { 
        label: 'Another Lengthy Step Name', 
        description: 'Testing responsive behavior with extensive descriptive text'
      },
      { 
        label: 'Final Extended Step Title', 
        description: 'Last step with comprehensive details'
      },
    ],
    currentStep: 0,
  },
};

// Many steps
export const ManySteps: Story = {
  args: {
    steps: [
      { label: 'Step 1', description: 'First step' },
      { label: 'Step 2', description: 'Second step' },
      { label: 'Step 3', description: 'Third step' },
      { label: 'Step 4', description: 'Fourth step' },
      { label: 'Step 5', description: 'Fifth step' },
      { label: 'Step 6', description: 'Sixth step' },
      { label: 'Step 7', description: 'Seventh step' },
      { label: 'Step 8', description: 'Eighth step' },
    ],
    currentStep: 3,
    variant: 'compact',
  },
};

// Dark mode
export const DarkMode: Story = {
  args: {
    steps: basicSteps,
    currentStep: 2,
    isDarkMode: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

// All variations comparison
export const AllVariations: Story = {
  render: () => (
    <Stack spacing={48}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={16}>Horizontal Default</Text>
        <ProgressStepper steps={basicSteps} currentStep={1} />
      </Box>
      
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={16}>Horizontal Compact</Text>
        <ProgressStepper steps={basicSteps} currentStep={1} variant="compact" />
      </Box>
      
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={16}>Vertical Default</Text>
        <ProgressStepper steps={basicSteps} currentStep={1} orientation="vertical" />
      </Box>
      
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={16}>With Custom Icons</Text>
        <ProgressStepper steps={iconSteps} currentStep={2} />
      </Box>
      
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={16}>Different Sizes</Text>
        <Stack spacing={16}>
          <ProgressStepper steps={basicSteps} currentStep={1} size="small" />
          <ProgressStepper steps={basicSteps} currentStep={1} size="medium" />
          <ProgressStepper steps={basicSteps} currentStep={1} size="large" />
        </Stack>
      </Box>
    </Stack>
  ),
  parameters: {
    layout: 'padded',
  },
};
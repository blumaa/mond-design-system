# FormContainer

The FormContainer is a comprehensive organism component that orchestrates form atoms and molecules with built-in validation, state management, and submission handling. It follows atomic design principles and provides a complete form solution.

## Features

- **Complete Form Management**: Handles form state, validation, and submission
- **Built-in Validation Engine**: Supports required, email, minLength, maxLength, pattern, and custom validation rules
- **Multiple Field Types**: Supports text, email, password, number, textarea, select, checkbox, and radio fields
- **Flexible Layouts**: Vertical, horizontal, and grid layouts with configurable columns
- **Form Variants**: Default, bordered, and card styling options
- **Multi-step Support**: Progress indicators and step tracking
- **Accessibility**: Full WCAG compliance with proper ARIA attributes
- **Theme Support**: Light and dark mode compatibility

## Usage

### Basic Contact Form

```tsx
import { FormContainer, FormContainerField } from '@mond-design-system/component-lib';

const contactFields: FormContainerField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    required: true,
    validation: [
      { type: 'required', message: 'Name is required' },
    ],
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
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
    required: true,
    validation: [
      { type: 'required', message: 'Message is required' },
      { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' },
    ],
  },
];

function ContactForm() {
  const handleSubmit = async (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <FormContainer
      fields={contactFields}
      title="Contact Us"
      description="We'd love to hear from you"
      onSubmit={handleSubmit}
      variant="card"
      validationMode="onBlur"
    />
  );
}
```

### Registration Form with Grid Layout

```tsx
const registrationFields: FormContainerField[] = [
  {
    name: 'firstName',
    type: 'text',
    label: 'First Name',
    required: true,
    validation: [{ type: 'required', message: 'First name is required' }],
  },
  {
    name: 'lastName',
    type: 'text',
    label: 'Last Name',
    required: true,
    validation: [{ type: 'required', message: 'Last name is required' }],
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
    name: 'password',
    type: 'password',
    label: 'Password',
    required: true,
    validation: [
      { type: 'required', message: 'Password is required' },
      { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
      {
        type: 'pattern',
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Password must contain uppercase, lowercase, and number',
      },
    ],
  },
  {
    name: 'terms',
    type: 'checkbox',
    label: 'I agree to the Terms of Service',
    required: true,
    validation: [
      {
        type: 'custom',
        message: 'You must accept the terms',
        validator: (value) => value === true,
      },
    ],
  },
];

function RegistrationForm() {
  return (
    <FormContainer
      fields={registrationFields}
      title="Create Account"
      layout="grid"
      columns={2}
      variant="bordered"
      validationMode="onChange"
      submitText="Sign Up"
      showReset={true}
      onSubmit={async (data) => {
        // Handle registration
      }}
    />
  );
}
```

### Multi-Step Form with Progress

```tsx
function MultiStepRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const stepFields = {
    1: [
      { name: 'firstName', type: 'text', label: 'First Name', required: true },
      { name: 'lastName', type: 'text', label: 'Last Name', required: true },
    ],
    2: [
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'phone', type: 'text', label: 'Phone Number' },
    ],
    3: [
      { name: 'password', type: 'password', label: 'Password', required: true },
      { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true },
    ],
  };

  const handleStepSubmit = async (data: Record<string, any>) => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      console.log('Registration complete:', data);
    }
  };

  return (
    <FormContainer
      fields={stepFields[currentStep]}
      title={`Registration - Step ${currentStep}`}
      showProgress={true}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onSubmit={handleStepSubmit}
      submitText={currentStep < totalSteps ? 'Continue' : 'Complete Registration'}
      size="lg"
    />
  );
}
```

## Props

### FormContainerProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `FormContainerField[]` | - | Array of form field configurations |
| `onSubmit` | `(data: Record<string, any>) => Promise<void> \| void` | - | Form submission handler |
| `onFieldChange` | `(fieldName: string, value: any) => void` | - | Field change handler |
| `initialValues` | `Record<string, any>` | `{}` | Initial form values |
| `validationMode` | `'onChange' \| 'onBlur' \| 'onSubmit'` | `'onBlur'` | When to validate fields |
| `title` | `string` | - | Form title |
| `description` | `string` | - | Form description |
| `submitText` | `string` | `'Submit'` | Submit button text |
| `resetText` | `string` | `'Reset'` | Reset button text |
| `showReset` | `boolean` | `false` | Show reset button |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `layout` | `'vertical' \| 'horizontal' \| 'grid'` | `'vertical'` | Form layout |
| `columns` | `1 \| 2 \| 3` | `2` | Number of columns for grid layout |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Form size |
| `variant` | `'default' \| 'bordered' \| 'card'` | `'default'` | Form variant |
| `showProgress` | `boolean` | `false` | Show progress indicator |
| `currentStep` | `number` | - | Current step (for multi-step forms) |
| `totalSteps` | `number` | - | Total steps (for multi-step forms) |
| `isDarkMode` | `boolean` | `false` | Dark mode |

### FormContainerField

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name (unique identifier) |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'textarea' \| 'select' \| 'checkbox' \| 'radio'` | Field type |
| `label` | `string` | Field label |
| `placeholder` | `string` | Placeholder text |
| `required` | `boolean` | Required field indicator |
| `validation` | `ValidationRule[]` | Array of validation rules |
| `options` | `Array<{value: string, label: string}>` | Options for select/radio fields |
| `defaultValue` | `any` | Default field value |
| `disabled` | `boolean` | Disabled state |
| `description` | `string` | Help text description |

### ValidationRule

| Prop | Type | Description |
|------|------|-------------|
| `type` | `'required' \| 'email' \| 'minLength' \| 'maxLength' \| 'pattern' \| 'custom'` | Validation rule type |
| `value` | `any` | Rule value (e.g., length for minLength) |
| `message` | `string` | Error message to display |
| `validator` | `(value: any) => boolean` | Custom validation function |

## Validation Rules

### Built-in Validators

- **required**: Ensures field has a value
- **email**: Validates email format
- **minLength**: Minimum character length
- **maxLength**: Maximum character length
- **pattern**: RegExp pattern matching

### Custom Validation

```tsx
{
  type: 'custom',
  message: 'Custom validation failed',
  validator: (value) => {
    // Your custom validation logic
    return value.length > 0 && value.includes('@');
  }
}
```

## Accessibility

The FormContainer component includes comprehensive accessibility features:

- Proper form semantics with fieldset/legend when appropriate
- ARIA attributes for form controls and error messages
- Error announcements for screen readers
- Focus management after validation errors
- Keyboard navigation support
- Required field indicators

## Examples

See the Storybook stories for comprehensive examples including:

- Basic contact form
- Registration form with complex validation
- Multi-step form with progress
- Survey form with all field types
- Error and loading states
- Dark mode support
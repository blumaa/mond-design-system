import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { FormContainer, FormField } from './FormContainer';

// Mock the theme utility
jest.mock('../../utils/theme', () => {
  const themes = {
    light: {
      'text.primary': '#000000',
      'text.secondary': '#666666',
      'text.disabled': '#9ca3af',
      'text.error': '#dc2626',
      'text.success': '#16a34a',
      'surface.input': '#ffffff',
      'surface.elevated': '#ffffff',
      'surface.background': '#ffffff',
      'surface.overlay': '#f3f4f6',
      'border.default': '#d1d5db',
      'border.error': '#dc2626',
      'border.success': '#10b981',
      'border.focused': '#3b82f6',
      'feedback.error.background': '#fef2f2',
      'feedback.error.border': '#fecaca',
      'feedback.error.text': '#dc2626',
      'feedback.success.background': '#f0fdf4',
      'feedback.success.border': '#bbf7d0',
      'feedback.success.text': '#16a34a',
      'feedback.info.background': '#eff6ff',
      'interactive.primary.background': '#3b82f6',
      'interactive.primary.text': '#ffffff',
      'interactive.primary.backgroundHover': '#2563eb',
      'interactive.primary.backgroundPressed': '#1d4ed8',
      'interactive.ghost.text': '#374151',
      'interactive.ghost.backgroundHover': '#f3f4f6',
      'interactive.ghost.backgroundPressed': '#e5e7eb',
    },
    dark: {
      'text.primary': '#ffffff',
      'text.secondary': '#9ca3af',
      'text.disabled': '#6b7280',
      'text.error': '#ef4444',
      'text.success': '#22c55e',
      'surface.input': '#374151',
      'surface.elevated': '#374151',
      'surface.background': '#111827',
      'surface.overlay': '#4b5563',
      'border.default': '#4b5563',
      'border.error': '#ef4444',
      'border.success': '#10b981',
      'border.focused': '#60a5fa',
      'feedback.error.background': '#450a0a',
      'feedback.error.border': '#991b1b',
      'feedback.error.text': '#ef4444',
      'feedback.success.background': '#052e16',
      'feedback.success.border': '#166534',
      'feedback.success.text': '#22c55e',
      'feedback.info.background': '#172554',
      'interactive.primary.background': '#60a5fa',
      'interactive.primary.text': '#ffffff',
      'interactive.primary.backgroundHover': '#3b82f6',
      'interactive.primary.backgroundPressed': '#2563eb',
      'interactive.ghost.text': '#d1d5db',
      'interactive.ghost.backgroundHover': '#374151',
      'interactive.ghost.backgroundPressed': '#4b5563',
    },
  };

  const resolveSemanticToken = (path: string, theme: string = 'light') => {
    const currentTheme = themes[theme as keyof typeof themes] || themes.light;
    return currentTheme[path as keyof typeof currentTheme] || path;
  };

  const useTheme = (isDarkMode: boolean) => (path: string) => {
    return resolveSemanticToken(path, isDarkMode ? 'dark' : 'light');
  };

  return {
    useTheme,
    resolveSemanticToken,
    createThemeResolver: (theme: string) => (path: string) => resolveSemanticToken(path, theme),
  };
});

describe('FormContainer', () => {
  const mockOnSubmit = jest.fn();
  const mockOnFieldChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const basicFields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
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
        { type: 'email', message: 'Please enter a valid email' },
      ],
    },
  ];

  describe('Basic Rendering', () => {
    it('should render form with title and description', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          title="Contact Form"
          description="Please fill out the form below"
        />
      );

      expect(screen.getByText('Contact Form')).toBeInTheDocument();
      expect(screen.getByText('Please fill out the form below')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render submit button with custom text', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          submitText="Send Message"
        />
      );

      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });

    it('should render reset button when showReset is true', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          showReset={true}
          resetText="Clear Form"
        />
      );

      expect(screen.getByText('Clear Form')).toBeInTheDocument();
    });
  });

  describe('Form Variants', () => {
    it('should render card variant with proper styling', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          variant="card"
          data-testid="form-container"
        />
      );

      const form = screen.getByTestId('form-container');
      expect(form).toBeInTheDocument();
    });

    it('should render bordered variant', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          variant="bordered"
          data-testid="form-container"
        />
      );

      const form = screen.getByTestId('form-container');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Field Types', () => {
    it('should render textarea field', () => {
      const fields: FormField[] = [
        {
          name: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    });

    it('should render select field with options', () => {
      const fields: FormField[] = [
        {
          name: 'country',
          type: 'select',
          label: 'Country',
          options: [
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
          ],
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    });

    it('should render checkbox field', () => {
      const fields: FormField[] = [
        {
          name: 'terms',
          type: 'checkbox',
          label: 'Accept Terms',
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Accept Terms')).toBeInTheDocument();
    });

    it('should render radio field with options', () => {
      const fields: FormField[] = [
        {
          name: 'gender',
          type: 'radio',
          label: 'Gender',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ],
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
    });
  });

  describe('Initial Values', () => {
    it('should populate fields with initial values', () => {
      const initialValues = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          initialValues={initialValues}
        />
      );

      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });

    it('should use default values from field configuration', () => {
      const fields: FormField[] = [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          defaultValue: 'Default Name',
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByDisplayValue('Default Name')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show required field error on blur', async () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          validationMode="onBlur"
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should show email validation error', async () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          validationMode="onChange"
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'invalid-email');

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      });
    });

    it('should validate minLength rule', async () => {
      const fields: FormField[] = [
        {
          name: 'password',
          type: 'password',
          label: 'Password',
          validation: [
            { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
          ],
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
          validationMode="onChange"
        />
      );

      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.type(passwordInput, '123');

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });

    it('should validate maxLength rule', async () => {
      const fields: FormField[] = [
        {
          name: 'username',
          type: 'text',
          label: 'Username',
          validation: [
            { type: 'maxLength', value: 10, message: 'Username must be 10 characters or less' },
          ],
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
          validationMode="onChange"
        />
      );

      const usernameInput = screen.getByLabelText(/username/i);
      await userEvent.type(usernameInput, 'verylongusername');

      await waitFor(() => {
        expect(screen.getByText('Username must be 10 characters or less')).toBeInTheDocument();
      });
    });

    it('should validate pattern rule', async () => {
      const fields: FormField[] = [
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
          validation: [
            { 
              type: 'pattern', 
              value: /^\d{3}-\d{3}-\d{4}$/, 
              message: 'Phone must be in format 123-456-7890' 
            },
          ],
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
          validationMode="onChange"
        />
      );

      const phoneInput = screen.getByLabelText(/phone/i);
      await userEvent.type(phoneInput, '123456789');

      await waitFor(() => {
        expect(screen.getByText('Phone must be in format 123-456-7890')).toBeInTheDocument();
      });
    });

    it('should validate custom validation rule', async () => {
      const fields: FormField[] = [
        {
          name: 'age',
          type: 'number',
          label: 'Age',
          validation: [
            { 
              type: 'custom', 
              message: 'You must be 18 or older',
              validator: (value) => parseInt(value) >= 18,
            },
          ],
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
          validationMode="onChange"
        />
      );

      const ageInput = screen.getByLabelText(/age/i);
      await userEvent.type(ageInput, '16');

      await waitFor(() => {
        expect(screen.getByText('You must be 18 or older')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByText('Submit');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });
    });

    it('should prevent submission with validation errors', async () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByText('Submit');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show loading state during submission', async () => {
      const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={slowSubmit}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByText('Submit');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.click(submitButton);

      expect(screen.getByText('Submitting...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Submit')).toBeInTheDocument();
      });
    });

    it('should show error message on submission failure', async () => {
      const failingSubmit = jest.fn(() => Promise.reject(new Error('Network error')));
      
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={failingSubmit}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByText('Submit');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should show success message after successful submission', async () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByText('Submit');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Field Change Handler', () => {
    it('should call onFieldChange when field value changes', async () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      await userEvent.type(nameInput, 'J');

      expect(mockOnFieldChange).toHaveBeenCalledWith('name', 'J');
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial values', async () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          showReset={true}
          initialValues={{ name: 'Initial Name' }}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const resetButton = screen.getByText('Reset');

      // Change the value
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Changed Name');
      expect(screen.getByDisplayValue('Changed Name')).toBeInTheDocument();

      // Reset the form
      await userEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Initial Name')).toBeInTheDocument();
      });
    });
  });

  describe('Progress Indicator', () => {
    it('should show progress indicator when enabled', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          showProgress={true}
          currentStep={2}
          totalSteps={4}
        />
      );

      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should not show progress indicator when disabled', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          showProgress={false}
        />
      );

      expect(screen.queryByText(/Step/)).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable all fields when form is disabled', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          disabled={true}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByText('Submit');

      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('should disable individual fields when field.disabled is true', () => {
      const fields: FormField[] = [
        ...basicFields,
        {
          name: 'disabled_field',
          type: 'text',
          label: 'Disabled Field',
          disabled: true,
        },
      ];

      render(
        <FormContainer
          fields={fields}
          onSubmit={mockOnSubmit}
        />
      );

      const disabledField = screen.getByLabelText(/disabled field/i);
      expect(disabledField).toBeDisabled();
    });
  });

  describe('Layout Options', () => {
    it('should render fields in grid layout', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          layout="grid"
          columns={2}
        />
      );

      // Both fields should be present
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render fields in horizontal layout', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          layout="horizontal"
        />
      );

      // Both fields should be present
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  describe('Dark Mode', () => {
    it('should render in dark mode', () => {
      render(
        <FormContainer
          fields={basicFields}
          onSubmit={mockOnSubmit}
          isDarkMode={true}
          title="Dark Form"
        />
      );

      expect(screen.getByText('Dark Form')).toBeInTheDocument();
    });
  });
});
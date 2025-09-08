'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '../Box/Box';
import { Stack } from '../Stack/Stack';
import { Grid } from '../Grid/Grid';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { FormField } from '../FormField/FormField';
// FormGroup import removed - not used in current implementation
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { Select } from '../Select/Select';
import { Checkbox } from '../Checkbox/Checkbox';
// Radio import removed - using RadioGroup instead
import { RadioGroup } from '../RadioGroup/RadioGroup';
// CheckboxGroup import removed - not used in current implementation
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import { useTheme } from '../../utils/theme';

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: Array<{ value: string; label: string }>; // for select/radio
  defaultValue?: string | number | boolean | string[];
  disabled?: boolean;
  description?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
  validator?: (value: FormValue) => boolean; // for custom validation
}

export interface FormContainerProps {
  /**
   * Form fields configuration
   */
  fields: FormField[];
  
  /**
   * Form submission handler
   */
  onSubmit: (data: Record<string, FormValue>) => Promise<void> | void;
  
  /**
   * Field change handler
   */
  onFieldChange?: (fieldName: string, value: FormValue) => void;
  
  /**
   * Initial form values
   */
  initialValues?: Record<string, FormValue>;
  
  /**
   * When to validate fields
   * @default 'onBlur'
   */
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  
  /**
   * Form title
   */
  title?: string;
  
  /**
   * Form description
   */
  description?: string;
  
  /**
   * Submit button text
   * @default 'Submit'
   */
  submitText?: string;
  
  /**
   * Reset button text
   * @default 'Reset'
   */
  resetText?: string;
  
  /**
   * Show reset button
   * @default false
   */
  showReset?: boolean;
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Form layout
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal' | 'grid';
  
  /**
   * Number of columns for grid layout
   * @default 2
   */
  columns?: 1 | 2 | 3;
  
  /**
   * Form size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Form variant
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'card';
  
  /**
   * Show progress indicator
   * @default false
   */
  showProgress?: boolean;
  
  /**
   * Current step (for multi-step forms)
   */
  currentStep?: number;
  
  /**
   * Total steps (for multi-step forms)
   */
  totalSteps?: number;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Additional className
   */
  className?: string;
  
  /**
   * Test ID
   */
  'data-testid'?: string;
}

type FormValue = string | number | boolean | string[];

type FormState = {
  values: Record<string, FormValue>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  submissionState: 'idle' | 'submitting' | 'success' | 'error';
  submissionError?: string;
};

// Built-in validation functions
const validators = {
  required: (value: FormValue) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return !isNaN(value);
    return value != null && value !== '';
  },
  
  email: (value: string) => {
    if (!value) return true; // Only validate if value exists
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  minLength: (value: string, min: number) => {
    if (!value) return true; // Only validate if value exists
    return value.length >= min;
  },
  
  maxLength: (value: string, max: number) => {
    if (!value) return true; // Only validate if value exists
    return value.length <= max;
  },
  
  pattern: (value: string, pattern: RegExp) => {
    if (!value) return true; // Only validate if value exists
    return pattern.test(value);
  },
  
  custom: (value: FormValue, validator: (value: FormValue) => boolean) => {
    return validator(value);
  },
};

export const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(
  ({
    fields,
    onSubmit,
    onFieldChange,
    initialValues = {},
    validationMode = 'onBlur',
    title,
    description,
    submitText = 'Submit',
    resetText = 'Reset',
    showReset = false,
    loading = false,
    disabled = false,
    layout = 'vertical',
    columns = 2,
    size = 'md',
    variant = 'default',
    showProgress = false,
    currentStep,
    totalSteps,
    isDarkMode = false,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const theme = useTheme(isDarkMode);
    
    // Initialize form state with default values
    const initialFormState: FormState = useMemo(() => ({
      values: fields.reduce((acc, field) => {
        acc[field.name] = initialValues[field.name] ?? field.defaultValue ?? 
          (field.type === 'checkbox' ? false : 
           field.type === 'radio' ? '' : 
           Array.isArray(field.options) && field.type === 'select' ? '' : 
           '');
        return acc;
      }, {} as Record<string, FormValue>),
      errors: {},
      touched: {},
      submissionState: 'idle',
    }), [fields, initialValues]);
    
    const [formState, setFormState] = useState<FormState>(initialFormState);
    
    // Validate a single field
    const validateField = useCallback((fieldName: string, value: FormValue): string | null => {
      const field = fields.find(f => f.name === fieldName);
      if (!field || !field.validation) return null;
      
      for (const rule of field.validation) {
        let isValid = false;
        
        switch (rule.type) {
          case 'required':
            isValid = validators.required(value);
            break;
          case 'email':
            isValid = validators.email(value as string);
            break;
          case 'minLength':
            isValid = validators.minLength(value as string, rule.value as number);
            break;
          case 'maxLength':
            isValid = validators.maxLength(value as string, rule.value as number);
            break;
          case 'pattern':
            isValid = validators.pattern(value as string, rule.value as RegExp);
            break;
          case 'custom':
            isValid = validators.custom(value, rule.validator!);
            break;
          default:
            isValid = true;
        }
        
        if (!isValid) {
          return rule.message;
        }
      }
      
      return null;
    }, [fields]);
    
    // Validate all fields
    const validateForm = useCallback((): Record<string, string> => {
      const errors: Record<string, string> = {};
      
      fields.forEach(field => {
        const error = validateField(field.name, formState.values[field.name]);
        if (error) {
          errors[field.name] = error;
        }
      });
      
      return errors;
    }, [fields, formState.values, validateField]);
    
    // Handle field value change
    const handleFieldChange = useCallback((fieldName: string, value: FormValue) => {
      setFormState(prev => {
        const newValues = { ...prev.values, [fieldName]: value };
        const newErrors = { ...prev.errors };
        const newTouched = { ...prev.touched };
        
        // Validate on change if validationMode is 'onChange'
        if (validationMode === 'onChange') {
          const error = validateField(fieldName, value);
          if (error) {
            newErrors[fieldName] = error;
          } else {
            delete newErrors[fieldName];
          }
          // Mark field as touched when validating on change
          newTouched[fieldName] = true;
        }
        
        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          touched: newTouched,
          submissionState: 'idle', // Reset submission state on field change
        };
      });
      
      // Call external change handler
      onFieldChange?.(fieldName, value);
    }, [validationMode, validateField, onFieldChange]);
    
    // Handle field blur
    const handleFieldBlur = useCallback((fieldName: string) => {
      if (validationMode === 'onBlur') {
        setFormState(prev => {
          const error = validateField(fieldName, prev.values[fieldName]);
          const newErrors = { ...prev.errors };
          
          if (error) {
            newErrors[fieldName] = error;
          } else {
            delete newErrors[fieldName];
          }
          
          return {
            ...prev,
            errors: newErrors,
            touched: { ...prev.touched, [fieldName]: true },
          };
        });
      } else {
        setFormState(prev => ({
          ...prev,
          touched: { ...prev.touched, [fieldName]: true },
        }));
      }
    }, [validationMode, validateField]);
    
    // Handle form submission
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (loading || disabled) return;
      
      // Validate all fields
      const errors = validateForm();
      
      setFormState(prev => ({
        ...prev,
        errors,
        touched: fields.reduce((acc, field) => {
          acc[field.name] = true;
          return acc;
        }, {} as Record<string, boolean>),
      }));
      
      // If there are errors, don't submit
      if (Object.keys(errors).length > 0) {
        // Focus first field with error
        const firstErrorField = fields.find(field => errors[field.name]);
        if (firstErrorField) {
          const element = document.getElementById(`form-field-${firstErrorField.name}`);
          element?.focus();
        }
        return;
      }
      
      // Submit form
      setFormState(prev => ({ ...prev, submissionState: 'submitting' }));
      
      try {
        await onSubmit(formState.values);
        setFormState(prev => ({ 
          ...prev, 
          submissionState: 'success',
          submissionError: undefined,
        }));
      } catch (error) {
        setFormState(prev => ({ 
          ...prev, 
          submissionState: 'error',
          submissionError: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    }, [loading, disabled, validateForm, onSubmit, formState.values, fields]);
    
    // Handle form reset
    const handleReset = useCallback(() => {
      setFormState(initialFormState);
    }, [initialFormState]);
    
    // Get input size based on form size
    const getInputSize = (formSize: FormContainerProps['size']) => {
      switch (formSize) {
        case 'sm': return 'sm';
        case 'lg': return 'lg';
        default: return 'md';
      }
    };
    
    // Render a single field
    const renderField = useCallback((field: FormField) => {
      const fieldId = `form-field-${field.name}`;
      const fieldValue = formState.values[field.name];
      const fieldError = formState.errors[field.name];
      const fieldTouched = formState.touched[field.name];
      const showError = fieldError && (fieldTouched || formState.submissionState !== 'idle' || validationMode === 'onChange');
      
      let control: React.ReactNode;
      
      switch (field.type) {
        case 'textarea':
          control = (
            <Textarea
              id={fieldId}
              disabled={disabled || field.disabled}
              value={String(fieldValue || '')}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              isDarkMode={isDarkMode}
            />
          );
          break;
          
        case 'select':
          control = (
            <Select
              id={fieldId}
              disabled={disabled || field.disabled}
              value={String(fieldValue || '')}
              options={field.options || []}
              placeholder={field.placeholder}
              isDarkMode={isDarkMode}
              onChange={(value) => {
                handleFieldChange(field.name, value);
                handleFieldBlur(field.name); // Handle blur on change for Select
              }}
            />
          );
          break;
          
        case 'checkbox':
          control = (
            <Checkbox
              id={fieldId}
              disabled={disabled || field.disabled}
              onBlur={() => handleFieldBlur(field.name)}
              checked={Boolean(fieldValue)}
              label={field.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.checked)}
              isDarkMode={isDarkMode}
            />
          );
          break;
          
        case 'radio':
          control = (
            <RadioGroup
              value={String(fieldValue || '')}
              onChange={(value) => handleFieldChange(field.name, value)}
              options={field.options || []}
              isDarkMode={isDarkMode}
            />
          );
          break;
          
        default: // text, email, password, number
          control = (
            <Input
              id={fieldId}
              disabled={disabled || field.disabled}
              value={String(fieldValue || '')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              type={field.type}
              placeholder={field.placeholder}
              inputSize={getInputSize(size)}
              isDarkMode={isDarkMode}
            />
          );
          break;
      }
      
      // Don't wrap checkbox in FormField as it has its own label
      if (field.type === 'checkbox') {
        return control;
      }
      
      return (
        <FormField
          key={field.name}
          label={field.label}
          required={field.required}
          error={showError ? fieldError : undefined}
          helpText={field.description}
          isDarkMode={isDarkMode}
        >
          {control}
        </FormField>
      );
    }, [formState, disabled, size, isDarkMode, handleFieldChange, handleFieldBlur, validationMode]);
    
    // Render fields based on layout
    const renderFields = () => {
      const fieldElements = fields.map(renderField);
      
      switch (layout) {
        case 'horizontal':
          return (
            <Stack spacing={16}>
              {fieldElements.map((element, index) => (
                <Box key={fields[index].name} display="flex" alignItems="flex-start" gap={16}>
                  {element}
                </Box>
              ))}
            </Stack>
          );
          
        case 'grid':
          return (
            <Grid columns={columns} gap={16}>
              {fieldElements.map((element, index) => (
                <React.Fragment key={fields[index].name}>
                  {element}
                </React.Fragment>
              ))}
            </Grid>
          );
          
        default: // vertical
          return (
            <Stack spacing={16}>
              {fieldElements.map((element, index) => (
                <React.Fragment key={fields[index].name}>
                  {element}
                </React.Fragment>
              ))}
            </Stack>
          );
      }
    };
    
    // Render progress indicator
    const renderProgress = () => {
      if (!showProgress || !currentStep || !totalSteps) return null;
      
      const progressPercentage = (currentStep / totalSteps) * 100;
      
      return (
        <Box mb={24}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
            <Text fontSize={14} color={theme('text.secondary')}>
              Step {currentStep} of {totalSteps}
            </Text>
            <Text fontSize={14} color={theme('text.secondary')}>
              {Math.round(progressPercentage)}%
            </Text>
          </Box>
          <Box 
            width="100%" 
            height="4px" 
            bg={theme('surface.overlay')} 
            borderRadius="2px"
            overflow="hidden"
          >
            <Box
              height="100%"
              bg={theme('interactive.primary.background')}
              width={`${progressPercentage}%`}
              style={{ transition: 'width 300ms ease' }}
            />
          </Box>
        </Box>
      );
    };
    
    // Form content
    const formContent = (
      <Box>
        {renderProgress()}
        
        {/* Header */}
        {(title || description) && (
          <Box mb={32}>
            {title && (
              <Heading size="lg" mb={description ? 8 : 0} isDarkMode={isDarkMode}>
                {title}
              </Heading>
            )}
            {description && (
              <Text color={theme('text.secondary')} isDarkMode={isDarkMode}>
                {description}
              </Text>
            )}
          </Box>
        )}
        
        {/* Fields */}
        <Box mb={32}>
          {renderFields()}
        </Box>
        
        {/* Submission Error */}
        {formState.submissionState === 'error' && formState.submissionError && (
          <Box 
            mb={24} 
            p={12} 
            bg={theme('feedback.error.background')} 
            borderRadius="6px" 
            border={`1px solid ${theme('feedback.error.border')}`}
          >
            <Text color={theme('feedback.error.text')} fontSize={14}>
              {formState.submissionError}
            </Text>
          </Box>
        )}
        
        {/* Success Message */}
        {formState.submissionState === 'success' && (
          <Box 
            mb={24} 
            p={12} 
            bg={theme('feedback.success.background')} 
            borderRadius="6px" 
            border={`1px solid ${theme('feedback.success.border')}`}
          >
            <Text color={theme('feedback.success.text')} fontSize={14}>
              Form submitted successfully!
            </Text>
          </Box>
        )}
        
        {/* Actions */}
        <Box display="flex" gap={12} justifyContent="flex-end">
          {showReset && (
            <Button
              variant="outline"
              size={size}
              onClick={handleReset}
              disabled={disabled || loading}
              isDarkMode={isDarkMode}
            >
              {resetText}
            </Button>
          )}
          <Button
            type="submit"
            size={size}
            disabled={disabled || formState.submissionState === 'submitting'}
            isDarkMode={isDarkMode}
          >
            {formState.submissionState === 'submitting' ? 'Submitting...' : submitText}
          </Button>
        </Box>
      </Box>
    );
    
    return (
      <Box
        as="form"
        ref={ref}
        className={className}
        data-testid={dataTestId}
        onSubmit={handleSubmit}
        {...props}
      >
        {variant === 'card' ? (
          <Card isDarkMode={isDarkMode} p={32}>
            {formContent}
          </Card>
        ) : variant === 'bordered' ? (
          <Box
            border={`1px solid ${theme('border.default')}`}
            borderRadius="8px"
            p={32}
          >
            {formContent}
          </Box>
        ) : (
          formContent
        )}
      </Box>
    );
  }
);

FormContainer.displayName = 'FormContainer';

export default FormContainer;
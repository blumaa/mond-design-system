'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '../../layout/Box/Box';
import { Card } from '../../layout/Card/Card';
import { Stack } from '../../layout/Stack/Stack';
import { Header } from '../../organisms/Header/Header';
import { Sidebar, SidebarSection } from '../../organisms/Sidebar/Sidebar';
import { FormContainer, FormField } from '../../organisms/FormContainer/FormContainer';
import { ProgressStepper, StepConfig } from '../../organisms/ProgressStepper/ProgressStepper';
import { Button } from '../../atoms/Button/Button';
import { Text } from '../../atoms/Text/Text';
import { Heading } from '../../atoms/Heading/Heading';
import { Alert } from '../../organisms/Alert/Alert';
import { useTheme } from '../../../utils/theme';

// Form value types
export type FormValue = string | number | boolean | string[] | Date | null;
export type FormValues = Record<string, FormValue>;
export type ValidationErrors = Record<string, string>;

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: (values: FormValues) => ValidationErrors;
  optional?: boolean;
}

export interface FormTemplateProps {
  /**
   * Form title
   * @default 'Form'
   */
  title?: string;
  
  /**
   * Form description
   */
  description?: string;
  
  /**
   * Form sections (multi-step form)
   */
  sections: FormSection[];
  
  /**
   * Initial form values
   */
  initialValues?: FormValues;
  
  /**
   * Form submission handler
   */
  onSubmit: (data: FormValues) => Promise<void> | void;
  
  /**
   * Section change handler
   */
  onSectionChange?: (sectionIndex: number) => void;
  
  /**
   * Form progress callback
   */
  onProgressChange?: (completed: number, total: number) => void;
  
  /**
   * Whether to show the sidebar
   * @default false
   */
  showSidebar?: boolean;
  
  /**
   * Sidebar collapsed state
   * @default false
   */
  sidebarCollapsed?: boolean;
  
  /**
   * Navigation items for sidebar
   */
  navigationItems?: SidebarSection[];
  
  /**
   * Header actions
   */
  headerActions?: React.ReactNode;
  
  /**
   * Custom content for the side panel
   */
  sideContent?: React.ReactNode;
  
  /**
   * Whether form is in review mode
   * @default false
   */
  reviewMode?: boolean;
  
  /**
   * Allow navigation between steps
   * @default true
   */
  allowStepNavigation?: boolean;
  
  /**
   * Form layout variant
   * @default 'card'
   */
  variant?: 'default' | 'card' | 'split';
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Callback when navigation item is clicked
   */
  onNavigationClick?: (itemId: string) => void;
  
  /**
   * Callback when sidebar toggle is clicked
   */
  onSidebarToggle?: () => void;
  
  /**
   * Custom className
   */
  className?: string;
}

export const FormTemplate: React.FC<FormTemplateProps> = ({
  title = 'Form',
  description,
  sections,
  initialValues = {},
  onSubmit,
  onSectionChange,
  onProgressChange,
  showSidebar = false,
  sidebarCollapsed = false,
  navigationItems,
  headerActions,
  sideContent,
  reviewMode = false,
  allowStepNavigation = true,
  variant = 'card',
  isDarkMode = false,
  onNavigationClick,
  onSidebarToggle,
  className,
}) => {
  const theme = useTheme(isDarkMode);
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>(initialValues || {});
  const [sectionErrors, setSectionErrors] = useState<Record<number, Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;
  const isFirstSection = currentSection === 0;

  // Create steps for progress stepper
  const steps: StepConfig[] = useMemo(() => {
    return sections.map((section, index) => {
      const hasErrors = sectionErrors[index] && Object.keys(sectionErrors[index]).length > 0;
      const isCompleted = index < currentSection || (index === currentSection && !hasErrors && reviewMode);
      
      return {
        label: section.title,
        description: section.description,
        status: hasErrors ? 'error' : isCompleted ? 'completed' : index === currentSection ? 'active' : 'disabled'
      };
    });
  }, [sections, currentSection, sectionErrors, reviewMode]);

  // Validate current section
  const validateCurrentSection = useCallback(() => {
    if (!currentSectionData) return {};
    
    const errors: Record<string, string> = {};
    const currentValues = formValues;
    
    // Run section-level validation if provided
    if (currentSectionData.validation) {
      const sectionValidationErrors = currentSectionData.validation(currentValues);
      Object.assign(errors, sectionValidationErrors);
    }
    
    // Basic field validation
    currentSectionData.fields.forEach(field => {
      const value = currentValues[field.name];
      
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[field.name] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === 'email' && value && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.name] = 'Please enter a valid email address';
        }
      }
      
      // Custom validation
      if (field.validation) {
        for (const rule of field.validation) {
          // Basic validation check - full validation is handled by FormContainer
          if (rule.type === 'required' && field.required && !value) {
            errors[field.name] = rule.message;
            break;
          }
        }
      }
    });
    
    return errors;
  }, [currentSectionData, formValues]);

  // Handle field changes
  const handleFieldChange = useCallback((fieldName: string, value: FormValue) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear errors for this field
    setSectionErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[currentSection] && newErrors[currentSection][fieldName]) {
        const updatedSectionErrors = { ...newErrors[currentSection] };
        delete updatedSectionErrors[fieldName];
        newErrors[currentSection] = updatedSectionErrors;
      }
      return newErrors;
    });
  }, [currentSection]);

  // Handle section navigation
  const goToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex < 0 || sectionIndex >= sections.length) return;
    
    setCurrentSection(sectionIndex);
    onSectionChange?.(sectionIndex);
  }, [sections.length, onSectionChange]);

  // Handle next section
  const handleNext = useCallback(() => {
    const errors = validateCurrentSection();
    
    if (Object.keys(errors).length > 0) {
      setSectionErrors(prev => ({ ...prev, [currentSection]: errors }));
      return;
    }
    
    // Clear errors for current section
    setSectionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentSection];
      return newErrors;
    });
    
    if (!isLastSection) {
      goToSection(currentSection + 1);
    }
  }, [validateCurrentSection, currentSection, isLastSection, goToSection]);

  // Handle previous section
  const handlePrevious = useCallback(() => {
    if (!isFirstSection) {
      goToSection(currentSection - 1);
    }
  }, [isFirstSection, currentSection, goToSection]);

  // Handle step click
  const handleStepClick = useCallback((stepIndex: number) => {
    if (allowStepNavigation) {
      goToSection(stepIndex);
    }
  }, [allowStepNavigation, goToSection]);

  // Handle form submission
  const handleSubmit = useCallback(async (sectionValues: FormValues) => {
    const finalValues = { ...formValues, ...sectionValues };
    
    if (isLastSection) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        await onSubmit(finalValues);
        setSubmitSuccess(true);
        onProgressChange?.(sections.length, sections.length);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting the form');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormValues(finalValues);
      handleNext();
      onProgressChange?.(currentSection + 1, sections.length);
    }
  }, [formValues, isLastSection, onSubmit, handleNext, currentSection, sections.length, onProgressChange]);


  // Form content
  const formContent = (
    <Stack spacing={32}>
      {/* Progress Stepper */}
      <ProgressStepper
        steps={steps}
        currentStep={currentSection}
        onStepClick={handleStepClick}
        allowStepNavigation={allowStepNavigation}
        isDarkMode={isDarkMode}
      />
      
      {/* Success Message */}
      {submitSuccess && (
        <Alert
          variant="success"
          title="Form Submitted Successfully!"
          isDarkMode={isDarkMode}
        >
          Your form has been submitted and is being processed.
        </Alert>
      )}
      
      {/* Submit Error */}
      {submitError && (
        <Alert
          variant="error"
          title="Submission Error"
          isDarkMode={isDarkMode}
          dismissible={true}
          onDismiss={() => setSubmitError(null)}
        >
          {submitError}
        </Alert>
      )}
      
      {/* Current Section */}
      {currentSectionData && !submitSuccess && (
        <Box>
          <FormContainer
            fields={currentSectionData.fields}
            onSubmit={handleSubmit}
            onFieldChange={handleFieldChange}
            initialValues={Object.fromEntries(
              Object.entries(formValues).filter(([_, value]) => value != null)
            ) as Record<string, string | number | boolean | string[]>}
            title={currentSectionData.title}
            description={currentSectionData.description}
            submitText={isLastSection ? 'Submit' : 'Next'}
            loading={isSubmitting}
            variant="default"
            isDarkMode={isDarkMode}
          />
          
          {/* Navigation Buttons */}
          {!isFirstSection && (
            <Box style={{ marginTop: '24px' }}>
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
                isDarkMode={isDarkMode}
              >
                Previous
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Stack>
  );

  // Split layout content
  const splitContent = (
    <Box style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Panel - Form */}
      <Box style={{ flex: 1, padding: '32px' }}>
        {formContent}
      </Box>
      
      {/* Right Panel - Side Content */}
      {sideContent && (
        <Box style={{ 
          width: '400px', 
          backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
          padding: '32px',
          borderLeft: `1px solid ${theme('border.default')}`
        }}>
          {sideContent}
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      className={className}
      style={{
        minHeight: '100vh',
        backgroundColor: theme('surface.primary'),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Header
        title={title}
        rightContent={headerActions}
        isDarkMode={isDarkMode}
        onMobileMenuToggle={onSidebarToggle}
      />

      {/* Main Content */}
      <Box style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {showSidebar && navigationItems && (
          <Sidebar
            sections={navigationItems}
            collapsed={sidebarCollapsed}
            isDarkMode={isDarkMode}
            onItemClick={(item) => onNavigationClick?.(item.id)}
          />
        )}

        {/* Content Area */}
        <Box style={{ flex: 1 }}>
          {variant === 'split' ? splitContent : (
            <Box style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
              {/* Header */}
              <Box style={{ marginBottom: '32px' }}>
                <Heading level={2} style={{ marginBottom: '8px' }}>
                  {title}
                </Heading>
                {description && (
                  <Text variant="body-lg" semantic="secondary" isDarkMode={isDarkMode}>
                    {description}
                  </Text>
                )}
              </Box>

              {variant === 'card' ? (
                <Card padding={32} isDarkMode={isDarkMode}>
                  {formContent}
                </Card>
              ) : (
                formContent
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FormTemplate;
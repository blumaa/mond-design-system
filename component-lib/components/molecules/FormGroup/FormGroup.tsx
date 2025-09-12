'use client';
import React from 'react';
import { Stack } from '../../layout/Stack/Stack';
import { Box } from '../../layout/Box/Box';
import { useThemeContext } from '../../providers/ThemeProvider';

export interface FormGroupProps {
  'data-testid'?: string;
  
  /**
   * Group title/legend
   */
  title?: string;
  
  /**
   * Group description
   */
  description?: string;
  
  /**
   * Spacing between form fields
   * @default 20
   */
  spacing?: number;
  
  /**
   * Dark mode
   * @default false
   */
  
  /**
   * Form fields to group together
   */
  children: React.ReactNode;
  
  /**
   * Additional class name
   */
  className?: string;
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ 
    title,
    description,
    spacing = 20,
    
    children,
    className,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const { theme } = useThemeContext();

    return (
      <Box
        ref={ref}
        className={className}
        data-testid={dataTestId}
        {...props}
      >
        <Stack spacing={spacing}>
          {/* Header */}
          {(title || description) && (
            <Box>
              <Stack spacing={4}>
                {title && (
                  <Box
                    fontSize={16}
                    fontWeight="600"
                    color={theme('text.primary')}
                  >
                    {title}
                  </Box>
                )}
                {description && (
                  <Box
                    fontSize={14}
                    color={theme('text.secondary')}
                    lineHeight="1.5"
                  >
                    {description}
                  </Box>
                )}
              </Stack>
            </Box>
          )}
          
          {/* Form Fields */}
          <Stack spacing={16}>
            {children}
          </Stack>
        </Stack>
      </Box>
    );
  }
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
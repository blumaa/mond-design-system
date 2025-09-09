'use client';
import React, { useMemo, forwardRef } from 'react';
import { Box } from '../../layout/Box/Box';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../../utils/theme';

export interface StepConfig {
  /**
   * Step label text
   */
  label: string;
  
  /**
   * Optional step description
   */
  description?: string;
  
  /**
   * Optional custom icon for the step
   */
  icon?: React.ReactNode;
  
  /**
   * Step status - determines visual appearance
   */
  status?: 'completed' | 'active' | 'disabled' | 'error';
}

export interface ProgressStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of step configurations
   */
  steps: StepConfig[];
  
  /**
   * Current active step index (0-based)
   */
  currentStep: number;
  
  /**
   * Stepper orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Stepper size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Display variant
   * @default 'default'
   */
  variant?: 'default' | 'compact';
  
  /**
   * Optional callback when a step is clicked
   */
  onStepClick?: (stepIndex: number) => void;
  
  /**
   * Whether steps can be navigated by clicking
   * @default false
   */
  allowStepNavigation?: boolean;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

interface StepProps {
  config: StepConfig;
  index: number;
  isLast: boolean;
  currentStep: number;
  size: NonNullable<ProgressStepperProps['size']>;
  variant: NonNullable<ProgressStepperProps['variant']>;
  orientation: NonNullable<ProgressStepperProps['orientation']>;
  allowStepNavigation: boolean;
  onStepClick?: (stepIndex: number) => void;
  theme: (path: string) => string;
}

const getStepStatus = (index: number, currentStep: number, config: StepConfig): 'completed' | 'active' | 'disabled' | 'error' => {
  // Explicit status takes precedence
  if (config.status) {
    return config.status;
  }
  
  // Auto-determine status based on current step
  if (index < currentStep) {
    return 'completed';
  } else if (index === currentStep) {
    return 'active';
  } else {
    return 'disabled';
  }
};

const getSizeValues = (size: NonNullable<ProgressStepperProps['size']>) => {
  switch (size) {
    case 'small':
      return {
        stepSize: 24,
        fontSize: 'xs' as const,
        iconSize: 12,
        connectorHeight: 2,
        spacing: 12,
        labelSpacing: 6,
      };
    case 'large':
      return {
        stepSize: 48,
        fontSize: 'base' as const,
        iconSize: 20,
        connectorHeight: 3,
        spacing: 24,
        labelSpacing: 12,
      };
    case 'medium':
    default:
      return {
        stepSize: 36,
        fontSize: 'sm' as const,
        iconSize: 16,
        connectorHeight: 2,
        spacing: 16,
        labelSpacing: 8,
      };
  }
};

const StepIcon: React.FC<{
  status: 'completed' | 'active' | 'disabled' | 'error';
  index: number;
  customIcon?: React.ReactNode;
  size: number;
  iconSize: number;
  theme: (path: string) => string;
}> = ({ status, index, customIcon, size, iconSize, theme }) => {
  const getIconStyles = () => {
    const baseStyles = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${iconSize}px`,
      fontWeight: 600,
      transition: 'all 200ms ease',
      position: 'relative' as const,
    };

    switch (status) {
      case 'completed':
        return {
          ...baseStyles,
          backgroundColor: theme('interactive.primary.background'),
          color: theme('interactive.primary.text'),
          border: `2px solid ${theme('interactive.primary.background')}`,
        };
      case 'active':
        return {
          ...baseStyles,
          backgroundColor: theme('surface.background'),
          color: theme('text.primary'),
          border: `2px solid ${theme('interactive.primary.background')}`,
          boxShadow: `0 0 0 4px ${theme('interactive.primary.background')}20`,
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: theme('feedback.error.background'),
          color: theme('feedback.error.text'),
          border: `2px solid ${theme('border.error')}`,
        };
      case 'disabled':
      default:
        return {
          ...baseStyles,
          backgroundColor: theme('surface.disabled'),
          color: theme('text.disabled'),
          border: `2px solid ${theme('border.default')}`,
        };
    }
  };

  const iconContent = customIcon || (
    status === 'completed' ? '✓' : (index + 1).toString()
  );

  return (
    <Box style={getIconStyles()}>
      {iconContent}
    </Box>
  );
};

const StepConnector: React.FC<{
  orientation: 'horizontal' | 'vertical';
  status: 'completed' | 'active' | 'disabled' | 'error';
  height: number;
  theme: (path: string) => string;
}> = ({ orientation, status, height, theme }) => {
  const isCompleted = status === 'completed';
  const isHorizontal = orientation === 'horizontal';

  const connectorStyles = {
    backgroundColor: isCompleted 
      ? theme('interactive.primary.background') 
      : theme('border.default'),
    transition: 'background-color 200ms ease',
    ...(isHorizontal ? {
      height: `${height}px`,
      flex: 1,
      minWidth: '32px',
    } : {
      width: `${height}px`,
      height: '32px',
      flex: 1,
    }),
  };

  return <Box style={connectorStyles} />;
};

const Step: React.FC<StepProps> = ({
  config,
  index,
  isLast,
  currentStep,
  size,
  variant,
  orientation,
  allowStepNavigation,
  onStepClick,
  theme,
}) => {
  const status = getStepStatus(index, currentStep, config);
  const sizeValues = getSizeValues(size);
  const isClickable = allowStepNavigation && onStepClick && !config.status;
  const showLabels = variant !== 'compact';
  const isHorizontal = orientation === 'horizontal';

  const handleClick = () => {
    if (isClickable) {
      onStepClick(index);
    }
  };

  const stepContainerStyles = {
    display: 'flex',
    alignItems: isHorizontal ? 'center' : 'flex-start',
    flexDirection: isHorizontal ? ('row' as const) : ('column' as const),
    flex: isHorizontal ? 1 : undefined,
    cursor: isClickable ? 'pointer' : 'default',
    ...(isHorizontal && {
      minWidth: 0, // Allow flex shrinking
    }),
  };

  const stepContentStyles = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: isHorizontal ? ('column' as const) : ('row' as const),
    gap: `${sizeValues.labelSpacing}px`,
    ...(isHorizontal && {
      textAlign: 'center' as const,
    }),
  };

  const labelContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    ...(isHorizontal && {
      alignItems: 'center' as const,
      maxWidth: '120px', // Prevent horizontal overflow
    }),
  };

  return (
    <Box style={stepContainerStyles} onClick={handleClick}>
      <Box style={stepContentStyles}>
        <StepIcon
          status={status}
          index={index}
          customIcon={config.icon}
          size={sizeValues.stepSize}
          iconSize={sizeValues.iconSize}
          theme={theme}
        />
        
        {showLabels && (
          <Box style={labelContainerStyles}>
            <Text
              fontSize={sizeValues.fontSize}
              fontWeight={status === 'active' ? 'medium' : 'normal'}
              color={status === 'disabled' ? theme('text.disabled') : 
                     status === 'error' ? theme('text.error') : theme('text.primary')}
              style={{ 
                textAlign: isHorizontal ? 'center' : 'left',
                wordBreak: 'break-word',
                lineHeight: 1.2,
              }}
            >
              {config.label}
            </Text>
            
            {config.description && (
              <Text
                fontSize="xs"
                color={theme('text.secondary')}
                style={{ 
                  textAlign: isHorizontal ? 'center' : 'left',
                  wordBreak: 'break-word',
                  lineHeight: 1.3,
                }}
              >
                {config.description}
              </Text>
            )}
          </Box>
        )}
      </Box>
      
      {/* Connector */}
      {!isLast && (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(isHorizontal ? {
              marginLeft: `${sizeValues.spacing}px`,
              marginRight: `${sizeValues.spacing}px`,
            } : {
              marginTop: `${sizeValues.spacing}px`,
              marginBottom: `${sizeValues.spacing}px`,
              marginLeft: `${sizeValues.stepSize / 2 - 1}px`, // Center with step icon
            }),
          }}
        >
          <StepConnector
            orientation={orientation}
            status={index < currentStep ? 'completed' : 'disabled'}
            height={sizeValues.connectorHeight}
            theme={theme}
          />
        </Box>
      )}
    </Box>
  );
};

export const ProgressStepper = forwardRef<HTMLDivElement, ProgressStepperProps>(
  ({
    steps,
    currentStep,
    orientation = 'horizontal',
    size = 'medium',
    variant = 'default',
    onStepClick,
    allowStepNavigation = false,
    isDarkMode = false,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const theme = useTheme(isDarkMode);
    
    // Validate props
    const validatedCurrentStep = Math.max(0, Math.min(currentStep, steps.length - 1));
    
    // Memoize steps with validation
    const validatedSteps = useMemo(() => {
      return steps.map((step, index) => ({
        ...step,
        // Ensure we have at minimum a label
        label: step.label || `Step ${index + 1}`,
      }));
    }, [steps]);

    if (validatedSteps.length === 0) {
      console.warn('ProgressStepper: No steps provided');
      return null;
    }

    const isHorizontal = orientation === 'horizontal';
    
    const containerStyles = {
      display: 'flex',
      alignItems: isHorizontal ? 'center' : 'flex-start',
      flexDirection: isHorizontal ? ('row' as const) : ('column' as const),
      width: '100%',
      ...(variant === 'compact' && {
        alignItems: 'center',
      }),
    };

    return (
      <Box
        ref={ref}
        className={className}
        data-testid={dataTestId}
        style={containerStyles}
        role="progressbar"
        aria-valuenow={validatedCurrentStep + 1}
        aria-valuemin={1}
        aria-valuemax={validatedSteps.length}
        aria-label={`Step ${validatedCurrentStep + 1} of ${validatedSteps.length}`}
        {...props}
      >
        {validatedSteps.map((step, index) => (
          <Step
            key={`step-${index}-${step.label}`}
            config={step}
            index={index}
            isLast={index === validatedSteps.length - 1}
            currentStep={validatedCurrentStep}
            size={size}
            variant={variant}
            orientation={orientation}
            allowStepNavigation={allowStepNavigation}
            onStepClick={onStepClick}
            theme={theme}
          />
        ))}
      </Box>
    );
  }
);

ProgressStepper.displayName = 'ProgressStepper';

export default ProgressStepper;
'use client';
import React from 'react';
import { spacing, fontSizes, fontWeights, fontFamilies, radii } from '../../../tokens';
import { useTheme } from '../../../utils/theme';
import { Box } from '../../layout/Box/Box';
import { Button } from '../../atoms/Button/Button';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Alert variant that determines colors and styling
   * @default 'info'
   */
  variant?: AlertVariant;
  
  /**
   * Alert title (optional)
   */
  title?: string;
  
  /**
   * Alert message content
   */
  children: React.ReactNode;
  
  /**
   * Action buttons to display
   */
  actions?: AlertAction[];
  
  /**
   * Whether the alert can be dismissed
   * @default false
   */
  dismissible?: boolean;
  
  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;
  
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

const getVariantStyles = (variant: AlertVariant, theme: (path: string) => string) => {
  switch (variant) {
    case 'success':
      return {
        backgroundColor: theme('feedback.success.background'),
        borderColor: theme('feedback.success.border'),
        iconColor: theme('feedback.success.text'),
        textColor: theme('text.primary'),
        icon: '✓',
      };
    case 'warning':
      return {
        backgroundColor: theme('feedback.warning.background'),
        borderColor: theme('feedback.warning.border'),
        iconColor: theme('feedback.warning.text'),
        textColor: theme('text.primary'),
        icon: '⚠',
      };
    case 'error':
      return {
        backgroundColor: theme('feedback.error.background'),
        borderColor: theme('feedback.error.border'),
        iconColor: theme('feedback.error.text'),
        textColor: theme('text.primary'),
        icon: '✕',
      };
    case 'info':
    default:
      return {
        backgroundColor: theme('feedback.info.background'),
        borderColor: theme('feedback.info.border'),
        iconColor: theme('feedback.info.text'),
        textColor: theme('text.primary'),
        icon: 'ℹ',
      };
  }
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    variant = 'info',
    title,
    children,
    actions,
    dismissible = false,
    onDismiss,
    isDarkMode = false,
    'data-testid': dataTestId,
    className,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const variantStyles = getVariantStyles(variant, theme);

    return (
      <Box
        ref={ref}
        className={className}
        data-testid={dataTestId}
        style={{
          display: 'flex',
          padding: spacing[4],
          backgroundColor: variantStyles.backgroundColor,
          border: `1px solid ${variantStyles.borderColor}`,
          borderRadius: radii.md,
          gap: spacing[3],
        }}
        {...props}
      >
        {/* Icon */}
        <Box
          style={{
            flexShrink: 0,
            color: variantStyles.iconColor,
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.bold,
            lineHeight: 1,
            marginTop: title ? '2px' : '0',
          }}
        >
          {variantStyles.icon}
        </Box>

        {/* Content */}
        <Box
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {title && (
            <Box
              as="h4"
              style={{
                margin: 0,
                marginBottom: spacing[2],
                fontFamily: fontFamilies.sans,
                fontSize: fontSizes.base,
                fontWeight: fontWeights.semibold,
                color: variantStyles.textColor,
                lineHeight: 1.4,
              }}
            >
              {title}
            </Box>
          )}
          
          <Box
            style={{
              fontFamily: fontFamilies.sans,
              fontSize: fontSizes.sm,
              color: variantStyles.textColor,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {children}
          </Box>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <Box
              style={{
                display: 'flex',
                gap: spacing[2],
                marginTop: spacing[3],
                flexWrap: 'wrap',
              }}
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  isDarkMode={isDarkMode}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Dismiss Button */}
        {dismissible && (
          <Box
            style={{
              flexShrink: 0,
            }}
          >
            <Box
              as="button"
              onClick={onDismiss}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: spacing[1],
                color: variantStyles.textColor,
                fontSize: fontSizes.lg,
                lineHeight: 1,
                borderRadius: radii.sm,
                opacity: 0.7,
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.opacity = '0.7';
              }}
            >
              ×
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
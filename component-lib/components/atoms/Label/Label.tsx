import { forwardRef } from 'react';
import { Box, BoxProps } from '../../layout/Box/Box';
import { tokens } from '../../../tokens/tokens';
import { useTheme } from '../../providers/ThemeProvider';

export interface LabelProps extends Omit<BoxProps, 'as' | 'children'> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold';
  semantic?: 'default' | 'error' | 'success';
  requiredIndicator?: string;
}

const getSizeStyles = (size: string) => {
  const sizeMap = {
    sm: {
      fontSize: tokens.fontSizes.xs,
      lineHeight: tokens.lineHeights.tight,
    },
    md: {
      fontSize: tokens.fontSizes.sm, 
      lineHeight: tokens.lineHeights.snug,
    },
    lg: {
      fontSize: tokens.fontSizes.base,
      lineHeight: tokens.lineHeights.normal,
    },
  };
  return sizeMap[size as keyof typeof sizeMap];
};

const getSemanticColor = (semantic: string, theme: ReturnType<typeof useTheme>, disabled: boolean) => {
  if (disabled) {
    return theme('text.disabled');
  }

  const colorMap = {
    default: theme('text.primary'),
    error: theme('text.error'),
    success: theme('text.success'),
  };
  return colorMap[semantic as keyof typeof colorMap];
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({
  children,
  htmlFor,
  required = false,
  disabled = false,
  size = 'md',
  weight = 'medium',
  semantic = 'default',
  requiredIndicator = '*',
  className = '',
  style,
  ...props
}, ref) => {
  const theme = useTheme();
  const sizeStyles = getSizeStyles(size);
  const textColor = getSemanticColor(semantic, theme, disabled);
  const fontWeight = tokens.fontWeights[weight as keyof typeof tokens.fontWeights];

  const labelStyle = {
    display: 'inline-block',
    fontSize: sizeStyles.fontSize,
    lineHeight: sizeStyles.lineHeight,
    fontWeight,
    color: textColor,
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginBottom: tokens.spacing['1'], // 0.25rem
    ...style,
  };

  const requiredStyle = {
    color: theme('text.error'),
    marginLeft: tokens.spacing['1'], // 0.25rem
    fontSize: 'inherit',
  };

  return (
    <Box
      ref={ref}
      as="label"
      className={`mond-label mond-label--${size} ${disabled ? 'mond-label--disabled' : ''} ${className}`}
      style={labelStyle}
      {...(htmlFor && { htmlFor })}
      {...props}
    >
      {children}
      {required && (
        <span 
          className="mond-label__required"
          style={requiredStyle}
          aria-label="required"
        >
          {requiredIndicator}
        </span>
      )}
    </Box>
  );
});

Label.displayName = 'Label';
import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box/Box';
import { tokens } from '../../tokens/tokens';

export interface LabelProps extends Omit<BoxProps, 'as' | 'children'> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold';
  isDarkMode?: boolean;
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

const getSemanticColor = (semantic: string, isDarkMode: boolean, disabled: boolean) => {
  if (disabled) {
    return isDarkMode ? tokens.colors.gray['600'] : tokens.colors.gray['400'];
  }

  const colorMap = {
    default: isDarkMode ? tokens.colors.gray['200'] : tokens.colors.gray['700'],
    error: isDarkMode ? tokens.colors.red['400'] : tokens.colors.red['600'],
    success: isDarkMode ? tokens.colors.green['400'] : tokens.colors.green['600'],
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
  isDarkMode = false,
  semantic = 'default',
  requiredIndicator = '*',
  className = '',
  style,
  ...props
}, ref) => {
  const sizeStyles = getSizeStyles(size);
  const textColor = getSemanticColor(semantic, isDarkMode, disabled);
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
    color: isDarkMode ? tokens.colors.red['400'] : tokens.colors.red['500'],
    marginLeft: tokens.spacing['1'], // 0.25rem
    fontSize: 'inherit',
  };

  return (
    <Box
      ref={ref}
      as="label"
      htmlFor={htmlFor}
      className={`mond-label mond-label--${size} ${disabled ? 'mond-label--disabled' : ''} ${className}`}
      style={labelStyle}
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
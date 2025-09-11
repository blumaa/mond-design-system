import { forwardRef } from 'react';
import { Box, BoxProps } from '../../layout/Box/Box';
import { tokens } from '../../../tokens/tokens';
import { useThemeContext } from '../../providers/ThemeProvider';

export interface DividerProps extends Omit<BoxProps, 'children'> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'subtle' | 'strong';
  size?: 'sm' | 'md' | 'lg';
  children?: string;
}

const getBorderColor = (variant: string, isDark: boolean) => {
  const colorMap = {
    default: isDark ? tokens.colors.gray['600'] : tokens.colors.gray['300'],
    subtle: isDark ? tokens.colors.gray['700'] : tokens.colors.gray['200'],
    strong: isDark ? tokens.colors.gray['500'] : tokens.colors.gray['400'],
  };
  return colorMap[variant as keyof typeof colorMap];
};

const getSizeValue = (size: string) => {
  const sizeMap = {
    sm: '1px',
    md: '1px', 
    lg: '2px',
  };
  return sizeMap[size as keyof typeof sizeMap];
};

export const Divider = forwardRef<HTMLElement, DividerProps>(({
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  
  children,
  className = '',
  style,
  m,
  my,
  mx,
  mt,
  mb,
  ml,
  mr,
  ...props
}, ref) => {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === 'dark';
  
  const borderColor = getBorderColor(variant, isDark);
  const borderSize = getSizeValue(size);
  
  const isHorizontal = orientation === 'horizontal';
  
  // Default margins - horizontal dividers get vertical margins, vertical dividers get horizontal margins
  const margins = {
    m,
    my: my !== undefined ? my : (m !== undefined ? m : (isHorizontal ? '4' : '0')),
    mx: mx !== undefined ? mx : (m !== undefined ? m : (isHorizontal ? '0' : '4')),
    mt,
    mb,
    ml,
    mr,
  };

  if (children) {
    // Divider with text content
    const textStyle = {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center' as const,
      fontSize: tokens.fontSizes.sm,
      color: isDark ? tokens.colors.gray['400'] : tokens.colors.gray['600'],
      fontWeight: tokens.fontWeights.medium,
    };

    const lineStyle = {
      flex: 1,
      height: borderSize,
      backgroundColor: borderColor,
    };

    return (
      <Box
        ref={ref}
        className={`mond-divider mond-divider--${orientation} ${className}`}
        style={{ ...textStyle, ...style }}
        role="separator"
        {...margins}
        {...props}
      >
        <Box style={lineStyle} />
        <Box px="3" style={{ fontSize: tokens.fontSizes.sm }}>
          {children}
        </Box>
        <Box style={lineStyle} />
      </Box>
    );
  }

  // Simple line divider
  const dividerStyle = isHorizontal
    ? {
        width: '100%',
        height: borderSize,
        backgroundColor: borderColor,
        border: 'none',
        ...style,
      }
    : {
        width: borderSize,
        height: '100%',
        minHeight: '24px',
        backgroundColor: borderColor,
        border: 'none',
        ...style,
      };

  const element = isHorizontal ? 'hr' : 'div';

  return (
    <Box
      ref={ref}
      as={element}
      className={`mond-divider mond-divider--${orientation} ${className}`}
      style={dividerStyle}
      role="separator"
      {...(isHorizontal ? {} : { 'aria-orientation': 'vertical' })}
      {...margins}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';
import React from 'react';
import { Box, BoxProps } from '../Box/Box';
import { useTheme } from '../../providers/ThemeProvider';

export interface CardProps extends BoxProps {
  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: 'flat' | 'outlined' | 'elevated';
  
  /**
   * Padding inside the card
   * @default 24
   */
  padding?: number | string;
}

export interface CardHeaderProps extends BoxProps {}
export interface CardBodyProps extends BoxProps {}
export interface CardFooterProps extends BoxProps {}

const getCardStyles = (variant: CardProps['variant'], theme: ReturnType<typeof useTheme>) => {
  const baseStyles = {
    borderRadius: 8,
    transition: 'all 150ms ease',
  };

  switch (variant) {
    case 'flat':
      return {
        ...baseStyles,
        bg: 'surface.elevated',
      };
    case 'outlined':
      return {
        ...baseStyles,
        bg: 'surface.elevated',
        border: '1px solid',
        borderColor: 'border.default',
      };
    case 'elevated':
    default:
      return {
        ...baseStyles,
        bg: 'surface.elevated',
        boxShadow: theme('effects.shadow.sm'),
      };
  }
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'elevated',
  padding = 24,
  children,
  isDarkMode,
  ...props
}, ref) => {
  const theme = useTheme(isDarkMode);
  const styles = getCardStyles(variant, theme);
  
  return (
    <Box
      ref={ref}
      p={padding}
      {...styles}
      {...props}
    >
      {children}
    </Box>
  );
});

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({
  children,
  ...props
}, ref) => (
  <Box
    ref={ref}
    mb={16}
    {...props}
  >
    {children}
  </Box>
));

CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(({
  children,
  ...props
}, ref) => (
  <Box
    ref={ref}
    {...props}
  >
    {children}
  </Box>
));

CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({
  children,
  ...props
}, ref) => (
  <Box
    ref={ref}
    mt={16}
    display="flex"
    justifyContent="flex-end"
    gap={12}
    {...props}
  >
    {children}
  </Box>
));

CardFooter.displayName = 'CardFooter';
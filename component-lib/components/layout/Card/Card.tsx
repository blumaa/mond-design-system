import React from 'react';
import { Box, BoxProps } from '../Box/Box';
import { useTheme } from '../../providers/ThemeProvider';

export interface CardProps extends BoxProps {
  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: 'flat' | 'outlined' | 'elevated' | 'glass' | 'floating';

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
    borderRadius: 12,
    transition: 'all 300ms ease',
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
    case 'glass':
      return {
        ...baseStyles,
        bg: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: theme('effects.shadow.glow'),
        '&:hover': {
          bg: 'rgba(255, 255, 255, 0.08)',
          transform: 'translateY(-2px)',
          boxShadow: theme('effects.shadow.floating'),
        },
      };
    case 'floating':
      return {
        ...baseStyles,
        bg: 'surface.elevated',
        boxShadow: theme('effects.shadow.floating'),
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme('effects.shadow.dramatic'),
        },
      };
    case 'elevated':
    default:
      return {
        ...baseStyles,
        bg: 'surface.elevated',
        boxShadow: theme('effects.shadow.lg'),
        border: '1px solid rgba(255, 255, 255, 0.05)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: theme('effects.shadow.xl'),
        },
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
      bg={styles.bg}
      borderRadius={styles.borderRadius}
      boxShadow={'boxShadow' in styles ? styles.boxShadow : undefined}
      border={'border' in styles ? styles.border : undefined}
      borderColor={'borderColor' in styles ? styles.borderColor : undefined}
      transition={styles.transition}
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
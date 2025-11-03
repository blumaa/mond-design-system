import { forwardRef } from 'react';
import styled from 'styled-components';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';

export interface DividerProps extends Omit<BoxProps, 'as' | 'children'> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'subtle' | 'strong';
  size?: 'sm' | 'md' | 'lg';
}

const StyledDivider = styled(Box).attrs({ as: 'hr' })<DividerProps>`
  border: 0;
  margin: 0;

  /* Orientation */
  ${({ orientation, theme }) => orientation === 'horizontal' ? `
    width: 100%;
    height: 0;
    margin-top: ${theme.space[4]};
    margin-bottom: ${theme.space[4]};
  ` : `
    width: 0;
    height: 100%;
    margin-left: ${theme.space[4]};
    margin-right: ${theme.space[4]};
    display: inline-block;
  `}

  /* Variants */
  ${({ orientation, variant, theme }) => {
    const borderColor = variant === 'subtle'
      ? theme.colors.borderSubtle
      : variant === 'strong'
      ? theme.colors.borderStrong
      : theme.colors.borderDefault;

    return orientation === 'horizontal'
      ? `border-top: 1px solid ${borderColor};`
      : `border-left: 1px solid ${borderColor};`;
  }}

  /* Sizes */
  ${({ orientation, size }) => {
    const borderWidth = size === 'lg' ? '2px' : '1px';
    return orientation === 'horizontal'
      ? `border-top-width: ${borderWidth};`
      : `border-left-width: ${borderWidth};`;
  }}
`;

/**
 * Divider Component
 *
 * A visual separator with support for horizontal/vertical orientation,
 * multiple variants, and sizes. Uses styled-components for theming.
 *
 * **SSR-Compatible**: Uses styled-components with theme tokens.
 * **Theme-Aware**: Automatically responds to theme changes via styled-components.
 *
 * @example
 * <Divider />
 *
 * @example
 * <Divider orientation="vertical" variant="strong" />
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(({
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  return (
    <StyledDivider
      ref={ref as React.Ref<HTMLHRElement>}
      orientation={orientation}
      variant={variant}
      size={size}
      data-orientation={orientation}
      data-variant={variant}
      data-size={size}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';


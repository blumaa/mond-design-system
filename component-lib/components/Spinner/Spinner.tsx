import { forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';

export interface SpinnerProps extends Omit<BoxProps, 'children' | 'as'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  label?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled(Box)<SpinnerProps>`
  border: 2px solid transparent;
  border-top-color: ${({ color, theme }) => color || theme.colors.brandPrimary600};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  position: relative;
  display: inline-block;

  /* Size Variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'xs':
        return `
          width: ${theme.space[4]};
          height: ${theme.space[4]};
        `;
      case 'sm':
        return `
          width: ${theme.space[5]};
          height: ${theme.space[5]};
        `;
      case 'lg':
        return `
          width: ${theme.space[8]};
          height: ${theme.space[8]};
        `;
      case 'xl':
        return `
          width: ${theme.space[10]};
          height: ${theme.space[10]};
        `;
      default: // md
        return `
          width: ${theme.space[6]};
          height: ${theme.space[6]};
        `;
    }
  }}
`;

const VisuallyHiddenLabel = styled(Box).attrs({ as: 'span' })`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

/**
 * Spinner Component
 *
 * A loading indicator with multiple sizes. Uses CSS animations for rotation.
 * Uses styled-components for theming.
 *
 * **SSR-Compatible**: Uses styled-components with theme tokens.
 * **Theme-Aware**: Automatically responds to theme changes via styled-components.
 *
 * @example
 * <Spinner />
 *
 * @example
 * <Spinner size="lg" label="Loading data..." />
 */
export const Spinner = forwardRef<HTMLElement, SpinnerProps>(({
  size = 'md',
  color,
  label = 'Loading...',
  ...props
}, ref) => {
  return (
    <StyledSpinner
      ref={ref as React.Ref<HTMLElement>}
      size={size}
      color={color}
      role="status"
      aria-live="polite"
      data-size={size}
      {...props}
    >
      <VisuallyHiddenLabel>
        {label}
      </VisuallyHiddenLabel>
    </StyledSpinner>
  );
});

Spinner.displayName = 'Spinner';


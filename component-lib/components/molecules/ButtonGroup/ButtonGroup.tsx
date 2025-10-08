'use client';
import React from 'react';
import { spacing } from '../../../tokens';
import { Box } from '../../layout/Box/Box';
import { ButtonVariant, ButtonSize, ButtonCorners, ButtonAlignContent } from '../../atoms/Button/Button';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Layout orientation of the button group
   * @default 'horizontal'
   */
  orientation?: ButtonGroupOrientation;

  /**
   * Gap between buttons using design tokens
   * @default spacing[2]
   */
  gap?: string | number;

  /**
   * Variant applied to all buttons in the group
   */
  variant?: ButtonVariant;

  /**
   * Size applied to all buttons in the group
   */
  size?: ButtonSize;

  /**
   * Corner style applied to all buttons in the group
   */
  corners?: ButtonCorners;

  /**
   * Alignment applied to all buttons in the group
   */
  alignContent?: ButtonAlignContent;

  /**
   * Button components to group together
   */
  children: React.ReactNode;

  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({
    orientation = 'horizontal',
    gap = spacing[2],
    variant,
    size,
    corners,
    alignContent,
    children,
    'data-testid': dataTestId,
    ...props
  }, ref) => {

    // Clone children to inherit group-level props
    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childType = child.type as React.ComponentType;
        // Check if it's a Button component (by displayName or component name)
        const isButton = childType && (
          childType.displayName === 'Button' ||
          (childType as React.ComponentType & { name?: string }).name === 'Button'
        );

        if (isButton) {
          const childProps = child.props as Record<string, unknown>;
          return React.cloneElement(child, {
            variant: childProps.variant || variant,
            size: childProps.size || size,
            corners: childProps.corners || corners,
            alignContent: childProps.alignContent || alignContent,
            isDarkMode: childProps.isDarkMode
          } as Record<string, unknown>);
        }
      }
      return child;
    });

    return (
      <Box
        ref={ref}
        display="flex"
        flexDirection={orientation === 'vertical' ? 'column' : 'row'}
        gap={gap}
        role="group"
        data-testid={dataTestId}
        {...props}
      >
        {enhancedChildren}
      </Box>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
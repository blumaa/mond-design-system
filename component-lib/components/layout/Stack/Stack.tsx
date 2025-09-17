import React from 'react';
import { Box, BoxProps } from '../Box/Box';

export interface StackProps extends Omit<BoxProps, 'display' | 'flexDirection'> {
  /**
   * Direction of the stack
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Spacing between items - supports numeric spacing tokens (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64) or pixel values
   * @default '4'
   */
  spacing?: number | string;

  /**
   * Alignment of items
   */
  align?: 'start' | 'center' | 'end' | 'stretch';

  /**
   * Justification of items
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const alignMap = {
  start: 'flex-start',
  center: 'center', 
  end: 'flex-end',
  stretch: 'stretch',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end', 
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(({
  direction = 'vertical',
  spacing = '4',
  align,
  justify,
  children,
  ...props
}, ref) => {
  const flexDirection = direction === 'vertical' ? 'column' : 'row';

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection={flexDirection}
      gap={spacing}
      alignItems={align ? alignMap[align] : undefined}
      justifyContent={justify ? justifyMap[justify] : undefined}
      {...props}
    >
      {children}
    </Box>
  );
});

Stack.displayName = 'Stack';
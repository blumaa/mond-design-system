import React from 'react';
import { Box, BoxProps } from '../Box/Box';

export interface GridProps extends Omit<BoxProps, 'display'> {
  /**
   * Number of columns (creates equal-width columns)
   */
  columns?: number;
  
  /**
   * Custom template columns (CSS grid-template-columns)
   */
  templateColumns?: string;
  
  /**
   * Custom template rows (CSS grid-template-rows)
   */
  templateRows?: string;
  
  /**
   * Gap between grid items
   * @default 16
   */
  gap?: number | string;
  
  /**
   * Row gap
   */
  rowGap?: number | string;
  
  /**
   * Column gap
   */
  columnGap?: number | string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  columns,
  templateColumns,
  templateRows,
  gap = 16,
  rowGap,
  columnGap,
  children,
  ...props
}, ref) => {
  // Generate template columns from columns prop
  const gridTemplateColumns = templateColumns || 
    (columns ? `repeat(${columns}, 1fr)` : undefined);
  
  return (
    <Box
      ref={ref}
      display="grid"
      gridTemplateColumns={gridTemplateColumns}
      gridTemplateRows={templateRows}
      gap={gap}
      rowGap={rowGap}
      columnGap={columnGap}
      {...props}
    >
      {children}
    </Box>
  );
});

Grid.displayName = 'Grid';
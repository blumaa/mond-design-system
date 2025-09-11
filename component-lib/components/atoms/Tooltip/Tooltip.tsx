'use client';
import React, { useState, useRef, useEffect } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies, shadows } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipTrigger = 'hover' | 'focus' | 'click';

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: React.ReactNode;
  
  /**
   * Tooltip placement
   * @default 'top'
   */
  placement?: TooltipPlacement;
  
  /**
   * Trigger behavior
   * @default 'hover'
   */
  trigger?: TooltipTrigger;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Delay before showing tooltip (ms)
   * @default 300
   */
  delay?: number;
  
  /**
   * Whether tooltip is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom class for tooltip container
   */
  className?: string;
  
  /**
   * Element that triggers the tooltip
   */
  children: React.ReactElement;
  
  /**
   * Test ID for the tooltip
   */
  'data-testid'?: string;
}

const getPlacementStyles = (placement: TooltipPlacement, offset: number = 8) => {
  switch (placement) {
    case 'top':
      return {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: `${offset}px`,
      };
    case 'bottom':
      return {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: `${offset}px`,
      };
    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: `${offset}px`,
      };
    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: `${offset}px`,
      };
    default:
      return {};
  }
};

const getArrowStyles = (placement: TooltipPlacement, theme: (path: string) => string) => {
  const arrowSize = 6;
  const borderColor = theme('surface.elevated');
  
  const baseStyles = {
    position: 'absolute' as const,
    width: 0,
    height: 0,
    border: `${arrowSize}px solid transparent`,
  };

  switch (placement) {
    case 'top':
      return {
        ...baseStyles,
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderTopColor: borderColor,
        borderBottomWidth: 0,
      };
    case 'bottom':
      return {
        ...baseStyles,
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderBottomColor: borderColor,
        borderTopWidth: 0,
      };
    case 'left':
      return {
        ...baseStyles,
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderLeftColor: borderColor,
        borderRightWidth: 0,
      };
    case 'right':
      return {
        ...baseStyles,
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderRightColor: borderColor,
        borderLeftWidth: 0,
      };
    default:
      return baseStyles;
  }
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  trigger = 'hover',
  isDarkMode,
  delay = 300,
  disabled = false,
  className,
  children,
  'data-testid': dataTestId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const theme = useTheme(isDarkMode);

  const shouldShow = !disabled && (
    (trigger === 'hover' && isHovered) ||
    (trigger === 'focus' && isFocused) ||
    (trigger === 'click' && isVisible)
  );

  useEffect(() => {
    if (shouldShow && !isVisible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else if (!shouldShow && isVisible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (trigger !== 'click') {
        setIsVisible(false);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldShow, isVisible, delay, trigger]);

  // Handle click outside for click trigger
  useEffect(() => {
    if (trigger === 'click' && isVisible) {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsVisible(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [trigger, isVisible]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsHovered(false);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      setIsFocused(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };


  const arrowStyles = getArrowStyles(placement, theme);

  // Clone child element to add event handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childElement = React.cloneElement(children as React.ReactElement<any>, {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter();
      // @ts-expect-error React 19 children props typing
      if (children.props.onMouseEnter) {
        // @ts-expect-error React 19 children props typing
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave();
      // @ts-expect-error React 19 children props typing
      if (children.props.onMouseLeave) {
        // @ts-expect-error React 19 children props typing
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      handleFocus();
      // @ts-expect-error React 19 children props typing
      if (children.props.onFocus) {
        // @ts-expect-error React 19 children props typing
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      handleBlur();
      // @ts-expect-error React 19 children props typing
      if (children.props.onBlur) {
        // @ts-expect-error React 19 children props typing
        children.props.onBlur(e);
      }
    },
    onClick: (e: React.MouseEvent) => {
      handleClick();
      // @ts-expect-error React 19 children props typing
      if (children.props.onClick) {
        // @ts-expect-error React 19 children props typing
        children.props.onClick(e);
      }
    },
  });

  return (
    <Box 
      ref={containerRef}
      className={className}
      position="relative"
      display="inline-block"
      data-testid={dataTestId}
    >
      {childElement}
      <Box
        style={{
          position: 'absolute',
          zIndex: 1000,
          padding: `${spacing[2]} ${spacing[3]}`,
          backgroundColor: theme('surface.elevated'),
          color: theme('text.primary'),
          border: `1px solid ${theme('border.default')}`,
          borderRadius: radii.md,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.normal,
          fontFamily: fontFamilies.sans,
          maxWidth: '200px',
          ...getPlacementStyles(placement),
          lineHeight: '1.4',
          wordWrap: 'break-word',
          boxShadow: shadows.md,
          opacity: isVisible ? 1 : 0,
          visibility: (isVisible ? 'visible' : 'hidden') as React.CSSProperties['visibility'],
          transition: 'opacity 150ms ease, visibility 150ms ease',
          pointerEvents: 'none',
        }}
        data-testid={`${dataTestId || 'tooltip'}-content`}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {content}
        <Box style={arrowStyles} data-testid={`${dataTestId || 'tooltip'}-arrow`} />
      </Box>
    </Box>
  );
};

export default Tooltip;
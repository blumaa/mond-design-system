'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Box } from '../Box/Box';
import './tooltip.css';

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

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  trigger = 'hover',
  disabled = false,
  className,
  children,
  'data-testid': dataTestId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (trigger === 'hover' && !disabled) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !disabled) {
      setIsVisible(false);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus' && !disabled) {
      setIsVisible(true);
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus' && !disabled) {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click' && !disabled) {
      setIsVisible(!isVisible);
    }
  };

  // Clone child element to add event handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childElement = React.cloneElement(children as React.ReactElement<any>, {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter();
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave();
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      handleFocus();
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      handleBlur();
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
    },
    onClick: (e: React.MouseEvent) => {
      handleClick();
      if (children.props.onClick) {
        children.props.onClick(e);
      }
    },
  });

  const tooltipClasses = [
    'mond-tooltip-content',
    `mond-tooltip-content--${placement}`,
    isVisible ? 'mond-tooltip-content--visible' : 'mond-tooltip-content--hidden',
  ].join(' ');

  const arrowClasses = [
    'mond-tooltip-arrow',
    `mond-tooltip-arrow--${placement}`,
  ].join(' ');

  return (
    <Box
      ref={containerRef}
      className={`mond-tooltip-container ${className || ''}`.trim()}
      data-testid={dataTestId}
    >
      {childElement}
      <Box
        className={tooltipClasses}
        data-testid={`${dataTestId || 'tooltip'}-content`}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {content}
        <Box className={arrowClasses} data-testid={`${dataTestId || 'tooltip'}-arrow`} />
      </Box>
    </Box>
  );
};

export default Tooltip;
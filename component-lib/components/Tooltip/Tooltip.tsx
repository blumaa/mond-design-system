import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';

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

const TooltipContainer = styled(Box)`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled(Box)<{ $placement: TooltipPlacement; $visible: boolean }>`
  position: absolute;
  z-index: 1000;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-family: ${({ theme }) => theme.fonts.sans};
  max-width: 200px;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: ${({ theme }) => theme.shadows.md};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 150ms ease, visibility 150ms ease;
  pointer-events: none;

  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
        return css`
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
        `;
      case 'bottom':
        return css`
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
        `;
      case 'left':
        return css`
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 8px;
        `;
      case 'right':
        return css`
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 8px;
        `;
      default:
        return css`
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
        `;
    }
  }}
`;

const TooltipArrow = styled(Box)<{ $placement: TooltipPlacement }>`
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;

  ${({ $placement, theme }) => {
    const surfaceElevated = theme.colors.surfaceElevated;

    switch ($placement) {
      case 'top':
        return css`
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: ${surfaceElevated};
          border-bottom-width: 0;
        `;
      case 'bottom':
        return css`
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-color: ${surfaceElevated};
          border-top-width: 0;
        `;
      case 'left':
        return css`
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-left-color: ${surfaceElevated};
          border-right-width: 0;
        `;
      case 'right':
        return css`
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-right-color: ${surfaceElevated};
          border-left-width: 0;
        `;
      default:
        return css`
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: ${surfaceElevated};
          border-bottom-width: 0;
        `;
    }
  }}
`;

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

  return (
    <TooltipContainer
      ref={containerRef}
      className={className}
      data-testid={dataTestId}
    >
      {childElement}
      <TooltipContent
        $placement={placement}
        $visible={isVisible}
        data-testid={`${dataTestId || 'tooltip'}-content`}
        data-placement={placement}
        data-visible={isVisible}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {content}
        <TooltipArrow
          $placement={placement}
          data-testid={`${dataTestId || 'tooltip'}-arrow`}
        />
      </TooltipContent>
    </TooltipContainer>
  );
};


'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { radii, fontSizes, fontWeights, fontFamilies, shadows } from '../../tokens';
import { useTheme } from '../providers/ThemeProvider';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';

export type PopoverPlacement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  | 'left-start' | 'left-end' | 'right-start' | 'right-end';

export type PopoverTrigger = 'click' | 'hover';

export interface PopoverProps {
  /**
   * Element that triggers the popover
   */
  children: React.ReactNode;

  /**
   * Popover content
   */
  content: React.ReactNode;

  /**
   * Whether the popover is open (controlled)
   */
  isOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Default open state (uncontrolled)
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Placement of the popover relative to trigger
   * @default 'bottom'
   */
  placement?: PopoverPlacement;

  /**
   * Offset distance from trigger
   * @default 8
   */
  offset?: number;

  /**
   * Trigger behavior
   * @default 'click'
   */
  trigger?: PopoverTrigger;

  /**
   * Close popover when clicking outside
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Close popover when pressing Escape
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Custom class for popover container
   */
  className?: string;

  /**
   * Custom class for popover content
   */
  contentClassName?: string;

  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;

  /**
   * Test ID for the popover
   */
  'data-testid'?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

const getPlacementStyles = (placement: PopoverPlacement, offset: number = 8) => {
  switch (placement) {
    case 'top':
      return {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        mb: offset,
      };
    case 'top-start':
      return {
        bottom: '100%',
        left: 0,
        mb: offset,
      };
    case 'top-end':
      return {
        bottom: '100%',
        right: 0,
        mb: offset,
      };
    case 'bottom':
      return {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        mt: offset,
      };
    case 'bottom-start':
      return {
        top: '100%',
        left: 0,
        mt: offset,
      };
    case 'bottom-end':
      return {
        top: '100%',
        right: 0,
        mt: offset,
      };
    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        mr: offset,
      };
    case 'left-start':
      return {
        right: '100%',
        top: 0,
        mr: offset,
      };
    case 'left-end':
      return {
        right: '100%',
        bottom: 0,
        mr: offset,
      };
    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        ml: offset,
      };
    case 'right-start':
      return {
        left: '100%',
        top: 0,
        ml: offset,
      };
    case 'right-end':
      return {
        left: '100%',
        bottom: 0,
        ml: offset,
      };
    default:
      return {};
  }
};

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  isOpen: controlledIsOpen,
  onOpenChange,
  defaultOpen = false,
  placement = 'bottom',
  offset = 8,
  trigger = 'click',
  closeOnClickOutside = true,
  closeOnEscape = true,
  className,
  contentClassName,
  isDarkMode,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const theme = useTheme(isDarkMode);

  // Controlled vs uncontrolled state
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback((open: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  }, [isControlled, onOpenChange]);

  const handleToggle = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen);
    } else if (trigger === 'hover' && isOpen) {
      // For hover trigger, clicking when already open should close it
      setIsOpen(false);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // For hover trigger, don't auto-close - let user close via X button, click outside, or Escape
  };

  // Handle click outside
  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside, setIsOpen, trigger]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeOnEscape, setIsOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const content = contentRef.current;
    if (!content) return;

    const focusableElements = content.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    content.addEventListener('keydown', handleTab);
    return () => {
      content.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  const placementStyles = getPlacementStyles(placement, offset);

  const contentStyle = {
    position: 'absolute' as const,
    zIndex: 1000,
    padding: '10px',
    backgroundColor: theme('surface.elevated'),
    color: theme('text.primary'),
    border: `1px solid ${theme('border.default')}`,
    borderRadius: radii.md,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    fontFamily: fontFamilies.sans,
    minWidth: '200px',
    maxWidth: '320px',
    lineHeight: '1.5',
    boxShadow: shadows.lg,
    ...placementStyles,
  };

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: 0,
    right: '4px',
    zIndex: 1,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
      data-testid={dataTestId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={handleToggle}>
        {children}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          className={contentClassName}
          style={contentStyle}
          role="dialog"
          aria-modal="false"
          aria-label={ariaLabel}
          data-testid={`${dataTestId || 'popover'}-content`}
        >
          {trigger === 'hover' && (
            <div style={closeButtonStyle}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                onClick={() => setIsOpen(false)}
                aria-label="Close popover"
                data-testid={`${dataTestId || 'popover'}-close`}
              >
                ×
              </Button>
            </div>
          )}
          {content}
        </div>
      )}
    </div>
  );
};

Popover.displayName = 'Popover';

export default Popover;

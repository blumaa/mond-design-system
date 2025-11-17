import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import './popover.css';

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
   * Show close button in popover
   * @default false
   */
  showCloseButton?: boolean;

  /**
   * Custom class for popover container
   */
  className?: string;

  /**
   * Custom class for popover content
   */
  contentClassName?: string;

  /**
   * Test ID for the popover
   */
  'data-testid'?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

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
  showCloseButton = false,
  className,
  contentClassName,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Build class names
  const contentClasses = [
    'popover-content',
    `placement-${placement}`,
    contentClassName,
  ].filter(Boolean).join(' ');

  // Custom CSS variable for offset
  const contentStyle = offset !== 8 ? { '--popover-offset': `${offset}px` } as React.CSSProperties : undefined;

  return (
    <Box
      ref={containerRef}
      className={`popover-container ${className || ''}`}
      data-testid={dataTestId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        className="popover-trigger"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </Box>

      {isOpen && (
        <div
          ref={contentRef as React.RefObject<HTMLDivElement>}
          style={contentStyle}
          data-testid={`${dataTestId || 'popover'}-wrapper`}
        >
          <Box
            className={contentClasses}
            role="dialog"
            aria-modal="false"
            aria-label={ariaLabel}
            data-testid={`${dataTestId || 'popover'}-content`}
          >
          {showCloseButton && (
            <Box className="popover-close-button">
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
            </Box>
          )}
          {content}
          </Box>
        </div>
      )}
    </Box>
  );
};

Popover.displayName = 'Popover';

export default Popover;

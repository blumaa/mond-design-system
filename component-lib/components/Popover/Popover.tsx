import { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';

export type PopoverPlacement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  | 'left-start' | 'left-end' | 'right-start' | 'right-end';

type PopoverTrigger = 'click' | 'hover';

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
   * Offset distance from trigger in pixels
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
   * Test ID for the popover
   */
  'data-testid'?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

const StyledPopoverContainer = styled(Box)`
  position: relative;
  display: inline-block;
`;

const StyledPopover = styled(Box)<{
  $placement: PopoverPlacement;
  $offset?: number;
}>`
  position: absolute;
  z-index: 1000;
  padding: ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-family: ${({ theme }) => theme.fonts.sans};
  min-width: 200px;
  max-width: 320px;
  line-height: 1.5;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  /* Placement - Top */
  ${({ $placement, $offset = 8 }) => $placement === 'top' && css`
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'top-start' && css`
    bottom: 100%;
    left: 0;
    margin-bottom: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'top-end' && css`
    bottom: 100%;
    right: 0;
    margin-bottom: ${$offset}px;
  `}

  /* Placement - Bottom */
  ${({ $placement, $offset = 8 }) => $placement === 'bottom' && css`
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'bottom-start' && css`
    top: 100%;
    left: 0;
    margin-top: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'bottom-end' && css`
    top: 100%;
    right: 0;
    margin-top: ${$offset}px;
  `}

  /* Placement - Left */
  ${({ $placement, $offset = 8 }) => $placement === 'left' && css`
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'left-start' && css`
    right: 100%;
    top: 0;
    margin-right: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'left-end' && css`
    right: 100%;
    bottom: 0;
    margin-right: ${$offset}px;
  `}

  /* Placement - Right */
  ${({ $placement, $offset = 8 }) => $placement === 'right' && css`
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'right-start' && css`
    left: 100%;
    top: 0;
    margin-left: ${$offset}px;
  `}

  ${({ $placement, $offset = 8 }) => $placement === 'right-end' && css`
    left: 100%;
    bottom: 0;
    margin-left: ${$offset}px;
  `}
`;

const StyledCloseContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: ${({ theme }) => theme.space[1]};
  z-index: 1;
`;

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

  return (
    <StyledPopoverContainer
      ref={containerRef}
      className={className}
      data-testid={dataTestId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {children}
      </Box>

      {isOpen && (
        <StyledPopover
          ref={contentRef}
          className={contentClassName}
          $placement={placement}
          $offset={offset}
          role="dialog"
          aria-modal="false"
          aria-label={ariaLabel}
          data-testid={`${dataTestId || 'popover'}-content`}
          data-placement={placement}
        >
          {trigger === 'hover' && (
            <StyledCloseContainer>
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
            </StyledCloseContainer>
          )}
          {content}
        </StyledPopover>
      )}
    </StyledPopoverContainer>
  );
};

Popover.displayName = 'Popover';


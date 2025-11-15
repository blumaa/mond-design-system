import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import './drawer.css';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;

  /**
   * Callback when drawer should close
   */
  onClose: () => void;

  /**
   * Position where drawer slides from
   * @default 'right'
   */
  position?: DrawerPosition;

  /**
   * Width of drawer (for left/right positions)
   * @default 'md'
   */
  width?: DrawerSize;

  /**
   * Height of drawer (for top/bottom positions)
   * @default 'md'
   */
  height?: DrawerSize;

  /**
   * Whether to show backdrop overlay
   * @default true
   */
  showBackdrop?: boolean;

  /**
   * Whether clicking backdrop closes the drawer
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing Escape closes the drawer
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * Drawer content
   */
  children: React.ReactNode;

  /**
   * Test ID
   */
  'data-testid'?: string;
}

export interface DrawerHeaderProps {
  /**
   * Header content
   */
  children: React.ReactNode;

  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;

  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;
}

export interface DrawerBodyProps {
  /**
   * Body content
   */
  children: React.ReactNode;
}

export interface DrawerFooterProps {
  /**
   * Footer content
   */
  children: React.ReactNode;
}

/**
 * DrawerHeader - Top section of the drawer with optional close button
 *
 * @example
 * <DrawerHeader onClose={handleClose}>
 *   <Heading level={3}>Drawer Title</Heading>
 * </DrawerHeader>
 */
export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  children,
  onClose,
  showCloseButton = true,
}) => {
  return (
    <Box className="mond-drawer__header">
      <Box>{children}</Box>
      {showCloseButton && onClose && (
        <Box className="mond-drawer__header-close-button">
          <Button
            variant="ghost"
            iconOnly
            onClick={onClose}
            aria-label="Close drawer"
            data-testid="drawer-close-button"
          >
            ×
          </Button>
        </Box>
      )}
    </Box>
  );
};

DrawerHeader.displayName = 'DrawerHeader';

/**
 * DrawerBody - Main content section of the drawer
 *
 * @example
 * <DrawerBody>
 *   <Text>Drawer content goes here</Text>
 * </DrawerBody>
 */
export const DrawerBody: React.FC<DrawerBodyProps> = ({ children }) => {
  return <Box className="mond-drawer__body">{children}</Box>;
};

DrawerBody.displayName = 'DrawerBody';

/**
 * DrawerFooter - Bottom section of the drawer
 *
 * @example
 * <DrawerFooter>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </DrawerFooter>
 */
export const DrawerFooter: React.FC<DrawerFooterProps> = ({ children }) => {
  return <Box className="mond-drawer__footer">{children}</Box>;
};

DrawerFooter.displayName = 'DrawerFooter';

/**
 * Drawer - A panel that slides in from the edge of the screen
 *
 * Mobile-first responsive drawer component with composition pattern.
 * Uses React Portal to render at document.body level, avoiding z-index issues.
 * Use DrawerHeader, DrawerBody, and DrawerFooter for structured layouts.
 *
 * @example
 * // Basic drawer
 * <Drawer isOpen={isOpen} onClose={handleClose}>
 *   <DrawerHeader onClose={handleClose}>
 *     <Heading level={3}>Settings</Heading>
 *   </DrawerHeader>
 *   <DrawerBody>
 *     <Text>Drawer content</Text>
 *   </DrawerBody>
 *   <DrawerFooter>
 *     <Button onClick={handleClose}>Close</Button>
 *   </DrawerFooter>
 * </Drawer>
 *
 * @example
 * // Left side drawer with custom width
 * <Drawer isOpen={isOpen} onClose={handleClose} position="left" width="lg">
 *   <DrawerBody>Navigation menu</DrawerBody>
 * </Drawer>
 *
 * @example
 * // Bottom drawer (mobile sheet)
 * <Drawer isOpen={isOpen} onClose={handleClose} position="bottom" height="md">
 *   <DrawerBody>Bottom sheet content</DrawerBody>
 * </Drawer>
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  width = 'md',
  height = 'md',
  showBackdrop = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  children,
  'data-testid': dataTestId,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isRendered, setIsRendered] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Handle mounting/unmounting with transition
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setHasAnimated(false);
    } else {
      setHasAnimated(false);
    }
  }, [isOpen]);

  // Trigger opening animation after mount
  React.useLayoutEffect(() => {
    if (isRendered && isOpen && !hasAnimated) {
      // Force browser to complete paint before adding open class
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isRendered, isOpen, hasAnimated]);

  // Handle transitionend to unmount after closing animation
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      // Only unmount when the drawer's transform transition ends (not backdrop or other elements)
      if (e.target === drawer && e.propertyName === 'transform' && !isOpen) {
        setIsRendered(false);
      }
    };

    drawer.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      drawer.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && isRendered) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the drawer
      if (drawerRef.current) {
        drawerRef.current.focus();
      }

      // Prevent body scroll
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;

        // Restore focus to the previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, isRendered]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeOnEsc, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableElements = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

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

    drawer.addEventListener('keydown', handleTab);
    return () => {
      drawer.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, children]);

  if (!isRendered) return null;

  const isHorizontal = position === 'left' || position === 'right';
  const sizeClass = isHorizontal
    ? `mond-drawer--width-${width}`
    : `mond-drawer--height-${height}`;

  const drawerClassName = [
    'mond-drawer',
    `mond-drawer--${position}`,
    sizeClass,
    hasAnimated && 'mond-drawer--open',
  ]
    .filter(Boolean)
    .join(' ');

  const backdropClassName = [
    'mond-drawer__backdrop',
    hasAnimated && 'mond-drawer__backdrop--open',
  ]
    .filter(Boolean)
    .join(' ');

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const drawerContent = (
    <Box
      className="mond-drawer-container"
      data-testid={`${dataTestId || 'drawer'}-container`}
      role="dialog"
      aria-modal="true"
    >
      {showBackdrop && (
        <Box
          className={backdropClassName}
          onClick={handleBackdropClick}
          data-testid={`${dataTestId || 'drawer'}-backdrop`}
        />
      )}
      <Box
        ref={drawerRef}
        className={drawerClassName}
        data-testid={dataTestId}
        tabIndex={-1}
      >
        {children}
      </Box>
    </Box>
  );

  return createPortal(drawerContent, document.body);
};

Drawer.displayName = 'Drawer';

export default Drawer;

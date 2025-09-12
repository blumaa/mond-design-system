'use client';
import React, { useEffect, useRef } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies, shadows } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when modal should close
   */
  onClose: () => void;
  
  /**
   * Modal title
   */
  title?: React.ReactNode;
  
  /**
   * Modal size
   * @default 'md'
   */
  size?: ModalSize;
  
  /**
   * Whether clicking outside closes the modal
   * @default true
   */
  closeOnOverlayClick?: boolean;
  
  /**
   * Whether pressing Escape closes the modal  
   * @default true
   */
  closeOnEscapeKey?: boolean;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom className for modal content
   */
  className?: string;
  
  /**
   * Modal content
   */
  children: React.ReactNode;
  
  /**
   * Test ID
   */
  'data-testid'?: string;
}

const getSizeStyles = (size: ModalSize) => {
  switch (size) {
    case 'sm':
      return {
        maxWidth: '400px',
        width: '90vw',
      };
    case 'md':
      return {
        maxWidth: '500px',
        width: '90vw',
      };
    case 'lg':
      return {
        maxWidth: '700px',
        width: '90vw',
      };
    case 'xl':
      return {
        maxWidth: '900px',
        width: '90vw',
      };
    case 'full':
      return {
        maxWidth: '95vw',
        width: '95vw',
        maxHeight: '95vh',
      };
    default:
      return {};
  }
};

export const ModalHeader: React.FC<{
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}> = ({ 
  children, 
  onClose, 
  showCloseButton = true, 
  className 
}) => {
  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[4]} ${spacing[6]}`,
    borderBottom: '1px solid #e5e7eb',
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.sans,
  };

  const closeButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: radii.sm,
    fontSize: fontSizes.lg,
    color: theme('text.secondary'),
    transition: 'all 150ms ease',
  };

  return (
    <Box className={className} style={headerStyles}>
      <Box>{children}</Box>
      {showCloseButton && onClose && (
        <button
          style={closeButtonStyles}
          onClick={onClose}
          aria-label="Close modal"
          data-testid="modal-close-button"
        >
          ×
        </button>
      )}
    </Box>
  );
};

export const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const bodyStyles = {
    padding: `${spacing[4]} ${spacing[6]}`,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.sans,
    lineHeight: '1.6',
    maxHeight: '60vh',
    overflowY: 'auto' as const,
  };

  return (
    <Box className={className} style={bodyStyles}>
      {children}
    </Box>
  );
};

export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const footerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[3],
    padding: `${spacing[4]} ${spacing[6]}`,
    borderTop: '1px solid #e5e7eb',
  };

  return (
    <Box className={className} style={footerStyles}>
      {children}
    </Box>
  );
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  isDarkMode,
  className,
  children,
  'data-testid': dataTestId,
}) => {
  const theme = useTheme(isDarkMode);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
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
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscapeKey) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeOnEscapeKey, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
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

    modal.addEventListener('keydown', handleTab);
    return () => {
      modal.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, children]);

  if (!isOpen) return null;

  const overlayStyles = {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: theme('surface.overlay'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  };

  const sizeStyles = getSizeStyles(size);
  
  const modalStyles = {
    backgroundColor: theme('surface.elevated'),
    color: theme('text.primary'),
    borderRadius: radii.lg,
    boxShadow: shadows['2xl'],
    position: 'relative' as const,
    maxHeight: size === 'full' ? '95vh' : '90vh',
    overflow: 'hidden' as const,
    outline: 'none',
    ...sizeStyles,
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Box
      style={overlayStyles}
      onClick={handleOverlayClick}
      data-testid={`${dataTestId || 'modal'}-overlay`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${dataTestId || 'modal'}-title` : undefined}
    >
      <Box
        ref={modalRef}
        className={className}
        style={modalStyles}
        data-testid={dataTestId}
        tabIndex={-1}
      >
        {title && (
          <ModalHeader onClose={onClose}>
            <Box id={`${dataTestId || 'modal'}-title`}>{title}</Box>
          </ModalHeader>
        )}
        
        {typeof children === 'string' || React.isValidElement(children) ? (
          <ModalBody>{children}</ModalBody>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default Modal;
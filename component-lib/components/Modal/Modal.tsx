'use client';
import React, { useEffect, useRef } from 'react';

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
  const headerClassNames = ['mond-modal__header', className].filter(Boolean).join(' ');

  return (
    <div className={headerClassNames}>
      <div>{children}</div>
      {showCloseButton && onClose && (
        <button
          className="mond-modal__close-button"
          onClick={onClose}
          aria-label="Close modal"
          data-testid="modal-close-button"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const bodyClassNames = ['mond-modal__body', className].filter(Boolean).join(' ');

  return (
    <div className={bodyClassNames}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const footerClassNames = ['mond-modal__footer', className].filter(Boolean).join(' ');

  return (
    <div className={footerClassNames}>
      {children}
    </div>
  );
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  className,
  children,
  'data-testid': dataTestId,
}) => {
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

  const modalClassNames = [
    'mond-modal',
    `mond-modal--${size}`,
    className,
  ].filter(Boolean).join(' ');

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="mond-modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (closeOnEscapeKey && e.key === 'Escape') {
          onClose();
        }
      }}
      data-testid={`${dataTestId || 'modal'}-overlay`}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={modalClassNames}
        data-testid={dataTestId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${dataTestId || 'modal'}-title` : undefined}
        tabIndex={-1}
      >
        {title && (
          <ModalHeader onClose={onClose}>
            <div id={`${dataTestId || 'modal'}-title`}>{title}</div>
          </ModalHeader>
        )}

        {typeof children === 'string' || React.isValidElement(children) ? (
          <ModalBody>{children}</ModalBody>
        ) : (
          children
        )}
      </div>
    </div>
  );
};


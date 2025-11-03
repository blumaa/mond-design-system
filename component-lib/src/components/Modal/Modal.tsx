import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';

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

const StyledOverlay = styled(Box)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[4]};
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const StyledModal = styled(Box)<{ $size: ModalSize }>`
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  position: relative;
  max-height: 90vh;
  overflow: hidden;
  outline: none;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          max-width: 400px;
          width: 90vw;
        `;
      case 'md':
        return css`
          max-width: 500px;
          width: 90vw;
        `;
      case 'lg':
        return css`
          max-width: 700px;
          width: 90vw;
        `;
      case 'xl':
        return css`
          max-width: 900px;
          width: 90vw;
        `;
      case 'full':
        return css`
          max-width: 95vw;
          width: 95vw;
          max-height: 95vh;
        `;
      default:
        return css`
          max-width: 500px;
          width: 90vw;
        `;
    }
  }}
`;

const StyledModalHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-family: ${({ theme }) => theme.fonts.sans};
`;

const StyledCloseButton = styled(Box).attrs({ as: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 150ms ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const StyledModalBody = styled(Box)`
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fonts.sans};
  line-height: 1.6;
  max-height: 60vh;
  overflow-y: auto;
`;

const StyledModalFooter = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

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
  return (
    <StyledModalHeader className={className}>
      <Box>{children}</Box>
      {showCloseButton && onClose && (
        <StyledCloseButton
          onClick={onClose}
          aria-label="Close modal"
          data-testid="modal-close-button"
        >
          ×
        </StyledCloseButton>
      )}
    </StyledModalHeader>
  );
};

export const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <StyledModalBody className={className}>
      {children}
    </StyledModalBody>
  );
};

export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <StyledModalFooter className={className}>
      {children}
    </StyledModalFooter>
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

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledOverlay
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (closeOnEscapeKey && e.key === 'Escape') {
          onClose();
        }
      }}
      data-testid={`${dataTestId || 'modal'}-overlay`}
      role="presentation"
    >
      <StyledModal
        ref={modalRef}
        $size={size}
        className={className}
        data-testid={dataTestId}
        data-size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${dataTestId || 'modal'}-title` : undefined}
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
      </StyledModal>
    </StyledOverlay>
  );
};


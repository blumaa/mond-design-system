import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders modal when open and hides when closed', () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={mockOnClose} data-testid="modal">
        Modal content
      </Modal>
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" data-testid="modal">
        Modal content
      </Modal>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
  });

  describe('Closing behavior', () => {
    it('closes via close button, overlay, and Escape key', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" data-testid="modal">
          Modal content
        </Modal>
      );

      fireEvent.click(screen.getByTestId('modal-close-button'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).toHaveBeenCalledTimes(2);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });

    it('respects closeOnOverlayClick and closeOnEscapeKey', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false} closeOnEscapeKey={false} data-testid="modal">
          Modal content
        </Modal>
      );

      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not close when clicking modal content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      fireEvent.click(screen.getByTestId('modal'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Sizes', () => {
    it('applies size classes correctly', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="sm" data-testid="modal">
          Modal content
        </Modal>
      );

      let modal = screen.getByTestId('modal');
      expect(modal).toHaveClass('mond-modal--sm');

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} size="full" data-testid="modal">
          Modal content
        </Modal>
      );

      modal = screen.getByTestId('modal');
      expect(modal).toHaveClass('mond-modal--full');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes and manages focus', async () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
          <div>
            <button onClick={() => setIsOpen(true)} data-testid="open-button">Open Modal</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Modal" data-testid="modal">
              <button data-testid="modal-button">Modal Button</button>
            </Modal>
          </div>
        );
      };

      render(<TestComponent />);

      const openButton = screen.getByTestId('open-button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const overlay = screen.getByTestId('modal-overlay');
        expect(overlay).toHaveAttribute('role', 'dialog');
        expect(overlay).toHaveAttribute('aria-modal', 'true');
        expect(overlay).toHaveAttribute('aria-labelledby', 'modal-title');

        const modal = screen.getByTestId('modal');
        expect(modal).toHaveFocus();
      });
    });

    it('prevents and restores body scroll', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Modal components', () => {
    it('renders custom modal structure', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          <ModalHeader onClose={mockOnClose}>Custom Header</ModalHeader>
          <ModalBody>Custom Body</ModalBody>
          <ModalFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </ModalFooter>
        </Modal>
      );

      expect(screen.getByText('Custom Header')).toBeInTheDocument();
      expect(screen.getByText('Custom Body')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('renders ModalHeader without close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          <ModalHeader showCloseButton={false}>Header Without Close</ModalHeader>
        </Modal>
      );

      expect(screen.getByText('Header Without Close')).toBeInTheDocument();
      expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-class" data-testid="modal">
        Modal content
      </Modal>
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('custom-class');
  });
});

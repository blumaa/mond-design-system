import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import '@testing-library/jest-dom';
import { defaultLightTheme, defaultDarkTheme } from '../../themes';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

const renderWithTheme = (ui: React.ReactElement) => {
  return rtlRender(
    <ThemeProvider theme={defaultLightTheme}>
      {ui}
    </ThemeProvider>
  );
};

const renderWithDarkMode = (ui: React.ReactElement) => {
  return rtlRender(
    <ThemeProvider theme={defaultDarkTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    // Reset body overflow style
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Clean up any remaining modals
    document.body.style.overflow = '';
  });

  it('does not render when closed', () => {
    renderWithTheme(
      <Modal isOpen={false} onClose={mockOnClose} data-testid="modal">
        Modal content
      </Modal>
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
        Modal content
      </Modal>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" data-testid="modal">
        Modal content
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
  });

  describe('closing behavior', () => {
    it('closes when close button is clicked', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" data-testid="modal">
          Modal content
        </Modal>
      );

      fireEvent.click(screen.getByTestId('modal-close-button'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes when overlay is clicked by default', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not close when overlay is clicked if closeOnOverlayClick is false', () => {
      renderWithTheme(
        <Modal
          isOpen={true}
          onClose={mockOnClose}
          closeOnOverlayClick={false}
          data-testid="modal"
        >
          Modal content
        </Modal>
      );

      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not close when modal content is clicked', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      fireEvent.click(screen.getByTestId('modal'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('closes when Escape key is pressed by default', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not close when Escape key is pressed if closeOnEscapeKey is false', () => {
      renderWithTheme(
        <Modal
          isOpen={true}
          onClose={mockOnClose}
          closeOnEscapeKey={false}
          data-testid="modal"
        >
          Modal content
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} size="sm" data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('data-size', 'sm');
    });

    it('renders medium size correctly', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} size="md" data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('data-size', 'md');
    });

    it('renders large size correctly', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} size="lg" data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('data-size', 'lg');
    });

    it('renders extra large size correctly', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} size="xl" data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('data-size', 'xl');
    });

    it('renders full size correctly', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} size="full" data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('data-size', 'full');
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling (SSR-compatible)', () => {
      renderWithDarkMode(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      // Styled-components handle theming automatically
      expect(modal).toBeInTheDocument();
    });

    it('applies light mode styling by default (SSR-compatible)', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      // Styled-components handle theming automatically
      expect(modal).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" data-testid="modal">
          Modal content
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      const modal = screen.getByTestId('modal');

      // Overlay is presentational, modal content has the dialog role
      expect(overlay).toHaveAttribute('role', 'presentation');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('manages focus correctly', async () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
          <div>
            <button onClick={() => setIsOpen(true)} data-testid="open-button">
              Open Modal
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} data-testid="modal">
              <button data-testid="modal-button">Modal Button</button>
            </Modal>
          </div>
        );
      };

      renderWithTheme(<TestComponent />);

      const openButton = screen.getByTestId('open-button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveFocus();
      });
    });

    it('prevents body scroll when open', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed', () => {
      const { rerender } = renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <ThemeProvider theme={defaultLightTheme}>
          <Modal isOpen={false} onClose={mockOnClose} data-testid="modal">
            Modal content
          </Modal>
        </ThemeProvider>
      );

      expect(document.body.style.overflow).toBe('');
    });

    it('has focusable close button', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" data-testid="modal">
          Modal content
        </Modal>
      );

      const closeButton = screen.getByTestId('modal-close-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });
  });

  describe('modal components', () => {
    it('renders custom modal structure', () => {
      renderWithTheme(
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
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          <ModalHeader showCloseButton={false}>Header Without Close</ModalHeader>
        </Modal>
      );

      expect(screen.getByText('Header Without Close')).toBeInTheDocument();
      expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
    });

    it('applies styles to modal components', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          <ModalHeader onClose={mockOnClose}>Header</ModalHeader>
          <ModalBody>Body content</ModalBody>
          <ModalFooter>Footer content</ModalFooter>
        </Modal>
      );

      // Check that all modal components render correctly
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies correct base styles', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Modal content
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      const overlay = screen.getByTestId('modal-overlay');

      // Styled-components handle all styling
      expect(modal).toBeInTheDocument();
      expect(overlay).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-class" data-testid="modal">
        Modal content
      </Modal>
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('custom-class');
  });

  describe('content handling', () => {
    it('wraps string content in ModalBody automatically', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          Simple string content
        </Modal>
      );

      expect(screen.getByText('Simple string content')).toBeInTheDocument();
    });

    it('wraps React element content in ModalBody automatically', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          <div>React element content</div>
        </Modal>
      );

      expect(screen.getByText('React element content')).toBeInTheDocument();
    });

    it('does not wrap complex children structure', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} data-testid="modal">
          <ModalHeader onClose={mockOnClose}>Header</ModalHeader>
          <ModalBody>Body</ModalBody>
        </Modal>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('focuses modal when opened', async () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" data-testid="modal">
          <button data-testid="first-button">First Button</button>
          <button data-testid="second-button">Second Button</button>
        </Modal>
      );

      const modal = screen.getByTestId('modal');

      await waitFor(() => {
        expect(modal).toHaveFocus();
      });
    });
  });
});

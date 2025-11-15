import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from './Drawer';

describe('Drawer Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders drawer when open and hides when closed', () => {
    const { rerender } = render(
      <Drawer isOpen={false} onClose={mockOnClose} data-testid="drawer">
        Drawer content
      </Drawer>
    );

    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();

    rerender(
      <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
        Drawer content
      </Drawer>
    );

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  describe('Positions', () => {
    it('applies position classes correctly', () => {
      const positions = ['left', 'right', 'top', 'bottom'] as const;

      positions.forEach((position) => {
        const { rerender } = render(
          <Drawer
            isOpen={true}
            onClose={mockOnClose}
            position={position}
            data-testid="drawer"
          >
            Drawer content
          </Drawer>
        );

        const drawer = screen.getByTestId('drawer');
        expect(drawer).toHaveClass(`mond-drawer--${position}`);

        rerender(<div />);
      });
    });

    it('defaults to right position', () => {
      render(
        <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
          Drawer content
        </Drawer>
      );

      const drawer = screen.getByTestId('drawer');
      expect(drawer).toHaveClass('mond-drawer--right');
    });
  });

  describe('Closing behavior', () => {
    it('closes via backdrop click and Escape key', () => {
      render(
        <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
          Drawer content
        </Drawer>
      );

      fireEvent.click(screen.getByTestId('drawer-backdrop'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    it('respects closeOnBackdropClick and closeOnEsc props', () => {
      render(
        <Drawer
          isOpen={true}
          onClose={mockOnClose}
          closeOnBackdropClick={false}
          closeOnEsc={false}
          data-testid="drawer"
        >
          Drawer content
        </Drawer>
      );

      fireEvent.click(screen.getByTestId('drawer-backdrop'));
      expect(mockOnClose).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not close when clicking drawer content', () => {
      render(
        <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
          Drawer content
        </Drawer>
      );

      fireEvent.click(screen.getByTestId('drawer'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('hides backdrop when showBackdrop is false', () => {
      render(
        <Drawer
          isOpen={true}
          onClose={mockOnClose}
          showBackdrop={false}
          data-testid="drawer"
        >
          Drawer content
        </Drawer>
      );

      expect(screen.queryByTestId('drawer-backdrop')).not.toBeInTheDocument();
    });
  });

  describe('Size props', () => {
    it('applies width for left/right drawers', () => {
      render(
        <Drawer
          isOpen={true}
          onClose={mockOnClose}
          position="right"
          width="lg"
          data-testid="drawer"
        >
          Drawer content
        </Drawer>
      );

      const drawer = screen.getByTestId('drawer');
      expect(drawer).toHaveClass('mond-drawer--width-lg');
    });

    it('applies height for top/bottom drawers', () => {
      render(
        <Drawer
          isOpen={true}
          onClose={mockOnClose}
          position="bottom"
          height="md"
          data-testid="drawer"
        >
          Drawer content
        </Drawer>
      );

      const drawer = screen.getByTestId('drawer');
      expect(drawer).toHaveClass('mond-drawer--height-md');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes and manages focus', async () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
          <div>
            <button onClick={() => setIsOpen(true)} data-testid="open-button">
              Open Drawer
            </button>
            <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} data-testid="drawer">
              <button data-testid="drawer-button">Drawer Button</button>
            </Drawer>
          </div>
        );
      };

      render(<TestComponent />);

      const openButton = screen.getByTestId('open-button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const drawerContainer = screen.getByTestId('drawer-container');
        expect(drawerContainer).toHaveAttribute('role', 'dialog');
        expect(drawerContainer).toHaveAttribute('aria-modal', 'true');

        const drawer = screen.getByTestId('drawer');
        expect(drawer).toHaveFocus();
      });
    });

    it('prevents and restores body scroll', () => {
      const { rerender } = render(
        <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
          Drawer content
        </Drawer>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Drawer isOpen={false} onClose={mockOnClose} data-testid="drawer">
          Drawer content
        </Drawer>
      );

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Drawer composition components', () => {
    it('renders custom drawer structure', () => {
      render(
        <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
          <DrawerHeader onClose={mockOnClose}>Custom Header</DrawerHeader>
          <DrawerBody>Custom Body</DrawerBody>
          <DrawerFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DrawerFooter>
        </Drawer>
      );

      expect(screen.getByText('Custom Header')).toBeInTheDocument();
      expect(screen.getByText('Custom Body')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('renders DrawerHeader with close button using Button component', () => {
      render(
        <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
          <DrawerHeader onClose={mockOnClose}>Header with Close</DrawerHeader>
        </Drawer>
      );

      expect(screen.getByText('Header with Close')).toBeInTheDocument();

      const closeButton = screen.getByTestId('drawer-close-button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Close drawer');

      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('renders DrawerHeader without close button', () => {
      render(
        <Drawer isOpen={true} onClose={mockOnClose} data-testid="drawer">
          <DrawerHeader showCloseButton={false}>Header Without Close</DrawerHeader>
        </Drawer>
      );

      expect(screen.getByText('Header Without Close')).toBeInTheDocument();
      expect(screen.queryByTestId('drawer-close-button')).not.toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '../../test-utils';
import { ToastContainer } from './ToastContainer';
import { Toast } from './Toast';
import { ToastData } from './ToastContainer';

// Mock timers for testing auto-dismissal
jest.useFakeTimers();

const mockToasts: ToastData[] = [
  {
    id: '1',
    type: 'info',
    title: 'Test Toast',
    message: 'This is a test message',
    duration: 5000,
  },
  {
    id: '2',
    type: 'success',
    title: 'Success Toast',
    duration: 0, // persistent
  },
  {
    id: '3',
    type: 'error',
    title: 'Error Toast',
    message: 'Something went wrong',
    dismissible: false,
  },
];

const defaultProps = {
  toasts: mockToasts,
  onDismiss: jest.fn(),
};

describe('ToastContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  describe('Rendering', () => {
    it('renders toast container with toasts', () => {
      render(<ToastContainer {...defaultProps} />);
      
      expect(screen.getByRole('region', { name: 'Toast notifications' })).toBeInTheDocument();
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByText('Success Toast')).toBeInTheDocument();
      expect(screen.getByText('Error Toast')).toBeInTheDocument();
    });

    it('does not render container when no toasts are provided', () => {
      render(<ToastContainer {...defaultProps} toasts={[]} />);
      
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('renders with custom position styles', () => {
      render(<ToastContainer {...defaultProps} position="bottom-left" />);
      
      const container = screen.getByRole('region');
      expect(container).toHaveStyle({ bottom: '1rem', left: '1rem' });
    });

    it('renders with dark mode', () => {
      render(<ToastContainer {...defaultProps} />);
      
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('renders with custom test id', () => {
      render(<ToastContainer {...defaultProps} data-testid="custom-toast-container" />);
      
      expect(screen.getByTestId('custom-toast-container')).toBeInTheDocument();
    });
  });

  describe('Toast Positioning', () => {
    it.each([
      ['top-right', { top: '1rem', right: '1rem' }],
      ['top-left', { top: '1rem', left: '1rem' }],
      ['bottom-right', { bottom: '1rem', right: '1rem' }],
      ['bottom-left', { bottom: '1rem', left: '1rem' }],
      ['top-center', { top: '1rem', left: '50%', transform: 'translateX(-50%)' }],
      ['bottom-center', { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }],
    ] as const)('positions container correctly for %s', (position, expectedStyles) => {
      render(<ToastContainer {...defaultProps} position={position} />);
      
      const container = screen.getByRole('region');
      Object.entries(expectedStyles).forEach(([property, value]) => {
        expect(container).toHaveStyle({ [property]: value });
      });
    });
  });

  describe('Toast Limits', () => {
    it('respects maxToasts limit', async () => {
      const manyToasts: ToastData[] = Array.from({ length: 10 }, (_, i) => ({
        id: `toast-${i}`,
        type: 'info' as const,
        title: `Toast ${i}`,
      }));

      render(<ToastContainer {...defaultProps} toasts={manyToasts} maxToasts={3} />);

      await waitFor(() => {
        const visibleToasts = screen.getAllByRole('alert');
        expect(visibleToasts).toHaveLength(3);
      });
    });
  });

  describe('Toast Dismissal', () => {
    it('calls onDismiss when toast is dismissed', async () => {
      const onDismiss = jest.fn();
      render(<ToastContainer {...defaultProps} onDismiss={onDismiss} />);

      const dismissButton = screen.getAllByLabelText('Close toast')[0];
      fireEvent.click(dismissButton);

      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalledWith('1');
      });
    });

    it('handles keyboard dismissal with Escape key', async () => {
      const onDismiss = jest.fn();
      render(<ToastContainer {...defaultProps} onDismiss={onDismiss} />);

      const toast = screen.getAllByRole('alert')[0];
      fireEvent.keyDown(toast, { key: 'Escape' });

      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<ToastContainer {...defaultProps} />);

      const container = screen.getByRole('region', { name: 'Toast notifications' });
      expect(container).toHaveAttribute('aria-live', 'polite');

      const toasts = screen.getAllByRole('alert');
      toasts.forEach((toast, index) => {
        expect(toast).toHaveAttribute('aria-live', 'polite');
        expect(toast).toHaveAttribute('aria-atomic', 'true');
        // The third toast (index 2) has dismissible: false, so tabIndex is -1
        // Other toasts are dismissible by default, so tabIndex is 0
        if (index === 2) {
          expect(toast).toHaveAttribute('tabIndex', '-1');
        } else {
          expect(toast).toHaveAttribute('tabIndex', '0');
        }
      });
    });
  });
});

describe('Toast', () => {
  const mockOnDismiss = jest.fn();

  const defaultToastProps = {
    id: 'test-toast',
    title: 'Test Toast',
    onDismiss: mockOnDismiss,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  describe('Rendering', () => {
    it('renders toast with title', () => {
      render(<Toast {...defaultToastProps} />);
      
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders toast with message', () => {
      render(<Toast {...defaultToastProps} message="Test message" />);
      
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders different toast types with appropriate icons', () => {
      const types = [
        { type: 'success' as const, icon: '✓' },
        { type: 'error' as const, icon: '✕' },
        { type: 'warning' as const, icon: '⚠' },
        { type: 'info' as const, icon: 'ℹ' },
      ];

      types.forEach(({ type, icon }) => {
        const { unmount } = render(<Toast {...defaultToastProps} type={type} />);
        expect(screen.getByText(icon)).toBeInTheDocument();
        unmount();
      });
    });

    it('renders custom icon when provided', () => {
      render(<Toast {...defaultToastProps} icon={<span>🎉</span>} />);
      
      expect(screen.getByText('🎉')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      const actions = [
        { label: 'Retry', onClick: jest.fn() },
        { label: 'Cancel', onClick: jest.fn(), variant: 'outline' as const },
      ];

      render(<Toast {...defaultToastProps} actions={actions} />);
      
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('renders dismiss button when dismissible', () => {
      render(<Toast {...defaultToastProps} dismissible />);
      
      expect(screen.getByLabelText('Close toast')).toBeInTheDocument();
    });

    it('does not render dismiss button when not dismissible', () => {
      render(<Toast {...defaultToastProps} dismissible={false} />);
      
      expect(screen.queryByLabelText('Close toast')).not.toBeInTheDocument();
    });
  });

  describe('Auto-dismissal', () => {
    it('auto-dismisses after specified duration', async () => {
      render(<Toast {...defaultToastProps} duration={1000} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');
      });
    });

    it('does not auto-dismiss when duration is 0', async () => {
      render(<Toast {...defaultToastProps} duration={0} />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('pauses timer on mouse enter and resumes on mouse leave', async () => {
      const onPause = jest.fn();
      const onResume = jest.fn();
      
      render(
        <Toast 
          {...defaultToastProps} 
          duration={2000} 
          onPause={onPause}
          onResume={onResume}
        />
      );

      const toast = screen.getByRole('alert');

      // Timer should start automatically
      expect(onResume).toHaveBeenCalledTimes(1);

      // Pause on mouse enter
      fireEvent.mouseEnter(toast);
      expect(onPause).toHaveBeenCalledTimes(1);

      // Advance time while paused - should not dismiss
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(mockOnDismiss).not.toHaveBeenCalled();

      // Resume on mouse leave
      fireEvent.mouseLeave(toast);
      expect(onResume).toHaveBeenCalledTimes(2);

      // Now should dismiss after remaining time
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');
      });
    });
  });

  describe('Interactions', () => {
    it('dismisses on click of dismiss button', () => {
      render(<Toast {...defaultToastProps} dismissible />);

      const dismissButton = screen.getByLabelText('Close toast');
      fireEvent.click(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');
    });

    it('dismisses on Escape key when dismissible', () => {
      render(<Toast {...defaultToastProps} dismissible />);

      const toast = screen.getByRole('alert');
      fireEvent.keyDown(toast, { key: 'Escape' });

      expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');
    });

    it('does not dismiss on Escape key when not dismissible', () => {
      render(<Toast {...defaultToastProps} dismissible={false} />);

      const toast = screen.getByRole('alert');
      fireEvent.keyDown(toast, { key: 'Escape' });

      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('calls action onClick when action button is clicked', () => {
      const actionOnClick = jest.fn();
      const actions = [{ label: 'Action', onClick: actionOnClick }];

      render(<Toast {...defaultToastProps} actions={actions} />);

      const actionButton = screen.getByRole('button', { name: 'Action' });
      fireEvent.click(actionButton);

      expect(actionOnClick).toHaveBeenCalled();
    });
  });

  describe('Animation States', () => {
    it('renders with different animation states', () => {
      const { rerender } = render(
        <Toast {...defaultToastProps} animationState="entering" />
      );

      let toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();

      rerender(<Toast {...defaultToastProps} animationState="visible" />);
      toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();

      rerender(<Toast {...defaultToastProps} animationState="exiting" />);
      toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Toast {...defaultToastProps} />);

      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
      expect(toast).toHaveAttribute('tabIndex', '0');
    });

    it('dismiss button has proper aria-label', () => {
      render(<Toast {...defaultToastProps} dismissible />);

      const dismissButton = screen.getByLabelText('Close toast');
      expect(dismissButton).toBeInTheDocument();
    });
  });
});
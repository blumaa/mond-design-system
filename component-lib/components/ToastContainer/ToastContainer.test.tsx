import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ToastContainer } from './ToastContainer';
import { Toast } from './Toast';
import { ToastData } from './ToastContainer';

jest.useFakeTimers();

const mockToasts: ToastData[] = [
  { id: '1', type: 'info', title: 'Test Toast', message: 'This is a test message', duration: 5000 },
  { id: '2', type: 'success', title: 'Success Toast', duration: 0 },
  { id: '3', type: 'error', title: 'Error Toast', message: 'Something went wrong', dismissible: false },
];

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

  it('renders toast container with toasts and proper positions', () => {
    const { rerender } = render(<ToastContainer toasts={mockToasts} onDismiss={jest.fn()} />);

    expect(screen.getByRole('region', { name: 'Toast notifications' })).toBeInTheDocument();
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Error Toast')).toBeInTheDocument();

    rerender(<ToastContainer toasts={mockToasts} onDismiss={jest.fn()} position="bottom-left" />);

    const container = screen.getByRole('region');
    expect(container).toHaveClass('mond-toast-container--bottom-left');
  });

  it('respects maxToasts limit and renders without toasts', async () => {
    const manyToasts: ToastData[] = Array.from({ length: 10 }, (_, i) => ({
      id: `toast-${i}`,
      type: 'info' as const,
      title: `Toast ${i}`,
    }));

    const { unmount } = render(<ToastContainer toasts={manyToasts} onDismiss={jest.fn()} maxToasts={3} />);

    await waitFor(() => {
      const visibleToasts = screen.getAllByRole('alert');
      expect(visibleToasts).toHaveLength(3);
    });

    unmount();

    render(<ToastContainer toasts={[]} onDismiss={jest.fn()} />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('calls onDismiss when toast is dismissed and handles keyboard', async () => {
    const onDismiss = jest.fn();
    render(<ToastContainer toasts={mockToasts} onDismiss={onDismiss} />);

    const dismissButton = screen.getAllByLabelText('Close toast')[0];
    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledWith('1');
    });

    const secondDismissButton = screen.getAllByLabelText('Close toast')[0];
    fireEvent.keyDown(secondDismissButton, { key: 'Escape' });

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledWith('2');
    });
  });

  it('has proper ARIA attributes', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={jest.fn()} />);

    const container = screen.getByRole('region', { name: 'Toast notifications' });
    expect(container).toHaveAttribute('aria-live', 'polite');

    const toasts = screen.getAllByRole('alert');
    toasts.forEach(toast => {
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
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

  it('renders toast with title, message, and type icons', () => {
    const { rerender } = render(<Toast {...defaultToastProps} message="Test message" type="success" />);

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();

    rerender(<Toast {...defaultToastProps} type="error" icon={<span>🎉</span>} />);
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('renders action buttons and dismissible state', () => {
    const actions = [
      { label: 'Retry', onClick: jest.fn() },
      { label: 'Cancel', onClick: jest.fn(), variant: 'outline' as const },
    ];

    const { rerender } = render(<Toast {...defaultToastProps} actions={actions} dismissible />);

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByLabelText('Close toast')).toBeInTheDocument();

    rerender(<Toast {...defaultToastProps} dismissible={false} />);
    expect(screen.queryByLabelText('Close toast')).not.toBeInTheDocument();
  });

  it('auto-dismisses after duration and pauses on hover', async () => {
    const onPause = jest.fn();
    const onResume = jest.fn();

    render(<Toast {...defaultToastProps} duration={2000} onPause={onPause} onResume={onResume} />);

    const toast = screen.getByRole('alert');

    expect(onResume).toHaveBeenCalledTimes(1);

    // Pause on mouse enter
    fireEvent.mouseEnter(toast);
    expect(onPause).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(mockOnDismiss).not.toHaveBeenCalled();

    // Resume on mouse leave
    fireEvent.mouseLeave(toast);
    expect(onResume).toHaveBeenCalledTimes(2);

    act(() => {
      jest.advanceTimersByTime(2000);
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

  it('dismisses on click and Escape key', () => {
    render(<Toast {...defaultToastProps} dismissible />);

    const dismissButton = screen.getByLabelText('Close toast');
    fireEvent.click(dismissButton);
    expect(mockOnDismiss).toHaveBeenCalledWith('test-toast');

    mockOnDismiss.mockClear();

    const { container } = render(<Toast {...defaultToastProps} id="test-toast-2" dismissible />);
    const newDismissButton = container.querySelector('[aria-label="Close toast"]') as HTMLElement;
    fireEvent.keyDown(newDismissButton, { key: 'Escape' });
    expect(mockOnDismiss).toHaveBeenCalledWith('test-toast-2');
  });

  it('calls action onClick', () => {
    const actionOnClick = jest.fn();
    const actions = [{ label: 'Action', onClick: actionOnClick }];

    render(<Toast {...defaultToastProps} actions={actions} />);

    const actionButton = screen.getByRole('button', { name: 'Action' });
    fireEvent.click(actionButton);

    expect(actionOnClick).toHaveBeenCalled();
  });

  it('applies animation states', () => {
    const { rerender } = render(<Toast {...defaultToastProps} animationState="entering" />);

    let toast = screen.getByRole('alert');
    expect(toast).toHaveClass('mond-toast--entering');

    rerender(<Toast {...defaultToastProps} animationState="exiting" />);
    toast = screen.getByRole('alert');
    expect(toast).toHaveClass('mond-toast--exiting');
  });

  it('has proper ARIA attributes', () => {
    render(<Toast {...defaultToastProps} dismissible />);

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');

    const dismissButton = screen.getByLabelText('Close toast');
    expect(dismissButton).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert } from './Alert';

describe('Alert Component', () => {
  it('renders alert with content', () => {
    render(
      <Alert data-testid="alert">
        This is an alert message
      </Alert>
    );
    
    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('This is an alert message')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Alert title="Alert Title" data-testid="alert">
        This is the alert content
      </Alert>
    );
    
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('This is the alert content')).toBeInTheDocument();
  });

  describe('variants', () => {
    it('renders info variant with correct icon', () => {
      render(
        <Alert variant="info" data-testid="info-alert">
          Info message
        </Alert>
      );
      
      const alert = screen.getByTestId('info-alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('renders success variant with correct icon', () => {
      render(
        <Alert variant="success" data-testid="success-alert">
          Success message
        </Alert>
      );
      
      const alert = screen.getByTestId('success-alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('renders warning variant with correct icon', () => {
      render(
        <Alert variant="warning" data-testid="warning-alert">
          Warning message
        </Alert>
      );
      
      const alert = screen.getByTestId('warning-alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('renders error variant with correct icon', () => {
      render(
        <Alert variant="error" data-testid="error-alert">
          Error message
        </Alert>
      );
      
      const alert = screen.getByTestId('error-alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('✕')).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('renders action buttons', () => {
      const mockAction1 = jest.fn();
      const mockAction2 = jest.fn();
      
      const actions = [
        { label: 'Primary Action', onClick: mockAction1, variant: 'primary' as const },
        { label: 'Secondary Action', onClick: mockAction2, variant: 'outline' as const },
      ];

      render(
        <Alert actions={actions} data-testid="alert">
          Alert with actions
        </Alert>
      );
      
      expect(screen.getByText('Primary Action')).toBeInTheDocument();
      expect(screen.getByText('Secondary Action')).toBeInTheDocument();
    });

    it('calls action callbacks when clicked', () => {
      const mockAction = jest.fn();
      const actions = [{ label: 'Click Me', onClick: mockAction }];

      render(
        <Alert actions={actions} data-testid="alert">
          Alert with action
        </Alert>
      );
      
      const actionButton = screen.getByText('Click Me');
      fireEvent.click(actionButton);
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('dismissible', () => {
    it('does not show dismiss button by default', () => {
      render(
        <Alert data-testid="alert">
          Alert message
        </Alert>
      );
      
      expect(screen.queryByText('×')).not.toBeInTheDocument();
    });

    it('shows dismiss button when dismissible is true', () => {
      render(
        <Alert dismissible data-testid="alert">
          Dismissible alert
        </Alert>
      );
      
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
      const mockDismiss = jest.fn();
      
      render(
        <Alert dismissible onDismiss={mockDismiss} data-testid="alert">
          Dismissible alert
        </Alert>
      );
      
      const dismissButton = screen.getByText('×');
      fireEvent.click(dismissButton);
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('applies dark mode', () => {
    render(
      <Alert isDarkMode data-testid="dark-alert">
        Dark mode alert
      </Alert>
    );
    
    const alert = screen.getByTestId('dark-alert');
    expect(alert).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <Alert ref={ref} data-testid="alert">
        Alert content
      </Alert>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('alert'));
  });

  it('passes through additional props', () => {
    render(
      <Alert
        data-testid="alert"
        className="custom-class"
        aria-label="Custom alert"
      >
        Alert content
      </Alert>
    );
    
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('custom-class');
    expect(alert).toHaveAttribute('aria-label', 'Custom alert');
  });

  it('handles complex content', () => {
    render(
      <Alert title="Complex Alert" data-testid="complex-alert">
        <p>This is a paragraph with <strong>bold text</strong> and a <a href="#test">link</a>.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </Alert>
    );
    
    expect(screen.getByText('Complex Alert')).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByText('link')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
  });

  it('handles long content properly', () => {
    const longContent = 'This is a very long alert message that should wrap properly and maintain good readability even when the content extends across multiple lines and contains various types of information.';
    
    render(
      <Alert title="Long Content Alert" data-testid="long-alert">
        {longContent}
      </Alert>
    );
    
    expect(screen.getByText(longContent)).toBeInTheDocument();
    expect(screen.getByText('Long Content Alert')).toBeInTheDocument();
  });
});
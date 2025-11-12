import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('renders switch with label and handles state changes', () => {
    const handleChange = jest.fn();
    render(<Switch label="Enable notifications" onChange={handleChange} data-testid="test-switch" />);

    const labelElement = screen.getByText(/enable notifications/i);
    const switchElement = screen.getByRole('checkbox');

    expect(labelElement).toBeInTheDocument();
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders in checked and unchecked states', () => {
    render(<Switch label="Checked switch" checked readOnly />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeChecked();

    render(<Switch label="Unchecked switch" />);
    const uncheckedSwitch = screen.getByLabelText(/unchecked switch/i);
    expect(uncheckedSwitch).not.toBeChecked();
  });

  describe('Sizes', () => {
    it('applies size classes correctly', () => {
      const { rerender } = render(<Switch size="sm" label="Small switch" data-testid="sm-switch" />);
      let container = screen.getByTestId('sm-switch');
      expect(container).toHaveClass('mond-switch--sm');

      rerender(<Switch size="lg" label="Large switch" data-testid="lg-switch" />);
      container = screen.getByTestId('lg-switch');
      expect(container).toHaveClass('mond-switch--lg');
    });
  });

  describe('Error and helper text', () => {
    it('displays error message and applies error styling', () => {
      render(<Switch label="Required switch" error="This setting is required" data-testid="error-switch" />);

      const errorMessage = screen.getByText(/this setting is required/i);
      const container = screen.getByTestId('error-switch');

      expect(errorMessage).toBeInTheDocument();
      expect(container).toHaveClass('mond-switch--error');
    });

    it('displays helper text', () => {
      render(<Switch label="Email notifications" helperText="Get updates via email" />);
      const helperText = screen.getByText(/get updates via email/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('renders disabled switch with proper styling', () => {
      render(<Switch label="Disabled switch" disabled data-testid="disabled-switch" />);

      const switchElement = screen.getByRole('checkbox');
      const container = screen.getByTestId('disabled-switch');

      expect(switchElement).toBeDisabled();
      expect(container).toHaveClass('mond-switch--disabled');
    });
  });

  describe('Accessibility', () => {
    it('uses checkbox role and associates label correctly', () => {
      render(<Switch label="Accessible switch" id="accessible-switch" />);

      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('id', 'accessible-switch');
    });

    it('handles focus and blur events', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(<Switch label="Focus test" onFocus={handleFocus} onBlur={handleBlur} />);

      const switchElement = screen.getByRole('checkbox');

      fireEvent.focus(switchElement);
      expect(handleFocus).toHaveBeenCalled();

      fireEvent.blur(switchElement);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  it('works as controlled and uncontrolled component', () => {
    const handleChange = jest.fn();

    const { rerender } = render(
      <Switch label="Controlled" checked={false} onChange={handleChange} />
    );

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalled();

    rerender(<Switch label="Controlled" checked={true} onChange={handleChange} />);
    expect(switchElement).toBeChecked();

    render(<Switch label="Uncontrolled" defaultChecked />);
    const uncontrolledSwitch = screen.getByLabelText(/uncontrolled/i);
    expect(uncontrolledSwitch).toBeChecked();
  });

  it('renders without label', () => {
    render(<Switch data-testid="no-label-switch" />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeInTheDocument();
  });
});

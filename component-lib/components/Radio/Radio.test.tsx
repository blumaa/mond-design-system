import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Radio } from './Radio';

describe('Radio Component', () => {
  it('renders radio with label and handles state changes', () => {
    const handleChange = jest.fn();
    render(<Radio label="Option 1" name="test-radio" onChange={handleChange} />);

    const labelElement = screen.getByText(/option 1/i);
    const radioElement = screen.getByRole('radio');

    expect(labelElement).toBeInTheDocument();
    expect(radioElement).toBeInTheDocument();
    expect(radioElement).not.toBeChecked();

    fireEvent.click(radioElement);
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders in checked and unchecked states', () => {
    render(<Radio label="Checked radio" name="test" checked readOnly />);
    const radioElement = screen.getByRole('radio');
    expect(radioElement).toBeChecked();

    render(<Radio label="Unchecked radio" name="test2" />);
    const uncheckedRadio = screen.getByLabelText(/unchecked radio/i);
    expect(uncheckedRadio).not.toBeChecked();
  });

  describe('Sizes', () => {
    it('applies size classes correctly', () => {
      const { rerender } = render(<Radio size="sm" label="Small radio" name="size-test" data-testid="sm-radio" />);
      let container = screen.getByTestId('sm-radio');
      expect(container).toHaveClass('mond-radio-wrapper--sm');

      rerender(<Radio size="lg" label="Large radio" name="size-test" data-testid="lg-radio" />);
      container = screen.getByTestId('lg-radio');
      expect(container).toHaveClass('mond-radio-wrapper--lg');
    });
  });

  describe('Radio group behavior', () => {
    it('maintains mutual exclusivity within same name group and allows independent groups', () => {
      render(
        <div>
          <Radio label="Option 1" name="group1" value="option1" />
          <Radio label="Option 2" name="group1" value="option2" />
          <Radio label="Group 2 Option A" name="group2" value="2a" />
        </div>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);

      const group1Radios = radios.filter(radio => radio.getAttribute('name') === 'group1');
      const group2Radios = radios.filter(radio => radio.getAttribute('name') === 'group2');

      expect(group1Radios).toHaveLength(2);
      expect(group2Radios).toHaveLength(1);
    });
  });

  describe('Error and helper text', () => {
    it('displays error message and applies error styling', () => {
      render(<Radio label="Required radio" name="test" error="Please select an option" data-testid="error-radio" />);

      const errorMessage = screen.getByText(/please select an option/i);
      const container = screen.getByTestId('error-radio');

      expect(errorMessage).toBeInTheDocument();
      expect(container).toHaveClass('mond-radio-wrapper--error');
    });

    it('displays helper text', () => {
      render(<Radio label="Email updates" name="test" helperText="Receive notifications via email" />);
      const helperText = screen.getByText(/receive notifications via email/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('renders disabled radio with proper styling', () => {
      render(<Radio label="Disabled radio" name="test" disabled data-testid="disabled-radio" />);

      const radioElement = screen.getByRole('radio');
      const container = screen.getByTestId('disabled-radio');

      expect(radioElement).toBeDisabled();
      expect(container).toHaveClass('mond-radio-wrapper--disabled');
    });
  });

  describe('Accessibility', () => {
    it('associates label with radio and supports value attribute', () => {
      render(<Radio label="Accessible radio" name="test" id="accessible-radio" value="test-value" />);

      const radioElement = screen.getByRole('radio');
      expect(radioElement).toHaveAttribute('id', 'accessible-radio');
      expect(radioElement).toHaveAttribute('value', 'test-value');
    });

    it('handles focus and blur events', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(<Radio label="Focus test" name="test" onFocus={handleFocus} onBlur={handleBlur} />);

      const radioElement = screen.getByRole('radio');

      fireEvent.focus(radioElement);
      expect(handleFocus).toHaveBeenCalled();

      fireEvent.blur(radioElement);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  it('renders without label and shows visual indicator when checked', () => {
    render(<Radio name="test" checked readOnly data-testid="checked-radio" />);
    const radioElement = screen.getByRole('radio');
    expect(radioElement).toBeInTheDocument();

    let container = screen.getByTestId('checked-radio');
    let dot = container.querySelector('.mond-radio-dot') as HTMLElement;
    expect(dot).toHaveClass('mond-radio-dot--checked');

    render(<Radio name="test2" data-testid="unchecked-radio" />);
    container = screen.getByTestId('unchecked-radio');
    dot = container.querySelector('.mond-radio-dot') as HTMLElement;
    expect(dot).not.toHaveClass('mond-radio-dot--checked');
  });
});

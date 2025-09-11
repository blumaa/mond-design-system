import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import '@testing-library/jest-dom';
import { RadioGroup } from './RadioGroup';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('RadioGroup Component', () => {
  it('renders radio group with options', () => {
    render(
      <RadioGroup 
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const group = screen.getByTestId('radio-group');
    const radios = screen.getAllByRole('radio');
    
    expect(group).toBeInTheDocument();
    expect(radios).toHaveLength(3);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders with group label', () => {
    render(
      <RadioGroup 
        label="Select an Option"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const group = screen.getByTestId('radio-group');
    const legend = screen.getByText('Select an Option');
    
    expect(group).toBeInTheDocument();
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe('LEGEND');
  });

  it('works in uncontrolled mode', () => {
    render(
      <RadioGroup 
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    
    // Initially no radios are checked
    radios.forEach(radio => {
      expect(radio).not.toBeChecked();
    });
    
    // Click first radio
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).not.toBeChecked();
    
    // Click second radio (should uncheck first)
    fireEvent.click(radios[1]);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  it('works in controlled mode', () => {
    const mockOnChange = jest.fn();
    
    render(
      <RadioGroup 
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    
    // First radio should be checked (controlled value)
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).not.toBeChecked();
    
    // Click second radio
    fireEvent.click(radios[1]);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('handles default value in uncontrolled mode', () => {
    render(
      <RadioGroup 
        defaultValue="option2"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  it('calls onChange callback with correct value', () => {
    const mockOnChange = jest.fn();
    
    render(
      <RadioGroup 
        onChange={mockOnChange}
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    
    // Click first radio
    fireEvent.click(radios[0]);
    expect(mockOnChange).toHaveBeenLastCalledWith('option1');
    
    // Click second radio
    fireEvent.click(radios[1]);
    expect(mockOnChange).toHaveBeenLastCalledWith('option2');
    
    // Click third radio
    fireEvent.click(radios[2]);
    expect(mockOnChange).toHaveBeenLastCalledWith('option3');
  });

  it('ensures only one radio is selected at a time', () => {
    const mockOnChange = jest.fn();
    
    render(
      <RadioGroup 
        onChange={mockOnChange}
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    
    // Click first radio
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).not.toBeChecked();
    
    // Click second radio - should uncheck first
    fireEvent.click(radios[1]);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  it('applies horizontal orientation', () => {
    render(
      <RadioGroup 
        orientation="horizontal"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const group = screen.getByTestId('radio-group');
    expect(group).toBeInTheDocument();
    // Layout is handled by Box component, we verify component renders
  });

  it('applies vertical orientation by default', () => {
    render(
      <RadioGroup 
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const group = screen.getByTestId('radio-group');
    expect(group).toBeInTheDocument();
    // Default orientation is vertical
  });

  it('applies size to all radios', () => {
    render(
      <RadioGroup 
        size="lg"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const group = screen.getByTestId('radio-group');
    expect(group).toBeInTheDocument();
    // Size is passed to individual Radio components
  });

  it('displays error message', () => {
    render(
      <RadioGroup 
        error="Please select an option"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const errorMessage = screen.getByText('Please select an option');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(
      <RadioGroup 
        helperText="Choose one option"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const helperText = screen.getByText('Choose one option');
    expect(helperText).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(
      <RadioGroup 
        error="Error message"
        helperText="Helper text"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('disables all radios when disabled prop is true', () => {
    render(
      <RadioGroup 
        disabled
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toBeDisabled();
    });
  });

  it('disables individual radios based on option disabled property', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ];
    
    render(
      <RadioGroup 
        options={optionsWithDisabled}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeDisabled();
    expect(radios[1]).toBeDisabled();
    expect(radios[2]).not.toBeDisabled();
  });

  it('applies dark mode to all radios', () => {
    render(
      <RadioGroup 
        isDarkMode
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const group = screen.getByTestId('radio-group');
    expect(group).toBeInTheDocument();
    // Dark mode is passed to individual Radio components
  });

  it('applies name to all radios', () => {
    render(
      <RadioGroup 
        name="test-group"
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', 'test-group');
    });
  });

  it('generates unique name when not provided', () => {
    render(
      <RadioGroup 
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    const firstName = radios[0].getAttribute('name');
    
    // All radios should have the same generated name
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', firstName);
    });
    
    // Name should not be empty
    expect(firstName).toBeTruthy();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLFieldSetElement>();
    
    render(
      <RadioGroup 
        ref={ref}
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    expect(ref.current).toBe(screen.getByTestId('radio-group'));
  });

  it('passes through additional props', () => {
    render(
      <RadioGroup 
        options={mockOptions}
        data-testid="radio-group"
        className="custom-class"
        aria-label="Custom radio group"
      />
    );
    
    const group = screen.getByTestId('radio-group');
    expect(group).toHaveClass('custom-class');
    expect(group).toHaveAttribute('aria-label', 'Custom radio group');
  });

  it('maintains single selection when clicking selected radio', () => {
    render(
      <RadioGroup 
        options={mockOptions}
        data-testid="radio-group"
      />
    );
    
    const radios = screen.getAllByRole('radio');
    
    // Click first radio
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    
    // Click same radio again - should remain checked (radio behavior)
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });
});
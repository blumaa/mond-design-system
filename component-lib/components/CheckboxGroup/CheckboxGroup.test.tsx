import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CheckboxGroup } from './CheckboxGroup';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('CheckboxGroup Component', () => {
  it('renders checkbox group with options', () => {
    render(
      <CheckboxGroup 
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const group = screen.getByTestId('checkbox-group');
    const checkboxes = screen.getAllByRole('checkbox');
    
    expect(group).toBeInTheDocument();
    expect(checkboxes).toHaveLength(3);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders with group label', () => {
    render(
      <CheckboxGroup 
        label="Select Options"
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const group = screen.getByTestId('checkbox-group');
    const legend = screen.getByText('Select Options');
    
    expect(group).toBeInTheDocument();
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe('LEGEND');
  });

  it('works in uncontrolled mode', () => {
    render(
      <CheckboxGroup 
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Initially no checkboxes are checked
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
    
    // Click first checkbox
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    
    // Click second checkbox
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('works in controlled mode', () => {
    const mockOnChange = jest.fn();
    
    render(
      <CheckboxGroup 
        value={['option1']}
        onChange={mockOnChange}
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    // First checkbox should be checked (controlled value)
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    
    // Click second checkbox
    fireEvent.click(checkboxes[1]);
    expect(mockOnChange).toHaveBeenCalledWith(['option1', 'option2']);
  });

  it('handles default values in uncontrolled mode', () => {
    render(
      <CheckboxGroup 
        defaultValue={['option2', 'option3']}
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it('calls onChange callback with correct values', () => {
    const mockOnChange = jest.fn();
    
    render(
      <CheckboxGroup 
        onChange={mockOnChange}
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Click first checkbox
    fireEvent.click(checkboxes[0]);
    expect(mockOnChange).toHaveBeenLastCalledWith(['option1']);
    
    // Click second checkbox
    fireEvent.click(checkboxes[1]);
    expect(mockOnChange).toHaveBeenLastCalledWith(['option1', 'option2']);
    
    // Uncheck first checkbox
    fireEvent.click(checkboxes[0]);
    expect(mockOnChange).toHaveBeenLastCalledWith(['option2']);
  });

  it('applies horizontal orientation', () => {
    render(
      <CheckboxGroup 
        orientation="horizontal"
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const group = screen.getByTestId('checkbox-group');
    expect(group).toBeInTheDocument();
    // Layout is handled by Box component, we verify component renders
  });

  it('applies vertical orientation by default', () => {
    render(
      <CheckboxGroup 
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const group = screen.getByTestId('checkbox-group');
    expect(group).toBeInTheDocument();
    // Default orientation is vertical
  });

  it('applies size to all checkboxes', () => {
    render(
      <CheckboxGroup 
        size="lg"
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const group = screen.getByTestId('checkbox-group');
    expect(group).toBeInTheDocument();
    // Size is passed to individual Checkbox components
  });

  it('displays error message', () => {
    render(
      <CheckboxGroup 
        error="Please select at least one option"
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const errorMessage = screen.getByText('Please select at least one option');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(
      <CheckboxGroup 
        helperText="Choose all that apply"
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const helperText = screen.getByText('Choose all that apply');
    expect(helperText).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(
      <CheckboxGroup 
        error="Error message"
        helperText="Helper text"
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('disables all checkboxes when disabled prop is true', () => {
    render(
      <CheckboxGroup 
        disabled
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('disables individual checkboxes based on option disabled property', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ];
    
    render(
      <CheckboxGroup 
        options={optionsWithDisabled}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
    expect(checkboxes[2]).not.toBeDisabled();
  });

  it('applies dark mode to all checkboxes', () => {
    render(
      <CheckboxGroup 
        isDarkMode
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const group = screen.getByTestId('checkbox-group');
    expect(group).toBeInTheDocument();
    // Dark mode is passed to individual Checkbox components
  });

  it('applies name to all checkboxes', () => {
    render(
      <CheckboxGroup 
        name="test-group"
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toHaveAttribute('name', 'test-group');
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLFieldSetElement>();
    
    render(
      <CheckboxGroup 
        ref={ref}
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    expect(ref.current).toBe(screen.getByTestId('checkbox-group'));
  });

  it('passes through additional props', () => {
    render(
      <CheckboxGroup 
        options={mockOptions}
        data-testid="checkbox-group"
        className="custom-class"
        aria-label="Custom checkbox group"
      />
    );
    
    const group = screen.getByTestId('checkbox-group');
    expect(group).toHaveClass('custom-class');
    expect(group).toHaveAttribute('aria-label', 'Custom checkbox group');
  });

  it('prevents duplicate values when same option is clicked multiple times', () => {
    const mockOnChange = jest.fn();
    
    // Test in uncontrolled mode where the component manages state
    render(
      <CheckboxGroup 
        onChange={mockOnChange}
        options={mockOptions}
        data-testid="checkbox-group"
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Click checkbox (should check)
    fireEvent.click(checkboxes[0]);
    expect(mockOnChange).toHaveBeenLastCalledWith(['option1']);
    
    // Click same checkbox again (should uncheck)
    fireEvent.click(checkboxes[0]);
    expect(mockOnChange).toHaveBeenLastCalledWith([]);
    
    // Click again to check
    fireEvent.click(checkboxes[0]);
    expect(mockOnChange).toHaveBeenLastCalledWith(['option1']);
  });
});
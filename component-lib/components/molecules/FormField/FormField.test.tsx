import React from 'react';
import { render, screen } from '../../../test-utils';
import '@testing-library/jest-dom';
import { FormField } from './FormField';
import { Input } from '../../atoms/Input/Input';

describe('FormField Component', () => {
  it('renders children correctly', () => {
    render(
      <FormField data-testid="form-field">
        <Input placeholder="Test input" />
      </FormField>
    );
    
    const formField = screen.getByTestId('form-field');
    const input = screen.getByPlaceholderText('Test input');
    
    expect(formField).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <FormField label="Email Address" data-testid="form-field">
        <Input placeholder="Enter email" />
      </FormField>
    );
    
    const label = screen.getByText('Email Address');
    const input = screen.getByPlaceholderText('Enter email');
    
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('shows required indicator when required is true', () => {
    render(
      <FormField label="Required Field" required data-testid="form-field">
        <Input placeholder="Required input" />
      </FormField>
    );
    
    const requiredIndicator = screen.getByLabelText('required');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('does not show required indicator by default', () => {
    render(
      <FormField label="Optional Field" data-testid="form-field">
        <Input placeholder="Optional input" />
      </FormField>
    );
    
    const requiredIndicator = screen.queryByLabelText('required');
    expect(requiredIndicator).not.toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(
      <FormField label="Email" error="Email is required" data-testid="form-field">
        <Input placeholder="Enter email" />
      </FormField>
    );
    
    const errorMessage = screen.getByText('Email is required');
    const input = screen.getByPlaceholderText('Enter email');
    
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(errorMessage.id));
  });

  it('renders help text when provided and no error', () => {
    render(
      <FormField 
        label="Password" 
        helpText="Must be at least 8 characters long" 
        data-testid="form-field"
      >
        <Input type="password" placeholder="Enter password" />
      </FormField>
    );
    
    const helpText = screen.getByText('Must be at least 8 characters long');
    const input = screen.getByPlaceholderText('Enter password');
    
    expect(helpText).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', helpText.id);
  });

  it('does not render help text when error is present', () => {
    render(
      <FormField 
        label="Email" 
        error="Email is required" 
        helpText="Enter a valid email address"
        data-testid="form-field"
      >
        <Input placeholder="Enter email" />
      </FormField>
    );
    
    const errorMessage = screen.getByText('Email is required');
    const helpText = screen.queryByText('Enter a valid email address');
    
    expect(errorMessage).toBeInTheDocument();
    expect(helpText).not.toBeInTheDocument();
  });

  it('sets aria-invalid to false when no error', () => {
    render(
      <FormField label="Name" data-testid="form-field">
        <Input placeholder="Enter name" />
      </FormField>
    );
    
    const input = screen.getByPlaceholderText('Enter name');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <FormField ref={ref} data-testid="form-field">
        <Input placeholder="Test input" />
      </FormField>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    render(
      <FormField className="custom-form-field" data-testid="form-field">
        <Input placeholder="Test input" />
      </FormField>
    );
    
    const formField = screen.getByTestId('form-field');
    expect(formField).toHaveClass('custom-form-field');
  });

  it('handles multiple children', () => {
    render(
      <FormField label="Multi-field" data-testid="form-field">
        <Input placeholder="First input" />
        <Input placeholder="Second input" />
      </FormField>
    );
    
    const firstInput = screen.getByPlaceholderText('First input');
    const secondInput = screen.getByPlaceholderText('Second input');
    
    expect(firstInput).toBeInTheDocument();
    expect(secondInput).toBeInTheDocument();
  });

  it('works without label', () => {
    render(
      <FormField data-testid="form-field">
        <Input placeholder="No label input" />
      </FormField>
    );
    
    const input = screen.getByPlaceholderText('No label input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('combines error and help text IDs in aria-describedby when both present but only shows error', () => {
    render(
      <FormField 
        label="Test Field"
        error="Error message"
        helpText="Help text"
        data-testid="form-field"
      >
        <Input placeholder="Test input" />
      </FormField>
    );
    
    const input = screen.getByPlaceholderText('Test input');
    const errorMessage = screen.getByText('Error message');
    const helpText = screen.queryByText('Help text');
    
    expect(errorMessage).toBeInTheDocument();
    expect(helpText).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(errorMessage.id));
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes when all features are used', () => {
      render(
        <FormField 
          label="Full Example"
          required
          error="Field is required"
          data-testid="form-field"
        >
          <Input placeholder="Test input" />
        </FormField>
      );
      
      const input = screen.getByPlaceholderText('Test input');
      const label = screen.getByText('Full Example');
      const errorMessage = screen.getByText('Field is required');
      const requiredIndicator = screen.getByLabelText('required');
      
      expect(label).toHaveAttribute('for', input.id);
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      expect(requiredIndicator).toBeInTheDocument();
    });
  });
});
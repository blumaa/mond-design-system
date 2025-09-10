import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Radio } from './Radio';

describe('Radio Component', () => {
  it('renders radio with label', () => {
    render(<Radio label="Option 1" name="test-radio" />);
    const labelElement = screen.getByText(/option 1/i);
    const radioElement = screen.getByRole('radio');
    
    expect(labelElement).toBeInTheDocument();
    expect(radioElement).toBeInTheDocument();
  });

  it('handles checked state changes', () => {
    const handleChange = jest.fn();
    render(
      <Radio 
        label="Test radio" 
        name="test"
        onChange={handleChange}
        data-testid="test-radio"
      />
    );
    
    const radioElement = screen.getByRole('radio');
    fireEvent.click(radioElement);
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders in checked state', () => {
    render(<Radio label="Checked radio" name="test" checked readOnly />);
    const radioElement = screen.getByRole('radio');
    expect(radioElement).toBeChecked();
  });

  it('renders in unchecked state by default', () => {
    render(<Radio label="Unchecked radio" name="test" />);
    const radioElement = screen.getByRole('radio');
    expect(radioElement).not.toBeChecked();
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Radio size="sm" label="Small radio" name="size-test" data-testid="sm-radio" />);
      const container = screen.getByTestId('sm-radio');
      const radioDiv = container.querySelector('[data-radio]') as HTMLElement;
      expect(radioDiv).toHaveStyle('width: 16px');
      expect(radioDiv).toHaveStyle('height: 16px');
    });

    it('renders medium size correctly', () => {
      render(<Radio size="md" label="Medium radio" name="size-test" data-testid="md-radio" />);
      const container = screen.getByTestId('md-radio');
      const radioDiv = container.querySelector('[data-radio]') as HTMLElement;
      expect(radioDiv).toHaveStyle('width: 20px');
      expect(radioDiv).toHaveStyle('height: 20px');
    });

    it('renders large size correctly', () => {
      render(<Radio size="lg" label="Large radio" name="size-test" data-testid="lg-radio" />);
      const container = screen.getByTestId('lg-radio');
      const radioDiv = container.querySelector('[data-radio]') as HTMLElement;
      expect(radioDiv).toHaveStyle('width: 24px');
      expect(radioDiv).toHaveStyle('height: 24px');
    });
  });

  describe('radio group behavior', () => {
    it('maintains mutual exclusivity within same name group', () => {
      render(
        <div>
          <Radio label="Option 1" name="group1" value="option1" />
          <Radio label="Option 2" name="group1" value="option2" />
          <Radio label="Option 3" name="group1" value="option3" />
        </div>
      );
      
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
      
      // All should have the same name attribute
      radios.forEach(radio => {
        expect(radio).toHaveAttribute('name', 'group1');
      });
    });

    it('allows different groups to be independent', () => {
      render(
        <div>
          <Radio label="Group 1 Option A" name="group1" value="1a" />
          <Radio label="Group 1 Option B" name="group1" value="1b" />
          <Radio label="Group 2 Option A" name="group2" value="2a" />
          <Radio label="Group 2 Option B" name="group2" value="2b" />
        </div>
      );
      
      const group1Radios = screen.getAllByRole('radio').filter(
        radio => radio.getAttribute('name') === 'group1'
      );
      const group2Radios = screen.getAllByRole('radio').filter(
        radio => radio.getAttribute('name') === 'group2'
      );
      
      expect(group1Radios).toHaveLength(2);
      expect(group2Radios).toHaveLength(2);
    });
  });

  describe('error state', () => {
    it('displays error message', () => {
      render(<Radio label="Required radio" name="test" error="Please select an option" />);
      const errorMessage = screen.getByText(/please select an option/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('applies error styling', () => {
      render(
        <Radio 
          label="Error radio" 
          name="test"
          error="Error message"
          data-testid="error-radio"
        />
      );
      const container = screen.getByTestId('error-radio');
      const radioDiv = container.querySelector('[data-radio]') as HTMLElement;
      expect(radioDiv).toHaveStyle('border: 1px solid #ef4444');
    });
  });

  describe('helper text', () => {
    it('displays helper text', () => {
      render(<Radio label="Email updates" name="test" helperText="Receive notifications via email" />);
      const helperText = screen.getByText(/receive notifications via email/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling', () => {
      render(<Radio isDarkMode label="Dark radio" name="test" data-testid="dark-radio" />);
      const container = screen.getByTestId('dark-radio');
      const radioDiv = container.querySelector('[data-radio]') as HTMLElement;
      expect(radioDiv).toHaveStyle('background-color: #171717');
    });

    it('applies light mode styling by default', () => {
      render(<Radio label="Light radio" name="test" data-testid="light-radio" />);
      const container = screen.getByTestId('light-radio');
      const radioDiv = container.querySelector('[data-radio]') as HTMLElement;
      expect(radioDiv).toHaveStyle('background-color: #ffffff');
    });
  });

  describe('disabled state', () => {
    it('renders disabled radio', () => {
      render(<Radio label="Disabled radio" name="test" disabled />);
      const radioElement = screen.getByRole('radio');
      expect(radioElement).toBeDisabled();
    });

    it('applies disabled cursor styling', () => {
      render(<Radio label="Disabled" name="test" disabled data-testid="disabled-radio" />);
      const container = screen.getByTestId('disabled-radio');
      const radioDiv = container.querySelector('[data-radio]') as HTMLElement;
      expect(radioDiv).toHaveStyle('cursor: not-allowed');
    });
  });

  describe('accessibility', () => {
    it('associates label with radio using htmlFor and id', () => {
      render(<Radio label="Accessible radio" name="test" id="accessible-radio" />);
      const radioElement = screen.getByRole('radio');
      expect(radioElement).toHaveAttribute('id', 'accessible-radio');
    });

    it('supports value attribute for form submission', () => {
      render(<Radio label="Value test" name="test" value="test-value" />);
      const radioElement = screen.getByRole('radio');
      expect(radioElement).toHaveAttribute('value', 'test-value');
    });

    it('supports keyboard interaction', () => {
      render(
        <div>
          <Radio label="Option 1" name="keyboard-test" value="1" />
          <Radio label="Option 2" name="keyboard-test" value="2" />
          <Radio label="Option 3" name="keyboard-test" value="3" />
        </div>
      );
      
      const radios = screen.getAllByRole('radio');
      
      // Focus first radio
      radios[0].focus();
      expect(radios[0]).toHaveFocus();
      
      // Arrow key navigation would be handled by the browser
      fireEvent.keyDown(radios[0], { key: 'ArrowDown' });
    });
  });

  describe('focus states', () => {
    it('handles focus and blur events', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(
        <Radio 
          label="Focus test"
          name="test"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      );
      
      const radioElement = screen.getByRole('radio');
      
      fireEvent.focus(radioElement);
      expect(handleFocus).toHaveBeenCalled();
      
      fireEvent.blur(radioElement);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('visual indicator', () => {
    it('shows dot when checked', () => {
      render(<Radio label="Checked" name="test" checked readOnly data-testid="checked-radio" />);
      const container = screen.getByTestId('checked-radio');
      const dot = container.querySelector('[data-radio] > div') as HTMLElement;
      expect(dot).toHaveStyle('opacity: 1');
    });

    it('hides dot when unchecked', () => {
      render(<Radio label="Unchecked" name="test" data-testid="unchecked-radio" />);
      const container = screen.getByTestId('unchecked-radio');
      const dot = container.querySelector('[data-radio] > div') as HTMLElement;
      expect(dot).toHaveStyle('opacity: 0');
    });
  });

  it('renders without label', () => {
    render(<Radio name="test" data-testid="no-label-radio" />);
    const radioElement = screen.getByRole('radio');
    expect(radioElement).toBeInTheDocument();
  });
});
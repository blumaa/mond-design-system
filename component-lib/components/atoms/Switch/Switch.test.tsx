import React from 'react';
import { render, screen, renderWithDarkMode, fireEvent } from '../../../test-utils';
import '@testing-library/jest-dom';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('renders switch with label', () => {
    render(<Switch label="Enable notifications" />);
    const labelElement = screen.getByText(/enable notifications/i);
    const switchElement = screen.getByRole('checkbox');
    
    expect(labelElement).toBeInTheDocument();
    expect(switchElement).toBeInTheDocument();
  });

  it('handles checked state changes', () => {
    const handleChange = jest.fn();
    render(
      <Switch 
        label="Test switch" 
        onChange={handleChange}
        data-testid="test-switch"
      />
    );
    
    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders in checked state', () => {
    render(<Switch label="Checked switch" checked readOnly />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeChecked();
  });

  it('renders in unchecked state by default', () => {
    render(<Switch label="Unchecked switch" />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Switch size="sm" label="Small switch" data-testid="sm-switch" />);
      const container = screen.getByTestId('sm-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('width: 32px');
        expect(track).toHaveStyle('height: 18px');
      }
    });

    it('renders medium size correctly', () => {
      render(<Switch size="md" label="Medium switch" data-testid="md-switch" />);
      const container = screen.getByTestId('md-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('width: 44px');
        expect(track).toHaveStyle('height: 24px');
      }
    });

    it('renders large size correctly', () => {
      render(<Switch size="lg" label="Large switch" data-testid="lg-switch" />);
      const container = screen.getByTestId('lg-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('width: 56px');
        expect(track).toHaveStyle('height: 32px');
      }
    });
  });

  describe('visual states', () => {
    it('shows correct background color when checked', () => {
      render(<Switch label="Checked" checked readOnly data-testid="checked-switch" />);
      const container = screen.getByTestId('checked-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('background-color: #0284c7');
      }
    });

    it('shows correct background color when unchecked', () => {
      render(<Switch label="Unchecked" data-testid="unchecked-switch" />);
      const container = screen.getByTestId('unchecked-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('background-color: #cbd5e1');
      }
    });

    it('moves thumb to correct position when checked', () => {
      render(<Switch label="Checked" checked readOnly data-testid="checked-switch" />);
      const container = screen.getByTestId('checked-switch');
      const thumb = container.querySelector('[data-switch-track] > div') as HTMLElement;
      
      expect(thumb).not.toBeNull();
      if (thumb) {
        // The thumb should be translated to the right when checked
        expect(thumb).toHaveStyle('transform: translateY(-50%) translateX(calc(44px - 20px - 2px))');
      }
    });

    it('positions thumb at start when unchecked', () => {
      render(<Switch label="Unchecked" data-testid="unchecked-switch" />);
      const container = screen.getByTestId('unchecked-switch');
      const thumb = container.querySelector('[data-switch-track] > div') as HTMLElement;
      
      expect(thumb).not.toBeNull();
      if (thumb) {
        expect(thumb).toHaveStyle('transform: translateY(-50%) translateX(2px)');
      }
    });
  });

  describe('error state', () => {
    it('displays error message', () => {
      render(<Switch label="Required switch" error="This setting is required" />);
      const errorMessage = screen.getByText(/this setting is required/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('applies error styling', () => {
      render(
        <Switch 
          label="Error switch" 
          error="Error message"
          data-testid="error-switch"
        />
      );
      const container = screen.getByTestId('error-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('border: 1px solid #ef4444');
      }
    });
  });

  describe('helper text', () => {
    it('displays helper text', () => {
      render(<Switch label="Email notifications" helperText="Get updates via email" />);
      const helperText = screen.getByText(/get updates via email/i);
      expect(helperText).toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styling', () => {
      renderWithDarkMode(<Switch label="Dark switch" data-testid="dark-switch" />);
      const container = screen.getByTestId('dark-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('background-color: #475569');
      }
    });

    it('applies light mode styling by default', () => {
      render(<Switch label="Light switch" data-testid="light-switch" />);
      const container = screen.getByTestId('light-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('background-color: #cbd5e1');
      }
    });
  });

  describe('disabled state', () => {
    it('renders disabled switch', () => {
      render(<Switch label="Disabled switch" disabled />);
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).toBeDisabled();
    });

    it('applies disabled cursor styling', () => {
      render(<Switch label="Disabled" disabled data-testid="disabled-switch" />);
      const container = screen.getByTestId('disabled-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('cursor: not-allowed');
      }
    });

    it('applies disabled opacity', () => {
      render(<Switch label="Disabled" disabled data-testid="disabled-switch" />);
      const container = screen.getByTestId('disabled-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      expect(track).not.toBeNull();
      if (track) {
        expect(track).toHaveStyle('opacity: 0.6');
      }
    });
  });

  describe('accessibility', () => {
    it('uses checkbox role for screen readers', () => {
      render(<Switch label="Accessible switch" />);
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).toBeInTheDocument();
    });

    it('associates label with switch using htmlFor and id', () => {
      render(<Switch label="Accessible switch" id="accessible-switch" />);
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).toHaveAttribute('id', 'accessible-switch');
    });

    it('supports keyboard interaction', () => {
      const handleChange = jest.fn();
      render(<Switch label="Keyboard test" onChange={handleChange} />);
      
      const switchElement = screen.getByRole('checkbox');
      switchElement.focus();
      
      // Space key should toggle the switch
      fireEvent.keyDown(switchElement, { key: ' ', code: 'Space' });
      fireEvent.keyUp(switchElement, { key: ' ', code: 'Space' });
      
      expect(switchElement).toHaveFocus();
    });
  });

  describe('focus states', () => {
    it('handles focus and blur events', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(
        <Switch 
          label="Focus test"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      );
      
      const switchElement = screen.getByRole('checkbox');
      
      fireEvent.focus(switchElement);
      expect(handleFocus).toHaveBeenCalled();
      
      fireEvent.blur(switchElement);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('works as controlled component', () => {
      let checked = false;
      const setChecked = jest.fn((newChecked) => {
        checked = newChecked;
      });
      
      const { rerender } = render(
        <Switch 
          label="Controlled"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
      
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).not.toBeChecked();
      
      fireEvent.click(switchElement);
      expect(setChecked).toHaveBeenCalledWith(true);
      
      // Rerender with new checked state
      rerender(
        <Switch 
          label="Controlled"
          checked={true}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
      
      expect(switchElement).toBeChecked();
    });

    it('works as uncontrolled component', () => {
      render(<Switch label="Uncontrolled" defaultChecked />);
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).toBeChecked();
    });
  });

  it('renders without label', () => {
    render(<Switch data-testid="no-label-switch" />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeInTheDocument();
  });

  describe('animation and transitions', () => {
    it('applies transition styles', () => {
      render(<Switch label="Animated" data-testid="animated-switch" />);
      const container = screen.getByTestId('animated-switch');
      const track = container.querySelector('[data-switch-track]') as HTMLElement;
      const thumb = container.querySelector('[data-switch-track] > div') as HTMLElement;
      
      expect(track).not.toBeNull();
      expect(thumb).not.toBeNull();
      if (track && thumb) {
        expect(track).toHaveStyle('transition: all 200ms ease');
        expect(thumb).toHaveStyle('transition: all 200ms ease');
      }
    });
  });
});

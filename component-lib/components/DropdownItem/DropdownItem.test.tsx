import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { DropdownItem, type DropdownItemProps } from './DropdownItem';

const defaultProps: DropdownItemProps = {
  value: 'test-value',
  label: 'Test Label',
};

const renderDropdownItem = (props: Partial<DropdownItemProps> = {}) => {
  return render(<DropdownItem {...defaultProps} {...props} />);
};

describe('DropdownItem', () => {
  describe('Basic Rendering', () => {
    it('renders with label and value', () => {
      renderDropdownItem();
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('menuitem')).toHaveAttribute('data-option-value', 'test-value');
    });

    it('applies correct CSS classes', () => {
      renderDropdownItem({});

      const item = screen.getByRole('menuitem');
      expect(item).toHaveClass('mond-dropdown-item');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<DropdownItem ref={ref} {...defaultProps} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Divider Mode', () => {
    it('renders as divider when divider prop is true', () => {
      renderDropdownItem({ divider: true });

      const divider = document.querySelector('.mond-dropdown-item--divider');
      expect(divider).toBeInTheDocument();
      expect(divider).toHaveClass('mond-dropdown-item--divider');

      // Should not render as menuitem when divider
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    });

    it('ignores other props when in divider mode', () => {
      renderDropdownItem({ 
        divider: true,
        label: 'This should not appear',
        icon: <span>Icon</span>
      });
      
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
      expect(screen.queryByText('Icon')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled', () => {
      renderDropdownItem({ disabled: true });
      
      const item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('aria-disabled', 'true');
      expect(item).toHaveAttribute('tabIndex', '-1');
      expect(item).toHaveClass('mond-dropdown-item--disabled');
    });

    it('does not trigger onSelect when disabled and clicked', () => {
      const onSelect = jest.fn();
      renderDropdownItem({ disabled: true, onSelect });
      
      const item = screen.getByRole('menuitem');
      fireEvent.click(item);
      
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('does not trigger mouse events when disabled', () => {
      const onMouseEnter = jest.fn();
      const onFocus = jest.fn();
      renderDropdownItem({ disabled: true, onMouseEnter, onFocus });
      
      const item = screen.getByRole('menuitem');
      fireEvent.mouseEnter(item);
      fireEvent.focus(item);
      
      expect(onMouseEnter).not.toHaveBeenCalled();
      expect(onFocus).not.toHaveBeenCalled();
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onSelect with correct value when clicked', () => {
      const onSelect = jest.fn();
      renderDropdownItem({ onSelect, value: 'test-item' });
      
      const item = screen.getByRole('menuitem');
      fireEvent.click(item);
      
      expect(onSelect).toHaveBeenCalledWith('test-item');
    });

    it('calls onMouseEnter with correct value', () => {
      const onMouseEnter = jest.fn();
      renderDropdownItem({ onMouseEnter, value: 'hover-item' });
      
      const item = screen.getByRole('menuitem');
      fireEvent.mouseEnter(item);
      
      expect(onMouseEnter).toHaveBeenCalledWith('hover-item');
    });

    it('calls onFocus with correct value', () => {
      const onFocus = jest.fn();
      renderDropdownItem({ onFocus, value: 'focus-item' });
      
      const item = screen.getByRole('menuitem');
      fireEvent.focus(item);
      
      expect(onFocus).toHaveBeenCalledWith('focus-item');
    });
  });

  describe('Icon Support', () => {
    it('renders icon when provided', () => {
      renderDropdownItem({
        icon: <span data-testid="dropdown-icon">📁</span>
      });
      
      expect(screen.getByTestId('dropdown-icon')).toBeInTheDocument();
      expect(screen.getByText('📁')).toBeInTheDocument();
    });

    it('does not render icon when not provided', () => {
      renderDropdownItem();
      
      expect(screen.queryByTestId('dropdown-icon')).not.toBeInTheDocument();
    });
  });

  describe('Nested Items Support', () => {
    it('renders expansion indicator when hasChildren is true', () => {
      renderDropdownItem({ hasChildren: true });
      
      const item = screen.getByRole('menuitem');
      expect(item).toHaveClass('mond-dropdown-item--has-children');
      expect(screen.getByText('▸')).toBeInTheDocument();
    });

    it('renders custom expansion indicator', () => {
      renderDropdownItem({ 
        hasChildren: true,
        expansionIndicator: <span data-testid="custom-indicator">→</span>
      });
      
      expect(screen.getByTestId('custom-indicator')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('applies correct indentation based on depth', () => {
      renderDropdownItem({ depth: 2 });
      
      const item = screen.getByRole('menuitem');
      // Depth 2 = base padding (0.75rem = 12px) + 2 * 16px = 44px
      expect(item).toHaveStyle({ paddingLeft: '44px' });
    });

    it('applies has-children class for items with children', () => {
      renderDropdownItem({ hasChildren: true });

      const item = screen.getByRole('menuitem');
      expect(item).toHaveClass('mond-dropdown-item--has-children');
    });
  });

  describe('Focus State', () => {
    it('applies focused styles when focused prop is true', () => {
      renderDropdownItem({ focused: true });
      
      const item = screen.getByRole('menuitem');
      expect(item).toHaveClass('mond-dropdown-item--focused');
    });

    it('applies both focused and disabled classes when both are true', () => {
      renderDropdownItem({ focused: true, disabled: true });

      const item = screen.getByRole('menuitem');
      expect(item).toHaveClass('mond-dropdown-item--disabled');
      expect(item).toHaveClass('mond-dropdown-item--focused');
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes', () => {
      renderDropdownItem();

      const item = screen.getByRole('menuitem');
      expect(item).toHaveClass('mond-dropdown-item');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderDropdownItem({ disabled: true });
      
      const item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('role', 'menuitem');
      expect(item).toHaveAttribute('aria-disabled', 'true');
      expect(item).toHaveAttribute('data-option-value', 'test-value');
    });

    it('has correct tabIndex for enabled items', () => {
      renderDropdownItem();
      
      const item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('tabIndex', '0');
    });

    it('has correct tabIndex for disabled items', () => {
      renderDropdownItem({ disabled: true });
      
      const item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('tabIndex', '-1');
    });
  });


  describe('Edge Cases', () => {
    it('handles empty label gracefully', () => {
      renderDropdownItem({ label: '' });
      
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });

    it('handles complex label content', () => {
      renderDropdownItem({
        label: 'Multi-line\nLabel with special chars: <>&"'
      });
      
      // Just verify the component renders without errors and contains the text
      const item = screen.getByRole('menuitem');
      expect(item).toBeInTheDocument();
      expect(item.textContent).toContain('Multi-line');
      expect(item.textContent).toContain('special chars');
    });

    it('handles zero depth correctly', () => {
      renderDropdownItem({ depth: 0 });
      
      const item = screen.getByRole('menuitem');
      // Depth 0 = base padding (0.75rem * 16 = 12px) + 0 * 16px = 12px
      expect(item).toHaveStyle({ paddingLeft: '12px' });
    });
  });
});
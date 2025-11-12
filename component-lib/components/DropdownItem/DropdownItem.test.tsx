import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownItem, type DropdownItemProps } from './DropdownItem';

const defaultProps: DropdownItemProps = {
  value: 'test-value',
  label: 'Test Label',
};

describe('DropdownItem', () => {
  it('renders with label and value', () => {
    render(<DropdownItem {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('menuitem')).toHaveAttribute('data-option-value', 'test-value');
  });

  it('renders as divider', () => {
    render(<DropdownItem {...defaultProps} divider label="This should not appear" icon={<span>Icon</span>} />);

    const divider = document.querySelector('.mond-dropdown-item--divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('mond-dropdown-item--divider');
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    expect(screen.queryByText('Icon')).not.toBeInTheDocument();
  });

  describe('Disabled state', () => {
    it('renders as disabled and does not trigger events', () => {
      const onSelect = jest.fn();
      const onMouseEnter = jest.fn();
      const onFocus = jest.fn();

      render(<DropdownItem {...defaultProps} disabled onSelect={onSelect} onMouseEnter={onMouseEnter} onFocus={onFocus} />);

      const item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('aria-disabled', 'true');
      expect(item).toHaveAttribute('tabIndex', '-1');
      expect(item).toHaveClass('mond-dropdown-item--disabled');

      fireEvent.click(item);
      fireEvent.mouseEnter(item);
      fireEvent.focus(item);

      expect(onSelect).not.toHaveBeenCalled();
      expect(onMouseEnter).not.toHaveBeenCalled();
      expect(onFocus).not.toHaveBeenCalled();
    });
  });

  describe('Interactive behavior', () => {
    it('calls onSelect, onMouseEnter, and onFocus with correct value', () => {
      const onSelect = jest.fn();
      const onMouseEnter = jest.fn();
      const onFocus = jest.fn();

      render(<DropdownItem {...defaultProps} value="test-item" onSelect={onSelect} onMouseEnter={onMouseEnter} onFocus={onFocus} />);

      const item = screen.getByRole('menuitem');

      fireEvent.click(item);
      expect(onSelect).toHaveBeenCalledWith('test-item');

      fireEvent.mouseEnter(item);
      expect(onMouseEnter).toHaveBeenCalledWith('test-item');

      fireEvent.focus(item);
      expect(onFocus).toHaveBeenCalledWith('test-item');
    });
  });

  it('renders icon and expansion indicator', () => {
    render(<DropdownItem {...defaultProps} icon={<span data-testid="dropdown-icon">📁</span>} hasChildren expansionIndicator={<span data-testid="custom-indicator">→</span>} />);

    expect(screen.getByTestId('dropdown-icon')).toBeInTheDocument();
    expect(screen.getByText('📁')).toBeInTheDocument();

    const item = screen.getByRole('menuitem');
    expect(item).toHaveClass('mond-dropdown-item--has-children');
    expect(screen.getByTestId('custom-indicator')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('applies correct indentation based on depth', () => {
    const { rerender } = render(<DropdownItem {...defaultProps} depth={2} />);

    let item = screen.getByRole('menuitem');
    expect(item).toHaveStyle({ paddingLeft: '44px' }); // 12px + 2 * 16px

    rerender(<DropdownItem {...defaultProps} depth={0} />);
    item = screen.getByRole('menuitem');
    expect(item).toHaveStyle({ paddingLeft: '12px' }); // 12px + 0 * 16px
  });

  it('applies focused styles', () => {
    render(<DropdownItem {...defaultProps} focused disabled />);

    const item = screen.getByRole('menuitem');
    expect(item).toHaveClass('mond-dropdown-item--disabled');
    expect(item).toHaveClass('mond-dropdown-item--focused');
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes and tabIndex', () => {
      const { rerender } = render(<DropdownItem {...defaultProps} disabled />);

      let item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('role', 'menuitem');
      expect(item).toHaveAttribute('aria-disabled', 'true');
      expect(item).toHaveAttribute('data-option-value', 'test-value');
      expect(item).toHaveAttribute('tabIndex', '-1');

      rerender(<DropdownItem {...defaultProps} />);
      item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  it('handles empty label and complex content gracefully', () => {
    const { rerender } = render(<DropdownItem {...defaultProps} label="" />);
    expect(screen.getByRole('menuitem')).toBeInTheDocument();

    rerender(<DropdownItem {...defaultProps} label="Multi-line\nLabel with special chars: <>&quot;" />);
    const item = screen.getByRole('menuitem');
    expect(item).toBeInTheDocument();
    expect(item.textContent).toContain('Multi-line');
    expect(item.textContent).toContain('special chars');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DropdownItem ref={ref} {...defaultProps} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

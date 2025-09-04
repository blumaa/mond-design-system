import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders with default props', () => {
    render(<Tag>Default Tag</Tag>);
    
    const tag = screen.getByText('Default Tag');
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveClass('mond-tag', 'mond-tag--filled', 'mond-tag--default', 'mond-tag--md');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Tag variant="filled">Filled</Tag>);
    let tag = screen.getByText('Filled');
    expect(tag).toHaveClass('mond-tag--filled');

    rerender(<Tag variant="outlined">Outlined</Tag>);
    tag = screen.getByText('Outlined');
    expect(tag).toHaveClass('mond-tag--outlined');

    rerender(<Tag variant="ghost">Ghost</Tag>);
    tag = screen.getByText('Ghost');
    expect(tag).toHaveClass('mond-tag--ghost');
  });

  it('renders with different semantic variants', () => {
    const { rerender } = render(<Tag semantic="primary">Primary</Tag>);
    let tag = screen.getByText('Primary');
    expect(tag).toHaveClass('mond-tag--primary');

    rerender(<Tag semantic="success">Success</Tag>);
    tag = screen.getByText('Success');
    expect(tag).toHaveClass('mond-tag--success');

    rerender(<Tag semantic="error">Error</Tag>);
    tag = screen.getByText('Error');
    expect(tag).toHaveClass('mond-tag--error');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Tag size="sm">Small</Tag>);
    let tag = screen.getByText('Small');
    expect(tag).toHaveClass('mond-tag--sm');
    expect(tag).toHaveStyle('font-size: 0.75rem; height: 24px');

    rerender(<Tag size="lg">Large</Tag>);
    tag = screen.getByText('Large');
    expect(tag).toHaveClass('mond-tag--lg');
    expect(tag).toHaveStyle('font-size: 1rem; height: 36px');
  });

  it('applies semantic colors correctly for filled variant in light mode', () => {
    const { rerender } = render(<Tag variant="filled" semantic="primary" isDarkMode={false}>Primary</Tag>);
    let tag = screen.getByText('Primary');
    expect(tag).toHaveStyle('background-color: #0ea5e9; color: #ffffff'); // blue.500, white.50

    rerender(<Tag variant="filled" semantic="success" isDarkMode={false}>Success</Tag>);
    tag = screen.getByText('Success');
    expect(tag).toHaveStyle('background-color: #22c55e; color: #ffffff'); // green.500, white.50

    rerender(<Tag variant="filled" semantic="error" isDarkMode={false}>Error</Tag>);
    tag = screen.getByText('Error');
    expect(tag).toHaveStyle('background-color: #ef4444; color: #ffffff'); // red.500, white.50
  });

  it('applies semantic colors correctly for outlined variant', () => {
    const { rerender } = render(<Tag variant="outlined" semantic="primary" isDarkMode={false}>Primary</Tag>);
    let tag = screen.getByText('Primary');
    expect(tag).toHaveStyle('border: 1px solid #0ea5e9; color: #0284c7'); // blue.500 border, blue.600 text

    rerender(<Tag variant="outlined" semantic="success" isDarkMode={false}>Success</Tag>);
    tag = screen.getByText('Success');
    expect(tag).toHaveStyle('border: 1px solid #22c55e; color: #16a34a'); // green.500 border, green.600 text
  });

  it('applies dark mode colors correctly', () => {
    const { rerender } = render(<Tag variant="filled" semantic="primary" isDarkMode={true}>Primary</Tag>);
    let tag = screen.getByText('Primary');
    expect(tag).toHaveStyle('background-color: #0284c7; color: #ffffff'); // blue.600, white.50

    rerender(<Tag variant="outlined" semantic="primary" isDarkMode={true}>Primary</Tag>);
    tag = screen.getByText('Primary');
    expect(tag).toHaveStyle('border: 1px solid #38bdf8; color: #38bdf8'); // blue.400 border and text
  });

  it('renders with icon', () => {
    const TestIcon = <svg data-testid="test-icon"><path /></svg>;
    render(<Tag icon={TestIcon}>With Icon</Tag>);
    
    expect(screen.getByText('With Icon')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders removable tag with remove button', () => {
    const onRemove = jest.fn();
    render(<Tag removable onRemove={onRemove}>Removable</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveAttribute('type', 'button');
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(<Tag removable onRemove={onRemove}>Removable</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when remove button is activated with Enter key', () => {
    const onRemove = jest.fn();
    render(<Tag removable onRemove={onRemove}>Removable</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.keyDown(removeButton, { key: 'Enter' });
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when remove button is activated with Space key', () => {
    const onRemove = jest.fn();
    render(<Tag removable onRemove={onRemove}>Removable</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.keyDown(removeButton, { key: ' ' });
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('prevents event bubbling on remove button click', () => {
    const onRemove = jest.fn();
    const onTagClick = jest.fn();
    
    render(
      <div onClick={onTagClick}>
        <Tag removable onRemove={onRemove} onClick={onTagClick}>Removable</Tag>
      </div>
    );
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onTagClick).not.toHaveBeenCalled();
  });

  it('applies disabled state correctly', () => {
    render(<Tag disabled>Disabled</Tag>);
    
    const tag = screen.getByText('Disabled');
    expect(tag).toHaveClass('mond-tag--disabled');
    expect(tag).toHaveStyle('cursor: not-allowed; opacity: 0.6');
  });

  it('disables remove functionality when disabled', () => {
    const onRemove = jest.fn();
    render(<Tag removable disabled onRemove={onRemove}>Disabled Removable</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    expect(removeButton).toBeDisabled();
    expect(removeButton).toHaveAttribute('tabIndex', '-1');
    
    fireEvent.click(removeButton);
    fireEvent.keyDown(removeButton, { key: 'Enter' });
    
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('applies disabled colors correctly', () => {
    const { rerender } = render(<Tag disabled isDarkMode={false}>Disabled Light</Tag>);
    let tag = screen.getByText('Disabled Light');
    expect(tag).toHaveStyle('background-color: #f1f5f9; color: #94a3b8'); // gray.100, gray.400

    rerender(<Tag disabled isDarkMode={true}>Disabled Dark</Tag>);
    tag = screen.getByText('Disabled Dark');
    expect(tag).toHaveStyle('background-color: #1e293b; color: #475569'); // gray.800, gray.600
  });

  it('applies custom className', () => {
    render(<Tag className="custom-tag">Custom</Tag>);
    
    const tag = screen.getByText('Custom');
    expect(tag).toHaveClass('mond-tag', 'custom-tag');
  });

  it('forwards additional props to Box', () => {
    render(<Tag data-testid="custom-tag">Custom</Tag>);
    
    const tag = screen.getByTestId('custom-tag');
    expect(tag).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    render(<Tag style={{ textTransform: 'uppercase' }}>Custom Style</Tag>);
    
    const tag = screen.getByText('Custom Style');
    expect(tag).toHaveStyle('text-transform: uppercase');
  });

  it('handles text overflow correctly', () => {
    render(<Tag>Very long tag content that should be truncated with ellipsis</Tag>);
    
    const textContainer = screen.getByText('Very long tag content that should be truncated with ellipsis');
    expect(textContainer).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
  });

  it('adjusts padding when removable', () => {
    const { rerender } = render(<Tag>Normal</Tag>);
    let tag = screen.getByText('Normal');
    expect(tag).toHaveStyle('padding-left: 0.75rem; padding-right: 0.75rem'); // md size default

    rerender(<Tag removable>Removable</Tag>);
    tag = screen.getByText('Removable');
    expect(tag).toHaveStyle('padding-left: 0.75rem; padding-right: 0.25rem'); // reduced right padding for remove button
  });

  it('renders ghost variant with correct background', () => {
    const { rerender } = render(<Tag variant="ghost" semantic="primary" isDarkMode={false}>Ghost Primary</Tag>);
    let tag = screen.getByText('Ghost Primary');
    expect(tag).toHaveStyle('background-color: #eff6ff'); // blue.50

    rerender(<Tag variant="ghost" semantic="primary" isDarkMode={true}>Ghost Primary Dark</Tag>);
    tag = screen.getByText('Ghost Primary Dark');
    expect(tag).toHaveStyle('background-color: #1e3a8a'); // blue.900
  });

  it('maintains accessibility for remove button', () => {
    render(<Tag removable onRemove={() => {}}>Accessible</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    expect(removeButton).toHaveAttribute('aria-label', 'Remove tag');
    expect(removeButton).toHaveAttribute('type', 'button');
    expect(removeButton).toHaveAttribute('tabIndex', '0');
  });

  it('renders without remove button when not removable', () => {
    render(<Tag>Not Removable</Tag>);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles all semantic variants in ghost mode', () => {
    const semantics = ['default', 'primary', 'success', 'warning', 'error', 'info'] as const;
    
    semantics.forEach(semantic => {
      const { unmount } = render(<Tag variant="ghost" semantic={semantic}>{semantic}</Tag>);
      const tag = screen.getByText(semantic);
      expect(tag).toHaveClass(`mond-tag--ghost`, `mond-tag--${semantic}`);
      unmount();
    });
  });
});
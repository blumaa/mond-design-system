import { render, screen, fireEvent } from '../../../test-utils';
import '@testing-library/jest-dom';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders with default props', () => {
    render(<Tag>Default Tag</Tag>);
    
    const tag = screen.getByText('Default Tag');
    expect(tag).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Tag variant="filled">Filled</Tag>);
    expect(screen.getByText('Filled')).toBeInTheDocument();

    rerender(<Tag variant="outlined">Outlined</Tag>);
    expect(screen.getByText('Outlined')).toBeInTheDocument();

    rerender(<Tag variant="ghost">Ghost</Tag>);
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });

  it('renders with different semantic variants', () => {
    const { rerender } = render(<Tag semantic="primary">Primary</Tag>);
    expect(screen.getByText('Primary')).toBeInTheDocument();

    rerender(<Tag semantic="success">Success</Tag>);
    expect(screen.getByText('Success')).toBeInTheDocument();

    rerender(<Tag semantic="error">Error</Tag>);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Tag size="sm">Small</Tag>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<Tag size="lg">Large</Tag>);
    expect(screen.getByText('Large')).toBeInTheDocument();
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
    
    expect(screen.getByText('Removable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove tag' })).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(<Tag removable onRemove={onRemove}>Remove me</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    render(<Tag disabled>Disabled</Tag>);
    
    const tag = screen.getByText('Disabled');
    expect(tag).toBeInTheDocument();
  });

  it('disables remove functionality when disabled', () => {
    const onRemove = jest.fn();
    render(<Tag removable disabled onRemove={onRemove}>Disabled Removable</Tag>);
    
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    expect(removeButton).toBeDisabled();
    
    fireEvent.click(removeButton);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('forwards additional props to Box', () => {
    render(<Tag data-testid="custom-tag">Custom</Tag>);
    
    const tag = screen.getByTestId('custom-tag');
    expect(tag).toBeInTheDocument();
  });

  it('handles text overflow correctly', () => {
    render(<Tag>Very long tag content that should be truncated with ellipsis</Tag>);
    
    const textContainer = screen.getByText('Very long tag content that should be truncated with ellipsis');
    expect(textContainer).toBeInTheDocument();
  });

  it('renders without remove button when not removable', () => {
    render(<Tag>No remove</Tag>);
    
    expect(screen.getByText('No remove')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles all semantic variants in ghost mode', () => {
    const semantics = ['default', 'primary', 'success', 'warning', 'error', 'info'] as const;
    
    semantics.forEach(semantic => {
      const { unmount } = render(<Tag variant="ghost" semantic={semantic}>{semantic}</Tag>);
      expect(screen.getByText(semantic)).toBeInTheDocument();
      unmount();
    });
  });
});
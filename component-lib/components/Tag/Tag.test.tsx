import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders with variants and semantic colors using rerender', () => {
    const { rerender } = render(<Tag variant="filled">Filled</Tag>);
    expect(screen.getByText('Filled')).toBeInTheDocument();

    rerender(<Tag variant="outlined">Outlined</Tag>);
    expect(screen.getByText('Outlined')).toBeInTheDocument();

    rerender(<Tag semantic="primary">Primary</Tag>);
    expect(screen.getByText('Primary')).toBeInTheDocument();

    rerender(<Tag semantic="error">Error</Tag>);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('applies size variants using rerender', () => {
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

  it('renders removable tag and calls onRemove when clicked', () => {
    const onRemove = jest.fn();
    render(<Tag removable onRemove={onRemove}>Removable</Tag>);

    expect(screen.getByText('Removable')).toBeInTheDocument();
    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    expect(removeButton).toBeInTheDocument();

    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables remove functionality when disabled', () => {
    const onRemove = jest.fn();
    render(<Tag removable disabled onRemove={onRemove}>Disabled Removable</Tag>);

    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    expect(removeButton).toBeDisabled();

    fireEvent.click(removeButton);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('renders without remove button when not removable', () => {
    render(<Tag>No remove</Tag>);

    expect(screen.getByText('No remove')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

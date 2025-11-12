import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from './Label';

describe('Label', () => {
  it('renders with htmlFor attribute and default styles', () => {
    render(<Label htmlFor="username">Username</Label>);

    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'username');
    expect(label).toHaveClass('mond-label', 'mond-label--md');
  });

  it('renders required indicator with custom text', () => {
    const { rerender } = render(<Label required>Username</Label>);

    let required = screen.getByText('*');
    expect(required).toBeInTheDocument();
    expect(required).toHaveAttribute('aria-label', 'required');
    expect(required).toHaveClass('mond-label__required');

    rerender(<Label required requiredIndicator="(required)">Username</Label>);
    required = screen.getByText('(required)');
    expect(required).toBeInTheDocument();
  });

  it('applies size and weight variants using rerender', () => {
    const { rerender } = render(<Label size="sm">Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--sm');

    rerender(<Label size="lg">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--lg');

    rerender(<Label weight="normal">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--weight-normal');

    rerender(<Label weight="semibold">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--weight-semibold');
  });

  it('applies semantic colors and disabled state', () => {
    const { rerender } = render(<Label semantic="error">Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--error');

    rerender(<Label semantic="success">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--success');

    rerender(<Label disabled>Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--disabled');
  });

  it('disabled state overrides semantic colors', () => {
    render(<Label disabled semantic="error">Username</Label>);

    const label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--disabled');
    expect(label).not.toHaveClass('mond-label--error');
  });

  it('applies custom color token and overrides semantic color', () => {
    const { rerender } = render(<Label color="blue.500">Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveStyle('--label-color-override: var(--mond-color-blue-500)');

    rerender(<Label semantic="error" color="blue.500">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('--label-color-override: var(--mond-color-blue-500)');
    expect(label).not.toHaveClass('mond-label--error');
  });
});

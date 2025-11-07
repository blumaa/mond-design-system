import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Label } from './Label';

describe('Label', () => {
  it('renders with default props', () => {
    render(<Label>Username</Label>);
    
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('mond-label', 'mond-label--md');
  });

  it('renders with htmlFor attribute', () => {
    render(<Label htmlFor="username">Username</Label>);
    
    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('for', 'username');
  });

  it('renders required indicator', () => {
    render(<Label required>Username</Label>);
    
    const label = screen.getByText('Username');
    const required = screen.getByText('*');
    
    expect(label).toBeInTheDocument();
    expect(required).toBeInTheDocument();
    expect(required).toHaveAttribute('aria-label', 'required');
  });

  it('renders custom required indicator', () => {
    render(<Label required requiredIndicator="(required)">Username</Label>);
    
    const required = screen.getByText('(required)');
    expect(required).toBeInTheDocument();
    expect(required).toHaveAttribute('aria-label', 'required');
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(<Label size="sm">Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--sm');

    rerender(<Label size="lg">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--lg');
  });

  it('applies weight variants correctly', () => {
    const { rerender } = render(<Label weight="normal">Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--weight-normal');

    rerender(<Label weight="semibold">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--weight-semibold');
  });

  it('applies semantic color classes', () => {
    const { rerender } = render(<Label semantic="default">Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--default');

    rerender(<Label semantic="error">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--error');

    rerender(<Label semantic="success">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--success');
  });

  it('applies disabled state correctly', () => {
    render(<Label disabled>Username</Label>);
    const label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--disabled');
  });

  it('disabled state overrides semantic colors', () => {
    render(<Label disabled semantic="error">Username</Label>);

    const label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--disabled');
    expect(label).not.toHaveClass('mond-label--error');
  });

  it('applies custom color token', () => {
    render(<Label color="blue.500">Username</Label>);

    const label = screen.getByText('Username');
    expect(label).toHaveStyle('--label-color-override: var(--mond-color-blue-500)');
  });

  it('color prop overrides semantic color', () => {
    render(<Label semantic="error" color="blue.500">Username</Label>);

    const label = screen.getByText('Username');
    // Should have color override style
    expect(label).toHaveStyle('--label-color-override: var(--mond-color-blue-500)');
    // Should NOT have semantic color class when color prop is provided
    expect(label).not.toHaveClass('mond-label--error');
  });

  it('applies semantic color when no color prop provided', () => {
    render(<Label semantic="error">Username</Label>);

    const label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label--error');
  });


  it('renders complex children', () => {
    render(
      <Label>
        <span>Username</span>
        <small> (optional)</small>
      </Label>
    );
    
    const label = screen.getByText('Username');
    const optional = screen.getByText('(optional)');
    
    expect(label).toBeInTheDocument();
    expect(optional).toBeInTheDocument();
  });

  it('required indicator has proper class', () => {
    render(<Label required>Username</Label>);

    const required = screen.getByText('*');
    expect(required).toHaveClass('mond-label__required');
  });
});
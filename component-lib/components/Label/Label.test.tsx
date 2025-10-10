import { render, screen, renderWithDarkMode } from '../../test-utils';
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
    expect(label).toHaveStyle('font-size: 0.75rem'); // xs
    expect(label).toHaveClass('mond-label--sm');

    rerender(<Label size="lg">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('font-size: 1rem'); // base
    expect(label).toHaveClass('mond-label--lg');
  });

  it('applies weight variants correctly', () => {
    const { rerender } = render(<Label weight="normal">Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveStyle('font-weight: 400'); // normal

    rerender(<Label weight="semibold">Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('font-weight: 600'); // semibold
  });

  it('applies semantic colors in light mode', () => {
    const { rerender } = render(<Label semantic="default" >Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #0f172a'); // text.primary (gray.900)

    rerender(<Label semantic="error" >Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #dc2626'); // red.600

    rerender(<Label semantic="success" >Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #16a34a'); // green.600
  });

  it('applies semantic colors in dark mode', () => {
    const { rerender } = renderWithDarkMode(<Label semantic="default" >Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #f1f5f9'); // text.primary (gray.100)

    rerender(<Label semantic="error" >Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #f87171'); // red.400

    rerender(<Label semantic="success" >Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #4ade80'); // green.400
  });

  it('applies disabled state correctly', () => {
    const { rerender } = render(<Label disabled >Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #94a3b8'); // gray.400
    expect(label).toHaveStyle('cursor: not-allowed');
    expect(label).toHaveClass('mond-label--disabled');

    rerender(<Label disabled >Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #94a3b8'); // text.disabled (gray.400)
  });

  it('disabled state overrides semantic colors', () => {
    render(<Label disabled semantic="error" >Username</Label>);
    
    const label = screen.getByText('Username');
    expect(label).toHaveStyle('color: #94a3b8'); // gray.400, not red
  });

  it('applies custom className', () => {
    render(<Label className="custom-label">Username</Label>);
    
    const label = screen.getByText('Username');
    expect(label).toHaveClass('mond-label', 'custom-label');
  });

  it('forwards additional props to Box', () => {
    render(<Label data-testid="custom-label" p="2">Username</Label>);
    
    const label = screen.getByTestId('custom-label');
    expect(label).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    render(<Label style={{ textTransform: 'uppercase' }}>Username</Label>);
    
    const label = screen.getByText('Username');
    expect(label).toHaveStyle('text-transform: uppercase');
  });

  it('has proper cursor styles', () => {
    const { rerender } = render(<Label>Username</Label>);
    let label = screen.getByText('Username');
    expect(label).toHaveStyle('cursor: pointer');

    rerender(<Label disabled>Username</Label>);
    label = screen.getByText('Username');
    expect(label).toHaveStyle('cursor: not-allowed');
  });

  it('applies default margin bottom', () => {
    render(<Label>Username</Label>);
    
    const label = screen.getByText('Username');
    expect(label).toHaveStyle('margin-bottom: 0.25rem');
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

  it('required indicator has proper styling', () => {
    render(<Label required >Username</Label>);
    
    const required = screen.getByText('*');
    expect(required).toHaveStyle('color: #dc2626'); // text.error (red.600)
    expect(required).toHaveStyle('margin-left: 0.25rem');
  });

  it('required indicator adapts to dark mode', () => {
    renderWithDarkMode(<Label required >Username</Label>);
    
    const required = screen.getByText('*');
    expect(required).toHaveStyle('color: #f87171'); // red.400 in dark mode
  });
});
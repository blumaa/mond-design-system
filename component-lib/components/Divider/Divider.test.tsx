import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders horizontal divider by default', () => {
    render(<Divider />);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('HR');
    expect(divider).toHaveClass('mond-divider');
    expect(divider).toHaveClass('mond-divider--horizontal');
    expect(divider).toHaveClass('mond-divider--default');
    expect(divider).toHaveClass('mond-divider--md');
  });

  it('renders vertical divider', () => {
    render(<Divider orientation="vertical" />);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveClass('mond-divider');
    expect(divider).toHaveClass('mond-divider--vertical');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Divider variant="default" />);
    let divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mond-divider--default');

    rerender(<Divider variant="subtle" />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mond-divider--subtle');

    rerender(<Divider variant="strong" />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mond-divider--strong');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Divider size="sm" />);
    let divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mond-divider--sm');

    rerender(<Divider size="md" />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mond-divider--md');

    rerender(<Divider size="lg" />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mond-divider--lg');
  });

  it('applies default margins correctly', () => {
    render(<Divider />);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('role', 'separator');
    expect(divider).toHaveClass('mt-4');
    expect(divider).toHaveClass('mb-4');
  });

  it('applies custom margins', () => {
    render(<Divider marginTop="2" marginBottom="8" />);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('mt-2');
    expect(divider).toHaveClass('mb-8');
  });

  it('applies vertical divider margins correctly', () => {
    render(<Divider orientation="vertical" />);

    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('ml-4');
    expect(divider).toHaveClass('mr-4');
  });

  it('forwards additional props to Box', () => {
    render(<Divider data-testid="custom-divider" />);

    const divider = screen.getByTestId('custom-divider');
    expect(divider).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    render(<Divider style={{ opacity: 0.5 }} />);

    const divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('opacity: 0.5');
  });
});
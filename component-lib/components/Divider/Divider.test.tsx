import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders horizontal divider by default with proper classes', () => {
    render(<Divider />);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('HR');
    expect(divider).toHaveClass('mond-divider', 'mond-divider--horizontal', 'mond-divider--default', 'mond-divider--md');
    expect(divider).toHaveClass('mt-4', 'mb-4');
  });

  it('renders vertical divider', () => {
    render(<Divider orientation="vertical" />);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveClass('mond-divider--vertical');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(divider).toHaveClass('ml-4', 'mr-4');
  });

  it('applies variant classes using rerender', () => {
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

  it('applies size classes using rerender', () => {
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

  it('applies custom margins', () => {
    render(<Divider marginTop="2" marginBottom="8" />);

    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mt-2', 'mb-8');
  });

  it('forwards additional props and custom styles', () => {
    render(<Divider data-testid="custom-divider" style={{ opacity: 0.5 }} />);

    const divider = screen.getByTestId('custom-divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveStyle('opacity: 0.5');
  });
});

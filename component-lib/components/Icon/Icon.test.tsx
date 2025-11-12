import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Icon, IconSize } from './Icon';

const TestSvg = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      fill="currentColor"
    />
  </svg>
);

describe('Icon', () => {
  it('renders correctly with default size', () => {
    render(
      <Icon>
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('mond-icon', 'mond-icon--md');
  });

  it('applies all size variants using rerender', () => {
    const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    const { rerender } = render(
      <Icon size="xs">
        <TestSvg />
      </Icon>
    );

    sizes.forEach((size) => {
      rerender(
        <Icon size={size}>
          <TestSvg />
        </Icon>
      );
      const icon = screen.getByRole('img');
      expect(icon).toHaveClass(`mond-icon--${size}`);
    });
  });

  it('renders with accessibility label or as decorative', () => {
    const { rerender } = render(
      <Icon label="Test icon">
        <TestSvg />
      </Icon>
    );

    let icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Test icon');
    expect(icon).not.toHaveAttribute('aria-hidden');

    rerender(
      <Icon decorative data-testid="decorative-icon">
        <TestSvg />
      </Icon>
    );

    icon = screen.getByTestId('decorative-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('role', 'presentation');
    expect(icon).not.toHaveAttribute('aria-label');
  });

  it('renders with custom color and custom className', () => {
    render(
      <Icon color="red" className="custom-class" data-testid="colored-icon">
        <TestSvg />
      </Icon>
    );

    const icon = screen.getByTestId('colored-icon');
    expect(icon).toHaveStyle({ color: 'red' });
    expect(icon).toHaveClass('custom-class', 'mond-icon');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSpanElement>();

    render(
      <Icon ref={ref}>
        <TestSvg />
      </Icon>
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

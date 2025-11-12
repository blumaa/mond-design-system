import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  describe('Basic Rendering', () => {
    it('renders with fallback initials', () => {
      const { container } = render(<Avatar fallback="John Doe" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('JD');
    });

    it('renders with different sizes', () => {
      const { container, rerender } = render(<Avatar size="sm" fallback="AB" />);
      let avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('data-size', 'sm');

      rerender(<Avatar size="xl" fallback="AB" />);
      avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveAttribute('data-size', 'xl');
    });

    it('renders with custom children', () => {
      const { container } = render(<Avatar><span>👤</span></Avatar>);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveTextContent('👤');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Avatar ref={ref} fallback="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

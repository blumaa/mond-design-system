import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

describe('Card Component', () => {
  describe('Basic Rendering', () => {
    it('renders with title and description', () => {
      render(<Card title="Test Card" description="Test description" />);

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders with image', () => {
      render(<Card title="Card" description="Description" imageSrc="/test-image.jpg" imageAlt="Test image" />);

      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('renders tag and date', () => {
      render(<Card title="Card" description="Description" tag="News" date="Jan 15, 2025" />);

      expect(screen.getByText('News')).toBeInTheDocument();
      expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
    });
  });

  describe('Interactive States', () => {
    it('renders as link when href is provided', () => {
      render(<Card title="Clickable Card" description="Description" href="/test-link" target="_blank" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('handles onClick events', () => {
      const handleClick = jest.fn();
      render(<Card title="Card" description="Description" onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Card title="Card" description="Description" onClick={handleClick} disabled />);

      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Enter and Space keys', () => {
      const handleClick = jest.fn();
      render(<Card title="Card" description="Description" onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(card, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('does not handle keyboard when disabled', () => {
      const handleClick = jest.fn();
      render(<Card title="Card" description="Description" onClick={handleClick} disabled />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Elements', () => {
    it('renders custom callToAction and overlay elements', () => {
      render(
        <Card
          title="Card"
          description="Description"
          callToAction={<Button variant="primary">Custom CTA</Button>}
          topLeftElement={<Badge variant="default" size="sm">Left</Badge>}
          topRightElement={<Badge variant="default" size="sm">Right</Badge>}
        />
      );

      expect(screen.getByText('Custom CTA')).toBeInTheDocument();
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct roles and attributes', () => {
      render(<Card title="Card" description="Description" onClick={() => {}} disabled />);

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-disabled', 'true');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('includes alt text for images', () => {
      render(<Card title="Card" description="Description" imageSrc="/image.jpg" imageAlt="Descriptive alt text" />);

      const image = screen.getByAltText('Descriptive alt text');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies maxWidth and hoverable styles', () => {
      const { container } = render(
        <Card title="Card" description="Description" maxWidth="400px" hoverable={true} />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveStyle({ maxWidth: '400px' });
      expect(card).toHaveClass('mond-card--hoverable');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref} title="Card" description="Description" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-card');
    });
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

describe('Card Component', () => {
  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(
        <Card
          title="Test Card"
          description="Test description"
        />
      );

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('applies correct display name', () => {
      expect(Card.displayName).toBe('Card');
    });

    it('renders without image', () => {
      const { container } = render(
        <Card
          title="No Image Card"
          description="Card without image"
        />
      );

      const imageWrapper = container.querySelector('.mond-card__image-wrapper');
      expect(imageWrapper).not.toBeInTheDocument();
    });
  });

  describe('Image Rendering', () => {
    it('renders with image when imageSrc is provided', () => {
      render(
        <Card
          title="Card with Image"
          description="Description"
          imageSrc="/test-image.jpg"
          imageAlt="Test image"
        />
      );

      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('applies top image position by default', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          imageSrc="/image.jpg"
          imageAlt="Image"
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--image-top');
    });

    it('applies left image position', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          imageSrc="/image.jpg"
          imageAlt="Image"
          imagePosition="left"
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--image-left');
    });
  });

  describe('Tag and Date', () => {
    it('renders tag when provided', () => {
      render(
        <Card
          title="Card"
          description="Description"
          tag="News"
        />
      );

      expect(screen.getByText('News')).toBeInTheDocument();
    });

    it('renders date when provided', () => {
      render(
        <Card
          title="Card"
          description="Description"
          date="Jan 15, 2025"
        />
      );

      expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
    });

    it('renders both tag and date', () => {
      render(
        <Card
          title="Card"
          description="Description"
          tag="Blog"
          date="Jan 15, 2025"
        />
      );

      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
    });
  });

  describe('Background Variants', () => {
    it('applies default background', () => {
      const { container } = render(
        <Card title="Card" description="Description" />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--default');
    });

    it('applies subtle background', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          background="subtle"
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--subtle');
    });

    it('applies emphasized background', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          background="emphasized"
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--emphasized');
    });
  });

  describe('Interactive States', () => {
    it('renders as link when href is provided', () => {
      render(
        <Card
          title="Clickable Card"
          description="Description"
          href="/test-link"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-link');
    });

    it('opens link in new tab when target is specified', () => {
      render(
        <Card
          title="Card"
          description="Description"
          href="https://example.com"
          target="_blank"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('handles onClick events', () => {
      const handleClick = jest.fn();
      render(
        <Card
          title="Card"
          description="Description"
          onClick={handleClick}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies hoverable class when href is provided', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          href="/link"
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--hoverable');
    });

    it('applies hoverable class when onClick is provided', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          onClick={() => {}}
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--hoverable');
    });

    it('does not apply hoverable class by default', () => {
      const { container } = render(
        <Card title="Card" description="Description" />
      );

      const card = container.querySelector('.mond-card');
      expect(card).not.toHaveClass('mond-card--hoverable');
    });

    it('respects explicit hoverable prop', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          hoverable={true}
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--hoverable');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled class', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          disabled
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--disabled');
    });

    it('prevents onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Card
          title="Card"
          description="Description"
          onClick={handleClick}
          disabled
        />
      );

      const card = screen.getByRole('button');
      fireEvent.click(card);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents link navigation when disabled', () => {
      render(
        <Card
          title="Card"
          description="Description"
          href="/link"
          disabled
        />
      );

      const link = screen.getByRole('link');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

      link.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('sets aria-disabled attribute', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          disabled
          onClick={() => {}}
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Call to Action', () => {
    it('renders custom callToAction', () => {
      render(
        <Card
          title="Card"
          description="Description"
          callToAction={<Button variant="primary">Custom CTA</Button>}
        />
      );

      expect(screen.getByText('Custom CTA')).toBeInTheDocument();
    });
  });

  describe('Overlay Elements', () => {
    it('renders topLeftElement', () => {
      render(
        <Card
          title="Card"
          description="Description"
          topLeftElement={<Badge variant="solid" size="sm">Featured</Badge>}
        />
      );

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('renders topRightElement', () => {
      render(
        <Card
          title="Card"
          description="Description"
          topRightElement={<Badge variant="solid" size="sm">New</Badge>}
        />
      );

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders both overlay elements', () => {
      render(
        <Card
          title="Card"
          description="Description"
          topLeftElement={<Badge variant="solid" size="sm">Left</Badge>}
          topRightElement={<Badge variant="solid" size="sm">Right</Badge>}
        />
      );

      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });
  });

  describe('Styling Props', () => {
    it('applies maxWidth style', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          maxWidth="400px"
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveStyle({ maxWidth: '400px' });
    });

    it('does not have inline styles when maxWidth is not provided', () => {
      const { container } = render(
        <Card title="Card" description="Description" />
      );

      const card = container.querySelector('.mond-card');
      expect(card).not.toHaveAttribute('style');
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Enter key for cards with onClick', () => {
      const handleClick = jest.fn();
      render(
        <Card
          title="Card"
          description="Description"
          onClick={handleClick}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key for cards with onClick', () => {
      const handleClick = jest.fn();
      render(
        <Card
          title="Card"
          description="Description"
          onClick={handleClick}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not handle keyboard when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Card
          title="Card"
          description="Description"
          onClick={handleClick}
          disabled
        />
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('has tabIndex when interactive', () => {
      const { container } = render(
        <Card
          title="Card"
          description="Description"
          onClick={() => {}}
        />
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('does not have tabIndex when not interactive', () => {
      const { container } = render(
        <Card title="Card" description="Description" />
      );

      const card = container.querySelector('.mond-card');
      expect(card).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Accessibility', () => {
    it('has button role when onClick is provided', () => {
      render(
        <Card
          title="Card"
          description="Description"
          onClick={() => {}}
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has link role when href is provided', () => {
      render(
        <Card
          title="Card"
          description="Description"
          href="/link"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/link');
    });

    it('does not have interactive role when non-interactive', () => {
      const { container } = render(
        <Card title="Card" description="Description" />
      );

      const card = container.querySelector('.mond-card');
      expect(card).not.toHaveAttribute('role');
    });

    it('includes alt text for images', () => {
      render(
        <Card
          title="Card"
          description="Description"
          imageSrc="/image.jpg"
          imageAlt="Descriptive alt text"
        />
      );

      const image = screen.getByAltText('Descriptive alt text');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Card
          ref={ref}
          title="Card"
          description="Description"
        />
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-card');
    });
  });
});

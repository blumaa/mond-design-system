import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';

describe('Card Component', () => {
  describe('Basic Rendering', () => {
    it('renders with children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders with CardHeader, CardBody, and CardFooter', () => {
      render(
        <Card>
          <CardHeader>
            <Heading level={3}>Header</Heading>
          </CardHeader>
          <CardBody>
            <Text>Body content</Text>
          </CardBody>
          <CardFooter>
            <Button variant="primary">Action</Button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders without sub-components', () => {
      render(
        <Card>
          <p>Simple content</p>
        </Card>
      );

      expect(screen.getByText('Simple content')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--default');
    });

    it('renders subtle variant', () => {
      const { container } = render(<Card variant="subtle">Content</Card>);
      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--subtle');
    });

    it('renders elevated variant', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--elevated');
    });
  });

  describe('Interactive States', () => {
    it('renders as link when href is provided', () => {
      render(
        <Card href="/test-link" target="_blank">
          <CardBody>Clickable Card</CardBody>
        </Card>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('handles onClick events', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <CardBody>Click me</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies hoverable class when href is provided', () => {
      const { container } = render(
        <Card href="/test">
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--hoverable');
    });

    it('applies hoverable class when onClick is provided', () => {
      const { container } = render(
        <Card onClick={() => {}}>
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--hoverable');
    });

    it('applies hoverable class when explicitly set', () => {
      const { container } = render(
        <Card hoverable={true}>
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveClass('mond-card--hoverable');
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Enter key', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('opens link on Enter key when href is provided', () => {
      const mockOpen = jest.fn();
      window.open = mockOpen;

      render(
        <Card href="/test">
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(mockOpen).toHaveBeenCalledWith('/test', '_self');
    });
  });

  describe('Polymorphic Rendering', () => {
    it('renders as div by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector('.mond-card');
      expect(card?.tagName).toBe('DIV');
    });

    it('renders as article when specified', () => {
      const { container } = render(<Card as="article">Content</Card>);
      const card = container.querySelector('.mond-card');
      expect(card?.tagName).toBe('ARTICLE');
    });

    it('renders as section when specified', () => {
      const { container } = render(<Card as="section">Content</Card>);
      const card = container.querySelector('.mond-card');
      expect(card?.tagName).toBe('SECTION');
    });
  });

  describe('CardHeader', () => {
    it('renders with correct class', () => {
      const { container } = render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      );

      const header = container.querySelector('.mond-card__header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header content');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Card>
          <CardHeader ref={ref}>Header</CardHeader>
        </Card>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-card__header');
    });
  });

  describe('CardBody', () => {
    it('renders with correct class', () => {
      const { container } = render(
        <Card>
          <CardBody>Body content</CardBody>
        </Card>
      );

      const body = container.querySelector('.mond-card__body');
      expect(body).toBeInTheDocument();
      expect(body).toHaveTextContent('Body content');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Card>
          <CardBody ref={ref}>Body</CardBody>
        </Card>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-card__body');
    });
  });

  describe('CardFooter', () => {
    it('renders with correct class', () => {
      const { container } = render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );

      const footer = container.querySelector('.mond-card__footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer content');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Card>
          <CardFooter ref={ref}>Footer</CardFooter>
        </Card>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-card__footer');
    });
  });

  describe('Accessibility', () => {
    it('has correct roles and attributes when interactive', () => {
      render(
        <Card onClick={() => {}}>
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has no role when not interactive', () => {
      const { container } = render(
        <Card>
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = container.querySelector('.mond-card');
      expect(card).not.toHaveAttribute('role');
      expect(card).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly to Card', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Card ref={ref}>
          <CardBody>Content</CardBody>
        </Card>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-card');
    });
  });

  describe('Custom Props', () => {
    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Card data-testid="custom-card" aria-label="Custom label">
          <CardBody>Content</CardBody>
        </Card>
      );

      const card = container.querySelector('.mond-card');
      expect(card).toHaveAttribute('data-testid', 'custom-card');
      expect(card).toHaveAttribute('aria-label', 'Custom label');
    });
  });
});

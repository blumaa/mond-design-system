import React, { forwardRef, ReactNode } from 'react';
import './card.css';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Background style variant
   * @default 'default'
   */
  variant?: 'default' | 'subtle' | 'elevated';

  /**
   * Make the entire card clickable
   */
  href?: string;

  /**
   * Link target attribute
   */
  target?: string;

  /**
   * Click handler for card
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * Show hover effect
   * @default true when href or onClick is provided
   */
  hoverable?: boolean;

  /**
   * Element type to render as
   * @default 'div'
   */
  as?: 'div' | 'article' | 'section';

  /**
   * Maximum width of card
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Full width card
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Selected state styling
   * @default false
   */
  isSelected?: boolean;

  /**
   * Trigger shake animation
   * @default false
   */
  shake?: boolean;

  /**
   * Trigger jump animation
   * @default false
   */
  jump?: boolean;

  /**
   * Aspect ratio for the card
   * square: 1:1 ratio (perfect squares)
   * small: 4:3 ratio, mobile optimized
   * medium: 4:3 ratio, tablet optimized
   * large: 4:3 ratio, desktop optimized
   */
  aspectRatio?: 'square' | 'small' | 'medium' | 'large';
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  /**
   * Header content
   */
  children: ReactNode;
}

export interface CardBodyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  /**
   * Body content
   */
  children: ReactNode;
}

export interface CardFooterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  /**
   * Footer content
   */
  children: ReactNode;
}

/**
 * CardHeader - Top section of the card
 *
 * @example
 * <CardHeader>
 *   <Heading level={3}>Card Title</Heading>
 * </CardHeader>
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="mond-card__header"
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardBody - Main content section of the card
 *
 * @example
 * <CardBody>
 *   <Text>Card content goes here</Text>
 * </CardBody>
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="mond-card__body"
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

/**
 * CardFooter - Bottom section of the card
 *
 * @example
 * <CardFooter>
 *   <Button variant="primary">Action</Button>
 * </CardFooter>
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="mond-card__footer"
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/**
 * Card - Container component for structured content
 *
 * A flexible card component that can be used with or without sub-components.
 * Compose with CardHeader, CardBody, and CardFooter for structured layouts,
 * or use Card alone for simple containers.
 *
 * @example
 * // Simple card with just children
 * <Card>
 *   <p>Simple content</p>
 * </Card>
 *
 * @example
 * // Structured card with sub-components
 * <Card>
 *   <CardHeader>
 *     <Heading level={3}>Card Title</Heading>
 *   </CardHeader>
 *   <CardBody>
 *     <Text>Card content and description</Text>
 *   </CardBody>
 *   <CardFooter>
 *     <Button variant="primary">Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * @example
 * // Clickable card
 * <Card href="/details">
 *   <CardHeader>
 *     <Heading level={3}>Clickable Card</Heading>
 *   </CardHeader>
 *   <CardBody>
 *     <Text>This entire card is clickable</Text>
 *   </CardBody>
 * </Card>
 *
 * @example
 * // Card with onClick handler
 * <Card onClick={handleClick}>
 *   <CardBody>
 *     <Text>Click me!</Text>
 *   </CardBody>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      href,
      target,
      onClick,
      hoverable,
      as: Component = 'div',
      maxWidth,
      fullWidth = false,
      isSelected = false,
      shake = false,
      jump = false,
      aspectRatio,
      ...props
    },
    ref
  ) => {
    // Determine if card should have hover effect
    const isHoverable = hoverable ?? (!!href || !!onClick);

    const cardClassName = `mond-card mond-card--${variant} ${
      isHoverable ? 'mond-card--hoverable' : ''
    } ${maxWidth ? `mond-card--max-width-${maxWidth}` : ''} ${
      fullWidth ? 'mond-card--full-width' : ''
    } ${isSelected ? 'mond-card--selected' : ''} ${
      shake ? 'mond-card--shake' : ''
    } ${jump ? 'mond-card--jump' : ''} ${
      aspectRatio ? `mond-card--aspect-ratio-${aspectRatio}` : ''
    }`.trim();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && (href || onClick)) {
        e.preventDefault();
        if (href) {
          window.open(href, target || '_self');
        } else if (onClick) {
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
    };

    const cardContent = (
      <Component
        ref={ref}
        className={cardClassName}
        onClick={href ? undefined : handleClick}
        onKeyDown={handleKeyDown}
        role={href || onClick ? 'button' : undefined}
        tabIndex={href || onClick ? 0 : undefined}
        {...props}
      >
        {children}
      </Component>
    );

    // Wrap in link if href is provided
    if (href) {
      return (
        <a
          href={href}
          target={target}
          className="mond-card__link-wrapper"
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {cardContent}
        </a>
      );
    }

    return cardContent;
  }
);

Card.displayName = 'Card';

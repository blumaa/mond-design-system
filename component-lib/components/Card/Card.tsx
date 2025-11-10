import React, { forwardRef, ReactNode } from 'react';
import { Box } from '../Box/Box';
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import { Tag } from '../Tag/Tag';
import { Image } from '../Image/Image';
import { Icon } from '../Icon/Icon';
import './card.css';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'className' | 'style'> {
  /**
   * Card title (required)
   */
  title: string;

  /**
   * Card description text (required)
   */
  description: string;

  /**
   * Image source URL
   */
  imageSrc?: string;

  /**
   * Image alt text
   */
  imageAlt?: string;

  /**
   * Tag label to display at top
   */
  tag?: string;

  /**
   * Date string to display
   */
  date?: string;

  /**
   * Image position
   * @default 'top'
   */
  imagePosition?: 'top' | 'left';

  /**
   * Background style variant
   * @default 'default'
   */
  background?: 'default' | 'subtle' | 'emphasized';

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
   * Custom call-to-action element (Button or Link)
   */
  callToAction?: ReactNode;

  /**
   * Element positioned in top-left corner (e.g., Badge)
   */
  topLeftElement?: ReactNode;

  /**
   * Element positioned in top-right corner
   */
  topRightElement?: ReactNode;

  /**
   * Reduce opacity for disabled state
   */
  disabled?: boolean;

  /**
   * Maximum width of card
   */
  maxWidth?: string;

  /**
   * Show hover effect
   * @default true when href or onClick is provided
   */
  hoverable?: boolean;
}

/**
 * Card Component
 *
 * A flexible card component for displaying content with image, title, description,
 * and optional interactive elements. Reuses MDS components for consistency.
 *
 * @example
 * // Basic card
 * <Card
 *   title="Card Title"
 *   description="Card description text"
 *   imageSrc="/image.jpg"
 *   imageAlt="Image description"
 * />
 *
 * @example
 * // Card with tag and date
 * <Card
 *   title="Blog Post"
 *   description="Read about our latest updates"
 *   imageSrc="/blog.jpg"
 *   imageAlt="Blog post"
 *   tag="News"
 *   date="Jan 15, 2025"
 * />
 *
 * @example
 * // Clickable card
 * <Card
 *   title="View Details"
 *   description="Click to learn more"
 *   href="/details"
 *   imageSrc="/preview.jpg"
 *   imageAlt="Preview"
 * />
 *
 * @example
 * // Card with call-to-action
 * <Card
 *   title="Get Started"
 *   description="Begin your journey today"
 *   callToAction={<Button variant="primary">Start Now</Button>}
 * />
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(({
  title,
  description,
  imageSrc,
  imageAlt = '',
  tag,
  date,
  imagePosition = 'top',
  background = 'default',
  href,
  target,
  onClick,
  callToAction,
  topLeftElement,
  topRightElement,
  disabled = false,
  maxWidth,
  hoverable,
  ...props
}, ref) => {
  // Determine if card should have hover effect
  const isHoverable = hoverable ?? (!!href || !!onClick);

  const cardClassName = `mond-card mond-card--${background} mond-card--image-${imagePosition} ${isHoverable ? 'mond-card--hoverable' : ''} ${disabled ? 'mond-card--disabled' : ''}`.trim();

  const cardStyle = maxWidth ? { maxWidth } : undefined;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
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
    <div
      ref={ref}
      className={cardClassName}
      style={cardStyle}
      onClick={href ? undefined : handleClick}
      onKeyDown={handleKeyDown}
      role={href || onClick ? 'button' : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {/* Top overlay elements */}
      {topLeftElement && (
        <div className="mond-card__top-left">
          {topLeftElement}
        </div>
      )}
      {topRightElement && (
        <div className="mond-card__top-right">
          {topRightElement}
        </div>
      )}

      {/* Image section */}
      {imageSrc && (
        <div className="mond-card__image-wrapper">
          <Image
            src={imageSrc}
            alt={imageAlt}
            aspectRatio={imagePosition === 'top' ? '16:9' : '1:1'}
            fit="cover"
            borderRadius="none"
          />
        </div>
      )}

      {/* Content section */}
      <Box padding="6" className="mond-card__content">
        {/* Tag */}
        {tag && (
          <Box marginBottom="3">
            <Tag size="sm" variant="outlined" semantic="default">
              {tag}
            </Tag>
          </Box>
        )}

        {/* Title */}
        <Box marginBottom="2">
          <Heading level={3} size="lg" semantic="primary">
            {title}
          </Heading>
        </Box>

        {/* Description */}
        <Box marginBottom="4">
          <Text variant="body" semantic="secondary">
            {description}
          </Text>
        </Box>

        {/* Date */}
        {date && (
          <Box marginBottom="4" className="mond-card__date">
            <Icon size="sm" decorative>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </Icon>
            <Text variant="body-sm" semantic="tertiary">
              {date}
            </Text>
          </Box>
        )}

        {/* Call to action */}
        {callToAction && (
          <div className="mond-card__cta">
            {callToAction}
          </div>
        )}
      </Box>
    </div>
  );

  // Wrap in link if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className="mond-card__link-wrapper"
        onClick={disabled ? (e) => e.preventDefault() : undefined}
        aria-disabled={disabled}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
});

Card.displayName = 'Card';

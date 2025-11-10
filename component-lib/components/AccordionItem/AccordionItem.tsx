import React, { useState, ReactNode } from 'react';
import { Box } from '../Box/Box';
import './accordionitem.css';

export type AccordionItemSize = 'sm' | 'md' | 'lg';
export type AccordionItemVariant = 'default' | 'bordered' | 'filled';

export interface AccordionItemProps {
  /**
   * The header content (trigger)
   */
  title: ReactNode;

  /**
   * The collapsible content
   */
  children: ReactNode;

  /**
   * Whether the item is expanded
   */
  expanded?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Size variant
   * @default 'md'
   */
  size?: AccordionItemSize;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: AccordionItemVariant;

  /**
   * Icon to display
   */
  icon?: ReactNode;

  /**
   * Icon position
   * @default 'right'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Enable/disable animations
   * @default true
   */
  animated?: boolean;

  /**
   * Default expanded state for uncontrolled mode
   */
  defaultExpanded?: boolean;

  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Unique identifier
   */
  itemId?: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({
  title,
  children,
  expanded,
  disabled = false,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'right',
  animated = true,
  defaultExpanded = false,
  onExpandedChange,
  itemId,
}, ref) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;

  const handleToggle = () => {
    if (disabled) return;

    const newExpanded = !isExpanded;
    if (expanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onExpandedChange?.(newExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const DefaultIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  );

  const classNames = [
    'mond-accordion-item',
    `mond-accordion-item--${variant}`,
    `mond-accordion-item--${size}`,
    isExpanded && 'mond-accordion-item--expanded',
    disabled && 'mond-accordion-item--disabled',
    !animated && 'mond-accordion-item--no-animation',
  ].filter(Boolean).join(' ');

  return (
    <Box ref={ref} className={classNames}>
      {/* Header/Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="mond-accordion-item__header"
        aria-expanded={isExpanded}
        aria-controls={itemId ? `${itemId}-content` : undefined}
        aria-disabled={disabled}
        data-accordion-header={itemId}
      >
        {iconPosition === 'left' && (
          <span className="mond-accordion-item__icon mond-accordion-item__icon--left">
            {icon || <DefaultIcon />}
          </span>
        )}

        <span className="mond-accordion-item__title">
          {title}
        </span>

        {iconPosition === 'right' && (
          <span className="mond-accordion-item__icon mond-accordion-item__icon--right">
            {icon || <DefaultIcon />}
          </span>
        )}
      </button>

      {/* Content */}
      <div
        id={itemId ? `${itemId}-content` : undefined}
        className="mond-accordion-item__content"
        aria-hidden={!isExpanded}
      >
        <div className="mond-accordion-item__content-inner">
          {children}
        </div>
      </div>
    </Box>
  );
});

AccordionItem.displayName = 'AccordionItem';

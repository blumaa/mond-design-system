'use client';
import React, { useState, ReactNode } from 'react';

export type AccordionItemSize = 'sm' | 'md' | 'lg';
export type AccordionItemVariant = 'default' | 'bordered' | 'filled';

export interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  disabled?: boolean;
  size?: AccordionItemSize;
  variant?: AccordionItemVariant;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  animated?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  itemId?: string;
  className?: string;
  style?: React.CSSProperties;
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
  className = '',
  style,
  ...props
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );

  const containerClassNames = [
    'mond-accordion-item',
    `mond-accordion-item--${variant}`,
    isExpanded && 'mond-accordion-item--expanded',
    disabled && 'mond-accordion-item--disabled',
    className,
  ].filter(Boolean).join(' ');

  const headerClassNames = [
    'mond-accordion-item__header',
    `mond-accordion-item__header--${variant}`,
    `mond-accordion-item__header--${size}`,
  ].filter(Boolean).join(' ');

  const iconClassNames = [
    'mond-accordion-item__icon',
    `mond-accordion-item__icon--${iconPosition}`,
    isExpanded && 'mond-accordion-item__icon--expanded',
  ].filter(Boolean).join(' ');

  const contentClassNames = [
    'mond-accordion-item__content',
    isExpanded && 'mond-accordion-item__content--expanded',
    !animated && 'mond-accordion-item__content--no-animation',
  ].filter(Boolean).join(' ');

  const contentInnerClassNames = [
    'mond-accordion-item__content-inner',
    `mond-accordion-item__content-inner--${variant}`,
    `mond-accordion-item__content-inner--${size}`,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={containerClassNames} style={style} {...props}>
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={headerClassNames}
        aria-expanded={isExpanded}
        aria-controls={itemId ? `${itemId}-content` : undefined}
        aria-disabled={disabled}
        data-accordion-header={itemId}
      >
        {iconPosition === 'left' && (
          <div className={iconClassNames}>
            {icon || <DefaultIcon />}
          </div>
        )}

        <div className="mond-accordion-item__title">
          {title}
        </div>

        {iconPosition === 'right' && (
          <div className={iconClassNames}>
            {icon || <DefaultIcon />}
          </div>
        )}
      </button>

      <div
        id={itemId ? `${itemId}-content` : undefined}
        className={contentClassNames}
        aria-hidden={!isExpanded}
      >
        <div className={contentInnerClassNames}>
          {children}
        </div>
      </div>
    </div>
  );
});

AccordionItem.displayName = 'AccordionItem';

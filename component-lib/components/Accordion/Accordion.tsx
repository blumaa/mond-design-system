import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { AccordionItem } from '../AccordionItem/AccordionItem';

export type AccordionMode = 'single' | 'multiple';
export type AccordionVariant = 'default' | 'bordered' | 'filled';
export type AccordionSize = 'sm' | 'md' | 'lg';

export interface AccordionItem {
  id: string;
  title: string | React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  mode?: AccordionMode;
  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  allowToggleOff?: boolean;
  variant?: AccordionVariant;
  size?: AccordionSize;
  animated?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

interface StyledAccordionProps {
  $variant: AccordionVariant;
}

const StyledAccordion = styled.div<StyledAccordionProps>`
  font-family: ${({ theme }) => theme.fonts.sans};

  /* Variant: default */
  ${({ $variant }) =>
    $variant === 'default' &&
    css`
      border: none;
      border-radius: 0;
    `}

  /* Variant: bordered */
  ${({ $variant, theme }) =>
    $variant === 'bordered' &&
    css`
      border: 1px solid ${theme.colors.borderDefault};
      border-radius: ${theme.radii.md};
    `}

  /* Variant: filled */
  ${({ $variant }) =>
    $variant === 'filled' &&
    css`
      border: none;
      border-radius: 0;
    `}
`;

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({
    items,
    mode = 'single',
    expandedIds,
    onExpandedChange,
    allowToggleOff = true,
    variant = 'default',
    size = 'md',
    animated = true,
    icon,
    iconPosition = 'right',
    className,
    ...props
  }, ref) => {
    const isControlled = expandedIds !== undefined && onExpandedChange !== undefined;

    const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(() => {
      if (isControlled) return [];
      return items
        .filter(item => item.defaultExpanded && !item.disabled)
        .map(item => item.id);
    });

    const activeExpandedIds = isControlled ? expandedIds : internalExpandedIds;

    const handleToggle = (itemId: string, disabled?: boolean) => {
      if (disabled) return;

      let newExpandedIds: string[];

      if (mode === 'single') {
        const isCurrentlyExpanded = activeExpandedIds.includes(itemId);

        if (isCurrentlyExpanded) {
          newExpandedIds = allowToggleOff ? [] : [itemId];
        } else {
          newExpandedIds = [itemId];
        }
      } else {
        newExpandedIds = activeExpandedIds.includes(itemId)
          ? activeExpandedIds.filter(id => id !== itemId)
          : [...activeExpandedIds, itemId];
      }

      if (isControlled) {
        onExpandedChange!(newExpandedIds);
      } else {
        setInternalExpandedIds(newExpandedIds);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentTarget = event.target as HTMLElement;
      const currentButton = currentTarget.closest('button[data-accordion-header]') as HTMLButtonElement;

      if (!currentButton) return;

      const currentId = currentButton.getAttribute('data-accordion-header');
      if (!currentId) return;

      const currentIndex = items.findIndex(item => item.id === currentId);
      let targetIndex = currentIndex;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          targetIndex = currentIndex;
          do {
            targetIndex = (targetIndex + 1) % items.length;
          } while (items[targetIndex].disabled && targetIndex !== currentIndex);
          break;
        case 'ArrowUp':
          event.preventDefault();
          targetIndex = currentIndex;
          do {
            targetIndex = targetIndex === 0 ? items.length - 1 : targetIndex - 1;
          } while (items[targetIndex].disabled && targetIndex !== currentIndex);
          break;
        case 'Home':
          event.preventDefault();
          targetIndex = items.findIndex(item => !item.disabled);
          if (targetIndex === -1) targetIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i].disabled) {
              targetIndex = i;
              break;
            }
          }
          break;
        default:
          return;
      }

      if (targetIndex !== currentIndex) {
        const targetButton = document.querySelector(`[data-accordion-header="${items[targetIndex].id}"]`) as HTMLElement;
        targetButton?.focus();
      }
    };

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <StyledAccordion
        ref={ref}
        $variant={variant}
        className={className}
        data-mond-accordion
        role="region"
        aria-label="Accordion"
        onKeyDown={handleKeyDown}
        {...props}
      >
        {items.map((item) => {
          const isExpanded = activeExpandedIds.includes(item.id);
          const displayIcon = item.icon || icon;

          return (
            <AccordionItem
              key={item.id}
              title={item.title}
              expanded={isExpanded}
              onExpandedChange={() => handleToggle(item.id, item.disabled)}
              disabled={item.disabled}
              size={size}
              variant={variant}
              animated={animated}
              icon={displayIcon}
              iconPosition={iconPosition}
              itemId={item.id}
            >
              {item.content}
            </AccordionItem>
          );
        })}
      </StyledAccordion>
    );
  }
);

Accordion.displayName = 'Accordion';
